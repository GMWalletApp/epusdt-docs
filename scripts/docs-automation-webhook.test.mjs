import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import test from "node:test";

const scriptPath = new URL("./docs-automation-webhook.mjs", import.meta.url).pathname;

async function runWebhook(eventName) {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "epusdt-webhook-test-"));
  await mkdir(path.join(cwd, ".automation"));
  await writeFile(path.join(cwd, ".automation/context.json"), JSON.stringify({ test: true }));

  let request;
  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => {
      request = {
        headers: req.headers,
        payload: JSON.parse(Buffer.concat(chunks).toString("utf8")),
      };
      res.writeHead(202, { "content-type": "application/json" });
      res.end('{"ok":true,"accepted":true}');
    });
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));

  const child = spawn(process.execPath, [scriptPath], {
    cwd,
    env: {
      ...process.env,
      HERMES_WEBHOOK_URL: `http://127.0.0.1:${server.address().port}/webhook/hermes`,
      HERMES_WEBHOOK_SECRET: "test-secret",
      GITHUB_EVENT_NAME: eventName,
      GITHUB_EVENT_ACTION: "created",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stderr = "";
  child.stderr.on("data", chunk => { stderr += chunk; });
  const exitCode = await new Promise(resolve => child.on("exit", resolve));
  server.close();

  assert.equal(exitCode, 0, stderr);
  return request;
}

test("uses Hermes webhook variables and signature header", async () => {
  const request = await runWebhook("issues");
  assert.match(request.headers["x-hermes-signature-256"], /^sha256=[a-f0-9]{64}$/);
  assert.equal(request.headers["x-openclaw-signature-256"], undefined);
});

test("treats issue comments as documentation fixes", async () => {
  const request = await runWebhook("issue_comment");
  assert.equal(request.payload.eventType, "docs.fix");
});
