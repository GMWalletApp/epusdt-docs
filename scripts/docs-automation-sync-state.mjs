import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const context = JSON.parse(readFileSync(".automation/context.json", "utf8"));
const upstreamState = context.upstreamState;

if (!upstreamState?.defaultBranch || !upstreamState?.latestCommitSha || !upstreamState?.latestRelease?.tag) {
  console.error("context.json is missing upstreamState fields");
  process.exit(1);
}

mkdirSync(".automation", { recursive: true });
writeFileSync(
  ".automation/upstream-state.json",
  `${JSON.stringify(
    {
      defaultBranch: upstreamState.defaultBranch,
      latestCommitSha: upstreamState.latestCommitSha,
      latestRelease: {
        tag: upstreamState.latestRelease.tag,
        publishedAt: upstreamState.latestRelease.publishedAt,
      },
    },
    null,
    2,
  )}\n`,
);

console.log(JSON.stringify({ ok: true, synced: true, path: ".automation/upstream-state.json" }));
