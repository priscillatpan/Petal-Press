const flowers = [
  { name: "Forget-me-not", color: "#5B7FBF", swatch: "#7B9FE0", img: "🌼" },
  { name: "California Poppy", color: "#E08A3C", swatch: "#F0A860", img: "🌼" },
  { name: "Star Jasmine", color: "#F5F1E6", swatch: "#FFFFFF", img: "🌼" },
  { name: "Hydrangea", color: "#9B87C4", swatch: "#B4A0DE", img: "🌼" },
];

const COLORS = [
  { key: "blue", label: "Blue", swatch: "#7B9FE0" },
  { key: "orange", label: "Orange", swatch: "#F0A860" },
  { key: "white", label: "White", swatch: "#FFFFFF" },
  { key: "purple", label: "Purple", swatch: "#B4A0DE" },
];

export function ColorFilter() {
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
            4 species found
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: "#9A8F7F" }}>
          Filtering by color
        </p>

        {/* Color swatch filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none items-center">
          <button
            className="shrink-0 h-8 px-3 rounded-full text-xs font-medium border"
            style={{ backgroundColor: "#c5d07d", color: "#3D362D", borderColor: "#c5d07d" }}
          >
            All
          </button>
          {COLORS.map((c, i) => (
            <button
              key={c.key}
              className="shrink-0 h-8 pl-1.5 pr-3 rounded-full text-xs font-medium border flex items-center gap-1.5"
              style={{
                backgroundColor: i === 1 ? "#FFF9ED" : "transparent",
                borderColor: i === 1 ? "#3D362D" : "#D4CBB3",
                color: i === 1 ? "#3D362D" : "#9A8F7F",
                boxShadow: i === 1 ? "0 1px 3px rgba(61,54,45,0.12)" : "none",
              }}
            >
              <span
                className="rounded-full"
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: c.swatch,
                  border: c.swatch === "#FFFFFF" ? "1px solid #D4CBB3" : "1px solid rgba(0,0,0,0.08)",
                }}
              />
              {c.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-3 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {flowers.map((f, i) => {
            const dimmed = i !== 1;
            return (
              <div
                key={f.name}
                className="rounded-2xl overflow-hidden relative transition-opacity"
                style={{
                  backgroundColor: "#FFF9ED",
                  border: "1px solid #E8DCC0",
                  opacity: dimmed ? 0.35 : 1,
                }}
              >
                <div
                  className="w-full flex items-center justify-center text-5xl"
                  style={{ height: 140, backgroundColor: f.color + "22" }}
                >
                  {f.img}
                </div>
                <div className="p-2.5">
                  <p
                    className="text-sm truncate"
                    style={{ fontFamily: "Fraunces, serif", color: "#2C2721" }}
                  >
                    {f.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className="rounded-full"
                      style={{ width: 10, height: 10, backgroundColor: f.swatch, border: "1px solid rgba(0,0,0,0.08)" }}
                    />
                    <span className="text-[10px] uppercase tracking-wide" style={{ color: "#9A8F7F" }}>
                      {f.color === "#E08A3C" ? "orange" : ""}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs mt-6" style={{ color: "#C4BBA5" }}>
          Tap a swatch to filter your garden by color. Tap "All" to clear.
        </p>
      </main>
    </div>
  );
}
