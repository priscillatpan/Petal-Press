import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, AlertCircle } from "lucide-react";
import { FlowerIcon } from "@/components/FlowerIcon";
import { BlobFrame } from "@/components/BlobFrame";
import { useGarden } from "@/context/useGarden";
import { Flower } from "@/data/types";
import { getNativeStatus } from "@/data/nativeStatus";
import { supabase } from "@/lib/supabase";
import { lookupFloriography } from "@/data/floriography";

type Candidate = { commonName: string; scientificName: string; score: number; family: string };
type Step = 1 | 2 | 3 | 4;

// Shared SVG defs — rendered once, reused by id
function FlowerDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
      <defs>
        {/* 5 rounded circles — matches the daisy icon shape, objectBoundingBox so it scales */}
        <clipPath id="flower-clip-photo" clipPathUnits="objectBoundingBox">
          <circle cx="0.50" cy="0.31" r="0.23" />
          <circle cx="0.68" cy="0.44" r="0.23" />
          <circle cx="0.61" cy="0.65" r="0.23" />
          <circle cx="0.39" cy="0.65" r="0.23" />
          <circle cx="0.32" cy="0.44" r="0.23" />
        </clipPath>
      </defs>
    </svg>
  );
}


function FlowerVideo({ videoRef, size = 240 }: { videoRef: React.RefObject<HTMLVideoElement | null>; size?: number }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0, position: 'relative' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          clipPath: 'url(#flower-clip-photo)',
          display: 'block',
        }}
      />
    </div>
  );
}



