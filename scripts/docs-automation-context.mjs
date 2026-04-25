import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const token = process.env.DOCS_AUTOMATION_TOKEN;
const eventName = process.env.GITHUB_EVENT_NAME || "unknown";
const eventPath = process.env.GITHUB_EVENT_PATH;

if (!token) {
  console.error("DOCS_AUTOMATION_TOKEN is required for docs automation workflow");
  process.exit(1);
}

const event = eventPath && existsSync(eventPath) ? JSON.parse(readFileSync(eventPath, "utf8")) : {};

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "epusdt-docs-automation",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${path} failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

const [docsIssues, upstreamIssues, upstreamRelease] = await Promise.all([
  github("/repos/GMWalletApp/epusdt-docs/issues?state=open&per_page=50"),
  github("/repos/GMWalletApp/epusdt/issues?state=open&per_page=50"),
  github("/repos/GMWalletApp/epusdt/releases/latest"),
]);

const report = {
  generatedAt: new Date().toISOString(),
  eventName,
  trigger: event.client_payload ?? {
    action: event.action ?? null,
    issue: event.issue
      ? {
          number: event.issue.number,
          title: event.issue.title,
          url: event.issue.html_url,
        }
      : null,
  },
  docsRepoIssues: docsIssues.filter((issue) => !issue.pull_request).map((issue) => ({
    number: issue.number,
    title: issue.title,
    url: issue.html_url,
  })),
  upstreamDocsIssues: upstreamIssues
    .filter((issue) => !issue.pull_request)
    .filter((issue) => {
      const haystack = [issue.title, ...(issue.labels || []).map((label) => label.name || "")]
        .join("\n")
        .toLowerCase();

      return ["doc", "docs", "documentation", "readme", "guide", "install", "tutorial", "docker", "aapanel", "文档", "教程", "安装", "部署"].some((keyword) => haystack.includes(keyword));
    })
    .map((issue) => ({
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
    })),
  latestRelease: {
    tag: upstreamRelease.tag_name,
    name: upstreamRelease.name,
    url: upstreamRelease.html_url,
    publishedAt: upstreamRelease.published_at,
  },
};

mkdirSync(".automation", { recursive: true });
writeFileSync(join(".automation", "context.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
