const allThemes = [
  { key: "love", label: "Love & Devotion", count: 3, color: "#E88FA5" },
  { key: "new", label: "New Beginnings", count: 2, color: "#c5d07d" },
  { key: "remembrance", label: "Remembrance", count: 1, color: "#9B87C4" },
  { key: "joy", label: "Joy & Celebration", count: 2, color: "#F0A860" },
  { key: "strength", label: "Strength & Resilience", count: 1, color: "#7B9FE0" },
  { key: "purity", label: "Purity & Innocence", count: 0, color: "#8FBF8F" },
  { key: "grief", label: "Grief & Farewell", count: 0, color: "#A9998A" },
  { key: "luck", label: "Luck & Fortune", count: 0, color: "#D9B84C" },
];

const themes = allThemes.filter((t) => t.count > 0);

export function ThemeIndex() {
  return (
    <div
      className="min-h-screen pb-28 relative"
      style={{ backgroundColor: "#F5EFD8", fontFamily: "system-ui, sans-serif" }}
    >
      <header
        className="px-5 pt-10 pb-4 sticky top-0 z-20"
        style={{
          backgroundColor: "rgba(245,239,216,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #E8DCC0",
        }}
      >
        <div className="flex items-center justify-between mb-0.5">
          <h1
            className="text-2xl tracking-tight flex items-center gap-2"
            style={{ fontFamily: "Fraunces, serif", color: "#3D362D" }}
          >
            🌸 Petal Press
          </h1>
          <span className="text-xs tracking-widest" style={{ color: "#9A8F7F" }}>
            9 flowers
          </span>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            className="h-8 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5"
            style={{ backgroundColor: "#FFF9ED", color: "#9A8F7F", borderColor: "#D4CBB3" }}
          >
            🔲 All Flowers
          </button>
          <button
            className="h-8 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5"
            style={{ backgroundColor: "#c5d07d", color: "#3D362D", borderColor: "#c5d07d" }}
          >
            ✦ By Meaning
          </button>
        </div>
      </header>

      <main className="px-3 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => (
            <div
              key={t.key}
              className="rounded-2xl p-4 flex flex-col justify-between"
              style={{ backgroundColor: "#FFF9ED", border: "1px solid #E8DCC0", minHeight: 108 }}
            >
              <span
                className="rounded-full mb-3"
                style={{ width: 22, height: 22, backgroundColor: t.color }}
              />
              <div>
                <p
                  className="text-sm leading-snug"
                  style={{ fontFamily: "Fraunces, serif", color: "#2C2721" }}
                >
                  {t.label}
                </p>
                <p className="text-[11px] mt-1" style={{ color: "#9A8F7F" }}>
                  {t.count} flower{t.count > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-6 px-4" style={{ color: "#C4BBA5" }}>
          Only meanings you've actually collected show up here — no empty tiles, even with just a few flowers.
        </p>
      </main>
    </div>
  );
}
