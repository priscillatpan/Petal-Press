import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { Flower } from "@/data/types";

const CANDIDATES = [
  { name: "California Bluebell", latin: "Phacelia campanularia", conf: 91 },
  { name: "Forget-me-not", latin: "Myosotis sylvatica", conf: 7 },
  { name: "Borage", latin: "Borago officinalis", conf: 2 },
];

type Step = 1 | 2 | 3 | 4;

export default function CaptureFlow() {
  const [, setLocation] = useLocation();
  const { addFlower } = useGarden();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [commonName, setCommonName] = useState("California Bluebell");
  const [latinName, setLatinName] = useState("Phacelia campanularia");
  const [nickname, setNickname] = useState("Desert Sky");
  const [meaning, setMeaning] = useState("humility, delicate beauty");
  const [locationInput, setLocationInput] = useState("");
  const [notes, setNotes] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setStep(2);
  }

  function handlePickPhoto() {
    fileInputRef.current?.click();
  }

  useEffect(() => {
    if (step !== 2) return;
    const t = setTimeout(() => setStep(3), 2500);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleSelectCandidate(name: string, latin: string) {
    setCommonName(name);
    setLatinName(latin);
    setStep(4);
  }

  function handleSave() {
    const newFlower: Flower = {
      id: `f${Date.now()}`,
      commonName,
      latinName,
      nickname,
      meaning,
      blurb: notes,
      color: "blue",
      datePressed: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      location: locationInput || "Unknown location",
      spottedCount: 1,
      imageUrl: imagePreview!,
      inBouquet: false,
    };
    addFlower(newFlower);
    setLocation("/");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hidden real file input — accepts photos and videos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        data-testid="input-file"
      />

      {/* Topbar */}
      <div className="p-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border/30">
        <button
          onClick={() => setLocation("/")}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/70 transition-colors"
          data-testid="button-cancel-capture"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="font-serif text-base text-foreground">Press a Flower</span>
        <div className="w-9" />
      </div>

      {/* Step indicator */}
      <div className="flex gap-1.5 px-6 pt-4 pb-0">
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${
              step >= s ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">

          {/* Step 1 — Photo picker */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="flex-1 flex flex-col items-center justify-center px-6 gap-6"
            >
              <div className="text-center mb-2">
                <h2 className="font-serif text-2xl text-foreground mb-1">What did you find?</h2>
                <p className="text-muted-foreground text-sm">Upload a photo from your walk</p>
              </div>

              {/* Main upload area */}
              <button
                onClick={handlePickPhoto}
                className="w-full aspect-[3/4] max-h-[52vh] border-2 border-dashed border-primary/25 rounded-3xl flex flex-col items-center justify-center gap-4 bg-primary/4 hover:bg-primary/8 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden"
                data-testid="upload-area"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Camera className="w-7 h-7" />
                </div>
                <div className="text-center px-4">
                  <p className="text-primary font-medium">Tap to choose a photo</p>
                  <p className="text-muted-foreground text-sm mt-1">or video from your library</p>
                </div>
              </button>

              <p className="text-muted-foreground/60 text-xs text-center max-w-[220px]">
                Works with any flower photo you've taken — on your walk, in your camera roll, wherever.
              </p>
            </motion.div>
          )}

          {/* Step 2 — Identifying */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center px-6 relative"
            >
              {imagePreview && (
                <div className="absolute inset-0 z-0">
                  <img src={imagePreview} alt="" className="w-full h-full object-cover opacity-15 blur-xl scale-110" />
                </div>
              )}
              <div className="z-10 flex flex-col items-center text-center gap-4">
                {/* Pulsing flower icon */}
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    >
                      <svg viewBox="0 0 32 32" className="w-8 h-8 text-primary" fill="currentColor">
                        <ellipse cx="16" cy="8" rx="4" ry="7" opacity="0.9" />
                        <ellipse cx="16" cy="24" rx="4" ry="7" opacity="0.9" />
                        <ellipse cx="8" cy="16" rx="7" ry="4" opacity="0.9" />
                        <ellipse cx="24" cy="16" rx="7" ry="4" opacity="0.9" />
                        <ellipse cx="10.3" cy="10.3" rx="4" ry="7" transform="rotate(-45 10.3 10.3)" opacity="0.7" />
                        <ellipse cx="21.7" cy="21.7" rx="4" ry="7" transform="rotate(-45 21.7 21.7)" opacity="0.7" />
                        <ellipse cx="21.7" cy="10.3" rx="4" ry="7" transform="rotate(45 21.7 10.3)" opacity="0.7" />
                        <ellipse cx="10.3" cy="21.7" rx="4" ry="7" transform="rotate(45 10.3 21.7)" opacity="0.7" />
                        <circle cx="16" cy="16" r="4" fill="hsl(48 60% 75%)" />
                      </svg>
                    </motion.div>
                  </motion.div>
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-foreground mb-1">Identifying...</h3>
                  <p className="text-muted-foreground text-sm">Consulting the floriography archives</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Pick a match */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col px-5 pt-6 pb-8 overflow-y-auto"
            >
              {imagePreview && (
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-6 shadow-md ring-2 ring-background">
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}

              <h3 className="font-serif text-xl text-center text-foreground mb-1">Select the best match</h3>
              <p className="text-muted-foreground text-xs text-center mb-6">Which one looks right to you?</p>

              <div className="space-y-3">
                {CANDIDATES.map((match, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectCandidate(match.name, match.latin)}
                    className="w-full bg-card border border-border p-4 rounded-2xl flex items-center justify-between text-left hover:border-primary/50 hover:bg-primary/4 active:scale-[0.98] transition-all"
                    data-testid={`select-match-${i}`}
                  >
                    <div>
                      <div className="font-medium text-foreground text-sm">{match.name}</div>
                      <div className="text-xs text-muted-foreground italic mt-0.5">{match.latin}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 rounded-full bg-primary/20 overflow-hidden" style={{ width: 40 }}>
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${match.conf}%` }}
                        />
                      </div>
                      <span className="text-xs text-primary font-medium w-8 text-right">{match.conf}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4 — Fill in details */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col overflow-y-auto pb-28"
            >
              {imagePreview && (
                <div className="w-full aspect-video relative flex-shrink-0">
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                </div>
              )}

              <div className="px-5 -mt-10 relative z-10 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-0.5">Identified as</p>
                  <h2 className="font-serif text-2xl text-foreground leading-tight">{commonName}</h2>
                  <p className="text-sm italic text-muted-foreground">{latinName}</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Nickname", value: nickname, setter: setNickname, testId: "input-nickname", placeholder: "Give it a name..." },
                    { label: "Meaning", value: meaning, setter: setMeaning, testId: "input-meaning", placeholder: "Floriography meaning..." },
                    { label: "Where found", value: locationInput, setter: setLocationInput, testId: "input-location", placeholder: "Dolores Park, Valencia St..." },
                  ].map(({ label, value, setter, testId, placeholder }) => (
                    <div key={testId}>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1.5">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => setter(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-b border-border py-2 text-foreground text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                        data-testid={testId}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1.5">
                      Field Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Write a memory — where you were, what caught your eye..."
                      className="w-full bg-muted/30 border border-border rounded-xl p-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors resize-none min-h-[90px] placeholder:text-muted-foreground/50"
                      data-testid="input-notes"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom CTA — only on step 4 */}
      <AnimatePresence>
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-5 pb-8 pt-4 bg-background/90 backdrop-blur-md border-t border-border/30 z-20"
          >
            <button
              onClick={handleSave}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-serif text-lg shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all"
              data-testid="button-save-flower"
            >
              Press this flower
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
