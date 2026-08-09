import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflow = await readFile(
  new URL("../.github/workflows/docs-automation.yml", import.meta.url),
  "utf8"
);

test("workflow exposes only generic automation webhook names", () => {
  assert.match(
    workflow,
    /AUTOMATION_WEBHOOK_URL:\s*\$\{\{ secrets\.AUTOMATION_WEBHOOK_URL \}\}/
  );
  assert.match(
    workflow,
    /AUTOMATION_WEBHOOK_SECRET:\s*\$\{\{ secrets\.AUTOMATION_WEBHOOK_SECRET \}\}/
  );
  assert.match(workflow, /AUTOMATION_DRY_RUN:/);
});