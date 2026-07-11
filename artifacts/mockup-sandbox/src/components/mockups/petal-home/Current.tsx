import './_group.css';
import { useState, useMemo } from "react";

const THEMES = [
  { key: "love", label: "Love", color: "#E88FA5" },
  { key: "new-beginnings", label: "New Beginnings", color: "#c5d07d" },
  { key: "remembrance", label: "Remembrance", color: "#9B87C4" },
  { key: "joy", label: "Joy", color: "#F0A860" },
  { key: "strength", label: "Strength", color: "#7B9FE0" },
];

const MOCK_FLOWERS = [
  { id: "f1", commonName: "Forget-me-not", theme: "remembrance", createdAt: "2026-04-03T10:00:00Z" },
  { id: "f2", commonName: "California Poppy", theme: "joy", createdAt: "2026-04-10T10:00:00Z" },
  { id: "f3", commonName: "Star Jasmine", theme: "love", createdAt: "2026-04-17T10:00:00Z" },
  { id: "f4", commonName: "Hydrangea", theme: "love", createdAt: "2026-04-25T10:00:00Z" },
  { id: "f5", commonName: "Daffodil", theme: "new-beginnings", createdAt: "2026-03-02T10:00:00Z" },
  { id: "f6", commonName: "Echinacea", theme: "strength", createdAt: "2026-07-08T10:00:00Z" },
];

const BLOBS = [
  "M 0.488,0.026 C 0.593,0.030 0.711,0.114 0.792,0.192 C 0.874,0.270 0.977,0.394 0.978,0.496 C 0.979,0.599 0.881,0.727 0.799,0.807 C 0.718,0.887 0.594,0.974 0.488,0.976 C 0.382,0.978 0.230,0.901 0.163,0.821 C 0.096,0.741 0.088,0.604 0.088,0.496 C 0.088,0.388 0.096,0.249 0.163,0.171 C 0.230,0.092 0.383,0.023 0.488,0.026 Z",
  "M 0.499,0.057 C 0.611,0.054 0.769,0.086 0.846,0.161 C 0.922,0.236 0.969,0.401 0.959,0.507 C 0.950,0.613 0.866,0.720 0.789,0.797 C 0.712,0.874 0.604,0.959 0.499,0.967 C 0.394,0.975 0.231,0.923 0.160,0.847 C 0.088,0.770 0.067,0.618 0.069,0.507 C 0.072,0.396 0.102,0.257 0.174,0.182 C 0.246,0.107 0.387,0.061 0.499,0.057 Z",
  "M 0.490,0.007 C 0.589,0.003 0.725,0.105 0.802,0.186 C 0.878,0.268 0.946,0.389 0.950,0.497 C 0.955,0.606 0.906,0.765 0.830,0.837 C 0.753,0.908 0.601,0.930 0.490,0.927 C 0.380,0.925 0.242,0.894 0.165,0.823 C 0.088,0.751 0.023,0.599 0.030,0.497 C 0.037,0.396 0.131,0.296 0.208,0.215 C 0.284,0.133 0.391,0.012 0.490,0.007 Z",
  "M 0.497,0.041 C 0.604,0.040 0.750,0.099 0.822,0.176 C 0.894,0.253 0.923,0.389 0.927,0.501 C 0.930,0.613 0.915,0.771 0.843,0.848 C 0.772,0.925 0.603,0.971 0.497,0.961 C 0.391,0.952 0.287,0.868 0.207,0.791 C 0.127,0.715 0.022,0.603 0.017,0.501 C 0.012,0.400 0.099,0.260 0.179,0.183 C 0.259,0.107 0.390,0.043 0.497,0.041 Z",
  "M 0.487,0.054 C 0.591,0.046 0.743,0.080 0.820,0.151 C 0.896,0.223 0.949,0.374 0.947,0.484 C 0.946,0.593 0.889,0.727 0.813,0.809 C 0.736,0.891 0.593,0.976 0.487,0.974 C 0.381,0.971 0.253,0.876 0.176,0.795 C 0.100,0.713 0.024,0.584 0.027,0.484 C 0.031,0.383 0.121,0.265 0.197,0.194 C 0.274,0.122 0.384,0.061 0.487,0.054 Z",
  "M 0.515,0.036 C 0.619,0.045 0.720,0.136 0.798,0.213 C 0.876,0.290 0.978,0.395 0.985,0.496 C 0.992,0.597 0.919,0.750 0.841,0.821 C 0.762,0.893 0.627,0.922 0.515,0.926 C 0.403,0.930 0.245,0.914 0.169,0.842 C 0.092,0.771 0.054,0.610 0.055,0.496 C 0.056,0.382 0.099,0.233 0.176,0.157 C 0.253,0.080 0.412,0.027 0.515,0.036 Z",
];

