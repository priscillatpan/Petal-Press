import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, AlertCircle } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { Flower } from "@/data/types";
import { supabase } from "@/lib/supabase";

type Candidate = { commonName: string; scientificName: string; score: number; family: string };
type Step = 1 | 2 | 3 | 4;

const FLORIOGRAPHY: Record<string, { meaning: string; nickname: string }> = {
  default: { meaning: "beauty, wonder", nickname: "Found Beauty" },
  rose: { meaning: "love, passion, beauty", nickname: "Heart's Bloom" },
  tulip: { meaning: "perfect love, elegance", nickname: "Spring's Promise" },
  daisy: { meaning: "innocence, purity, new beginnings", nickname: "Little Sunshine" },
  lavender: { meaning: "devotion, serenity, grace", nickname: "Purple Peace" },
  poppy: { meaning: "rest, sleep, imagination", nickname: "Golden Hour" },
  jasmine: { meaning: "grace, elegance, attachment", nickname: "Night Perfume" },
  hydrangea: { meaning: "heartfelt emotion, gratitude, understanding", nickname: "Mrs. Weatherglass" },
  forget: { meaning: "remembrance, true love", nickname: "Little Blue Reminder" },
  sunflower: { meaning: "adoration, loyalty, longevity", nickname: "Sun Chaser" },
  violet: { meaning: "faithfulness, humility, modesty", nickname: "Shy Gem" },
  lily: { meaning: "purity, refined beauty, rebirth", nickname: "White Whisper" },
  orchid: { meaning: "rare beauty, strength, love", nickname: "Exotic Heart" },
  camellia: { meaning: "admiration, perfection, gratitude", nickname: "Quiet Grace" },
  magnolia: { meaning: "dignity, nobility, perseverance", nickname: "Ancient Glory" },
};

function getFloriography(name: string) {
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(FLORIOGRAPHY)) {
    if (lower.includes(key)) return val;
  }
  return FLORIOGRAPHY.default;
}

