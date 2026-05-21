import { useId } from "react";

// 6 organic blob shapes in objectBoundingBox (0–1) space.
// Designed to look like the Canva "blob frame" style — each one distinct,
// all smooth cubic bezier curves, filling ~85–92% of the bounding box.
const BLOBS = [
  // 1: Rounded, slightly wider at top-right
  "M 0.06,0.30 C 0.00,0.10 0.22,0.00 0.55,0.03 C 0.80,0.06 1.00,0.18 0.96,0.45 C 0.92,0.68 1.00,0.90 0.75,0.97 C 0.52,1.00 0.24,1.00 0.08,0.87 C -0.04,0.75 0.08,0.55 0.06,0.30 Z",
  // 2: Full rounded, slight squeeze on left
  "M 0.12,0.06 C 0.30,0.00 0.68,0.00 0.88,0.10 C 1.04,0.20 1.00,0.42 0.94,0.62 C 0.88,0.82 0.96,0.98 0.70,1.00 C 0.45,1.02 0.17,0.96 0.04,0.82 C -0.07,0.68 0.02,0.48 0.00,0.32 C -0.02,0.18 -0.02,0.10 0.12,0.06 Z",
  // 3: Soft rectangle, blobby corners
  "M 0.06,0.18 C 0.04,0.04 0.20,0.00 0.50,0.00 C 0.78,0.00 0.96,0.04 0.98,0.20 C 1.02,0.38 0.94,0.60 0.97,0.80 C 0.99,0.96 0.82,1.02 0.56,0.98 C 0.30,0.94 0.06,1.00 0.02,0.82 C -0.04,0.65 0.06,0.44 0.04,0.30 C 0.02,0.20 0.08,0.28 0.06,0.18 Z",
  // 4: Wider/flatter, irregular top edge
  "M 0.04,0.25 C 0.00,0.08 0.18,0.00 0.50,0.02 C 0.78,0.04 1.00,0.00 1.00,0.22 C 1.02,0.42 0.92,0.65 0.96,0.82 C 0.98,0.96 0.78,1.04 0.50,0.98 C 0.24,0.93 0.00,1.00 -0.02,0.78 C -0.04,0.60 0.06,0.40 0.04,0.25 Z",
  // 5: Teardrop / pear — wider at bottom
  "M 0.22,0.03 C 0.38,-0.02 0.62,0.00 0.78,0.10 C 0.96,0.20 1.00,0.40 0.96,0.58 C 0.92,0.76 1.02,0.92 0.82,0.98 C 0.64,1.04 0.38,1.02 0.20,0.96 C 0.04,0.90 -0.02,0.74 0.02,0.56 C 0.06,0.40 -0.02,0.22 0.10,0.12 C 0.14,0.08 0.12,0.06 0.22,0.03 Z",
  // 6: Kidney / crescent
  "M 0.08,0.14 C 0.18,-0.02 0.48,0.00 0.75,0.08 C 0.98,0.16 1.05,0.38 0.96,0.58 C 0.88,0.76 1.00,0.96 0.78,1.02 C 0.55,1.07 0.25,0.95 0.08,0.82 C -0.06,0.70 -0.02,0.52 -0.02,0.36 C -0.02,0.22 0.00,0.24 0.08,0.14 Z",
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
