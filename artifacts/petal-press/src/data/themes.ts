export type ThemeKey = "love" | "joy" | "strength" | "new-beginnings" | "remembrance";

export type Theme = {
  key: ThemeKey;
  label: string;
  color: string;
  keywords: string[];
};

export const THEMES: Theme[] = [
  {
    key: "love",
    label: "Love",
    color: "#D08090",
    keywords: ["love", "romance", "passion", "devotion", "affection", "adoration", "desire", "heart", "attachment", "sweet love", "true love"],
  },
  {
    key: "joy",
    label: "Joy",
    color: "#D4A070",
    keywords: ["joy", "happiness", "cheerful", "delight", "bright", "sunshine", "warmth", "celebration", "prosperity", "radiance", "pleasure", "beauty", "grace"],
  },
  {
    key: "strength",
    label: "Strength",
    color: "#7A90C0",
    keywords: ["strength", "resilience", "courage", "endurance", "power", "vitality", "fortitude", "protection", "victory", "pride"],
  },
  {
    key: "new-beginnings",
    label: "New Beginnings",
    color: "#7BAC80",
    keywords: ["hope", "new beginning", "renewal", "rebirth", "fresh start", "purity", "innocence", "consolation", "anticipation", "healing", "rest", "fleeting"],
  },
  {
    key: "remembrance",
    label: "Remembrance",
    color: "#A080B0",
    keywords: ["remembrance", "memory", "grief", "sorrow", "melancholy", "mourning", "loyalty", "constancy", "faithfulness", "friendship", "trust", "gratitude"],
  },
];

export function deriveTheme(meaning: string): ThemeKey | null {
  const lower = meaning.toLowerCase();
  for (const theme of THEMES) {
    if (theme.keywords.some(k => lower.includes(k))) return theme.key;
  }
  return null;
}