export default function CaptureFlow() {
  const [, setLocation] = useLocation();
  const { addFlower } = useGarden();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFileRef = useRef<File | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [commonName, setCommonName] = useState("");
  const [latinName, setLatinName] = useState("");
  const [nickname, setNickname] = useState("");
  const [meaning, setMeaning] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [notes, setNotes] = useState("");

  const identifyPhoto = useCallback(async (file: File) => {
    setStep(2);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/identify", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error || `Server error ${res.status}`);
      }

      const data = await res.json() as { results: Candidate[] };
      setCandidates(data.results || []);
      setStep(3);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Identification failed";
      setError(msg);
      setStep(1);
    }
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    selectedFileRef.current = file;
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    identifyPhoto(file);
    // Reset input so same file can be picked again
    e.target.value = "";
  }

  function handlePickPhoto() {
    fileInputRef.current?.click();
  }

  function handleSelectCandidate(candidate: Candidate) {
    const flori = getFloriography(candidate.commonName || candidate.scientificName);
    setCommonName(candidate.commonName);
    setLatinName(candidate.scientificName);
    setNickname(flori.nickname);
    setMeaning(flori.meaning);
    setStep(4);
  }

  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (saving) return;
    setSaving(true);

    let finalImageUrl = imagePreview ?? "";

    const file = selectedFileRef.current;
    if (file) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("flower-images")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (!uploadError) {
        const { data } = supabase.storage.from("flower-images").getPublicUrl(path);
        finalImageUrl = data.publicUrl;
      }
    }

    const newFlower: Flower = {
      id: `f${Date.now()}`,
      commonName,
      latinName,
      nickname,
      meaning,
      blurb: notes,
      color: "unknown",
      datePressed: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      location: locationInput || "Unknown location",
      spottedCount: 1,
      imageUrl: finalImageUrl,
      inBouquet: false,
    };

    try {
      await addFlower(newFlower);
      setLocation("/");
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="bg-background flex flex-col" style={{ minHeight: "100dvh" }}>
      {/*
        iOS fix: do NOT use capture="environment" — that forces the camera
        and disables the photo library picker on iOS Safari.
        accept="image/*" alone opens the full iOS sheet (Camera / Photo Library / Files).
      */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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

      {/* Step progress */}
      <div className="flex gap-1.5 px-6 pt-4">
        {[1, 2, 3, 4].map(s => (
          <div
            key={s}
            className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${step >= s ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">

          {/* Step 1 — Pick photo */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="flex-1 flex flex-col items-center justify-center px-6 gap-5"
            >
              <div className="text-center">
                <h2 className="font-serif text-2xl text-foreground mb-1">What did you find?</h2>
                <p className="text-muted-foreground text-sm">Choose a photo from your walk</p>
              </div>

              {error && (
                <div className="w-full bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handlePickPhoto}
                className="w-full aspect-[3/4] max-h-[52vh] border-2 border-dashed border-primary/25 rounded-3xl flex flex-col items-center justify-center gap-4 bg-primary/[0.04] hover:bg-primary/[0.08] active:scale-[0.98] transition-all"
                data-testid="upload-area"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Camera className="w-7 h-7" />
                </div>
                <div className="text-center px-4">
                  <p className="text-primary font-medium">Tap to choose a photo</p>
                  <p className="text-muted-foreground text-sm mt-1">Camera · Photo Library · Files</p>
                </div>
              </button>

              <p className="text-muted-foreground/60 text-xs text-center max-w-[240px]">
                We'll send it to Pl@ntNet to identify the species automatically.
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
              <div className="z-10 flex flex-col items-center text-center gap-5">
                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  >
                    <svg viewBox="0 0 32 32" className="w-10 h-10 text-primary" fill="currentColor">
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
                <div>
                  <h3 className="font-serif text-2xl text-foreground mb-1">Identifying...</h3>
                  <p className="text-muted-foreground text-sm">Consulting the floriography archives</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Results from Pl@ntNet */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col px-5 pt-6 pb-8 overflow-y-auto"
            >
              {imagePreview && (
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto mb-5 shadow-md ring-2 ring-background">
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}

              <h3 className="font-serif text-xl text-center text-foreground mb-1">We think this might be…</h3>
              <p className="text-muted-foreground text-xs text-center mb-5">Tap to confirm, or pick a different match</p>

              <div className="space-y-3">
                {candidates.map((match, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectCandidate(match)}
                    className="w-full bg-card border border-border p-4 rounded-2xl flex items-center justify-between text-left hover:border-primary/50 hover:bg-primary/[0.04] active:scale-[0.98] transition-all"
                    data-testid={`select-match-${i}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className={`font-serif text-foreground ${i === 0 ? "text-lg" : "text-sm"}`}>
                        {match.commonName}
                      </div>
                      <div className="text-xs text-muted-foreground italic mt-0.5 truncate">{match.scientificName}</div>
                      {match.family && (
                        <div className="text-[10px] text-muted-foreground/50 mt-0.5">{match.family} family</div>
                      )}
                    </div>
                    {i === 0 && (
                      <div className="shrink-0 ml-3 text-[10px] font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Best match
                      </div>
                    )}
                  </button>
                ))}

                {candidates.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">No strong matches found.</p>
                    <button
                      onClick={() => setStep(1)}
                      className="mt-3 text-primary text-sm underline underline-offset-2"
                    >
                      Try a different photo
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4 — Confirm & save */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col overflow-y-auto pb-32"
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
                  {([
                    { label: "Nickname", value: nickname, setter: setNickname, testId: "input-nickname", placeholder: "Give it a name..." },
                    { label: "Meaning", value: meaning, setter: setMeaning, testId: "input-meaning", placeholder: "Floriography meaning..." },
                    { label: "Where found", value: locationInput, setter: setLocationInput, testId: "input-location", placeholder: "Dolores Park, Valencia St..." },
                  ] as const).map(({ label, value, setter, testId, placeholder }) => (
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

      {/* Save button — step 4 only */}
      <AnimatePresence>
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 px-5 pb-8 pt-4 bg-background/90 backdrop-blur-md border-t border-border/30 z-20"
            style={{
              left: "max(0px, calc(50vw - 215px))",
              right: "max(0px, calc(50vw - 215px))",
            }}
          >
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-serif text-lg shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              data-testid="button-save-flower"
            >
              {saving ? "Pressing…" : "Press this flower"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
