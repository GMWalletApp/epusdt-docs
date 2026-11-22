import MiniSearch from "minisearch";

const defaultTokenize = MiniSearch.getDefault("tokenize");
const japanese = typeof Intl.Segmenter === "function"
  ? new Intl.Segmenter("ja", { granularity: "word" })
  : undefined;

export function tokenize(text: string): string[] {
  return defaultTokenize(text).flatMap((token: string) => {
    if (!japanese || !/[\u3040-\u30ff\u3400-\u9fff]/u.test(token)) return [token];
    return Array.from(japanese.segment(token)).filter(part => part.isWordLike).map(part => part.segment);
  });
}
