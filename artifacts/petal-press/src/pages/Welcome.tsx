import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Welcome() {
  const [, setLocation] = useLocation();

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
      {/* Decorative botanical motif */}
      <div className="flex-shrink-0 flex items-center justify-center pt-20 pb-4">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden>
          <circle cx="60" cy="60" r="42" stroke="#D4CBB3" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="60" cy="60" r="28" fill="#FAF7EF" />
          {/* Simple pressed-flower cross petals */}
          {[0,60,120,180,240,300].map((deg, i) => (
            <ellipse
              key={i}
              cx="60" cy="38"
              rx="5" ry="14"
              fill={i % 2 === 0 ? '#c5d07d' : '#E8DCC0'}
              opacity="0.85"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
          <circle cx="60" cy="60" r="9" fill="#986E5D" opacity="0.7" />
          <circle cx="60" cy="60" r="5" fill="#FAF7EF" />
        </svg>
      </div>

      {/* Title + subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
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
      <div className="flex-1" style={{ minHeight: 32 }} />

      {/* CTA */}
      <div className="flex-shrink-0 pb-12 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
        >
          <button
            onClick={handleEnter}
            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-sans text-base tracking-wide shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all"
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
