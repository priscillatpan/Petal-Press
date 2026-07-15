import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGarden } from "@/context/useGarden";
import { useAuth } from "@/context/AuthContext";
import { FlowerIcon } from "@/components/FlowerIcon";
import { BlobFrame } from "@/components/BlobFrame";

const GHOST_SLOTS = 3;

type Theme = "love" | "hope" | "friendship" | "mystery" | "joy";
type ThemeFilter = Theme | null;

const THEMES: { id: Theme; label: string; keywords: string[] }[] = [
  { id: "love",       label: "💛 love",       keywords: ["love", "romance", "passion", "devotion", "affection", "adoration", "desire", "heart"] },
  { id: "hope",       label: "🌱 hope",       keywords: ["hope", "new beginning", "consolation", "anticipation", "rebirth", "renewal", "healing", "purity", "innocence"] },
  { id: "friendship", label: "🤝 friendship", keywords: ["friendship", "loyalty", "constancy", "remembrance", "trust", "faithful", "gratitude", "support"] },
  { id: "mystery",    label: "🌙 mystery",    keywords: ["magic", "enchant", "intrigue", "secret", "sorrow", "melancholy", "mystery", "caution", "beware", "grief"] },
  { id: "joy",        label: "✨ joy",        keywords: ["joy", "happiness", "cheerful", "delight", "bright", "sunshine", "warmth", "celebration", "prosperity"] },
];

function deriveTheme(meaning: string): Theme | null {
  const lower = meaning.toLowerCase();
  for (const theme of THEMES) {
    if (theme.keywords.some(k => lower.includes(k))) return theme.id;
  }
  return null;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const cell = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 220, damping: 20 } },
};

export default function Home({ hideCapture = false }: { hideCapture?: boolean }) {
  const { flowers, loading } = useGarden();
  const { signOut, user } = useAuth();
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>(null);

  const themesPresent = useMemo(() => {
    const set = new Set(flowers.map(f => deriveTheme(f.meaning)));
    return THEMES.filter(t => set.has(t.id));
  }, [flowers]);

  const filtered = useMemo(() => {
    if (!themeFilter) return flowers;
    return flowers.filter(f => deriveTheme(f.meaning) === themeFilter);
  }, [flowers, themeFilter]);

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
          <div className="flex items-center gap-3">
            <span className="text-xs tracking-widest" style={{ color: '#9A8F7F' }}>
              {loading ? '…' : `${flowers.length} species found`}
            </span>
            {user && (
              <button
                onClick={() => signOut()}
                title="Sign out"
                style={{
                  fontSize: '11px',
                  color: '#B8AFA0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 0',
                  letterSpacing: '0.03em',
                }}
              >
                sign out
              </button>
            )}
          </div>
        </div>
        <p className="text-xs mb-3" style={{ color: '#9A8F7F' }}>
          {loading ? 'Loading your pressings…' : 'What flowers will you discover today?'}
        </p>

        {!loading && themesPresent.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              onClick={() => setThemeFilter(null)}
              className="shrink-0 h-7 px-3 rounded-full text-xs font-medium border transition-colors"
              style={{
                backgroundColor: themeFilter === null ? '#c5d07d' : 'transparent',
                color: themeFilter === null ? '#3D362D' : '#9A8F7F',
                borderColor: themeFilter === null ? '#c5d07d' : '#D4CBB3',
              }}
              data-testid="filter-all"
            >
              All
            </button>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setThemeFilter(themeFilter === t.id ? null : t.id)}
                className="shrink-0 h-7 px-3 rounded-full text-xs font-medium border transition-colors"
                style={{
                  backgroundColor: themeFilter === t.id ? '#c5d07d' : 'transparent',
                  color: themeFilter === t.id ? '#3D362D' : '#9A8F7F',
                  borderColor: themeFilter === t.id ? '#c5d07d' : '#D4CBB3',
                  opacity: themesPresent.some(p => p.id === t.id) ? 1 : 0.35,
                }}
                data-testid={`filter-${t.id}`}
              >
                {t.label}
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

      {!hideCapture && <Link href="/capture" style={{ display: 'block' }}>
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
      </Link>}
    </div>
  );
}
