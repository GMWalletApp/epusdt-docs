import { readFileSync } from "node:fs";
import { languages } from "../languages";
import { resolve } from "node:path";

export declare const data: Record<string, Record<string, string>>;

export default {
  watch: ["../../api/payment.md", "../../*/api/payment.md"],
  load() {
    return Object.fromEntries(languages.map(({ id }) => {
      const locale = id === "en" ? "root" : id;
      const path = resolve(locale === "root" ? "" : locale, "api/payment.md");
      const text = readFileSync(path, "utf8");
      const rows = [...text.matchAll(/^\| `(\d+)` \| \d+ \| ([^|]+) \|/gm)];
      return [locale, Object.fromEntries(rows.map(([,code,label]) => [code,label]))];
    }));
  },
};
