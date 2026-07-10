export type ThemeKey =
  | "love"
  | "new-beginnings"
  | "remembrance"
  | "friendship"
  | "purity"
  | "strength"
  | "joy"
  | "mystery"
  | "grief"
  | "luck";

export const THEMES: { key: ThemeKey; label: string; color: string }[] = [
  { key: "love", label: "Love & Devotion", color: "#E88FA5" },
  { key: "new-beginnings", label: "New Beginnings", color: "#c5d07d" },
  { key: "remembrance", label: "Remembrance", color: "#9B87C4" },
  { key: "friendship", label: "Friendship", color: "#E0B84C" },
  { key: "purity", label: "Purity & Innocence", color: "#8FBF8F" },
  { key: "strength", label: "Strength & Resilience", color: "#7B9FE0" },
  { key: "joy", label: "Joy & Celebration", color: "#F0A860" },
  { key: "mystery", label: "Mystery & Magic", color: "#6E6A9E" },
  { key: "grief", label: "Grief & Farewell", color: "#A9998A" },
  { key: "luck", label: "Luck & Fortune", color: "#D9B84C" },
];

export const THEME_KEYS = THEMES.map(t => t.key);

export function themeLabel(key: string): string {
  return THEMES.find(t => t.key === key)?.label ?? "Uncategorized";
}

export function themeColor(key: string): string {
  return THEMES.find(t => t.key === key)?.color ?? "#C4BBA5";
}

// Fallback classifier for meanings that came from the local floriography table
// (which predates theme tagging). AI-generated meanings return a theme directly.
const KEYWORD_MAP: [ThemeKey, string[]][] = [
  ["love", ["love", "devotion", "romance", "passion", "desire", "affection", "heart"]],
  ["new-beginnings", ["new beginnings", "hope", "renewal", "rebirth", "first", "spring", "anticipation"]],
  ["remembrance", ["remembrance", "memory", "recollection", "nostalgia"]],
  ["friendship", ["friendship", "friend", "loyalty", "companion"]],
  ["purity", ["purity", "innocence", "chastity", "modesty"]],
  ["strength", ["strength", "courage", "resilience", "persistence", "endurance", "protection"]],
  ["joy", ["joy", "cheerfulness", "happiness", "delight", "celebration", "sunshine"]],
  ["mystery", ["mystery", "magic", "enchantment", "intrigue", "witch"]],
  ["grief", ["grief", "farewell", "sorrow", "mourning", "departure", "goodbye"]],
  ["luck", ["luck", "fortune", "prosperity", "wealth"]],
];

export function deriveTheme(meaning: string): ThemeKey {
  const lower = meaning.toLowerCase();
  for (const [key, keywords] of KEYWORD_MAP) {
    if (keywords.some(k => lower.includes(k))) return key;
  }
  return "joy";
}
