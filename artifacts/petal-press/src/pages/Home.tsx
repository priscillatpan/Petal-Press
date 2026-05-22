import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import { FlowerIcon } from "@/components/FlowerIcon";
import { BlobFrame } from "@/components/BlobFrame";
import { getSeasonFromDate, SEASON_LABELS, type Season } from "@/data/season";

const GHOST_SLOTS = 3;

type SeasonFilter = Season | null;

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
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>(null);
  const seasonsPresent = useMemo(() => {
    const set = new Set(flowers.map(f => getSeasonFromDate(f.datePressed)));
    return SEASONS.filter(s => set.has(s));
  }, [flowers]);

  const filtered = useMemo(() => {
    if (!seasonFilter) return flowers;
    return flowers.filter(f => getSeasonFromDate(f.datePressed) === seasonFilter);
  }, [flowers, seasonFilter]);

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
        <div className="flex items-center justify-between mb-0.5">
          <h1
            className="text-2xl tracking-tight flex items-center gap-2"
            style={{ fontFamily: 'Fraunces, serif', color: '#3D362D' }}
          >
            <FlowerIcon size={20} color="#c5d07d" />
            Petal Press
          </h1>
          <span
            className="text-xs tracking-widest"
            style={{ color: '#9A8F7F' }}
          >
            {loading ? '…' : `${flowers.length} species found`}
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: '#9A8F7F' }}>
          {loading ? 'Loading your pressings…' : 'What flowers will you discover today?'}
        </p>

        {!loading && seasonsPresent.length > 0 && (
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
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 gap-2"
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
                        style={{ fontSize: '11px', fontFamily: 'Fraunces, serif', color: '#736959' }}
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
        {/* Outer container sized to hold button + curved label text */}
        <div
          className="fixed z-20 active:scale-95 transition-all"
          style={{
            bottom: '16px',
            right: 'max(0px, calc(50vw - 215px))',
            width: '96px',
            height: '96px',
          }}
          data-testid="button-capture"
        >
          {/* Curved "add flower" text arcing over the top */}
          <svg
            width="96" height="96" viewBox="0 0 96 96"
            className="absolute inset-0 pointer-events-none"
            aria-hidden
          >
            <defs>
              {/* Arc from left (8,48) counterclockwise through top to right (88,48) */}
              <path id="fab-arc" d="M 8,48 A 40,40 0 0,0 88,48" />
            </defs>
            <text
              fill="#c5d07d"
              fontSize="7.5"
              fontFamily="Fraunces, serif"
              letterSpacing="2.5"
              textAnchor="middle"
            >
              <textPath href="#fab-arc" startOffset="50%">
                ✿ add flower ✿
              </textPath>
            </text>
          </svg>

          {/* The actual circle button, centered in the container */}
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: '#c5d07d',
              boxShadow: '0 4px 16px rgba(197,208,125,0.45)',
            }}
          >
            <FlowerIcon size={28} color="#3D362D" />
          </button>
        </div>
      </Link>
    </div>
  );
}
