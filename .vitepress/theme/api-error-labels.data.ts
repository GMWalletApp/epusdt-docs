import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export declare const data: Record<string, Record<string, string>>;

export default {
  watch: ["../../api/payment.md", "../../*/api/payment.md"],
  load() {
    return Object.fromEntries(["root","zh","zh-tw","vi","ja","es","pt"].map(locale => {
      const path = resolve(locale === "root" ? "" : locale, "api/payment.md");
      const text = readFileSync(path, "utf8");
      const rows = [...text.matchAll(/^\| `(\d+)` \| \d+ \| ([^|]+) \|/gm)];
      return [locale, Object.fromEntries(rows.map(([,code,label]) => [code,label]))];
    }));
  },
};
