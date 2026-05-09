import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, Edit2, Check } from "lucide-react";
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
    <div className="min-h-screen bg-background pb-12">
      {/* Header Actions */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <Link href="/">
          <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background shadow-sm" data-testid="button-back">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full aspect-[4/5] relative rounded-b-[2rem] overflow-hidden shadow-lg"
      >
        <img
          src={flower.imageUrl}
          alt={flower.commonName}
          className="w-full h-full object-cover"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <main className="px-6 pt-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="font-serif text-4xl text-foreground mb-1">{flower.commonName}</h1>
          <p className="italic text-muted-foreground text-sm font-serif mb-3">{flower.latinName}</p>

          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-accent/30 text-accent-foreground text-xs font-medium tracking-wide mb-4">
            "{flower.nickname}"
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{flower.datePressed}</span>
            </div>
            {flower.plantFamily && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground italic">{flower.plantFamily}</span>
              </>
            )}
          </div>

          <div className="flex justify-center mt-3">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors}`}>
              {statusLabel}
            </span>
          </div>
        </motion.div>

        {/* Meaning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 text-center px-4"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-border flex-1" />
            <span className="text-primary text-lg font-serif italic">Meaning</span>
            <div className="h-px bg-border flex-1" />
          </div>
          <p className="text-foreground/90 leading-relaxed">{flower.meaning}</p>
        </motion.div>

        {/* Notes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5 shadow-sm border border-card-border"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-serif text-lg text-foreground">Field Notes</h3>
            {!isEditingNotes ? (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsEditingNotes(true)} data-testid="button-edit-notes">
                <Edit2 className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={handleSaveNotes} data-testid="button-save-notes">
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isEditingNotes ? (
            <textarea
              className="w-full bg-transparent border-none focus:ring-0 resize-none text-foreground/80 leading-relaxed min-h-[100px] text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              autoFocus
              data-testid="input-notes"
            />
          ) : (
            <p className="text-foreground/80 leading-relaxed text-sm whitespace-pre-wrap">
              {flower.blurb || "No notes added yet."}
            </p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
