import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, AlertCircle } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { Flower } from "@/data/types";
import { getNativeStatus } from "@/data/nativeStatus";
import { supabase } from "@/lib/supabase";

type Candidate = { commonName: string; scientificName: string; score: number; family: string };
type Step = 1 | 2 | 3 | 4 | 5;

// 5-petal flower clip — scales to any square size via objectBoundingBox
function FlowerPhoto({ src, size = 96, className = "" }: { src: string; size?: number; className?: string }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0 }} className={className}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="flower-clip-capture" clipPathUnits="objectBoundingBox">
            {/* 5-petal flower path in 0–1 bounding-box space */}
            <path d="M0.394,0.354 C0.48,0.14 0.52,0.14 0.606,0.354 C0.84,0.37 0.85,0.41 0.671,0.556 C0.73,0.78 0.70,0.81 0.5,0.68 C0.30,0.81 0.27,0.78 0.329,0.556 C0.15,0.41 0.16,0.37 0.394,0.354 Z" />
          </clipPath>
        </defs>
      </svg>
      <img
        src={src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          clipPath: 'url(#flower-clip-capture)',
          display: 'block',
        }}
      />
    </div>
  );
}

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
  const { flowers, addFlower, addPhotoToFlower } = useGarden();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFileRef = useRef<File | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileReceived, setFileReceived] = useState(false);

  const [commonName, setCommonName] = useState("");
  const [latinName, setLatinName] = useState("");
  const [nickname, setNickname] = useState("");
  const [meaning, setMeaning] = useState("");
  const [plantFamily, setPlantFamily] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

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
    setFileReceived(true);
    setError(null);
    selectedFileRef.current = file;
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    identifyPhoto(file);
  }

  function handleSelectCandidate(candidate: Candidate) {
    const flori = getFloriography(candidate.commonName || candidate.scientificName);
    setCommonName(candidate.commonName);
    setLatinName(candidate.scientificName);
    setPlantFamily(candidate.family || "");
    setNickname(flori.nickname);
    setMeaning(flori.meaning);
    setStep(4);
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);

    // Upload photo — never fall back to blob URLs (ephemeral)
    let finalImageUrl = "";
    const file = selectedFileRef.current;
    if (file) {
      try {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("flower-images")
          .upload(path, file, { contentType: file.type, upsert: false });

        if (uploadError) {
          console.error("Image upload failed:", uploadError.message);
        } else {
          const { data } = supabase.storage.from("flower-images").getPublicUrl(path);
          finalImageUrl = data.publicUrl;
        }
      } catch (err) {
        console.error("Image processing failed:", err);
      }
    }

    // Check if the same species already exists — if so, just add the photo
    const existing = flowers.find(
      f => f.latinName.toLowerCase() === latinName.toLowerCase()
    );

    try {
      if (existing) {
        if (finalImageUrl) {
          await addPhotoToFlower(existing.id, finalImageUrl);
        }
      } else {
        const newFlower: Flower = {
          id: `f${Date.now()}`,
          commonName,
          latinName,
          nickname,
          meaning,
          blurb: notes,
          color: "unknown",
          datePressed: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          plantFamily,
          nativeStatus: getNativeStatus(latinName),
          imageUrl: finalImageUrl,
          imageUrls: finalImageUrl ? [finalImageUrl] : [],
        };
        await addFlower(newFlower);
      }

      // Show "Painting your specimen" step while illustration generates in background
      setSaving(false);
      setStep(5);

      // Fire-and-forget illustration generation (cached by latin name)
      fetch("/api/illustrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latinName, commonName }),
      }).catch(() => {});

      // Navigate after 2.5 s — illustration will be ready soon
      setTimeout(() => {
        if (existing) {
          setLocation(`/flower/${existing.id}`);
        } else {
          setLocation("/");
        }
      }, 2500);
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="bg-background flex flex-col" style={{ minHeight: "100dvh" }}>
      {/* Hidden file input — triggered via label for maximum iOS compatibility */}
      <input
        id="flower-photo-input"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
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
                <div className="w-full bg-destructive/15 border-2 border-destructive/40 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                    <p className="text-destructive font-medium text-sm">Couldn't identify this photo</p>
                  </div>
                  <p className="text-destructive/80 text-xs pl-7">{error}</p>
                  <button
                    className="ml-7 mt-1 text-xs text-primary underline underline-offset-2 text-left"
                    onClick={() => { setError(null); setStep(4); }}
                  >
                    Enter the name manually instead →
                  </button>
                </div>
              )}

              <label
                htmlFor="flower-photo-input"
                className={`w-full aspect-[3/4] max-h-[52vh] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer active:scale-[0.98] ${
                  fileReceived
                    ? "border-primary/60 bg-primary/10"
                    : "border-primary/25 bg-primary/[0.04] hover:bg-primary/[0.08]"
                }`}
                data-testid="upload-area"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {fileReceived
                    ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><Camera className="w-7 h-7" /></motion.div>
                    : <Camera className="w-7 h-7" />
                  }
                </div>
                <div className="text-center px-4">
                  <p className="text-primary font-medium">
                    {fileReceived ? "Got it, identifying…" : "Tap to choose a photo"}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">Camera · Photo Library · Files</p>
                </div>
              </label>

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
                <div className="flex justify-center mb-5">
                  <div style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.22))' }}>
                    <FlowerPhoto src={imagePreview} size={112} />
                  </div>
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
                <div className="flex justify-center pt-8 pb-4" style={{ backgroundColor: 'rgba(245,239,216,0.6)' }}>
                  <div style={{ filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.28))' }}>
                    <FlowerPhoto src={imagePreview} size={180} />
                  </div>
                </div>
              )}

              <div className="px-5 pt-2 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-0.5">Identified as</p>
                  <h2 className="font-serif text-2xl text-foreground leading-tight">{commonName}</h2>
                  <p className="text-sm italic text-muted-foreground">{latinName}</p>
                </div>

                <div className="space-y-4">
                  {([
                    { label: "Nickname", value: nickname, setter: setNickname, testId: "input-nickname", placeholder: "Give it a name..." },
                    { label: "Meaning", value: meaning, setter: setMeaning, testId: "input-meaning", placeholder: "Floriography meaning..." },
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

          {/* Step 5 — Painting your specimen */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center px-6 gap-6 relative"
              style={{ backgroundColor: '#F5EFD8' }}
            >
              {imagePreview && (
                <div className="absolute inset-0 z-0">
                  <img src={imagePreview} alt="" className="w-full h-full object-cover opacity-10 blur-2xl scale-110" style={{ mixBlendMode: 'multiply' }} />
                </div>
              )}
              <div className="z-10 flex flex-col items-center text-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(152,110,93,0.12)' }}
                >
                  <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14" style={{ color: '#986E5D' }}>
                    <ellipse cx="32" cy="22" rx="10" ry="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="32" y1="40" x2="32" y2="60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <ellipse cx="20" cy="34" rx="7" ry="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" transform="rotate(-30 20 34)" />
                    <ellipse cx="44" cy="34" rx="7" ry="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" transform="rotate(30 44 34)" />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-2xl mb-1" style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#3D362D' }}>
                    Painting your specimen…
                  </h3>
                  <p className="text-sm" style={{ color: '#9A8F7F' }}>
                    Your botanical illustration is being created
                  </p>
                </div>
                <p className="text-xs" style={{ color: '#C4BBA5', fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
                  {commonName} · {latinName}
                </p>
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
