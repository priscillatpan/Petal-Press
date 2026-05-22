import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";
import { FlowerIcon } from "@/components/FlowerIcon";
import { BlobFrame } from "@/components/BlobFrame";
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
            {filtered.map((flower, idx) => {
              const illUrl = illustrationUrl(flower.latinName);
              const illFailed = illErrors.has(flower.id);
              const photos = flower.imageUrls?.length ? flower.imageUrls : flower.imageUrl ? [flower.imageUrl] : [];
              const hasPhoto = photos.length > 0 && !photos[0].startsWith('blob:');

              return (
                <motion.div key={flower.id} variants={cell}>
                  <Link href={`/flower/${flower.id}`}>
                    <div
                      className="flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-transform duration-150"
                      data-testid={`card-flower-${flower.id}`}
                    >
                      {/* Blob-shaped image — always 1:1 so paths render undistorted */}
                      <BlobFrame
                        blobIndex={idx}
                        className="relative w-full"
                        style={{
                          aspectRatio: '1',
                          backgroundColor: hasPhoto ? '#2a1f18' : '#FAF7EF',
                          boxShadow: '0 3px 12px rgba(0,0,0,0.13)',
                        }}
                      >
                        {hasPhoto ? (
                          <>
                            <img
                              src={photos[0]}
                              alt={flower.commonName}
                              className="w-full h-full object-cover"
                            />
                            {!illFailed && (
                              <div
                                className="absolute bottom-1 right-1"
                                style={{ transform: 'rotate(3deg)' }}
                              >
                                <div style={{
                                  width: '28px', height: '28px',
                                  backgroundColor: '#FCFBF7',
                                  border: '2px solid #FCFBF7',
                                  borderRadius: '2px',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.28)',
                                  overflow: 'hidden',
                                }}>
                                  <img
                                    src={illUrl} alt=""
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
                            <FlowerIcon size={32} color="#D4CBB3" />
                          </div>
                        ) : (
                          <img
                            src={illUrl}
                            alt={flower.commonName}
                            className="w-full h-full object-contain"
                            style={{ mixBlendMode: 'multiply', opacity: 0.92, padding: '6px' }}
                            onError={() => handleIllError(flower.id)}
                          />
                        )}
                      </BlobFrame>

                      <p
                        className="text-center truncate w-full px-0.5 shrink-0"
                        style={{ fontSize: '9px', fontFamily: 'Fraunces, serif', color: '#736959' }}
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
                  <BlobFrame
                    blobIndex={filtered.length + i}
                    className="w-full flex flex-col items-center justify-center"
                    style={{
                      aspectRatio: '1',
                      backgroundColor: 'rgba(232,220,192,0.35)',
                    }}
                  >
                    <FlowerIcon size={28} color="#C4BBA5" style={{ opacity: 0.45 }} />
                  </BlobFrame>
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
