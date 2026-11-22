export const languages = [
  { id: "en", label: "English", tag: "en", prefix: "/", openGraph: "en_US" },
  { id: "zh", label: "简体中文", tag: "zh-Hans", prefix: "/zh/", openGraph: "zh_CN" },
  { id: "zh-tw", label: "繁體中文", tag: "zh-Hant", prefix: "/zh-tw/", openGraph: "zh_TW" },
  { id: "vi", label: "Tiếng Việt", tag: "vi", prefix: "/vi/", openGraph: "vi_VN" },
  { id: "ja", label: "日本語", tag: "ja", prefix: "/ja/", openGraph: "ja_JP" },
  { id: "es", label: "Español", tag: "es", prefix: "/es/", openGraph: "es_ES" },
  { id: "pt", label: "Português", tag: "pt-BR", prefix: "/pt/", openGraph: "pt_BR" },
  { id: "ko", label: "한국어", tag: "ko", prefix: "/ko/", openGraph: "ko_KR" },
  { id: "ru", label: "Русский", tag: "ru", prefix: "/ru/", openGraph: "ru_RU" },
] as const;

export type Language = typeof languages[number]["id"];