export default function CaptureFlow() {
  const [, setLocation] = useLocation();
  const { flowers, addFlower, addPhotoToFlower } = useGarden();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFileRef = useRef<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileReceived, setFileReceived] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraFailed, setCameraFailed] = useState(false);

  const [commonName, setCommonName] = useState("");
  const [latinName, setLatinName] = useState("");
  const [nickname, setNickname] = useState("");
  const [meaning, setMeaning] = useState("");
  const [plantFamily, setPlantFamily] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Start rear camera on mount; stop when leaving step 1 or unmounting
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraFailed(true);
      return;
    }
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 1280 } } })
      .then(stream => {
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      })
      .catch(() => { if (active) setCameraFailed(true); });
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, []);

  // Stop camera the moment we leave step 1
  useEffect(() => {
    if (step !== 1) {
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      setCameraReady(false);
    }
  }, [step]);

  function captureFromCamera() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    const side = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = side;
    canvas.height = side;
    // Force sRGB so iOS P3 camera frames are correctly tone-mapped before JPEG export.
    // Without this, P3 values get stripped of their color profile and appear overexposed.
    const ctx = canvas.getContext("2d", { colorSpace: "srgb" })!;
    const ox = (video.videoWidth - side) / 2;
    const oy = (video.videoHeight - side) / 2;
    ctx.drawImage(video, ox, oy, side, side, 0, 0, side, side);
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
      selectedFileRef.current = file;
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setFileReceived(true);
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      identifyPhoto(file);
    }, "image/jpeg", 0.92);
  }

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
    const flori = lookupFloriography(candidate.commonName, candidate.scientificName);
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

      setSaving(false);
      if (existing) {
        setLocation(`/flower/${existing.id}`);
      } else {
        setLocation("/garden");
      }
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="bg-background flex flex-col" style={{ minHeight: "100dvh" }}>
      {/* Shared flower clip-path definitions — used by FlowerPhoto and FlowerVideo */}
      <FlowerDefs />

      {/* Camera input — opens rear camera directly */}
      <input
        id="flower-photo-input"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleFileChange}
        data-testid="input-file"
      />
      {/* Library input — no capture attribute, opens photo picker */}
      <input
        id="flower-library-input"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />

      {/* Topbar */}
      <div className="p-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b border-border/30">
        <button
          onClick={() => setLocation("/garden")}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/70 transition-colors"
          data-testid="button-cancel-capture"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="font-sans text-sm font-medium text-foreground">Press a Flower</span>
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

          {/* Step 1 — Camera viewfinder (or file picker fallback) */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="flex-1 flex flex-col items-center justify-center px-6 gap-6"
            >
              <div className="text-center">
                <h2 className="font-serif text-2xl text-foreground mb-1">
                  {cameraFailed ? "What did you find?" : "Press a flower"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {cameraFailed ? "Choose a photo from your walk" : "point at a flower · hold steady · capture"}
                </p>
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

              {/* Live camera viewfinder through flower cutout */}
              {!cameraFailed && (
                <div className="flex flex-col items-center gap-5">
                  {/* Flower-shaped viewfinder */}
                  <div
                    style={{ width: 360, height: 360, position: 'relative' }}
                    data-testid="upload-area"
                  >
                    {/* Loading shimmer while camera warms up */}
                    {!cameraReady && (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          clipPath: 'url(#flower-clip-photo)',
                          backgroundColor: '#EDE5CC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <motion.div
                          animate={{ opacity: [0.4, 0.9, 0.4] }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                        >
                          <FlowerIcon size={96} color="#C4B8A0" />
                        </motion.div>
                      </div>
                    )}
                    <FlowerVideo videoRef={videoRef} size={360} />
                  </div>

                  {/* Capture shutter button */}
                  {cameraReady && (
                    <button
                      onClick={captureFromCamera}
                      className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                      style={{
                        backgroundColor: '#c5d07d',
                        boxShadow: '0 0 0 4px #FAF7EF, 0 0 0 6px #c5d07d',
                      }}
                      aria-label="Capture photo"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20" />
                    </button>
                  )}

                  {/* Escape hatch: choose from library */}
                  <label
                    htmlFor="flower-library-input"
                    className="text-sm text-muted-foreground underline underline-offset-2 cursor-pointer active:opacity-60"
                  >
                    or choose from library
                  </label>
                </div>
              )}

              {/* Fallback: file picker (no camera access) */}
              {cameraFailed && (
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
              )}

              {cameraFailed && (
                <p className="text-muted-foreground/60 text-xs text-center max-w-[240px]">
                  We'll send it to Pl@ntNet to identify the species automatically.
                </p>
              )}
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
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  >
                    <FlowerIcon size={40} color="hsl(var(--primary))" />
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
                  <div style={{ width: '42%' }}>
                    <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                      <BlobFrame
                        blobIndex={0}
                        className="absolute inset-0"
                        style={{ backgroundColor: '#1a1a1a', boxShadow: '0 4px 18px rgba(0,0,0,0.18)' }}
                      >
                        <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                      </BlobFrame>
                    </div>
                  </div>
                </div>
              )}

              <h3 className="font-serif text-xl text-center text-foreground mb-1">We think this might be…</h3>
              <p className="text-xs text-center mb-5" style={{ color: '#9A8F7F' }}>Tap to confirm, or pick a different match</p>

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
              {/* Hero blob — mirrors EntryCard layout */}
              {imagePreview && (
                <div className="px-5 pt-6 pb-1" style={{ backgroundColor: 'rgba(245,239,216,0.55)' }}>
                  <div className="mx-auto" style={{ width: '65%' }}>
                    <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                      <BlobFrame
                        blobIndex={0}
                        className="absolute inset-0"
                        style={{ backgroundColor: '#1a1a1a', boxShadow: '0 6px 28px rgba(0,0,0,0.13)' }}
                      >
                        <img src={imagePreview} alt={commonName} className="w-full h-full object-cover" />
                      </BlobFrame>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-5 pt-5 space-y-5">
                {/* Name block — matches EntryCard */}
                <div>
                  <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#9A8F7F' }}>Identified as</p>
                  <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#2C2721', lineHeight: 1.15 }}>{commonName}</h2>
                  <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '15px', color: '#736959' }}>{latinName}</p>
                </div>

                <div className="space-y-4">
                  {([
                    { label: "Nickname", value: nickname, setter: setNickname, testId: "input-nickname", placeholder: "Give it a name…" },
                    { label: "Meaning", value: meaning, setter: setMeaning, testId: "input-meaning", placeholder: "Floriography meaning…" },
                  ] as const).map(({ label, value, setter, testId, placeholder }) => (
                    <div key={testId}>
                      <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: '#9A8F7F' }}>
                        {label}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => setter(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-b py-2 text-sm focus:outline-none transition-colors placeholder:text-muted-foreground/40"
                        style={{ borderColor: '#E8DCC0', color: '#2C2721' }}
                        data-testid={testId}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: '#9A8F7F' }}>
                      Field Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Write a memory — where you were, what caught your eye…"
                      className="w-full resize-none focus:outline-none text-sm leading-relaxed placeholder:text-muted-foreground/40"
                      style={{
                        fontFamily: 'Fraunces, serif',
                        fontStyle: 'italic',
                        color: '#5C5346',
                        backgroundColor: '#FCFBF7',
                        border: '1px solid #E8DCC0',
                        borderRadius: '8px',
                        padding: '12px',
                        minHeight: '90px',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
                      }}
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
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-sans text-base font-medium tracking-wide shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
