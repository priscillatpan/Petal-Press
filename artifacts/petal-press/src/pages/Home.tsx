import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGarden } from "@/context/useGarden";
import { useAuth } from "@/context/AuthContext";
import { FlowerIcon } from "@/components/FlowerIcon";
import { BlobFrame } from "@/components/BlobFrame";
import { THEMES, deriveTheme, type ThemeKey } from "@/data/themes";

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

function Pill({
  active, onClick, dot, count, children, testId,
}: {
  active: boolean;
  onClick: () => void;
  dot?: string;
  count?: number;
  children: React.ReactNode;
  testId?: string;
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
      {dot && (
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: dot, opacity: active ? 1 : 0.6 }}
        />
      )}
      {children}
      {count !== undefined && (
        <span
          className="ml-0.5 rounded-full px-1.5 py-px text-[10px] leading-none"
          style={{
            backgroundColor: active ? '#E8DCC0' : '#EDE5D0',
            color: active ? '#3D362D' : '#9A8F7F',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function Home({ hideCapture = false }: { hideCapture?: boolean }) {
  const { flowers, loading } = useGarden();
  const { signOut, user } = useAuth();

  const [viewMode, setViewMode] = useState<ViewMode>(
    () => (sessionStorage.getItem("garden-view") as ViewMode) ?? "all"
  );
  const [sortMode, setSortMode] = useState<SortMode>(
    () => (sessionStorage.getItem("garden-sort") as SortMode) ?? "recent"
  );
  const [themeFilter, setThemeFilter] = useState<ThemeKey | null>(
    () => (sessionStorage.getItem("garden-theme") as ThemeKey) || null
  );

  const setView = (m: ViewMode) => { setViewMode(m); sessionStorage.setItem("garden-view", m); };
  const setSort = (m: SortMode) => { setSortMode(m); sessionStorage.setItem("garden-sort", m); };
  const setTheme = (t: ThemeKey | null) => { setThemeFilter(t); sessionStorage.setItem("garden-theme", t ?? ""); };

  const themeCounts = useMemo(() => {
    const counts: Partial<Record<ThemeKey, number>> = {};
    for (const f of flowers) {
      const t = deriveTheme(f.meaning);
      if (t) counts[t] = (counts[t] ?? 0) + 1;
    }
    return counts;
  }, [flowers]);

  const presentThemes = useMemo(() =>
    THEMES.filter(t => (themeCounts[t.key] ?? 0) > 0)
          .sort((a, b) => (themeCounts[b.key] ?? 0) - (themeCounts[a.key] ?? 0)),
    [themeCounts]
  );

  const displayed = useMemo(() => {
    let list = [...flowers];
    if (viewMode === "meaning" && themeFilter) {
      list = list.filter(f => deriveTheme(f.meaning) === themeFilter);
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

        <div className="flex items-center justify-between mb-3">
          <h1
            className="text-2xl tracking-tight flex items-center gap-2"
            style={{ fontFamily: 'Fraunces, serif', color: '#3D362D' }}
          >
            <FlowerIcon size={20} color="#c5d07d" />
            Petal Press
          </h1>
          <span className="text-xs tracking-widest" style={{ color: '#9A8F7F' }}>
            {loading ? '…' : `${flowers.length} found`}
          </span>
        </div>

        {!loading && flowers.length > 0 && (
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
                  onClick={() => setView(mode)}
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

            {/* Sub-options */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
              {viewMode === "all" ? (
                <>
                  <Pill active={sortMode === "recent"} onClick={() => setSort("recent")} testId="sort-recent">Newest</Pill>
                  <Pill active={sortMode === "az"} onClick={() => setSort("az")} testId="sort-az">A – Z</Pill>
                </>
              ) : (
                presentThemes.map(t => (
                  <Pill
                    key={t.key}
                    active={themeFilter === t.key}
                    dot={t.color}
                    count={themeCounts[t.key]}
                    onClick={() => setTheme(themeFilter === t.key ? null : t.key)}
                    testId={`theme-${t.key}`}
                  >
                    {t.label}
                  </Pill>
                ))
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
        ) : flowers.length === 0 && !hideCapture ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center px-6 pt-16 pb-32"
          >
            <div className="text-6xl mb-6 select-none" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))' }}>
              🌸
            </div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', color: '#3D362D', marginBottom: '10px', lineHeight: 1.25 }}>
              Welcome to Petal Press
            </h2>
            <p style={{ fontSize: '14px', color: '#9A8F7F', lineHeight: 1.6, maxWidth: '240px', marginBottom: '28px' }}>
              Your garden is empty. Press your first flower to start your collection.
            </p>
            <Link href="/capture">
              <button
                className="flex items-center gap-2.5 h-14 px-6 rounded-full active:scale-95 transition-transform"
                style={{ backgroundColor: '#c5d07d', boxShadow: '0 4px 20px rgba(197,208,125,0.55)' }}
              >
                <FlowerIcon size={22} color="#3D362D" />
                <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '15px', color: '#3D362D' }}>
                  add your first flower
                </span>
              </button>
            </Link>
          </motion.div>
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
                    <div
                      className="flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform duration-150"
                      data-testid={`card-flower-${flower.id}`}
                    >
                      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                        <BlobFrame
                          blobIndex={idx}
                          className="absolute inset-0"
                          style={{ backgroundColor: hasPhoto ? '#2a1f18' : '#FAF7EF', boxShadow: '0 3px 12px rgba(0,0,0,0.13)' }}
                        >
                          {hasPhoto ? (
                            <img src={photos[0]} alt={flower.commonName} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FlowerIcon size={32} color="#D4CBB3" />
                            </div>
                          )}
                        </BlobFrame>
                      </div>
                      <p
                        className="text-center truncate w-full px-0.5 shrink-0"
                        style={{ fontSize: '13px', fontFamily: 'Fraunces, serif', color: '#736959' }}
                      >
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
                    <BlobFrame
                      blobIndex={displayed.length + i}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(232,220,192,0.35)' }}
                    >
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

      <div className="text-center pt-6 pb-2">
        <p style={{ fontSize: '11px', color: '#C4BBA5' }}>
          made with love by{" "}
          <a
            href="https://www.instagram.com/priscilla.png/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#9A8F7F', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            priscilla
          </a>
          {" — "}
          <Link href="/privacy">
            <span style={{ color: '#9A8F7F', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              privacy
            </span>
          </Link>
        </p>
      </div>

      {!hideCapture && (
        <Link href="/capture" style={{ display: 'block' }}>
          <div
            className="fixed z-20 active:scale-95 transition-all"
            style={{ bottom: '20px', right: 'max(16px, calc(50vw - 215px))' }}
            data-testid="button-capture"
          >
            <button
              className="flex items-center gap-2.5 h-14 px-5 rounded-full"
              style={{ backgroundColor: '#c5d07d', boxShadow: '0 4px 20px rgba(197,208,125,0.55)' }}
            >
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
