import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

function illustrationUrl(latinName: string): string {
  const slug = latinName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${SUPABASE_URL}/storage/v1/object/public/flower-images/illustrations/${slug}.png`;
}

const ROTATIONS = [-9, 6, -5, 8];
const POSITIONS = [
  { top: 10, left: 4 },
  { top: 0, left: "42%" },
  { top: 60, left: "22%" },
  { top: 35, left: "58%" },
];

export default function Welcome() {
  const [, setLocation] = useLocation();
  const { flowers } = useGarden();
  const sampleFlowers = flowers.slice(0, 4);

  function handleEnter() {
    localStorage.setItem("petal-press-seen", "1");
    setLocation("/");
  }

  return (
    <div
      className="bg-background flex flex-col px-6"
      style={{ minHeight: "100dvh" }}
      data-testid="welcome-screen"
    >
      {/* Scattered illustration cards */}
      <div className="flex-shrink-0 flex items-center justify-center pt-14 pb-2">
        <div className="relative w-72 h-48">
          {sampleFlowers.map((flower, i) => (
            <motion.div
              key={flower.id}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1, rotate: ROTATIONS[i] }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
              style={{
                position: "absolute",
                top: POSITIONS[i].top,
                left: POSITIONS[i].left,
                zIndex: i + 1,
              }}
            >
              <div
                className="overflow-hidden shadow-md"
                style={{
                  width: 96,
                  height: 112,
                  backgroundColor: '#FCFBF7',
                  border: '2px solid rgba(255,255,255,0.9)',
                  borderRadius: 6,
                }}
              >
                <img
                  src={illustrationUrl(flower.latinName)}
                  alt={flower.commonName}
                  className="w-full h-full object-cover"
                  style={{ mixBlendMode: 'multiply', opacity: 0.92 }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Title + subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex-shrink-0 text-center px-2 mt-6"
      >
        <h1 className="font-serif text-5xl text-foreground leading-tight mb-3">
          Petal<br />Press
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Every flower on your street has a name,<br />a history, and a secret meaning.
        </p>
        <p className="text-muted-foreground/60 text-sm mt-2">
          Photograph them on your walks. Press them here.
        </p>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" style={{ minHeight: 32 }} />

      {/* CTA */}
      <div className="flex-shrink-0 pb-12 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.35 }}
        >
          <button
            onClick={handleEnter}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-serif text-lg tracking-wide shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all"
            data-testid="button-begin"
          >
            Open my garden
          </button>
          <p className="text-center text-muted-foreground/50 text-xs mt-3">
            San Francisco · Spring 2026
          </p>
        </motion.div>
      </div>
    </div>
  );
}
