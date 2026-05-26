import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Share } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function BouquetView() {
  const { flowers } = useGarden();
  const { toast } = useToast();
  const bouquetFlowers = flowers;

  const handleShare = () => {
    toast({
      title: "Link copied!",
      description: "Share your bouquet with someone special.",
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden flex flex-col">
      {/* Decorative texture overlay specific to bouquet */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4c5b9' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Header */}
      <div className="p-6 relative z-10 flex justify-between items-center">
        <Link href="/garden">
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground" data-testid="button-back">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary hover:bg-primary/5" onClick={handleShare} data-testid="button-share">
          <Share className="w-4 h-4 mr-2" /> Share
        </Button>
      </div>

      <div className="flex-1 flex flex-col relative z-10 px-6 pb-24 pt-4">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl text-primary mb-4 leading-tight"
          >
            A bouquet <br/><span className="italic font-light">for you</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm uppercase tracking-widest max-w-[250px] mx-auto leading-relaxed"
          >
            Pressed and collected on walks through San Francisco
          </motion.p>
        </div>

        {bouquetFlowers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center opacity-50">
            <p className="font-serif text-lg text-muted-foreground">Your bouquet is empty.<br/>Find some flowers to add.</p>
          </div>
        ) : (
          <div className="relative flex-1 min-h-[400px]">
            {bouquetFlowers.map((flower, index) => {
              // Calculate scattered positions
              const total = bouquetFlowers.length;
              const angle = (index / total) * Math.PI * 2;
              const radius = 60 + Math.random() * 40;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius + (index * 20); // slight downward cascade
              const rotation = (Math.random() - 0.5) * 30; // Random rotation between -15 and 15 deg

              return (
                <motion.div
                  key={flower.id}
                  initial={{ opacity: 0, scale: 0.8, rotate: rotation - 20 }}
                  animate={{ opacity: 1, scale: 1, rotate: rotation }}
                  transition={{ 
                    delay: 0.3 + index * 0.15,
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                  className="absolute left-1/2 top-1/2 w-32 md:w-40 bg-white p-2 pb-6 shadow-xl border border-border/50 rounded-sm"
                  style={{
                    transformOrigin: "center center",
                    marginLeft: `-4rem`,
                    marginTop: `-5rem`,
                    x, y
                  }}
                >
                  <div className="aspect-[3/4] w-full overflow-hidden mb-2">
                    <img 
                      src={flower.imageUrl} 
                      alt={flower.commonName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center px-1">
                    <h4 className="font-serif text-xs text-foreground leading-tight mb-1">{flower.commonName}</h4>
                    <p className="text-[9px] text-muted-foreground italic leading-tight line-clamp-2">{flower.meaning}</p>
                  </div>
                  
                  {/* Faux tape piece */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/40 backdrop-blur-sm border border-white/20 shadow-sm rotate-2 opacity-70 mix-blend-overlay" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
