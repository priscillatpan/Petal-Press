import { useId } from "react";

// All in the pebble/chunky family: smooth, rounded, filling most of the card.
// Each has a subtle personality shift — offset weight, slight lean, gentle dent.
const BLOBS = [
  {
    label: "Heavier top-left",
    // Anchors nudged up-left; right side slightly pinched
    d: "M 0.46,0.03 C 0.74,0.00 0.98,0.18 0.97,0.48 C 0.96,0.76 0.76,0.98 0.50,0.97 C 0.24,0.98 0.03,0.78 0.03,0.50 C 0.03,0.22 0.20,0.04 0.46,0.03 Z",
  },
  {
    label: "Slightly wide",
    // Wider than tall — landscape pebble
    d: "M 0.50,0.06 C 0.80,0.04 0.98,0.22 0.96,0.50 C 0.94,0.76 0.76,0.96 0.50,0.95 C 0.24,0.96 0.04,0.78 0.04,0.50 C 0.04,0.24 0.22,0.06 0.50,0.06 Z",
  },
  {
    label: "Gentle dent bottom",
    // Subtle inward lean at lower-left
    d: "M 0.50,0.05 C 0.76,0.03 0.97,0.20 0.97,0.48 C 0.97,0.74 0.78,0.97 0.52,0.97 C 0.26,0.98 0.04,0.80 0.05,0.54 C 0.06,0.28 0.26,0.05 0.50,0.05 Z",
  },
  {
    label: "Chunky top",
    // Heavier at the top — top corners fuller, bottom slightly pinched
    d: "M 0.50,0.02 C 0.82,0.00 1.00,0.14 0.98,0.46 C 0.96,0.74 0.80,0.98 0.50,0.98 C 0.20,0.98 0.04,0.76 0.02,0.50 C 0.00,0.20 0.18,0.02 0.50,0.02 Z",
  },
  {
    label: "Offset right",
    // Center of mass shifted right — left side flatter
    d: "M 0.54,0.04 C 0.78,0.02 0.98,0.20 0.98,0.48 C 0.98,0.76 0.80,0.97 0.54,0.97 C 0.28,0.98 0.04,0.80 0.03,0.52 C 0.02,0.24 0.24,0.04 0.54,0.04 Z",
  },
  {
    label: "Gentle pinch top",
    // Narrower at top, fuller at bottom — slight pear feel but still round
    d: "M 0.50,0.06 C 0.74,0.04 0.97,0.22 0.97,0.50 C 0.97,0.78 0.78,0.98 0.50,0.97 C 0.22,0.98 0.03,0.78 0.04,0.52 C 0.05,0.24 0.26,0.06 0.50,0.06 Z",
  },
];

const COLORS = [
  "#8FAE7B","#B87C5A","#7B9EAE","#C4A07A","#9B7BB5","#AE8F7B",
];

function BlobShape({ d, label, color, index }: { d: string; label: string; color: string; index: number }) {
  const uid = useId().replace(/:/g, "");
  const clipId = `bc-${uid}`;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 118, height: 118 }}>
        <svg width="0" height="0" style={{ position: "absolute", overflow: "hidden" }}>
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path d={d} />
            </clipPath>
          </defs>
        </svg>
        <div
          style={{
            width: "100%",
            height: "100%",
            clipPath: `url(#${clipId})`,
            background: `radial-gradient(circle at 38% 36%, ${color}ee, ${color}66)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
          }}
        >
          ✿
        </div>
      </div>
      <div className="text-center" style={{ maxWidth: 118 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#3D362D", fontFamily: "Fraunces, serif" }}>
          {index + 1}
        </div>
        <div style={{ fontSize: 9, color: "#9A8F7F", lineHeight: 1.3 }}>{label}</div>
      </div>
    </div>
  );
}

export function BlobPicker() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 p-10"
      style={{ backgroundColor: "#F5EFD8" }}
    >
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: "#3D362D", fontWeight: 600 }}>
        Pebble family — smooth & filled
      </div>
      <div className="grid grid-cols-6 gap-7">
        {BLOBS.map((blob, i) => (
          <BlobShape key={i} d={blob.d} label={blob.label} color={COLORS[i]} index={i} />
        ))}
      </div>
      <div style={{ fontSize: 10, color: "#9A8F7F", textAlign: "center" }}>
        Tell me which numbers you like — or "all of them" to use the whole set in the grid.
      </div>
    </div>
  );
}
