const themes = [
  { key: "love", label: "Love & Devotion", count: 3, color: "#E88FA5" },
  { key: "new", label: "New Beginnings", count: 2, color: "#c5d07d" },
  { key: "remembrance", label: "Remembrance", count: 1, color: "#9B87C4" },
  { key: "joy", label: "Joy & Celebration", count: 2, color: "#F0A860" },
  { key: "strength", label: "Strength & Resilience", count: 1, color: "#7B9FE0" },
];

const flowers = [
  { name: "Sweet Pea", theme: "love", color: "#E88FA5", img: "🌸" },
  { name: "California Poppy", theme: "joy", color: "#F0A860", img: "🌼" },
  { name: "Forget-me-not", theme: "remembrance", color: "#7B9FE0", img: "🌸" },
];

export function ThemeIndex() {
  return (
    <div
      className="min-h-screen pb-28 relative"
      style={{ backgroundColor: "#F5EFD8", fontFamily: "system-ui, sans-serif" }}
    >
      <header
        className="px-5 pt-10 pb-3 sticky top-0 z-20"
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
        <p className="text-xs mb-3" style={{ color: "#9A8F7F" }}>
          Browse by meaning
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            className="shrink-0 h-8 px-3 rounded-full text-xs font-medium border"
            style={{ backgroundColor: "transparent", color: "#9A8F7F", borderColor: "#D4CBB3" }}
          >
            All
          </button>
          {themes.map((t, i) => (
            <button
              key={t.key}
              className="shrink-0 h-8 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5"
              style={{
                backgroundColor: i === 0 ? "#FFF9ED" : "transparent",
                borderColor: i === 0 ? "#3D362D" : "#D4CBB3",
                color: i === 0 ? "#3D362D" : "#9A8F7F",
                boxShadow: i === 0 ? "0 1px 3px rgba(61,54,45,0.12)" : "none",
              }}
            >
              <span className="rounded-full" style={{ width: 8, height: 8, backgroundColor: t.color }} />
              {t.label}
              <span
                className="rounded-full flex items-center justify-center"
                style={{ width: 16, height: 16, fontSize: 9, backgroundColor: "#E8DCC0", color: "#3D362D" }}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </header>

      <main className="px-3 pt-5 flex flex-col gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-widest mb-2 px-1" style={{ color: "#9A8F7F" }}>
            Love &amp; Devotion &middot; 3 flowers
          </p>
          <div className="grid grid-cols-2 gap-3">
            {flowers
              .filter((f) => f.theme === "love")
              .map((f) => (
                <div
                  key={f.name}
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: "#FFF9ED", border: "1px solid #E8DCC0" }}
                >
                  <div
                    className="w-full flex items-center justify-center text-5xl"
                    style={{ height: 140, backgroundColor: f.color + "22" }}
                  >
                    {f.img}
                  </div>
                  <div className="p-2.5">
                    <p className="text-sm truncate" style={{ fontFamily: "Fraunces, serif", color: "#2C2721" }}>
                      {f.name}
                    </p>
                    <p className="text-[10px] italic truncate mt-0.5" style={{ color: "#9A8F7F" }}>
                      "Blissful pleasure"
                    </p>
                  </div>
                </div>
              ))}
            <div className="rounded-2xl overflow-hidden opacity-40" style={{ backgroundColor: "#FFF9ED", border: "1px solid #E8DCC0" }}>
              <div
                className="w-full flex items-center justify-center text-5xl"
                style={{ height: 140, backgroundColor: "#EFE7D0" }}
              >
                🌷
              </div>
              <div className="p-2.5">
                <p className="text-sm truncate" style={{ fontFamily: "Fraunces, serif", color: "#9A8F7F" }}>
                  Tulip
                </p>
                <p className="text-[10px] truncate mt-0.5" style={{ color: "#C4BBA5" }}>
                  Perfect &amp; Deep Love
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-2" style={{ color: "#C4BBA5" }}>
          Each theme comes from a fixed list of 10 — so this stays browsable, not overwhelming.
        </p>
      </main>
    </div>
  );
}
