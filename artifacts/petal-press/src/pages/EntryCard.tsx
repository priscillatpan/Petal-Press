import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Edit2, Check } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { Button } from "@/components/ui/button";
import { NATIVE_STATUS_LABELS, NATIVE_STATUS_COLORS } from "@/data/nativeStatus";

export default function EntryCard() {
  const [, params] = useRoute("/flower/:id");
  const id = params?.id;
  const { flowers, updateFlower } = useGarden();
  const flower = flowers.find(f => f.id === id);

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(flower?.blurb || "");

  if (!flower) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl text-foreground mb-4">Flower not found</h2>
        <Link href="/">
          <Button variant="outline" data-testid="button-back-home">Return to Garden</Button>
        </Link>
      </div>
    );
  }

  const handleSaveNotes = () => {
    updateFlower(flower.id, { blurb: notes });
    setIsEditingNotes(false);
  };

  const statusLabel = NATIVE_STATUS_LABELS[flower.nativeStatus];
  const statusColors = NATIVE_STATUS_COLORS[flower.nativeStatus];

  return (
    <div className="min-h-screen bg-background pb-16 overflow-y-auto">
      {/* Topbar */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <Link href="/">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <span className="text-xs text-muted-foreground/50 font-mono tracking-widest">
          {flower.datePressed}
        </span>
        <div className="w-9" />
      </div>

      <main className="px-6 flex flex-col items-center gap-5">
        {/* Photo — small square card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-48 h-48 rounded-2xl overflow-hidden shadow-md border border-border/30 bg-muted shrink-0"
        >
          {flower.imageUrl ? (
            <img
              src={flower.imageUrl}
              alt={flower.commonName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🌸</div>
          )}
        </motion.div>

        {/* Name block */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center w-full"
        >
          <h1 className="font-serif text-3xl text-foreground leading-tight mb-0.5">
            {flower.commonName}
          </h1>
          <p className="italic text-muted-foreground text-sm font-serif mb-2">
            {flower.latinName}
          </p>
          <p className="text-primary text-xs tracking-widest uppercase font-medium">
            "{flower.nickname}"
          </p>
        </motion.div>

        {/* Meaning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full"
        >
          <p className="text-center text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase mb-2">
            · It means ·
          </p>
          <p className="text-center font-serif italic text-foreground/85 text-base leading-snug">
            {flower.meaning}
          </p>
        </motion.div>

        {/* Blurb */}
        {flower.blurb && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="text-sm text-foreground/70 leading-relaxed text-center"
          >
            {flower.blurb}
          </motion.p>
        )}

        {/* Meta strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full bg-card border border-border/40 rounded-2xl px-5 py-4 flex justify-between items-center gap-4"
        >
          <div>
            <p className="text-[10px] tracking-widest text-muted-foreground/50 uppercase mb-0.5">Family</p>
            <p className="text-sm font-medium text-foreground">
              {flower.plantFamily || "Unknown"}
            </p>
          </div>
          <div className="h-8 w-px bg-border/40" />
          <div className="text-right">
            <p className="text-[10px] tracking-widest text-muted-foreground/50 uppercase mb-0.5">Status</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors}`}>
              {statusLabel}
            </span>
          </div>
        </motion.div>

        {/* Field notes */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="w-full bg-card border border-border/40 rounded-2xl px-5 py-4"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] tracking-widest text-muted-foreground/50 uppercase">· Notes ·</p>
            {!isEditingNotes ? (
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsEditingNotes(true)}
                data-testid="button-edit-notes"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                className="text-primary"
                onClick={handleSaveNotes}
                data-testid="button-save-notes"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isEditingNotes ? (
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 resize-none text-foreground/80 leading-relaxed min-h-[80px] text-sm font-serif italic"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              autoFocus
              data-testid="input-notes"
            />
          ) : (
            <p className="text-foreground/80 leading-relaxed text-sm font-serif italic whitespace-pre-wrap">
              {flower.blurb || "No notes yet."}
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
