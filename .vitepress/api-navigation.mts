import { readFileSync } from "node:fs";

export function endpointNavigation(prefix: string) {
  const index = readFileSync(new URL(`..${prefix}api/reference.md`, import.meta.url), "utf8");
  const rows = /^\| \[([^\]]+)\]\(([^)]+\/endpoints\/[^)]+)\) \| ([^|]+) \| `([^`]+)` \|/gm;
  return [...index.matchAll(rows)].map(([, text, link, methods, route]) => ({
    text, link, route, method: (methods.match(/GET|POST/g) ?? []).join("/"),
  }));
}
