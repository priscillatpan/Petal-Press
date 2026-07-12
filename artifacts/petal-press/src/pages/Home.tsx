import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGarden } from "@/context/useGarden";
import { useAuth } from "@/context/AuthContext";
import { FlowerIcon } from "@/components/FlowerIcon";
import { BlobFrame } from "@/components/BlobFrame";
import { THEMES, type ThemeKey } from "@/data/themes";

const GHOST_SLOTS = 3;

type ViewMode = "all" | "meaning";
type SortMode = "recent" | "az";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const cell = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 220, damping: 20 } },
};

const THEME_SHORT: Record<ThemeKey, string> = {
  "love": "Love",
  "new-beginnings": "New Beginnings",
  "remembrance": "Remembrance",
  "joy": "Joy",
  "strength": "Strength",
};

function Pill({
  active, onClick, dot, children, testId,
}: {
  active: boolean; onClick: () => void; dot?: string;
  children: React.ReactNode; testId?: string;
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className="shrink-0 flex items-center gap-1.5 h-8 px-3.5 rounded-full text-xs font-medium border transition-all duration-150"
      style={{
        backgroundColor: active ? '#FFFDF5' : 'transparent',
        color: active ? '#3D362D' : '#9A8F7F',
        borderColor: active ? '#C8BFA8' : '#D4CBB3',
        boxShadow: active ? '0 1px 4px rgba(0,0,0,0.09)' : 'none',
      }}
    >
      {dot && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dot, opacity: active ? 1 : 0.5 }} />}
      {children}
    </button>
  );
}

