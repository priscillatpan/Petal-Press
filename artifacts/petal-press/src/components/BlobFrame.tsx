import { useId } from "react";

// 6 organic blob shapes in objectBoundingBox (0–1) space.
// Each shape is genuinely distinct: some tall, some wide, some with dents,
// some nearly circular but with character — all smooth cubic bezier curves.
const BLOBS = [
  // 1: Wide & squat — flat top, full rounded bottom
  "M 0.08,0.22 C 0.10,0.02 0.38,0.00 0.62,0.04 C 0.82,0.08 1.00,0.16 0.97,0.36 C 0.94,0.52 1.02,0.68 0.94,0.84 C 0.86,0.98 0.64,1.02 0.42,0.98 C 0.20,0.94 0.02,0.92 0.00,0.72 C -0.02,0.54 0.06,0.38 0.08,0.22 Z",

  // 2: Tall & narrow — squeezed sides, taller than wide
  "M 0.30,0.02 C 0.46,-0.02 0.64,0.04 0.74,0.18 C 0.86,0.34 0.84,0.52 0.86,0.68 C 0.88,0.88 0.76,1.02 0.56,1.00 C 0.36,0.98 0.18,0.94 0.12,0.78 C 0.06,0.62 0.14,0.44 0.14,0.28 C 0.14,0.12 0.16,0.06 0.30,0.02 Z",

  // 3: Pebble — nearly circular but with a gentle dent at lower-left
  "M 0.50,0.04 C 0.70,0.02 0.92,0.14 0.98,0.36 C 1.04,0.56 0.96,0.78 0.80,0.92 C 0.64,1.04 0.38,1.02 0.20,0.90 C 0.04,0.78 -0.04,0.56 0.06,0.38 C 0.12,0.22 0.32,0.06 0.50,0.04 Z",

  // 4: Kidney / bean — prominent inward dent on one side
  "M 0.18,0.06 C 0.38,-0.04 0.68,0.00 0.84,0.16 C 0.98,0.30 0.92,0.48 0.78,0.60 C 0.68,0.70 0.76,0.84 0.64,0.96 C 0.50,1.06 0.28,1.02 0.14,0.88 C 0.00,0.74 0.02,0.54 0.06,0.38 C 0.10,0.22 0.02,0.14 0.18,0.06 Z",

  // 5: Cloud / mushroom — bumpy top, flat-ish bottom
  "M 0.20,0.26 C 0.14,0.08 0.28,-0.02 0.46,0.04 C 0.54,0.06 0.56,0.00 0.66,0.02 C 0.80,0.04 0.90,0.14 0.88,0.28 C 0.98,0.34 1.02,0.50 0.94,0.64 C 0.88,0.76 0.74,0.84 0.62,0.90 C 0.44,0.98 0.24,0.98 0.12,0.86 C 0.00,0.74 0.02,0.54 0.06,0.42 C 0.08,0.36 0.22,0.36 0.20,0.26 Z",

  // 6: Teardrop / pear — narrow top, wide full bottom
  "M 0.36,0.02 C 0.50,-0.02 0.64,0.04 0.68,0.18 C 0.72,0.28 0.64,0.36 0.72,0.48 C 0.84,0.62 1.00,0.72 0.96,0.86 C 0.90,1.00 0.68,1.04 0.48,1.02 C 0.28,1.00 0.08,0.94 0.04,0.80 C -0.02,0.66 0.10,0.52 0.20,0.42 C 0.28,0.32 0.24,0.24 0.28,0.14 C 0.30,0.08 0.26,0.04 0.36,0.02 Z",
];

interface Props {
  children: React.ReactNode;
  blobIndex: number;
  className?: string;
  style?: React.CSSProperties;
}

// Clips its children to one of 6 organic blob shapes.
// Uses useId() so multiple BlobFrames on the same page each get a unique clipPath id.
export function BlobFrame({ children, blobIndex, className, style }: Props) {
  const uid = useId().replace(/:/g, "");
  const clipId = `blob-${uid}`;
  const d = BLOBS[Math.abs(blobIndex) % BLOBS.length];

  return (
    <>
      <svg
        width="0"
        height="0"
        aria-hidden
        style={{ position: "absolute", pointerEvents: "none", overflow: "hidden" }}
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        </defs>
      </svg>
      <div className={className} style={{ clipPath: `url(#${clipId})`, ...style }}>
        {children}
      </div>
    </>
  );
}
