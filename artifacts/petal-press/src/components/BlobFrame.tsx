import { useId } from "react";

// 6 shapes in the same smooth pebble family — all fill the card,
// each with a subtle personality shift. Shapes 1–4 are direct from
// the picker (picker slots 2–5); 5–6 are close family additions.
const BLOBS = [
  // Slightly wide — landscape pebble
  "M 0.50,0.06 C 0.80,0.04 0.98,0.22 0.96,0.50 C 0.94,0.76 0.76,0.96 0.50,0.95 C 0.24,0.96 0.04,0.78 0.04,0.50 C 0.04,0.24 0.22,0.06 0.50,0.06 Z",
  // Gentle dent bottom-left
  "M 0.50,0.05 C 0.76,0.03 0.97,0.20 0.97,0.48 C 0.97,0.74 0.78,0.97 0.52,0.97 C 0.26,0.98 0.04,0.80 0.05,0.54 C 0.06,0.28 0.26,0.05 0.50,0.05 Z",
  // Chunky top — top corners fuller, bottom slightly pinched
  "M 0.50,0.02 C 0.82,0.00 1.00,0.14 0.98,0.46 C 0.96,0.74 0.80,0.98 0.50,0.98 C 0.20,0.98 0.04,0.76 0.02,0.50 C 0.00,0.20 0.18,0.02 0.50,0.02 Z",
  // Offset right — center of mass shifted right
  "M 0.54,0.04 C 0.78,0.02 0.98,0.20 0.98,0.48 C 0.98,0.76 0.80,0.97 0.54,0.97 C 0.28,0.98 0.04,0.80 0.03,0.52 C 0.02,0.24 0.24,0.04 0.54,0.04 Z",
  // Chunky bottom — heavier at the bottom, pinched top
  "M 0.50,0.04 C 0.76,0.02 0.98,0.18 0.98,0.46 C 0.98,0.74 0.82,1.00 0.50,0.98 C 0.18,1.00 0.02,0.80 0.02,0.52 C 0.02,0.24 0.24,0.04 0.50,0.04 Z",
  // Offset left — mirror of offset right
  "M 0.46,0.04 C 0.72,0.02 0.96,0.20 0.97,0.50 C 0.98,0.78 0.76,0.97 0.48,0.97 C 0.22,0.98 0.02,0.78 0.03,0.50 C 0.04,0.22 0.20,0.04 0.46,0.04 Z",
];

interface Props {
  children: React.ReactNode;
  blobIndex: number;
  className?: string;
  style?: React.CSSProperties;
}

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