let idCounter = 0;
function BlobFrame({ children, blobIndex, style }: { children: React.ReactNode; blobIndex: number; style?: React.CSSProperties }) {
  const id = `blob-${blobIndex}-${idCounter++}`;
  const d = BLOBS[Math.abs(blobIndex) % BLOBS.length];
  return (
    <>
      <svg width="0" height="0" aria-hidden style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox"><path d={d} /></clipPath>
        </defs>
      </svg>
      <div style={{ clipPath: `url(#${id})`, position: "absolute", inset: 0, ...style }}>
        {children}
      </div>
    </>
  );
}

function Pill({ active, onClick, dot, children }: { active: boolean; onClick: () => void; dot?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
        height: 32, padding: '0 14px', borderRadius: 999, fontSize: 12,
        fontWeight: 500, border: `1px solid ${active ? '#C8BFA8' : '#D4CBB3'}`,
        backgroundColor: active ? '#FFFDF5' : 'transparent',
        color: active ? '#3D362D' : '#9A8F7F',
        boxShadow: active ? '0 1px 4px rgba(0,0,0,0.09)' : 'none',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {dot && <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: dot, opacity: active ? 1 : 0.5, flexShrink: 0 }} />}
      {children}
    </button>
  );
}

export function Current() {
  const [viewMode, setViewMode] = useState<"all" | "meaning">("all");
  const [sortMode, setSortMode] = useState<"recent" | "az">("recent");
  const [themeFilter, setThemeFilter] = useState<string | null>(null);

  const displayed = useMemo(() => {
    let list = [...MOCK_FLOWERS];
    if (viewMode === "meaning" && themeFilter) {
      list = list.filter(f => f.theme === themeFilter);
    }
    if (sortMode === "az") {
      list.sort((a, b) => a.commonName.localeCompare(b.commonName));
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [viewMode, themeFilter, sortMode]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5EFD8', fontFamily: 'system-ui, sans-serif', paddingBottom: 112 }}>
      <header style={{
        padding: '32px 20px 12px', position: 'sticky', top: 0, zIndex: 20,
        backgroundColor: 'rgba(245,239,216,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #E8DCC0',
      }}>
        <button style={{ position: 'absolute', top: 10, right: 20, fontSize: 11, color: '#B8AFA0', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.03em' }}>
          sign out
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, color: '#3D362D', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            ✿ Petal Press
          </h1>
          <span style={{ fontSize: 11, color: '#9A8F7F', letterSpacing: '0.08em' }}>
            {MOCK_FLOWERS.length} found
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* View toggle */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            <Pill active={viewMode === "all"} onClick={() => setViewMode("all")}>All Flowers</Pill>
            <Pill active={viewMode === "meaning"} onClick={() => setViewMode("meaning")}>By Meaning</Pill>
          </div>

          {/* Sort pills */}
          {viewMode === "all" && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              <Pill active={sortMode === "recent"} onClick={() => setSortMode("recent")}>Newest</Pill>
              <Pill active={sortMode === "az"} onClick={() => setSortMode("az")}>A – Z</Pill>
            </div>
          )}

          {/* Theme pills */}
          {viewMode === "meaning" && (
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {THEMES.map(t => (
                <Pill
                  key={t.key}
                  active={themeFilter === t.key}
                  dot={t.color}
                  onClick={() => setThemeFilter(themeFilter === t.key ? null : t.key)}
                >
                  {t.label}
                </Pill>
              ))}
            </div>
          )}
        </div>
      </header>

      <main style={{ padding: '16px 12px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {displayed.map((flower, idx) => (
            <div key={flower.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                <BlobFrame blobIndex={idx} style={{ backgroundColor: '#FAF7EF', boxShadow: '0 3px 12px rgba(0,0,0,0.13)' }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#D4CBB3' }}>
                    ✿
                  </div>
                </BlobFrame>
              </div>
              <p style={{ fontSize: 13, fontFamily: 'Fraunces, serif', color: '#736959', textAlign: 'center', margin: 0, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {flower.commonName}
              </p>
            </div>
          ))}

          {viewMode === "all" && [0, 1, 2].map(i => (
            <div key={`ghost-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                <BlobFrame blobIndex={displayed.length + i} style={{ backgroundColor: 'rgba(232,220,192,0.35)' }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#C4BBA5', opacity: 0.45 }}>✿</div>
                </BlobFrame>
              </div>
              <p style={{ fontSize: 8, fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#C4BBA5', margin: 0 }}>???</p>
            </div>
          ))}
        </div>
      </main>

      <div style={{ position: 'fixed', bottom: 20, right: 'max(16px, calc(50vw - 215px))', zIndex: 20 }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 10, height: 56, padding: '0 20px', borderRadius: 999, backgroundColor: '#c5d07d', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(197,208,125,0.55)' }}>
          <span style={{ fontSize: 20 }}>✿</span>
          <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 15, color: '#3D362D', letterSpacing: '0.01em' }}>add flower</span>
        </button>
      </div>
    </div>
  );
}
