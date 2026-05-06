import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useGarden } from "@/context/GardenContext";

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
  const sampleImages = flowers.slice(0, 4).map(f => f.imageUrl);

  function handleEnter() {
    localStorage.setItem("petal-press-seen", "1");
    setLocation("/");
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col px-6"
      data-testid="welcome-screen"
    >
      {/* Scattered photos */}
      <div className="flex-shrink-0 flex items-center justify-center pt-16 pb-4">
        <div className="relative w-72 h-52">
          {sampleImages.map((src, i) => (
            <motion.div
              key={i}
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
                className="rounded-lg overflow-hidden shadow-md border-2 border-background"
                style={{ width: 100, height: 118 }}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Title + subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex-shrink-0 text-center px-2 mt-4"
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
      <div className="flex-1 min-h-[40px]" />

      {/* CTA always visible at bottom */}
      <div className="flex-shrink-0 pb-14 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
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
