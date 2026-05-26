import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Edit2, Check, Camera } from "lucide-react";
import { FlowerIcon } from "@/components/FlowerIcon";
import { BlobFrame } from "@/components/BlobFrame";
import { useGarden } from "@/context/GardenContext";
import { getSeasonFromDate } from "@/data/season";

export default function EntryCard() {
  const [, params] = useRoute("/flower/:id");
  const id = params?.id;
  const { flowers, updateFlower } = useGarden();
  const flower = flowers.find(f => f.id === id);

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(flower?.blurb ?? "");
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
        <Link href="/garden">
          <button
            className="text-sm underline underline-offset-2"
            style={{ color: '#986E5D' }}
            data-testid="button-back-home"
          >
            Return to Petal Press
          </button>
        </Link>
      </div>
    );
  }

  const season = getSeasonFromDate(flower.datePressed);
  const photos = flower.imageUrls?.length ? flower.imageUrls : flower.imageUrl ? [flower.imageUrl] : [];
  const hasPhoto = photos.length > 0 && !photos[0].startsWith('blob:');
  // Consistent blob shape per flower derived from its id
  const blobIndex = flower.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  const handleSaveNotes = () => {
    updateFlower(flower.id, { blurb: notes });
    setIsEditingNotes(false);
  };

  return (
    <div className="min-h-screen pb-20 overflow-y-auto" style={{ backgroundColor: '#F5EFD8' }}>
      <div
        className="px-4 pt-10 pb-3 flex items-center justify-between sticky top-0 z-10"
        style={{
          backgroundColor: 'rgba(245,239,216,0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #E8DCC0',
        }}
      >
        <Link href="/garden">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ color: '#9A8F7F' }}
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </Link>
        <span
          className="text-xs tracking-widest"
          style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: '#9A8F7F' }}
        >
          Petal Press
        </span>
        <div className="w-9" />
      </div>

      <main className="px-5 pt-5 pb-12 flex flex-col gap-7">
        {/* Hero — blob-shaped photo/illustration */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FlowerIcon size={80} color="#9A8F7F" style={{ opacity: 0.2 }} />
                </div>
              )}

            </BlobFrame>
          </div>
          </div>
        </motion.div>

        {/* Name block */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center"
        >
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
        </motion.div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#E8DCC0' }} />

        {/* Floriography */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.08 }}
        >
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#9A8F7F' }}>
            Language of Flowers
          </p>
          <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '20px', color: '#986E5D' }}>
            {flower.meaning}
          </p>
        </motion.div>

        {/* Found info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-6"
        >
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
        </motion.div>

        {/* Field notes */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
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
        </motion.div>
      </main>
    </div>
  );
}
