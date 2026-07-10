const species = [
  { name: "California Poppy", latin: "Eschscholzia californica", count: 4, color: "#F0A860", img: "🌼" },
  { name: "Forget-me-not", latin: "Myosotis scorpioides", count: 1, color: "#7B9FE0", img: "🌸" },
  { name: "Star Jasmine", latin: "Trachelospermum jasminoides", count: 2, color: "#F5F1E6", img: "🌼" },
  { name: "Hydrangea", latin: "Hydrangea macrophylla", count: 1, color: "#B4A0DE", img: "🌸" },
  { name: "Sweet Pea", latin: "Lathyrus odoratus", count: 3, color: "#E88FA5", img: "🌸" },
  { name: "Black-eyed Susan", latin: "Rudbeckia hirta", count: 1, color: "#E0B84C", img: "🌼" },
];

export function SpeciesIndex() {
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
            6 species
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: "#9A8F7F" }}>
          Species Index &middot; A&ndash;Z
        </p>

        <div className="flex gap-2 pb-1">
          <button
            className="h-8 px-3 rounded-full text-xs font-medium border"
            style={{ backgroundColor: "#c5d07d", color: "#3D362D", borderColor: "#c5d07d" }}
          >
            A&ndash;Z
          </button>
          <button
            className="h-8 px-3 rounded-full text-xs font-medium border"
            style={{ backgroundColor: "transparent", color: "#9A8F7F", borderColor: "#D4CBB3" }}
          >
            Most Seen
          </button>
          <button
            className="h-8 px-3 rounded-full text-xs font-medium border"
            style={{ backgroundColor: "transparent", color: "#9A8F7F", borderColor: "#D4CBB3" }}
          >
            Rarest
          </button>
        </div>
      </header>

      <main className="px-3 pt-4 flex flex-col gap-2.5">
        {species.map((s) => (
          <div
            key={s.name}
            className="rounded-2xl flex items-center gap-3 p-2.5"
            style={{ backgroundColor: "#FFF9ED", border: "1px solid #E8DCC0" }}
          >
            <div
              className="rounded-xl flex items-center justify-center text-3xl shrink-0"
              style={{ width: 56, height: 56, backgroundColor: s.color + "22" }}
            >
              {s.img}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm truncate" style={{ fontFamily: "Fraunces, serif", color: "#2C2721" }}>
                {s.name}
              </p>
              <p className="text-[11px] italic truncate" style={{ color: "#9A8F7F" }}>
                {s.latin}
              </p>
            </div>
            <div
              className="flex flex-col items-center justify-center rounded-full shrink-0"
              style={{
                width: 44,
                height: 44,
                backgroundColor: s.count > 1 ? "#c5d07d" : "#EFE7D0",
                border: s.count > 1 ? "1px solid #c5d07d" : "1px solid #D4CBB3",
              }}
            >
              <span className="text-sm font-semibold" style={{ color: s.count > 1 ? "#3D362D" : "#9A8F7F" }}>
                {s.count}
              </span>
              <span className="text-[8px] uppercase tracking-wide" style={{ color: s.count > 1 ? "#3D362D" : "#9A8F7F" }}>
                seen
              </span>
            </div>
          </div>
        ))}
        <p className="text-center text-xs mt-4" style={{ color: "#C4BBA5" }}>
          Repeat sightings stack into one card with a running count. Tap a card to see every date you've found it.
        </p>
      </main>
    </div>
  );
}
