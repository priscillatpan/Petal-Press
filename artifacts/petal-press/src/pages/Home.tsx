import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import { FlowerIcon } from "@/components/FlowerIcon";
import { getSeasonFromDate, SEASON_LABELS, type Season } from "@/data/season";

const TOTAL_SLOTS = 24;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

type SeasonFilter = Season | null;

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter'];

function illustrationUrl(latinName: string): string {
  const slug = latinName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${SUPABASE_URL}/storage/v1/object/public/flower-images/illustrations/v2/${slug}.png`;
}

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
  const [illErrors, setIllErrors] = useState<Set<string>>(new Set());

  const seasonsPresent = useMemo(() => {
    const set = new Set(flowers.map(f => getSeasonFromDate(f.datePressed)));
    return SEASONS.filter(s => set.has(s));
  }, [flowers]);

  const filtered = useMemo(() => {
    if (!seasonFilter) return flowers;
    return flowers.filter(f => getSeasonFromDate(f.datePressed) === seasonFilter);
  }, [flowers, seasonFilter]);

  const ghostCount = Math.max(0, TOTAL_SLOTS - filtered.length);

  function handleIllError(flowerId: string) {
    setIllErrors(prev => new Set([...prev, flowerId]));
  }

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
            <FlowerIcon size={20} color="#986E5D" />
            Petal Press
          </h1>
          <span
            className="text-xs tracking-widest"
            style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#9A8F7F' }}
          >
            {loading ? '…' : `${flowers.length} / ${TOTAL_SLOTS}`}
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: '#9A8F7F' }}>
          {loading
            ? 'Loading your pressings…'
            : `${flowers.length} of ${TOTAL_SLOTS} species discovered`}
        </p>

        {!loading && seasonsPresent.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              onClick={() => setSeasonFilter(null)}
              className="shrink-0 h-7 px-3 rounded-full text-xs font-medium border transition-colors"
              style={{
                backgroundColor: seasonFilter === null ? '#986E5D' : 'transparent',
                color: seasonFilter === null ? '#fff' : '#9A8F7F',
                borderColor: seasonFilter === null ? '#986E5D' : '#D4CBB3',
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
                  backgroundColor: seasonFilter === s ? '#986E5D' : 'transparent',
                  color: seasonFilter === s ? '#fff' : '#9A8F7F',
                  borderColor: seasonFilter === s ? '#986E5D' : '#D4CBB3',
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
            {filtered.map(flower => {
              const illUrl = illustrationUrl(flower.latinName);
              const illFailed = illErrors.has(flower.id);
              const photos = flower.imageUrls?.length ? flower.imageUrls : flower.imageUrl ? [flower.imageUrl] : [];
              const hasPhoto = photos.length > 0 && !photos[0].startsWith('blob:');

              return (
                <motion.div key={flower.id} variants={cell}>
                  <Link href={`/flower/${flower.id}`}>
                    <div
                      className="relative cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
                      style={{ aspectRatio: '3/4' }}
                      data-testid={`card-flower-${flower.id}`}
                    >
                      <div className="absolute -top-0.5 -right-0.5 w-5 h-2 rotate-45 z-10" style={{ backgroundColor: 'rgba(255,255,255,0.55)', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }} />
                      <div className="absolute -bottom-0.5 -left-0.5 w-5 h-2 rotate-45 z-10" style={{ backgroundColor: 'rgba(255,255,255,0.55)', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' }} />

                      <div
                        className="w-full h-full flex flex-col"
                        style={{
                          backgroundColor: '#FCFBF7',
                          border: '1px solid #E8DCC0',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05), inset 0 0 12px rgba(139,115,85,0.03)',
                          padding: '6px',
                        }}
                      >
                        {/* Image area */}
                        <div
                          className="flex-1 mb-1.5 overflow-hidden relative"
                          style={{ border: '1px solid #EDE5CC', backgroundColor: hasPhoto ? '#1a1a1a' : '#FAF7EF' }}
                        >
                          {hasPhoto ? (
                            <>
                              {/* Main: real photo */}
                              <img
                                src={photos[0]}
                                alt={flower.commonName}
                                className="w-full h-full object-cover"
                              />
                              {/* Illustration sticker bottom-right */}
                              {!illFailed && (
                                <div
                                  className="absolute bottom-1 right-1"
                                  style={{ transform: 'rotate(3deg)' }}
                                >
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    backgroundColor: '#FCFBF7',
                                    border: '2px solid #FCFBF7',
                                    borderRadius: '2px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.28)',
                                    overflow: 'hidden',
                                  }}>
                                    <img
                                      src={illUrl}
                                      alt=""
                                      className="w-full h-full object-contain"
                                      style={{ mixBlendMode: 'multiply', opacity: 0.95 }}
                                      onError={() => handleIllError(flower.id)}
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          ) : illFailed ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <FlowerIcon size={36} color="#D4CBB3" />
                            </div>
                          ) : (
                            /* No photo — illustration fills the card */
                            <img
                              src={illUrl}
                              alt={flower.commonName}
                              className="w-full h-full object-contain"
                              style={{ mixBlendMode: 'multiply', opacity: 0.92, padding: '4px' }}
                              onError={() => handleIllError(flower.id)}
                            />
                          )}
                        </div>

                        <p
                          className="text-center truncate px-0.5"
                          style={{
                            fontSize: '9px',
                            fontFamily: 'Fraunces, serif',
                            color: '#736959',
                          }}
                        >
                          {flower.commonName}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {Array.from({ length: ghostCount }).map((_, i) => (
              <motion.div key={`ghost-${i}`} variants={cell}>
                <div
                  className="relative"
                  style={{ aspectRatio: '3/4' }}
                  data-testid={`slot-undiscovered-${i}`}
                >
                  <div
                    className="w-full h-full flex flex-col"
                    style={{
                      backgroundColor: 'rgba(252,251,247,0.4)',
                      border: '1px dashed #D4CBB3',
                      padding: '6px',
                    }}
                  >
                    <div
                      className="flex-1 mb-1.5 flex flex-col items-center justify-center"
                      style={{ border: '1px dashed #E0D7C0' }}
                    >
                      <FlowerIcon size={32} color="#C4BBA5" style={{ opacity: 0.5 }} />
                    </div>
                    <p
                      className="text-center"
                      style={{
                        fontSize: '8px',
                        fontFamily: 'Fraunces, serif',
                        fontStyle: 'italic',
                        color: '#C4BBA5',
                      }}
                    >
                      ???
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Link href="/capture">
        <button
          className="fixed bottom-8 w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-all z-20"
          style={{
            backgroundColor: '#986E5D',
            right: 'max(20px, calc(50vw - 215px + 20px))',
            boxShadow: '0 4px 16px rgba(152,110,93,0.35)',
          }}
          data-testid="button-capture"
        >
          <FlowerIcon size={28} color="#fff" />
        </button>
      </Link>
    </div>
  );
}
