import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, Filter, Image as ImageIcon } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { flowers } = useGarden();
  const [filterColor, setFilterColor] = useState<string | null>(null);

  const colors = useMemo(() => {
    const set = new Set(flowers.map(f => f.color));
    return Array.from(set);
  }, [flowers]);

  const filteredFlowers = useMemo(() => {
    let result = flowers;
    if (filterColor) {
      result = result.filter(f => f.color === filterColor);
    }
    return result;
  }, [flowers, filterColor]);

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border/40">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif text-primary">Petal Press</h1>
          <Link href="/bouquet">
            <Button variant="ghost" size="icon" className="rounded-full text-primary" data-testid="link-bouquet">
              <ImageIcon className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {flowers.length} of {flowers.length + 1} pressed
        </p>

        {/* Filters */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
          <Button
            variant={filterColor === null ? "default" : "outline"}
            size="sm"
            className="rounded-full h-8 text-xs shrink-0"
            onClick={() => setFilterColor(null)}
            data-testid="filter-all"
          >
            All
          </Button>
          {colors.map(color => (
            <Button
              key={color}
              variant={filterColor === color ? "default" : "outline"}
              size="sm"
              className="rounded-full h-8 text-xs shrink-0 capitalize"
              onClick={() => setFilterColor(color)}
              data-testid={`filter-${color}`}
            >
              {color}
            </Button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <main className="px-6 py-6">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4"
        >
          {filteredFlowers.map((flower) => (
            <motion.div key={flower.id} variants={item}>
              <Link href={`/flower/${flower.id}`}>
                <div 
                  className="group relative bg-card rounded-xl overflow-hidden shadow-sm border border-card-border cursor-pointer aspect-[3/4] flex flex-col"
                  data-testid={`card-flower-${flower.id}`}
                >
                  <div className="relative flex-1 overflow-hidden">
                    <img 
                      src={flower.imageUrl} 
                      alt={flower.commonName} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-serif text-white text-sm leading-tight drop-shadow-md">
                      {flower.commonName}
                    </h3>
                    <p className="text-[10px] text-white/80 italic drop-shadow-md">
                      {flower.datePressed}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Undiscovered Slot */}
          {!filterColor && (
            <motion.div variants={item}>
              <div 
                className="bg-card/50 rounded-xl overflow-hidden shadow-sm border border-dashed border-muted-foreground/30 aspect-[3/4] flex flex-col items-center justify-center relative p-4"
                data-testid="card-undiscovered"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3 opacity-50 blur-[2px]">
                  <span className="text-2xl font-serif text-muted-foreground">?</span>
                </div>
                <h3 className="font-serif text-muted-foreground text-sm text-center">
                  Undiscovered
                </h3>
                <p className="text-[10px] text-muted-foreground/60 text-center mt-1">
                  Keep walking
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* FAB */}
      <Link href="/capture">
        <Button 
          className="fixed bottom-8 right-6 w-14 h-14 rounded-full shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-transform active:scale-95 z-20 flex items-center justify-center"
          data-testid="button-capture"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
}
