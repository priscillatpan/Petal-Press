import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, Flower2 } from "lucide-react";
import { useGarden } from "@/context/GardenContext";

const TOTAL_SLOTS = 24;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const cell = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 220, damping: 20 } }
};

const COLORS = ["blue", "orange", "white", "purple", "pink", "yellow", "red"];

export default function Home() {
  const { flowers } = useGarden();
  const [filterColor, setFilterColor] = useState<string | null>(null);

  const presentColors = useMemo(() => {
    const set = new Set(flowers.map(f => f.color));
    return COLORS.filter(c => set.has(c));
  }, [flowers]);

  const filtered = useMemo(() => {
    if (!filterColor) return flowers;
    return flowers.filter(f => f.color === filterColor);
  }, [flowers, filterColor]);

  const ghostCount = Math.max(0, TOTAL_SLOTS - filtered.length);

  return (
    <div className="min-h-screen bg-background pb-28 relative">
      {/* Header */}
      <header className="px-5 pt-10 pb-4 sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border/30">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-serif text-2xl text-foreground tracking-tight">Petal Press</h1>
          <Link href="/bouquet">
            <button
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/70 transition-colors"
              data-testid="link-bouquet"
            >
              <Flower2 className="w-4 h-4" />
            </button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-primary">{flowers.length}</span> of {TOTAL_SLOTS} pressed
        </p>

        {/* Color filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterColor(null)}
            className={`shrink-0 h-7 px-3 rounded-full text-xs font-medium border transition-colors ${
              filterColor === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-muted-foreground border-border hover:border-primary/40"
            }`}
            data-testid="filter-all"
          >
            All
          </button>
          {presentColors.map(color => (
            <button
              key={color}
              onClick={() => setFilterColor(filterColor === color ? null : color)}
              className={`shrink-0 h-7 px-3 rounded-full text-xs font-medium border capitalize transition-colors ${
                filterColor === color
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/40"
              }`}
              data-testid={`filter-${color}`}
            >
              {color}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <main className="px-3 pt-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-4 gap-1.5"
        >
          {filtered.map((flower) => (
            <motion.div key={flower.id} variants={cell}>
              <Link href={`/flower/${flower.id}`}>
                <div
                  className="relative aspect-square rounded-xl overflow-hidden bg-card cursor-pointer group"
                  data-testid={`card-flower-${flower.id}`}
                >
                  <img
                    src={flower.imageUrl}
                    alt={flower.commonName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-1.5">
                    <p className="text-white text-[9px] font-medium leading-tight line-clamp-2 drop-shadow-sm">
                      {flower.commonName}
                    </p>
                  </div>
                  {flower.inBouquet && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary/90 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Ghost / undiscovered slots */}
          {Array.from({ length: ghostCount }).map((_, i) => (
            <motion.div key={`ghost-${i}`} variants={cell}>
              <div
                className="aspect-square rounded-xl overflow-hidden bg-muted/40 border border-dashed border-border/50 flex flex-col items-center justify-center"
                data-testid={`slot-undiscovered-${i}`}
              >
                <div className="w-6 h-6 opacity-25">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground w-full h-full">
                    <path d="M12 2C9 2 6 5 6 9c0 2.5 1.2 4.7 3 6l3 3 3-3c1.8-1.3 3-3.5 3-6 0-4-3-7-6-7z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 9v4M12 2v2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* FAB — constrained to mobile shell on desktop */}
      <Link href="/capture">
        <button
          className="fixed bottom-8 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all z-20"
          style={{ right: "max(20px, calc(50vw - 215px + 20px))" }}
          data-testid="button-capture"
        >
          <Plus className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
}
