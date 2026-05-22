import { useId } from "react";

// Square-fitting blobs: 4 side-midpoint anchors with asymmetric bezier handles
// so the curve bulges close to all 4 corners. Each corner has different roundness.
// Format per corner handle: [outH_horizontal, outH_vertical] going clockwise.
// M = top-mid, then curves: → upper-right → lower-right → lower-left → upper-left → Z

const SQUARE_BLOBS = [
  {
    label: "Rounded square",
    // Even, soft corners — almost a squircle
    d: "M 0.50,0.03 C 0.78,0.03 0.97,0.20 0.97,0.50 C 0.97,0.78 0.78,0.97 0.50,0.97 C 0.22,0.97 0.03,0.78 0.03,0.50 C 0.03,0.22 0.22,0.03 0.50,0.03 Z",
  },
  {
    label: "Lopsided — taller right",
    // Right side puffs out more
    d: "M 0.50,0.04 C 0.80,0.02 1.00,0.18 0.98,0.52 C 0.96,0.82 0.76,0.98 0.50,0.96 C 0.24,0.98 0.04,0.82 0.04,0.50 C 0.04,0.20 0.22,0.04 0.50,0.04 Z",
  },
  {
    label: "Leaning left",
    // Left side fuller, right narrower
    d: "M 0.50,0.05 C 0.74,0.02 0.96,0.20 0.96,0.48 C 0.96,0.76 0.78,0.97 0.50,0.96 C 0.20,0.98 0.02,0.80 0.04,0.50 C 0.06,0.18 0.24,0.04 0.50,0.05 Z",
  },
  {
    label: "Chunky top",
    // Top-heavy: top corners fuller, bottom pinches slightly
    d: "M 0.50,0.02 C 0.82,0.00 1.00,0.14 0.98,0.46 C 0.96,0.74 0.80,0.98 0.50,0.98 C 0.20,0.98 0.04,0.76 0.02,0.50 C 0.00,0.20 0.18,0.02 0.50,0.02 Z",
  },
  {
    label: "Wobbly — uneven",
    // One corner tighter, one corner flatter
    d: "M 0.50,0.04 C 0.76,0.00 0.98,0.16 0.98,0.46 C 0.99,0.76 0.80,1.00 0.50,0.97 C 0.22,0.96 0.02,0.78 0.02,0.50 C 0.02,0.22 0.22,0.04 0.50,0.04 Z",
  },
  {
    label: "Blobby corners",
    // Each corner has very different roundness for max character
    d: "M 0.50,0.04 C 0.82,0.02 1.00,0.22 0.96,0.52 C 0.94,0.76 0.74,1.00 0.50,0.97 C 0.26,0.98 0.04,0.80 0.04,0.52 C 0.04,0.24 0.18,0.02 0.50,0.04 Z",
  },
];

// Pebble variants: smooth, roundish, slightly irregular
const PEBBLE_BLOBS = [
  {
    label: "Pebble A — offset center",
    d: "M 0.55,0.05 C 0.76,0.04 0.96,0.20 0.97,0.44 C 0.98,0.68 0.80,0.96 0.54,0.97 C 0.30,0.98 0.06,0.80 0.04,0.55 C 0.02,0.28 0.18,0.06 0.55,0.05 Z",
  },
  {
    label: "Pebble B — gentle dent left",
    d: "M 0.50,0.05 C 0.72,0.03 0.96,0.18 0.97,0.46 C 0.98,0.72 0.78,0.96 0.50,0.96 C 0.26,0.97 0.04,0.80 0.06,0.54 C 0.08,0.28 0.30,0.05 0.50,0.05 Z",
  },
  {
    label: "Pebble C — slightly wide",
    d: "M 0.50,0.06 C 0.78,0.04 0.98,0.22 0.96,0.50 C 0.94,0.76 0.76,0.96 0.50,0.95 C 0.24,0.96 0.04,0.78 0.04,0.50 C 0.04,0.24 0.22,0.06 0.50,0.06 Z",
  },
];

const ALL = [...SQUARE_BLOBS, ...PEBBLE_BLOBS];
const COLORS = [
  "#7B9E6B","#B87C5A","#9B7BB5","#5A8FAE","#C4875A","#7BAE8F",
  "#C4A882","#8FAE9B","#AE8F7B",
];

function BlobShape({ d, label, color, index, dimLabel }: { d: string; label: string; color: string; index: number; dimLabel?: string }) {
  const uid = useId().replace(/:/g, "");
  const clipId = `bc-${uid}`;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 110, height: 110 }}>
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
            background: `radial-gradient(circle at 38% 38%, ${color}ee, ${color}77)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
          }}
        >
          ✿
        </div>
      </div>
      <div className="text-center" style={{ maxWidth: 110 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#3D362D", fontFamily: "Fraunces, serif" }}>
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
      className="min-h-screen flex flex-col items-center justify-center gap-8 p-8"
      style={{ backgroundColor: "#F5EFD8" }}
    >
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: "#3D362D", fontWeight: 600 }}>
        Square-fitting blobs (fill the card)
      </div>
      <div className="grid grid-cols-6 gap-6">
        {SQUARE_BLOBS.map((blob, i) => (
          <BlobShape key={i} d={blob.d} label={blob.label} color={COLORS[i]} index={i} />
        ))}
      </div>
      <div style={{ width: "100%", borderTop: "1px dashed #C4B89A" }} />
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: "#3D362D", fontWeight: 600 }}>
        Pebble variants (soft & round)
      </div>
      <div className="flex gap-8 justify-center">
        {PEBBLE_BLOBS.map((blob, i) => (
          <BlobShape key={i} d={blob.d} label={blob.label} color={COLORS[6 + i]} index={6 + i} />
        ))}
      </div>
      <div style={{ fontSize: 10, color: "#9A8F7F", maxWidth: 500, textAlign: "center" }}>
        Tell me which numbers you like — I'll use those shapes in the garden grid.
      </div>
    </div>
  );
}
