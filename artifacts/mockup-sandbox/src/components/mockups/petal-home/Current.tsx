import './_group.css';
import { useId, useMemo, useState } from "react";

// ── Inlined from src/data/season.ts ──────────────────────────────
type Season = 'spring' | 'summer' | 'fall' | 'winter';
const MONTH_SEASONS: Record<string, Season> = {
  january: 'winter', february: 'winter', march: 'spring', april: 'spring',
  may: 'spring', june: 'summer', july: 'summer', august: 'summer',
  september: 'fall', october: 'fall', november: 'fall', december: 'winter',
};
function getSeasonFromDate(dateStr: string): Season {
  const monthName = (dateStr || '').split(' ')[0].toLowerCase();
  return MONTH_SEASONS[monthName] ?? 'spring';
}
const SEASON_LABELS: Record<Season, string> = { spring: 'Spring', summer: 'Summer', fall: 'Fall', winter: 'Winter' };
const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter'];

// ── Inlined from src/data/themes.ts ──────────────────────────────
type ThemeKey = "love" | "new-beginnings" | "remembrance" | "joy" | "strength";
const THEMES: { key: ThemeKey; label: string; color: string }[] = [
  { key: "love", label: "Love & Devotion", color: "#E88FA5" },
  { key: "new-beginnings", label: "New Beginnings & Luck", color: "#c5d07d" },
  { key: "remembrance", label: "Remembrance & Grief", color: "#9B87C4" },
  { key: "joy", label: "Joy & Celebration", color: "#F0A860" },
  { key: "strength", label: "Strength & Wisdom", color: "#7B9FE0" },
];

// ── Inlined from src/components/FlowerIcon.tsx ───────────────────
function FlowerIcon({ size = 36, color = "currentColor", className, style }: { size?: number; color?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={className}
      style={{ fontSize: size, color, lineHeight: 1, display: 'inline-block', userSelect: 'none', ...style }}
      aria-hidden
    >
      ✿
    </span>
  );
}

