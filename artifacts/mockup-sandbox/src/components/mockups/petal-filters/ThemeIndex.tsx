const themes = [
  { key: "love", label: "Love & Devotion", count: 3, color: "#E88FA5" },
  { key: "new", label: "New Beginnings", count: 2, color: "#c5d07d" },
  { key: "remembrance", label: "Remembrance", count: 1, color: "#9B87C4" },
  { key: "joy", label: "Joy & Celebration", count: 2, color: "#F0A860" },
  { key: "strength", label: "Strength & Resilience", count: 1, color: "#7B9FE0" },
  { key: "purity", label: "Purity & Innocence", count: 0, color: "#8FBF8F" },
];

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
        <p className="text-xs" style={{ color: "#9A8F7F" }}>
          Browse by meaning
        </p>
      </header>

      <main className="px-3 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => {
            const empty = t.count === 0;
            return (
              <div
                key={t.key}
                className="rounded-2xl p-4 flex flex-col justify-between"
                style={{
                  backgroundColor: empty ? "#EFE7D0" : "#FFF9ED",
                  border: "1px solid #E8DCC0",
                  minHeight: 108,
                  opacity: empty ? 0.55 : 1,
                }}
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
                    {empty ? "None yet" : `${t.count} flower${t.count > 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs mt-6 px-4" style={{ color: "#C4BBA5" }}>
          Tap a meaning to see every flower tied to it. Themes come from a fixed list of 10, so this never sprawls.
        </p>
      </main>
    </div>
  );
}
