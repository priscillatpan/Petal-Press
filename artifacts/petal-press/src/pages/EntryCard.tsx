import { useState, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Edit2, Check } from "lucide-react";
import { FlowerIcon } from "@/components/FlowerIcon";
import { BlobFrame } from "@/components/BlobFrame";
import { useGarden } from "@/context/useGarden";
import { getSeasonFromDate } from "@/data/season";

export default function EntryCard() {
  const [, params] = useRoute("/flower/:id");
  const [, setLocation] = useLocation();
  const id = params?.id;
  const { flowers, updateFlower } = useGarden();

  const currentIndex = flowers.findIndex(f => f.id === id);
  const flower = flowers[currentIndex];
  const prevFlower = currentIndex > 0 ? flowers[currentIndex - 1] : null;
  const nextFlower = currentIndex < flowers.length - 1 ? flowers[currentIndex + 1] : null;

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(flower?.blurb ?? "");
  const [slideDir, setSlideDir] = useState<1 | -1>(1);

  const goToPrev = useCallback(() => {
    if (!prevFlower) return;
    setSlideDir(-1);
    setNotes(prevFlower.blurb ?? "");
    setIsEditingNotes(false);
    setLocation(`/flower/${prevFlower.id}`);
  }, [prevFlower, setLocation]);

  const goToNext = useCallback(() => {
    if (!nextFlower) return;
    setSlideDir(1);
    setNotes(nextFlower.blurb ?? "");
    setIsEditingNotes(false);
    setLocation(`/flower/${nextFlower.id}`);
  }, [nextFlower, setLocation]);

  if (!flower) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ backgroundColor: '#F5EFD8' }}
      >
        <h2
          className="text-2xl mb-4"
          style={{ fontFamily: 'Fraunces, serif', color: '#3D362D' }}
        >
          Specimen not found
        </h2>
        <button
          onClick={() => setLocation("/garden")}
          className="text-sm underline underline-offset-2"
          style={{ color: '#986E5D' }}
          data-testid="button-back-home"
        >
          Return to Petal Press
        </button>
      </div>
    );
  }

  const photos = flower.imageUrls?.length ? flower.imageUrls : flower.imageUrl ? [flower.imageUrl] : [];
  const hasPhoto = photos.length > 0 && !photos[0].startsWith('blob:');
  const blobIndex = flower.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const season = getSeasonFromDate(flower.datePressed);
  void season;

  const handleSaveNotes = () => {
    updateFlower(flower.id, { blurb: notes });
    setIsEditingNotes(false);
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    // Swipe left → go to next; swipe right → go to prev
    if ((offset.x < -60 || velocity.x < -400) && nextFlower) {
      goToNext();
    } else if ((offset.x > 60 || velocity.x > 400) && prevFlower) {
      goToPrev();
    }
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#F5EFD8' }}>
      {/* Topbar */}
      <div
        className="px-4 pt-10 pb-3 flex items-center justify-between sticky top-0 z-10"
        style={{
          backgroundColor: 'rgba(245,239,216,0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #E8DCC0',
        }}
      >
        <button
          onClick={() => setLocation("/garden")}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ color: '#9A8F7F' }}
          data-testid="button-back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        {flowers.length > 1 && (
          <div className="flex items-center gap-1.5">
            {flowers.map((f, i) => (
              <button
                key={f.id}
                onClick={() => {
                  if (i === currentIndex) return;
                  setSlideDir(i > currentIndex ? 1 : -1);
                  setNotes(flowers[i].blurb ?? "");
                  setIsEditingNotes(false);
                  setLocation(`/flower/${f.id}`);
                }}
                style={{
                  width: i === currentIndex ? 16 : 5,
                  height: 5,
                  borderRadius: 999,
                  backgroundColor: i === currentIndex ? '#986E5D' : '#D4CBB3',
                  transition: 'width 0.25s ease, background-color 0.25s ease',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        )}

        <div className="w-9" />
      </div>

      {/* Swipeable card content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={flower.id}
          initial={{ x: slideDir * 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: slideDir * -60, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: nextFlower ? 0.15 : 0.04, right: prevFlower ? 0.15 : 0.04 }}
          onDragEnd={handleDragEnd}
          className="pb-20 overflow-y-auto cursor-grab active:cursor-grabbing"
          style={{ minHeight: 'calc(100dvh - 73px)', touchAction: 'pan-y' }}
        >
          <main className="px-5 pt-5 pb-12 flex flex-col gap-7">
            {/* Hero */}
            <div className="mx-auto" style={{ width: '65%' }}>
              <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                <BlobFrame
                  blobIndex={blobIndex}
                  className="absolute inset-0"
                  style={{
                    backgroundColor: hasPhoto ? '#1a1a1a' : '#FAF7EF',
                    boxShadow: '0 6px 28px rgba(0,0,0,0.13)',
                  }}
                >
                  {hasPhoto ? (
                    <img
                      src={photos[0]}
                      alt={flower.commonName}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FlowerIcon size={80} color="#9A8F7F" style={{ opacity: 0.2 }} />
                    </div>
                  )}
                </BlobFrame>
              </div>
            </div>

            {/* Prev / Next arrows */}
            {(prevFlower || nextFlower) && (
              <div className="flex items-center justify-between -mt-2">
                <button
                  onClick={goToPrev}
                  disabled={!prevFlower}
                  className="flex items-center gap-1 text-xs"
                  style={{
                    color: prevFlower ? '#9A8F7F' : 'transparent',
                    pointerEvents: prevFlower ? 'auto' : 'none',
                  }}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
                    {prevFlower?.commonName}
                  </span>
                </button>
                <button
                  onClick={goToNext}
                  disabled={!nextFlower}
                  className="flex items-center gap-1 text-xs"
                  style={{
                    color: nextFlower ? '#9A8F7F' : 'transparent',
                    pointerEvents: nextFlower ? 'auto' : 'none',
                  }}
                >
                  <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
                    {nextFlower?.commonName}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Name block */}
            <div className="text-center">
              <h1
                className="leading-tight mb-1"
                style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', color: '#2C2721' }}
              >
                {flower.commonName}
              </h1>
              <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '15px', color: '#736959' }}>
                {flower.latinName}
              </p>
              {flower.nickname && (
                <p className="mt-1.5 text-xs tracking-widest uppercase" style={{ color: '#986E5D' }}>
                  "{flower.nickname}"
                </p>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#E8DCC0' }} />

            {/* Floriography */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#9A8F7F' }}>
                Language of Flowers
              </p>
              <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '20px', color: '#986E5D' }}>
                {flower.meaning}
              </p>
            </div>

            {/* Found info */}
            <div className="flex gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#9A8F7F' }}>Pressed</p>
                <p style={{ fontSize: '14px', color: '#5C5346' }}>{flower.datePressed}</p>
              </div>
              {flower.plantFamily && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#9A8F7F' }}>Family</p>
                  <p style={{ fontSize: '14px', color: '#5C5346' }}>{flower.plantFamily}</p>
                </div>
              )}
            </div>

            {/* Field notes */}
            <div
              className="rounded"
              style={{
                backgroundColor: '#FCFBF7',
                border: '1px solid #E8DCC0',
                padding: '16px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs uppercase tracking-widest" style={{ color: '#9A8F7F' }}>
                  Field Notes
                </p>
                {!isEditingNotes ? (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    style={{ color: '#9A8F7F' }}
                    data-testid="button-edit-notes"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSaveNotes}
                    style={{ color: '#986E5D' }}
                    data-testid="button-save-notes"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <textarea
                  className="w-full bg-transparent resize-none focus:outline-none text-sm"
                  style={{
                    fontFamily: 'Fraunces, serif',
                    fontStyle: 'italic',
                    color: '#5C5346',
                    minHeight: '80px',
                    borderBottom: '1px solid #D4CBB3',
                  }}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  autoFocus
                  data-testid="input-notes"
                />
              ) : (
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#5C5346' }}
                >
                  {flower.blurb || "No notes yet."}
                </p>
              )}
            </div>
          </main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
