import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGarden } from "@/context/GardenContext";
import { Flower } from "@/data/types";

export default function CaptureFlow() {
  const [, setLocation] = useLocation();
  const { addFlower } = useGarden();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form state
  const [commonName, setCommonName] = useState("California Bluebell");
  const [latinName, setLatinName] = useState("Phacelia campanularia");
  const [nickname, setNickname] = useState("Desert Sky");
  const [meaning, setMeaning] = useState("humility, delicate beauty");
  const [locationInput, setLocationInput] = useState("");
  const [notes, setNotes] = useState("");

  const handleFileUpload = () => {
    // Fake upload
    setImagePreview("https://images.unsplash.com/photo-1457195740896-7f345b14458f?auto=format&fit=crop&w=800&q=80");
    setStep(2);
  };

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => setStep(3), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSave = () => {
    const newFlower: Flower = {
      id: `f${Date.now()}`,
      commonName,
      latinName,
      nickname,
      meaning,
      blurb: notes,
      color: "blue",
      datePressed: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      location: locationInput || "Unknown location",
      spottedCount: 1,
      imageUrl: imagePreview!,
      inBouquet: false,
    };
    addFlower(newFlower);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-cancel-capture">
          <X className="w-5 h-5" />
        </Button>
        <span className="font-serif text-lg">Press a Flower</span>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 1: Upload */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col items-center justify-center p-6"
            >
              <div 
                className="w-full aspect-[3/4] border-2 border-dashed border-primary/30 rounded-3xl flex flex-col items-center justify-center gap-4 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={handleFileUpload}
                data-testid="upload-area"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-primary font-medium text-lg">Drop a flower here</p>
                <p className="text-muted-foreground text-sm">or tap to take a photo</p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Identifying */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-6 relative"
            >
              <div className="absolute inset-0 z-0 opacity-20">
                <img src={imagePreview!} alt="preview" className="w-full h-full object-cover blur-xl" />
              </div>
              <div className="z-10 flex flex-col items-center text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                <h3 className="font-serif text-2xl text-foreground mb-2">Identifying...</h3>
                <p className="text-muted-foreground">Consulting the floriography archives...</p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col p-6"
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-8 shadow-md">
                <img src={imagePreview!} alt="preview" className="w-full h-full object-cover" />
              </div>
              
              <h3 className="font-serif text-xl mb-6 text-center">Select the best match</h3>
              
              <div className="space-y-3">
                {[
                  { name: "California Bluebell", latin: "Phacelia campanularia", conf: 92 },
                  { name: "Forget-me-not", latin: "Myosotis sylvatica", conf: 8 },
                  { name: "Borage", latin: "Borago officinalis", conf: 2 },
                ].map((match, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCommonName(match.name);
                      setLatinName(match.latin);
                      setStep(4);
                    }}
                    className="w-full bg-card border border-border p-4 rounded-xl flex items-center justify-between text-left hover:border-primary/50 transition-colors"
                    data-testid={`select-match-${i}`}
                  >
                    <div>
                      <div className="font-medium text-foreground">{match.name}</div>
                      <div className="text-xs text-muted-foreground italic">{match.latin}</div>
                    </div>
                    <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {match.conf}% match
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col overflow-y-auto pb-24"
            >
              <div className="w-full aspect-video relative">
                <img src={imagePreview!} alt="preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>
              
              <div className="px-6 -mt-12 relative z-10 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Species</label>
                  <div className="font-serif text-2xl text-foreground">{commonName}</div>
                  <div className="text-sm italic text-muted-foreground">{latinName}</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Nickname</label>
                    <input 
                      type="text" 
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-foreground"
                      data-testid="input-nickname"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Meaning</label>
                    <input 
                      type="text" 
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-foreground"
                      data-testid="input-meaning"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Location found</label>
                    <input 
                      type="text" 
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="e.g. Dolores Park"
                      className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-foreground"
                      data-testid="input-location"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Field Notes</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write a memory..."
                      className="w-full bg-muted/50 border border-border rounded-xl p-3 focus:outline-none focus:border-primary transition-colors text-foreground resize-none min-h-[100px]"
                      data-testid="input-notes"
                    />
                  </div>
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-4 bg-background/90 backdrop-blur-md border-t border-border">
                <Button 
                  className="w-full h-14 rounded-xl text-lg font-serif" 
                  onClick={handleSave}
                  data-testid="button-save-flower"
                >
                  Press this flower
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
