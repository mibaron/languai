const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  de: "German",
  fa: "Persian",
  ar: "Arabic",
  tr: "Turkish",
  fr: "French",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
};

export function getLanguageLabel(code: string): string {
  return LANGUAGE_LABELS[code] ?? code;
}
