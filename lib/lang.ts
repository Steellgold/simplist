export enum Lang {
  EN = "EN",
  ZH = "ZH", // Mandarin
  HI = "HI",
  ES = "ES",
  BN = "BN", // Bengali
  RU = "RU",
  PT = "PT",
  FR = "FR",
  UR = "UR", // Urdu
  JP = "JP", // Japanese
  AR = "AR",
  KO = "KO", // Korean
  VI = "VI",
  TH = "TH", // Thai
  GU = "GU", // Gujarati
  TR = "TR",
  FA = "FA", // Persian
  DE = "DE",
  IT = "IT",
  LN = "LN"  // Lingala
}

export const LANGUAGES: Record<Lang, string> = {
  // 20 most spoken languages in the world (2023)
  // https://search.brave.com/search?q=20+langues+les+plus+parl%C3%A9es&source=desktop&summary=1&summary_og=d27d65a6011c33e0db0b5c
  [Lang.EN]: "English",
  [Lang.ZH]: "中文",
  [Lang.HI]: "हिन्दी",
  [Lang.ES]: "Español",
  [Lang.BN]: "বাংলা",
  [Lang.RU]: "Русский",
  [Lang.PT]: "Português",
  [Lang.FR]: "Français",
  [Lang.UR]: "اردو",
  [Lang.JP]: "日本語",
  [Lang.AR]: "العربية",
  [Lang.KO]: "한국어",
  [Lang.VI]: "Tiếng Việt",
  [Lang.TH]: "ไทย",
  [Lang.GU]: "ગુજરાતી",
  [Lang.TR]: "Türkçe",
  [Lang.FA]: "فارسی",
  [Lang.DE]: "Deutsch",
  [Lang.IT]: "Italiano",
  [Lang.LN]: "Lingala"
};