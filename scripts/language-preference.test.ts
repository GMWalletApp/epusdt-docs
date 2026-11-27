import assert from "node:assert/strict";
import test from "node:test";
import { languages } from "../.vitepress/languages";
import { preferredHomePrefix } from "../.vitepress/theme/language-preference";

test("every supported language resolves to its own homepage", () => {
  for (const { tag, prefix } of languages) {
    assert.equal(preferredHomePrefix(null, [tag]), prefix);
  }
});

test("Chinese regions and explicit scripts select the intended writing system", () => {
  for (const tag of ["zh", "zh-CN", "zh-SG", "zh-Hans-TW"]) {
    assert.equal(preferredHomePrefix(null, [tag]), "/zh/", tag);
  }
  for (const tag of ["zh-HK", "zh-MO", "zh-TW", "zh-Hant-CN"]) {
    assert.equal(preferredHomePrefix(null, [tag]), "/zh-tw/", tag);
  }
});

test("site preference comes first, including an explicit choice of English", () => {
  for (const { id, prefix } of languages) {
    assert.equal(preferredHomePrefix(id, ["ja-JP", "en-US"]), prefix);
  }
});

test("use the first supported browser language and fall back to English", () => {
  assert.equal(preferredHomePrefix("unknown", ["de-DE", "es-419", "pt-PT"]), "/es/");
  assert.equal(preferredHomePrefix(null, ["invalid tag", "pt-PT"]), "/pt/");
  assert.equal(preferredHomePrefix(null, ["en-GB", "zh-TW"]), "/");
  assert.equal(preferredHomePrefix(null, ["de-DE"]), "/");
  assert.equal(preferredHomePrefix(null, []), "/");
});
