import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGarden } from "@/context/useGarden";
import { useAuth } from "@/context/AuthContext";
import { FlowerIcon } from "@/components/FlowerIcon";
import { BlobFrame } from "@/components/BlobFrame";
import { getSeasonFromDate, SEASON_LABELS, type Season } from "@/data/season";
import { THEMES } from "@/data/themes";

const GHOST_SLOTS = 3;

type SeasonFilter = Season | null;
type ViewMode = "all" | "meaning";
type SortMode = "recent" | "az";

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter'];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const cell = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 220, damping: 20 } },
};

export default function Home() {
  const { flowers, loading } = useGarden();
  const { signOut, user } = useAuth();
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const seasonsPresent = useMemo(() => {
    const set = new Set(flowers.map(f => getSeasonFromDate(f.datePressed)));
    return SEASONS.filter(s => set.has(s));
  }, [flowers]);

  const filtered = useMemo(() => {
    const bySeason = !seasonFilter
      ? flowers
      : flowers.filter(f => getSeasonFromDate(f.datePressed) === seasonFilter);
    const sorted = [...bySeason];
    if (sortMode === "az") {
      sorted.sort((a, b) => a.commonName.localeCompare(b.commonName));
    } else {
      sorted.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
    }
    return sorted;
  }, [flowers, seasonFilter, sortMode]);

  const themeGroups = useMemo(() => {
    return THEMES.map(t => ({
      ...t,
      flowers: filtered.filter(f => (f.theme || "joy") === t.key),
    })).filter(g => g.flowers.length > 0);
  }, [filtered]);

  const ghostCount = GHOST_SLOTS;

  return (
    <div className="min-h-screen pb-28 relative" style={{ backgroundColor: '#F5EFD8' }}>
      <header
        className="px-5 pt-10 pb-3 sticky top-0 z-20"
        style={{
          backgroundColor: 'rgba(245,239,216,0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #E8DCC0',
        }}
      >
        {user && (
          <button
            onClick={() => signOut()}
            title="Sign out"
            style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              fontSize: '11px',
              color: '#B8AFA0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.03em',
              padding: '2px 0',
            }}
          >
            sign out
          </button>
        )}
        <div className="flex items-center justify-between mb-0.5">
          <h1
            className="text-2xl tracking-tight flex items-center gap-2"
            style={{ fontFamily: 'Fraunces, serif', color: '#3D362D' }}
          >
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

        {!loading && (
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
                data-testid={`mode-${opt.key}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {!loading && viewMode === "all" && (
          <div className="flex gap-1 mb-3 p-0.5 rounded-full w-fit" style={{ backgroundColor: '#EDE6D0' }}>
            {([
              { key: "recent", label: "Newest" },
              { key: "az", label: "A – Z" },
            ] as const).map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortMode(opt.key)}
                className="h-7 px-3 rounded-full text-xs font-medium transition-colors"
                style={{
                  backgroundColor: sortMode === opt.key ? '#FFF9ED' : 'transparent',
                  color: sortMode === opt.key ? '#3D362D' : '#9A8F7F',
                  boxShadow: sortMode === opt.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
                data-testid={`sort-${opt.key}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {!loading && viewMode === "all" && seasonsPresent.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              onClick={() => setSeasonFilter(null)}
              className="shrink-0 h-7 px-3 rounded-full text-xs font-medium border transition-colors"
              style={{
                backgroundColor: seasonFilter === null ? '#c5d07d' : 'transparent',
                color: seasonFilter === null ? '#3D362D' : '#9A8F7F',
                borderColor: seasonFilter === null ? '#c5d07d' : '#D4CBB3',
              }}
              data-testid="filter-all"
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
                data-testid={`filter-${s}`}
              >
                {SEASON_LABELS[s]}
              </button>
            ))}
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
        ) : viewMode === "meaning" ? (
          <div className="space-y-6">
            {themeGroups.map(group => (
              <div key={group.key}>
                <div className="flex items-center gap-2 mb-2 px-0.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: group.color }}
                  />
                  <h2
                    className="text-sm tracking-wide"
                    style={{ fontFamily: 'Fraunces, serif', color: '#3D362D' }}
                  >
                    {group.label}
                  </h2>
                  <span className="text-[11px]" style={{ color: '#9A8F7F' }}>
                    {group.flowers.length}
                  </span>
                </div>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 gap-3"
                >
                  {group.flowers.map((flower, idx) => {
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
                                style={{
                                  backgroundColor: hasPhoto ? '#2a1f18' : '#FAF7EF',
                                  boxShadow: '0 3px 12px rgba(0,0,0,0.13)',
                                }}
                              >
                                {hasPhoto ? (
                                  <img
                                    src={photos[0]}
                                    alt={flower.commonName}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
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
                </motion.div>
              </div>
            ))}
            {themeGroups.length === 0 && (
              <p className="text-center text-sm py-10" style={{ color: '#9A8F7F' }}>
                No pressed flowers yet.
              </p>
            )}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3"
          >
            {filtered.map((flower, idx) => {
              const photos = flower.imageUrls?.length ? flower.imageUrls : flower.imageUrl ? [flower.imageUrl] : [];
              const hasPhoto = photos.length > 0 && !photos[0].startsWith('blob:');

              return (
                <motion.div key={flower.id} variants={cell}>
                  {/* display:block on the <a> so % widths resolve from the grid cell */}
                  <Link href={`/flower/${flower.id}`} style={{ display: 'block' }}>
                    <div
                      className="flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform duration-150"
                      data-testid={`card-flower-${flower.id}`}
                    >
                      {/* Explicit square container — padding-bottom trick guarantees 1:1 */}
                      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                        <BlobFrame
                          blobIndex={idx}
                          className="absolute inset-0"
                          style={{
                            backgroundColor: hasPhoto ? '#2a1f18' : '#FAF7EF',
                            boxShadow: '0 3px 12px rgba(0,0,0,0.13)',
                          }}
                        >
                          {hasPhoto ? (
                            <img
                              src={photos[0]}
                              alt={flower.commonName}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
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

            {Array.from({ length: ghostCount }).map((_, i) => (
              <motion.div key={`ghost-${i}`} variants={cell}>
                <div
                  className="flex flex-col items-center gap-1"
                  data-testid={`slot-undiscovered-${i}`}
                >
                  <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                    <BlobFrame
                      blobIndex={filtered.length + i}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(232,220,192,0.35)' }}
                    >
                      <FlowerIcon size={28} color="#C4BBA5" style={{ opacity: 0.45 }} />
                    </BlobFrame>
                  </div>
                  <p
                    className="text-center shrink-0"
                    style={{ fontSize: '8px', fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#C4BBA5' }}
                  >
                    ???
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Link href="/capture" style={{ display: 'block' }}>
        {/* FAB pill button */}
        <div
          className="fixed z-20 active:scale-95 transition-all"
          style={{
            bottom: '20px',
            right: 'max(16px, calc(50vw - 215px))',
          }}
          data-testid="button-capture"
        >
          <button
            className="flex items-center gap-2.5 h-14 px-5 rounded-full"
            style={{
              backgroundColor: '#c5d07d',
              boxShadow: '0 4px 20px rgba(197,208,125,0.55)',
            }}
          >
            <FlowerIcon size={22} color="#3D362D" />
            <span style={{
              fontFamily: 'Fraunces, serif',
              fontStyle: 'italic',
              fontSize: '15px',
              color: '#3D362D',
              letterSpacing: '0.01em',
            }}>
              add flower
            </span>
          </button>
        </div>
      </Link>
    </div>
  );
}