export default function Home({ hideCapture = false }: { hideCapture?: boolean }) {
  const { flowers, loading } = useGarden();
  const { signOut, user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [themeFilter, setThemeFilter] = useState<ThemeKey | null>(null);

  const displayed = useMemo(() => {
    let list = [...flowers];
    if (viewMode === "meaning" && themeFilter) {
      list = list.filter(f => f.theme === themeFilter);
    }
    if (sortMode === "az") {
      list.sort((a, b) => a.commonName.localeCompare(b.commonName));
    } else {
      list.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
    }
    return list;
  }, [flowers, viewMode, themeFilter, sortMode]);

  return (
    <div className="min-h-screen pb-28 relative" style={{ backgroundColor: '#F5EFD8' }}>
      <header
        className="px-5 pt-8 pb-3 sticky top-0 z-20"
        style={{
          backgroundColor: 'rgba(245,239,216,0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #E8DCC0',
        }}
      >
        {user && (
          <button
            onClick={() => signOut()}
            style={{
              position: 'absolute', top: '10px', right: '20px',
              fontSize: '11px', color: '#B8AFA0', background: 'none',
              border: 'none', cursor: 'pointer', letterSpacing: '0.03em',
            }}
          >
            sign out
          </button>
        )}

        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl tracking-tight flex items-center gap-2" style={{ fontFamily: 'Fraunces, serif', color: '#3D362D' }}>
            <FlowerIcon size={20} color="#c5d07d" />
            Petal Press
          </h1>
          <span className="text-xs tracking-widest" style={{ color: '#9A8F7F' }}>
            {loading ? '…' : `${flowers.length} found`}
          </span>
        </div>

        {!loading && (
          <div className="space-y-2">
            {/* Segmented toggle */}
            <div
              className="inline-flex rounded-full p-[3px]"
              style={{ backgroundColor: '#E8DCC0' }}
            >
              {(['all', 'meaning'] as const).map(mode => (
                <button
                  key={mode}
                  data-testid={mode === 'all' ? 'mode-all' : 'mode-meaning'}
                  onClick={() => setViewMode(mode)}
                  className="rounded-full px-4 py-1 text-xs transition-all"
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontWeight: viewMode === mode ? 500 : 400,
                    color: viewMode === mode ? '#3D362D' : '#9A8F7F',
                    backgroundColor: viewMode === mode ? '#FFFDF5' : 'transparent',
                    boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.10)' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.01em',
                  }}
                >
                  {mode === 'all' ? 'All Flowers' : 'By Meaning'}
                </button>
              ))}
            </div>

            {/* Sub-options row */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none">
              {viewMode === "all" ? (
                <>
                  <Pill active={sortMode === "recent"} onClick={() => setSortMode("recent")} testId="sort-recent">Newest</Pill>
                  <Pill active={sortMode === "az"} onClick={() => setSortMode("az")} testId="sort-az">A – Z</Pill>
                </>
              ) : (
                (() => {
                  const counts = Object.fromEntries(
                    THEMES.map(t => [t.key, flowers.filter(f => f.theme === t.key).length])
                  );
                  return THEMES
                    .filter(t => counts[t.key] > 0)
                    .sort((a, b) => counts[b.key] - counts[a.key])
                    .map(t => (
                      <Pill
                        key={t.key}
                        active={themeFilter === t.key}
                        dot={t.color}
                        onClick={() => setThemeFilter(themeFilter === t.key ? null : t.key as ThemeKey)}
                        testId={`theme-${t.key}`}
                      >
                        {THEME_SHORT[t.key as ThemeKey]}
                        <span
                          className="ml-1 rounded-full px-1.5 py-px text-[10px] leading-none"
                          style={{
                            backgroundColor: themeFilter === t.key ? '#E8DCC0' : '#EDE5D0',
                            color: themeFilter === t.key ? '#3D362D' : '#9A8F7F',
                          }}
                        >
                          {counts[t.key]}
                        </span>
                      </Pill>
                    ));
                })()
              )}
            </div>
          </div>
        )}
      </header>

      <main className="px-3 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-20" style={{ color: '#9A8F7F' }}>
            <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : (
          <motion.div
            key={`${viewMode}-${themeFilter}-${sortMode}`}
            variants={container} initial="hidden" animate="show"
            className="grid grid-cols-2 gap-3"
          >
            {displayed.map((flower, idx) => {
              const photos = flower.imageUrls?.length ? flower.imageUrls : flower.imageUrl ? [flower.imageUrl] : [];
              const hasPhoto = photos.length > 0 && !photos[0].startsWith('blob:');
              return (
                <motion.div key={flower.id} variants={cell}>
                  <Link href={`/flower/${flower.id}`} style={{ display: 'block' }}>
                    <div className="flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform duration-150" data-testid={`card-flower-${flower.id}`}>
                      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                        <BlobFrame blobIndex={idx} className="absolute inset-0" style={{ backgroundColor: hasPhoto ? '#2a1f18' : '#FAF7EF', boxShadow: '0 3px 12px rgba(0,0,0,0.13)' }}>
                          {hasPhoto ? (
                            <img src={photos[0]} alt={flower.commonName} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FlowerIcon size={32} color="#D4CBB3" />
                            </div>
                          )}
                        </BlobFrame>
                      </div>
                      <p className="text-center truncate w-full px-0.5 shrink-0" style={{ fontSize: '13px', fontFamily: 'Fraunces, serif', color: '#736959' }}>
                        {flower.commonName}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {displayed.length === 0 && (
              <div className="col-span-2 py-10 text-center" style={{ color: '#9A8F7F', fontSize: '13px' }}>
                No flowers in this category yet.
              </div>
            )}

            {viewMode === "all" && Array.from({ length: GHOST_SLOTS }).map((_, i) => (
              <motion.div key={`ghost-${i}`} variants={cell}>
                <div className="flex flex-col items-center gap-1" data-testid={`slot-undiscovered-${i}`}>
                  <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                    <BlobFrame blobIndex={displayed.length + i} className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(232,220,192,0.35)' }}>
                      <FlowerIcon size={28} color="#C4BBA5" style={{ opacity: 0.45 }} />
                    </BlobFrame>
                  </div>
                  <p className="text-center shrink-0" style={{ fontSize: '8px', fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#C4BBA5' }}>???</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {!hideCapture && (
        <Link href="/capture" style={{ display: 'block' }}>
          <div className="fixed z-20 active:scale-95 transition-all" style={{ bottom: '20px', right: 'max(16px, calc(50vw - 215px))' }} data-testid="button-capture">
            <button className="flex items-center gap-2.5 h-14 px-5 rounded-full" style={{ backgroundColor: '#c5d07d', boxShadow: '0 4px 20px rgba(197,208,125,0.55)' }}>
              <FlowerIcon size={22} color="#3D362D" />
              <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '15px', color: '#3D362D', letterSpacing: '0.01em' }}>
                add flower
              </span>
            </button>
          </div>
        </Link>
      )}
    </div>
  );
}
