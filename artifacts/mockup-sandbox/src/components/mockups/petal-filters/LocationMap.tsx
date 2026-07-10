const pins = [
  { name: "Forget-me-not", spot: "Palm tree, tennis courts", x: 28, y: 22, color: "#7B9FE0" },
  { name: "California Poppy", spot: "Front garden, Elm St", x: 62, y: 40, color: "#F0A860" },
  { name: "Star Jasmine", spot: "Fence on Liberty", x: 40, y: 65, color: "#F5F1E6" },
  { name: "Hydrangea", spot: "Porch, Liberty & 5th", x: 74, y: 74, color: "#B4A0DE" },
];

export function LocationMap() {
  return (
    <div
      className="min-h-screen pb-28 relative flex flex-col"
      style={{ backgroundColor: "#F5EFD8", fontFamily: "system-ui, sans-serif" }}
    >
      <header
        className="px-5 pt-10 pb-3 z-20"
        style={{ backgroundColor: "rgba(245,239,216,0.95)", borderBottom: "1px solid #E8DCC0" }}
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
          Where I've Wandered
        </p>

        <div className="flex gap-2 pb-1">
          <button
            className="h-8 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5"
            style={{ backgroundColor: "#FFF9ED", color: "#9A8F7F", borderColor: "#D4CBB3" }}
          >
            🔲 Grid
          </button>
          <button
            className="h-8 px-3 rounded-full text-xs font-medium border flex items-center gap-1.5"
            style={{ backgroundColor: "#c5d07d", color: "#3D362D", borderColor: "#c5d07d" }}
          >
            📍 Map
          </button>
        </div>
      </header>

      {/* Map area */}
      <div className="flex-1 relative mx-3 mt-4 rounded-2xl overflow-hidden" style={{ minHeight: 460, border: "1px solid #E8DCC0" }}>
        {/* stylized paper map background */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <rect width="100" height="100" fill="#EFE7D0" />
          <path d="M0 30 Q 25 20 45 32 T 100 28" stroke="#DCCFAE" strokeWidth="1.4" fill="none" />
          <path d="M0 55 Q 30 65 55 52 T 100 58" stroke="#DCCFAE" strokeWidth="1.4" fill="none" />
          <path d="M15 0 L 20 100" stroke="#E3D8BC" strokeWidth="1" fill="none" />
          <path d="M70 0 L 66 100" stroke="#E3D8BC" strokeWidth="1" fill="none" />
          <circle cx="20" cy="18" r="6" fill="#D9CFA8" opacity="0.6" />
          <circle cx="85" cy="85" r="9" fill="#D9CFA8" opacity="0.5" />
          <circle cx="85" cy="15" r="5" fill="#D9CFA8" opacity="0.4" />
        </svg>

        {pins.map((p) => (
          <div
            key={p.name}
            className="absolute flex flex-col items-center"
            style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -100%)" }}
          >
            <div
              className="rounded-full flex items-center justify-center shadow-md"
              style={{
                width: 30,
                height: 30,
                backgroundColor: "#FFF9ED",
                border: `2px solid ${p.color === "#F5F1E6" ? "#D4CBB3" : p.color}`,
              }}
            >
              <span style={{ fontSize: 14 }}>🌼</span>
            </div>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `7px solid ${p.color === "#F5F1E6" ? "#D4CBB3" : p.color}`,
                marginTop: -2,
              }}
            />
          </div>
        ))}

        {/* Selected pin callout card */}
        <div
          className="absolute left-3 right-3 bottom-3 rounded-xl p-3 flex items-center gap-3 shadow-lg"
          style={{ backgroundColor: "#FFF9ED", border: "1px solid #E8DCC0" }}
        >
          <div
            className="rounded-lg flex items-center justify-center text-2xl shrink-0"
            style={{ width: 48, height: 48, backgroundColor: "#B4A0DE22" }}
          >
            🌼
          </div>
          <div className="min-w-0">
            <p className="text-sm truncate" style={{ fontFamily: "Fraunces, serif", color: "#2C2721" }}>
              Hydrangea
            </p>
            <p className="text-[11px] truncate" style={{ color: "#9A8F7F" }}>
              Porch, Liberty & 5th
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs mt-4 px-6" style={{ color: "#C4BBA5" }}>
        Tap a pin to see which flower you found there. Toggle back to Grid anytime.
      </p>
    </div>
  );
}
