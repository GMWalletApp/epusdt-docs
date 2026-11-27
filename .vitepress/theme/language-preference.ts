import { languages, type Language } from "../languages";

const preferenceKey = "epusdt-docs.language";

export function preferredHomePrefix(stored: string | null, browserLanguages: readonly string[]) {
  const selected = languages.find(language => language.id === stored);
  if (selected) return selected.prefix;

  for (const tag of browserLanguages) {
    let locale: Intl.Locale;
    try {
      locale = new Intl.Locale(tag);
    } catch {
      continue;
    }
    const id = locale.language === "zh" && locale.maximize().script === "Hant" ? "zh-tw" : locale.language;
    const match = languages.find(language => language.id === id);
    if (match) return match.prefix;
  }
  return "/";
}

export function rememberLanguage(language: Language) {
  try {
    window.localStorage.setItem(preferenceKey, language);
  } catch {
    // Navigation still works when the browser disallows persistent storage.
  }
}

export function redirectHomeOnEntry() {
  const { location, navigator } = window;
  if (!["/", "/index", "/index.html"].includes(location.pathname)) return;

  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(preferenceKey);
  } catch {
    // Use the browser's language list when storage is unavailable.
  }
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  const prefix = preferredHomePrefix(stored, preferred);
  if (prefix !== "/") location.replace(prefix + location.search + location.hash);
}
