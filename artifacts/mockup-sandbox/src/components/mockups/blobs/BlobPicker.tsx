import { useId } from "react";

const BLOBS = [
  {
    label: "Wide & squat",
    d: "M 0.08,0.22 C 0.10,0.02 0.38,0.00 0.62,0.04 C 0.82,0.08 1.00,0.16 0.97,0.36 C 0.94,0.52 1.02,0.68 0.94,0.84 C 0.86,0.98 0.64,1.02 0.42,0.98 C 0.20,0.94 0.02,0.92 0.00,0.72 C -0.02,0.54 0.06,0.38 0.08,0.22 Z",
  },
  {
    label: "Tall & narrow",
    d: "M 0.30,0.02 C 0.46,-0.02 0.64,0.04 0.74,0.18 C 0.86,0.34 0.84,0.52 0.86,0.68 C 0.88,0.88 0.76,1.02 0.56,1.00 C 0.36,0.98 0.18,0.94 0.12,0.78 C 0.06,0.62 0.14,0.44 0.14,0.28 C 0.14,0.12 0.16,0.06 0.30,0.02 Z",
  },
  {
    label: "Pebble",
    d: "M 0.50,0.04 C 0.70,0.02 0.92,0.14 0.98,0.36 C 1.04,0.56 0.96,0.78 0.80,0.92 C 0.64,1.04 0.38,1.02 0.20,0.90 C 0.04,0.78 -0.04,0.56 0.06,0.38 C 0.12,0.22 0.32,0.06 0.50,0.04 Z",
  },
  {
    label: "Kidney / bean",
    d: "M 0.18,0.06 C 0.38,-0.04 0.68,0.00 0.84,0.16 C 0.98,0.30 0.92,0.48 0.78,0.60 C 0.68,0.70 0.76,0.84 0.64,0.96 C 0.50,1.06 0.28,1.02 0.14,0.88 C 0.00,0.74 0.02,0.54 0.06,0.38 C 0.10,0.22 0.02,0.14 0.18,0.06 Z",
  },
  {
    label: "Cloud / bumpy",
    d: "M 0.20,0.26 C 0.14,0.08 0.28,-0.02 0.46,0.04 C 0.54,0.06 0.56,0.00 0.66,0.02 C 0.80,0.04 0.90,0.14 0.88,0.28 C 0.98,0.34 1.02,0.50 0.94,0.64 C 0.88,0.76 0.74,0.84 0.62,0.90 C 0.44,0.98 0.24,0.98 0.12,0.86 C 0.00,0.74 0.02,0.54 0.06,0.42 C 0.08,0.36 0.22,0.36 0.20,0.26 Z",
  },
  {
    label: "Teardrop / pear",
    d: "M 0.36,0.02 C 0.50,-0.02 0.64,0.04 0.68,0.18 C 0.72,0.28 0.64,0.36 0.72,0.48 C 0.84,0.62 1.00,0.72 0.96,0.86 C 0.90,1.00 0.68,1.04 0.48,1.02 C 0.28,1.00 0.08,0.94 0.04,0.80 C -0.02,0.66 0.10,0.52 0.20,0.42 C 0.28,0.32 0.24,0.24 0.28,0.14 C 0.30,0.08 0.26,0.04 0.36,0.02 Z",
  },
];

const PHOTO_COLORS = [
  "#7B9E6B",
  "#B87C5A",
  "#9B7BB5",
  "#5A8FAE",
  "#C4875A",
  "#7BAE8F",
];

function BlobShape({ d, label, color, index }: { d: string; label: string; color: string; index: number }) {
  const uid = useId().replace(/:/g, "");
  const clipId = `blob-clip-${uid}`;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 120, height: 140 }}>
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
            background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}88)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
          }}
        >
          ✿
        </div>
      </div>
      <div className="text-center">
        <div style={{ fontSize: 11, fontWeight: 600, color: "#3D362D", fontFamily: "Fraunces, serif" }}>
          {index + 1}
        </div>
        <div style={{ fontSize: 10, color: "#9A8F7F" }}>{label}</div>
      </div>
    </div>
  );
}

export function BlobPicker() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 p-8"
      style={{ backgroundColor: "#F5EFD8", fontFamily: "system-ui, sans-serif" }}
    >
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, color: "#3D362D", fontWeight: 600 }}>
        Blob shape options — which ones feel right?
      </div>
      <div className="grid grid-cols-3 gap-8">
        {BLOBS.map((blob, i) => (
          <BlobShape key={i} d={blob.d} label={blob.label} color={PHOTO_COLORS[i]} index={i} />
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#9A8F7F", maxWidth: 360, textAlign: "center" }}>
        Each shape clamps to a 3:4 card. Tell me which numbers you like — or say "too similar", "more dramatic", etc.
      </div>
    </div>
  );
}
