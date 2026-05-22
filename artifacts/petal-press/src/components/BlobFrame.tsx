import { useId } from "react";

// 6 genuinely blobby shapes — 6-node Catmull-Rom splines with dramatic radius
// variation (0.21–0.46). Each has clear lobes and notches, not just rounded circles.
const BLOBS = [
  // Teardrop lower-left — full bottom+left, notched upper-right
  "M 0.500,0.150 C 0.588,0.166 0.618,0.300 0.682,0.395 C 0.745,0.490 0.911,0.626 0.881,0.720 C 0.851,0.814 0.627,0.960 0.500,0.960 C 0.373,0.960 0.177,0.830 0.119,0.720 C 0.061,0.610 0.090,0.395 0.154,0.300 C 0.217,0.205 0.412,0.134 0.500,0.150 Z",
  // Right lobe — big bump right, pinched left
  "M 0.500,0.120 C 0.604,0.103 0.832,0.168 0.898,0.270 C 0.965,0.372 0.965,0.645 0.898,0.730 C 0.832,0.815 0.595,0.802 0.500,0.780 C 0.405,0.758 0.364,0.668 0.327,0.600 C 0.289,0.532 0.246,0.450 0.275,0.370 C 0.304,0.290 0.396,0.137 0.500,0.120 Z",
  // Top-heavy — wide top, pinched at bottom
  "M 0.500,0.060 C 0.624,0.062 0.826,0.195 0.864,0.290 C 0.901,0.385 0.786,0.558 0.725,0.630 C 0.665,0.702 0.581,0.717 0.500,0.720 C 0.419,0.723 0.304,0.723 0.240,0.650 C 0.177,0.577 0.076,0.378 0.119,0.280 C 0.162,0.182 0.376,0.058 0.500,0.060 Z",
  // Left notch — full right side, concave left
  "M 0.500,0.100 C 0.595,0.082 0.815,0.175 0.881,0.280 C 0.947,0.385 0.962,0.623 0.898,0.730 C 0.835,0.837 0.595,0.942 0.500,0.920 C 0.405,0.898 0.359,0.688 0.327,0.600 C 0.295,0.512 0.281,0.473 0.309,0.390 C 0.338,0.307 0.405,0.118 0.500,0.100 Z",
  // Bottom-heavy — pinched top, very full bottom
  "M 0.500,0.260 C 0.581,0.257 0.696,0.273 0.760,0.350 C 0.823,0.427 0.924,0.618 0.881,0.720 C 0.838,0.822 0.627,0.960 0.500,0.960 C 0.373,0.960 0.156,0.818 0.119,0.720 C 0.081,0.622 0.211,0.447 0.275,0.370 C 0.338,0.293 0.419,0.263 0.500,0.260 Z",
  // Kidney — S-curve character, dip at upper-right
  "M 0.500,0.080 C 0.598,0.097 0.653,0.278 0.708,0.380 C 0.763,0.482 0.864,0.593 0.829,0.690 C 0.794,0.787 0.618,0.955 0.500,0.960 C 0.382,0.965 0.182,0.833 0.119,0.720 C 0.055,0.607 0.055,0.387 0.119,0.280 C 0.182,0.173 0.402,0.063 0.500,0.080 Z",
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
