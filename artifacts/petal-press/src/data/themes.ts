export type ThemeKey =
  | "love"
  | "new-beginnings"
  | "remembrance"
  | "joy"
  | "strength";

export const THEMES: { key: ThemeKey; label: string; color: string }[] = [
  { key: "love", label: "Love & Devotion", color: "#E88FA5" },
  { key: "new-beginnings", label: "New Beginnings & Luck", color: "#c5d07d" },
  { key: "remembrance", label: "Remembrance & Grief", color: "#9B87C4" },
  { key: "joy", label: "Joy & Celebration", color: "#F0A860" },
  { key: "strength", label: "Strength & Wisdom", color: "#7B9FE0" },
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
  ["love", ["love", "devotion", "romance", "passion", "desire", "affection", "heart", "friendship", "friend", "loyalty", "companion"]],
  ["new-beginnings", ["new beginnings", "hope", "renewal", "rebirth", "first", "spring", "anticipation", "luck", "fortune", "prosperity", "wealth"]],
  ["remembrance", ["remembrance", "memory", "recollection", "nostalgia", "grief", "farewell", "sorrow", "mourning", "departure", "goodbye"]],
  ["joy", ["joy", "cheerfulness", "happiness", "delight", "celebration", "sunshine", "purity", "innocence", "chastity", "modesty"]],
  ["strength", ["strength", "courage", "resilience", "persistence", "endurance", "protection", "mystery", "magic", "enchantment", "intrigue", "witch", "wisdom"]],
];

export function deriveTheme(meaning: string): ThemeKey {
  const lower = meaning.toLowerCase();
  for (const [key, keywords] of KEYWORD_MAP) {
    if (keywords.some(k => lower.includes(k))) return key;
  }
  return "joy";
}
