import { useState, useCallback, useRef, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Edit2, Check, Trash2, Plus, X } from "lucide-react";
import { FlowerIcon } from "@/components/FlowerIcon";
import { BlobFrame } from "@/components/BlobFrame";
import { useGarden } from "@/context/useGarden";
import { getSeasonFromDate } from "@/data/season";
import { uploadFlowerImage } from "@/lib/uploadFlowerImage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EntryCard() {
  const [, params] = useRoute("/flower/:id");
  const [, setLocation] = useLocation();
  const id = params?.id;
  const { flowers, loading, updateFlower, addPhotoToFlower, deleteFlower } = useGarden();

  const currentIndex = flowers.findIndex(f => f.id === id);
  const flower = flowers[currentIndex];
  const prevFlower = currentIndex > 0 ? flowers[currentIndex - 1] : null;
  const nextFlower = currentIndex < flowers.length - 1 ? flowers[currentIndex + 1] : null;

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(flower?.blurb ?? "");
  const [slideDir, setSlideDir] = useState<1 | -1>(1);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedPhotoIndex(0);
  }, [flower?.id]);

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

  if (loading && !flower) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5EFD8' }}>
        <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24" style={{ color: '#c5d07d' }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

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
  const activePhotoIndex = Math.min(selectedPhotoIndex, Math.max(photos.length - 1, 0));
  const activePhoto = photos[activePhotoIndex];
  const hasPhoto = photos.length > 0 && !activePhoto.startsWith('blob:');
  const blobIndex = flower.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const season = getSeasonFromDate(flower.datePressed);
  void season;

  const handleSaveNotes = () => {
    updateFlower(flower.id, { blurb: notes });
    setIsEditingNotes(false);
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadFlowerImage(file);
      if (url) {
        await addPhotoToFlower(flower.id, url);
        setSelectedPhotoIndex(photos.length);
      }
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async (url: string) => {
    const remaining = photos.filter(p => p !== url);
    await updateFlower(flower.id, { imageUrls: remaining });
    setSelectedPhotoIndex((i) => Math.min(i, Math.max(remaining.length - 1, 0)));
  };

  const handleDeleteEntry = async () => {
    await deleteFlower(flower.id);
    const fallback = nextFlower ?? prevFlower;
    setLocation(fallback ? `/flower/${fallback.id}` : "/garden");
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
          <X className="w-5 h-5" />
        </button>

        {/* Position indicator — dots for a handful of entries, a plain counter once the garden grows */}
        {flowers.length > 1 && (
          flowers.length <= 12 ? (
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
          ) : (
            <p
              className="text-xs"
              style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#9A8F7F' }}
            >
              {currentIndex + 1} of {flowers.length}
            </p>
          )
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
            {/* Hero + photo gallery, grouped so the thumbnails sit close to the photo */}
            <div className="mx-auto flex flex-col items-center gap-3" style={{ width: '65%' }}>
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
                      src={activePhoto}
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

              {/* Photo gallery — every photo of this specimen, plus add/remove.
                  Stops the pointer event here so a tap doesn't get read as the
                  card's own left/right swipe-between-flowers gesture. */}
              <div
                className="flex flex-wrap justify-center gap-1.5"
                onPointerDownCapture={(e) => e.stopPropagation()}
              >
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAddPhoto}
                  data-testid="input-add-photo"
                />
                {photos.map((url, i) => (
                  <div key={url} className="relative">
                    <button
                      onClick={() => setSelectedPhotoIndex(i)}
                      className="w-9 h-9 rounded-full overflow-hidden"
                      style={{
                        border: i === activePhotoIndex ? '2px solid #986E5D' : '2px solid transparent',
                      }}
                      data-testid={`button-photo-thumb-${i}`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" draggable={false} />
                    </button>
                    {photos.length > 1 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#3D362D', color: '#F5EFD8' }}
                            data-testid={`button-remove-photo-${i}`}
                          >
                            <X className="w-2 h-2" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove this photo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This can't be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemovePhoto(url)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ border: '2px dashed #D4CBB3', color: '#9A8F7F', opacity: uploadingPhoto ? 0.5 : 1 }}
                  data-testid="button-add-photo"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
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

            {/* Delete — deliberately low-key and at the bottom so it's not an easy misfire */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="flex items-center gap-1.5 text-xs mx-auto"
                  style={{ color: '#B08D80' }}
                  data-testid="button-delete-entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete this flower
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this flower?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This can't be undone. {flower.commonName} and all its photos will be removed from your garden.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteEntry} data-testid="button-confirm-delete">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </main>
        </motion.div>
      </AnimatePresence>

      {/* Add another — same treatment as the garden page's capture button */}
      <button
        onClick={() => setLocation("/capture")}
        className="fixed z-20 flex items-center gap-2.5 h-14 px-5 rounded-full active:scale-95 transition-all"
        style={{
          bottom: '20px',
          right: 'max(16px, calc(50vw - 215px))',
          backgroundColor: '#c5d07d',
          boxShadow: '0 4px 20px rgba(197,208,125,0.55)',
        }}
        data-testid="button-capture-another"
      >
        <FlowerIcon size={22} color="#3D362D" />
        <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '15px', color: '#3D362D', letterSpacing: '0.01em' }}>
          add flower
        </span>
      </button>
    </div>
  );
}