// ── Inlined from src/components/BlobFrame.tsx ────────────────────
const BLOBS = [
  "M 0.488,0.026 C 0.593,0.030 0.711,0.114 0.792,0.192 C 0.874,0.270 0.977,0.394 0.978,0.496 C 0.979,0.599 0.881,0.727 0.799,0.807 C 0.718,0.887 0.594,0.974 0.488,0.976 C 0.382,0.978 0.230,0.901 0.163,0.821 C 0.096,0.741 0.088,0.604 0.088,0.496 C 0.088,0.388 0.096,0.249 0.163,0.171 C 0.230,0.092 0.383,0.023 0.488,0.026 Z",
  "M 0.499,0.057 C 0.611,0.054 0.769,0.086 0.846,0.161 C 0.922,0.236 0.969,0.401 0.959,0.507 C 0.950,0.613 0.866,0.720 0.789,0.797 C 0.712,0.874 0.604,0.959 0.499,0.967 C 0.394,0.975 0.231,0.923 0.160,0.847 C 0.088,0.770 0.067,0.618 0.069,0.507 C 0.072,0.396 0.102,0.257 0.174,0.182 C 0.246,0.107 0.387,0.061 0.499,0.057 Z",
  "M 0.490,0.007 C 0.589,0.003 0.725,0.105 0.802,0.186 C 0.878,0.268 0.946,0.389 0.950,0.497 C 0.955,0.606 0.906,0.765 0.830,0.837 C 0.753,0.908 0.601,0.930 0.490,0.927 C 0.380,0.925 0.242,0.894 0.165,0.823 C 0.088,0.751 0.023,0.599 0.030,0.497 C 0.037,0.396 0.131,0.296 0.208,0.215 C 0.284,0.133 0.391,0.012 0.490,0.007 Z",
  "M 0.497,0.041 C 0.604,0.040 0.750,0.099 0.822,0.176 C 0.894,0.253 0.923,0.389 0.927,0.501 C 0.930,0.613 0.915,0.771 0.843,0.848 C 0.772,0.925 0.603,0.971 0.497,0.961 C 0.391,0.952 0.287,0.868 0.207,0.791 C 0.127,0.715 0.022,0.603 0.017,0.501 C 0.012,0.400 0.099,0.260 0.179,0.183 C 0.259,0.107 0.390,0.043 0.497,0.041 Z",
  "M 0.487,0.054 C 0.591,0.046 0.743,0.080 0.820,0.151 C 0.896,0.223 0.949,0.374 0.947,0.484 C 0.946,0.593 0.889,0.727 0.813,0.809 C 0.736,0.891 0.593,0.976 0.487,0.974 C 0.381,0.971 0.253,0.876 0.176,0.795 C 0.100,0.713 0.024,0.584 0.027,0.484 C 0.031,0.383 0.121,0.265 0.197,0.194 C 0.274,0.122 0.384,0.061 0.487,0.054 Z",
  "M 0.515,0.036 C 0.619,0.045 0.720,0.136 0.798,0.213 C 0.876,0.290 0.978,0.395 0.985,0.496 C 0.992,0.597 0.919,0.750 0.841,0.821 C 0.762,0.893 0.627,0.922 0.515,0.926 C 0.403,0.930 0.245,0.914 0.169,0.842 C 0.092,0.771 0.054,0.610 0.055,0.496 C 0.056,0.382 0.099,0.233 0.176,0.157 C 0.253,0.080 0.412,0.027 0.515,0.036 Z",
];
function BlobFrame({ children, blobIndex, className, style }: { children: React.ReactNode; blobIndex: number; className?: string; style?: React.CSSProperties }) {
  const uid = useId().replace(/:/g, "");
  const clipId = `blob-${uid}`;
  const d = BLOBS[Math.abs(blobIndex) % BLOBS.length];
  return (
    <>
      <svg width="0" height="0" aria-hidden style={{ position: "absolute", pointerEvents: "none", overflow: "hidden" }}>
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

// ── Mock garden data (mirrors src/data/flowers.ts shape) ─────────
type Flower = {
  id: string; commonName: string; datePressed: string; theme: string;
  imageUrl: string; imageUrls: string[];
};
const MOCK_FLOWERS: Flower[] = [
  { id: "f1", commonName: "Forget-me-not", datePressed: "April 3, 2026", theme: "remembrance", imageUrl: "", imageUrls: [] },
  { id: "f2", commonName: "California Poppy", datePressed: "April 10, 2026", theme: "joy", imageUrl: "", imageUrls: [] },
  { id: "f3", commonName: "Star Jasmine", datePressed: "April 17, 2026", theme: "love", imageUrl: "", imageUrls: [] },
  { id: "f4", commonName: "Hydrangea", datePressed: "April 25, 2026", theme: "love", imageUrl: "", imageUrls: [] },
  { id: "f5", commonName: "Daffodil", datePressed: "March 2, 2026", theme: "new-beginnings", imageUrl: "", imageUrls: [] },
  { id: "f6", commonName: "Echinacea", datePressed: "July 8, 2026", theme: "strength", imageUrl: "", imageUrls: [] },
];

const GHOST_SLOTS = 3;
type SeasonFilter = Season | null;
type ViewMode = "all" | "meaning";

const container = { hidden: { opacity: 0 }, show: { opacity: 1 } };
const cell = { hidden: { opacity: 0 }, show: { opacity: 1 } };

export function Current() {
  const flowers = MOCK_FLOWERS;
  const loading = false;
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  const seasonsPresent = useMemo(() => {
    const set = new Set(flowers.map(f => getSeasonFromDate(f.datePressed)));
    return SEASONS.filter(s => set.has(s));
  }, [flowers]);

  const filtered = useMemo(() => {
    if (!seasonFilter) return flowers;
    return flowers.filter(f => getSeasonFromDate(f.datePressed) === seasonFilter);
  }, [flowers, seasonFilter]);

  const themeGroups = useMemo(() => {
    return THEMES.map(t => ({
      ...t,
      flowers: filtered.filter(f => (f.theme || "joy") === t.key),
    })).filter(g => g.flowers.length > 0);
  }, [filtered]);

  const ghostCount = GHOST_SLOTS;

  return (
    <div className="min-h-screen pb-28 relative" style={{ backgroundColor: '#F5EFD8', fontFamily: 'system-ui, sans-serif' }}>
      <header
        className="px-5 pt-10 pb-3 sticky top-0 z-20"
        style={{ backgroundColor: 'rgba(245,239,216,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E8DCC0' }}
      >
        <div className="flex items-center justify-between mb-0.5">
          <h1 className="text-2xl tracking-tight flex items-center gap-2" style={{ fontFamily: 'Fraunces, serif', color: '#3D362D' }}>
            <FlowerIcon size={20} color="#c5d07d" />
            Petal Press
          </h1>
          <span className="text-xs tracking-widest" style={{ color: '#9A8F7F' }}>
            {loading ? '…' : `${flowers.length} species found`}
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: '#9A8F7F' }}>
          {loading ? 'Loading your pressings…' : 'What flowers will you discover today?'}
        </p>

        <div className="flex gap-1 mb-3 p-0.5 rounded-full w-fit" style={{ backgroundColor: '#EDE6D0' }}>
          {([
            { key: "all", label: "All Flowers" },
            { key: "meaning", label: "By Meaning" },
          ] as const).map(opt => (
            <button
              key={opt.key}
              onClick={() => setViewMode(opt.key)}
              className="h-7 px-3 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: viewMode === opt.key ? '#FFF9ED' : 'transparent',
                color: viewMode === opt.key ? '#3D362D' : '#9A8F7F',
                boxShadow: viewMode === opt.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {viewMode === "all" && seasonsPresent.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            <button
              onClick={() => setSeasonFilter(null)}
              className="shrink-0 h-7 px-3 rounded-full text-xs font-medium border transition-colors"
              style={{
                backgroundColor: seasonFilter === null ? '#c5d07d' : 'transparent',
                color: seasonFilter === null ? '#3D362D' : '#9A8F7F',
                borderColor: seasonFilter === null ? '#c5d07d' : '#D4CBB3',
              }}
            >
              All
            </button>
            {SEASONS.map(s => (
              <button
                key={s}
                onClick={() => setSeasonFilter(seasonFilter === s ? null : s)}
                className="shrink-0 h-7 px-3 rounded-full text-xs font-medium border transition-colors"
                style={{
                  backgroundColor: seasonFilter === s ? '#c5d07d' : 'transparent',
                  color: seasonFilter === s ? '#3D362D' : '#9A8F7F',
                  borderColor: seasonFilter === s ? '#c5d07d' : '#D4CBB3',
                  opacity: seasonsPresent.includes(s) ? 1 : 0.4,
                }}
              >
                {SEASON_LABELS[s]}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="px-3 pt-4">
        {viewMode === "meaning" ? (
          <div className="space-y-6">
            {themeGroups.map(group => (
              <div key={group.key}>
                <div className="flex items-center gap-2 mb-2 px-0.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
                  <h2 className="text-sm tracking-wide" style={{ fontFamily: 'Fraunces, serif', color: '#3D362D' }}>
                    {group.label}
                  </h2>
                  <span className="text-[11px]" style={{ color: '#9A8F7F' }}>{group.flowers.length}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {group.flowers.map((flower, idx) => (
                    <div key={flower.id} className="flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform duration-150">
                      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                        <BlobFrame blobIndex={idx} className="absolute inset-0" style={{ backgroundColor: '#FAF7EF', boxShadow: '0 3px 12px rgba(0,0,0,0.13)' }}>
                          <div className="w-full h-full flex items-center justify-center">
                            <FlowerIcon size={32} color="#D4CBB3" />
                          </div>
                        </BlobFrame>
                      </div>
                      <p className="text-center truncate w-full px-0.5 shrink-0" style={{ fontSize: '13px', fontFamily: 'Fraunces, serif', color: '#736959' }}>
                        {flower.commonName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {themeGroups.length === 0 && (
              <p className="text-center text-sm py-10" style={{ color: '#9A8F7F' }}>No pressed flowers yet.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((flower, idx) => (
              <div key={flower.id} className="flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform duration-150">
                <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                  <BlobFrame blobIndex={idx} className="absolute inset-0" style={{ backgroundColor: '#FAF7EF', boxShadow: '0 3px 12px rgba(0,0,0,0.13)' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <FlowerIcon size={32} color="#D4CBB3" />
                    </div>
                  </BlobFrame>
                </div>
                <p className="text-center truncate w-full px-0.5 shrink-0" style={{ fontSize: '13px', fontFamily: 'Fraunces, serif', color: '#736959' }}>
                  {flower.commonName}
                </p>
              </div>
            ))}

            {Array.from({ length: ghostCount }).map((_, i) => (
              <div key={`ghost-${i}`} className="flex flex-col items-center gap-1">
                <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                  <BlobFrame blobIndex={filtered.length + i} className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(232,220,192,0.35)' }}>
                    <FlowerIcon size={28} color="#C4BBA5" style={{ opacity: 0.45 }} />
                  </BlobFrame>
                </div>
                <p className="text-center shrink-0" style={{ fontSize: '8px', fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#C4BBA5' }}>???</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="fixed z-20 active:scale-95 transition-all" style={{ bottom: '20px', right: 'max(16px, calc(50vw - 215px))' }}>
        <button className="flex items-center gap-2.5 h-14 px-5 rounded-full" style={{ backgroundColor: '#c5d07d', boxShadow: '0 4px 20px rgba(197,208,125,0.55)' }}>
          <FlowerIcon size={22} color="#3D362D" />
          <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '15px', color: '#3D362D', letterSpacing: '0.01em' }}>
            add flower
          </span>
        </button>
      </div>
    </div>
  );
}
