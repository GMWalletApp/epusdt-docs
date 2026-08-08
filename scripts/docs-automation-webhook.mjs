import { createHmac } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const webhookUrl = process.env.HERMES_WEBHOOK_URL;
const webhookSecret = process.env.HERMES_WEBHOOK_SECRET;

if (!webhookUrl || !webhookSecret) {
  console.error("HERMES_WEBHOOK_URL and HERMES_WEBHOOK_SECRET are required");
  process.exit(1);
}

const context = JSON.parse(readFileSync(".automation/context.json", "utf8"));
const trackedStatePath = ".automation/upstream-state.json";
const trackedState = existsSync(trackedStatePath) ? JSON.parse(readFileSync(trackedStatePath, "utf8")) : null;

const triggerKind = process.env.GITHUB_EVENT_NAME || "unknown";
const eventType = ["issues", "issue_comment"].includes(triggerKind) ? "docs.fix" : "docs.update";

if (eventType === "docs.update" && triggerKind === "schedule") {
  const currentState = context.upstreamState;

  const unchanged =
    trackedState &&
    trackedState.defaultBranch === currentState?.defaultBranch &&
    trackedState.latestCommitSha === currentState?.latestCommitSha &&
    trackedState.latestRelease?.tag === currentState?.latestRelease?.tag;

  if (unchanged) {
    console.log(JSON.stringify({ ok: true, skipped: true, reason: "upstream_unchanged" }));
    process.exit(0);
  }
}

const payload = {
  routeId: "epusdt-docs-repair",
  eventType,
  repo: "GMWalletApp/epusdt-docs",
  source: "github-actions",
  trigger: {
    kind: triggerKind,
    eventName: triggerKind,
    eventAction: process.env.GITHUB_EVENT_ACTION || "",
  },
  context,
};

const rawBody = JSON.stringify(payload);
const signature = `sha256=${createHmac("sha256", webhookSecret).update(rawBody).digest("hex")}`;

const response = await fetch(webhookUrl, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-hermes-signature-256": signature,
  },
  body: rawBody,
});

if (!response.ok) {
  const text = await response.text();
  console.error(`Webhook request failed: ${response.status} ${text}`);
  process.exit(1);
}

console.log(await response.text());
