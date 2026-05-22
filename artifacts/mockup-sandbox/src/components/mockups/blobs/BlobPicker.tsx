import { useId } from "react";

const BLOBS = [
  { label: "Pebble A", d: "M 0.488,0.026 C 0.593,0.030 0.711,0.114 0.792,0.192 C 0.874,0.270 0.977,0.394 0.978,0.496 C 0.979,0.599 0.881,0.727 0.799,0.807 C 0.718,0.887 0.594,0.974 0.488,0.976 C 0.382,0.978 0.230,0.901 0.163,0.821 C 0.096,0.741 0.088,0.604 0.088,0.496 C 0.088,0.388 0.096,0.249 0.163,0.171 C 0.230,0.092 0.383,0.023 0.488,0.026 Z" },
  { label: "Pebble B", d: "M 0.499,0.057 C 0.611,0.054 0.769,0.086 0.846,0.161 C 0.922,0.236 0.969,0.401 0.959,0.507 C 0.950,0.613 0.866,0.720 0.789,0.797 C 0.712,0.874 0.604,0.959 0.499,0.967 C 0.394,0.975 0.231,0.923 0.160,0.847 C 0.088,0.770 0.067,0.618 0.069,0.507 C 0.072,0.396 0.102,0.257 0.174,0.182 C 0.246,0.107 0.387,0.061 0.499,0.057 Z" },
  { label: "Pebble C", d: "M 0.490,0.007 C 0.589,0.003 0.725,0.105 0.802,0.186 C 0.878,0.268 0.946,0.389 0.950,0.497 C 0.955,0.606 0.906,0.765 0.830,0.837 C 0.753,0.908 0.601,0.930 0.490,0.927 C 0.380,0.925 0.242,0.894 0.165,0.823 C 0.088,0.751 0.023,0.599 0.030,0.497 C 0.037,0.396 0.131,0.296 0.208,0.215 C 0.284,0.133 0.391,0.012 0.490,0.007 Z" },
  { label: "Pebble D", d: "M 0.497,0.041 C 0.604,0.040 0.750,0.099 0.822,0.176 C 0.894,0.253 0.923,0.389 0.927,0.501 C 0.930,0.613 0.915,0.771 0.843,0.848 C 0.772,0.925 0.603,0.971 0.497,0.961 C 0.391,0.952 0.287,0.868 0.207,0.791 C 0.127,0.715 0.022,0.603 0.017,0.501 C 0.012,0.400 0.099,0.260 0.179,0.183 C 0.259,0.107 0.390,0.043 0.497,0.041 Z" },
  { label: "Pebble E", d: "M 0.487,0.054 C 0.591,0.046 0.743,0.080 0.820,0.151 C 0.896,0.223 0.949,0.374 0.947,0.484 C 0.946,0.593 0.889,0.727 0.813,0.809 C 0.736,0.891 0.593,0.976 0.487,0.974 C 0.381,0.971 0.253,0.876 0.176,0.795 C 0.100,0.713 0.024,0.584 0.027,0.484 C 0.031,0.383 0.121,0.265 0.197,0.194 C 0.274,0.122 0.384,0.061 0.487,0.054 Z" },
  { label: "Pebble F", d: "M 0.515,0.036 C 0.619,0.045 0.720,0.136 0.798,0.213 C 0.876,0.290 0.978,0.395 0.985,0.496 C 0.992,0.597 0.919,0.750 0.841,0.821 C 0.762,0.893 0.627,0.922 0.515,0.926 C 0.403,0.930 0.245,0.914 0.169,0.842 C 0.092,0.771 0.054,0.610 0.055,0.496 C 0.056,0.382 0.099,0.233 0.176,0.157 C 0.253,0.080 0.412,0.027 0.515,0.036 Z" },
];

const FILL = "#C4BEAE";

function BlobShape({ d, label, index }: { d: string; label: string; index: number }) {
  const uid = useId().replace(/:/g, "");
  const clipId = `bc-${uid}`;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 130, height: 130 }}>
        <svg width="0" height="0" style={{ position: "absolute", overflow: "hidden" }}>
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path d={d} />
            </clipPath>
          </defs>
        </svg>
        <div
          style={{
            width: "100%", height: "100%",
            clipPath: `url(#${clipId})`,
            backgroundColor: FILL,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 42, color: "#F5EFD8",
          }}
        >✿</div>
      </div>
      <div className="text-center">
        <div style={{ fontSize: 15, fontWeight: 700, color: "#3D362D", fontFamily: "Fraunces, serif" }}>{index + 1}</div>
      </div>
    </div>
  );
}

export function BlobPicker() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-10 p-10"
      style={{ backgroundColor: "#F5EFD8" }}
    >
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, color: "#6B5F4F" }}>
        Pebble shapes — smoothed &amp; centered, ~10% more variation than before
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {BLOBS.map((b, i) => (
          <BlobShape key={i} d={b.d} label={b.label} index={i} />
        ))}
      </div>
      <div style={{ fontSize: 10, color: "#9A8F7F" }}>All 6 are live in the app now.</div>
    </div>
  );
}
