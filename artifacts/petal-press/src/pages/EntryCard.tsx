import { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Edit2, Check, Camera, Flower2 } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { getSeasonFromDate, SEASON_MONTH_INDICES, ALL_MONTHS_SHORT } from "@/data/season";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

function illustrationUrl(latinName: string): string {
  const slug = latinName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${SUPABASE_URL}/storage/v1/object/public/flower-images/illustrations/v2/${slug}.png`;
}

export default function EntryCard() {
  const [, params] = useRoute("/flower/:id");
  const id = params?.id;
  const { flowers, updateFlower } = useGarden();
  const flower = flowers.find(f => f.id === id);

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(flower?.blurb ?? "");
  const [illError, setIllError] = useState(false);

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
        <Link href="/">
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
  const bloomMonths = SEASON_MONTH_INDICES[season] ?? [];
  const illUrl = illustrationUrl(flower.latinName);
  const photos = flower.imageUrls?.length ? flower.imageUrls : flower.imageUrl ? [flower.imageUrl] : [];
  const hasPhoto = photos.length > 0 && !photos[0].startsWith('blob:');

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
        <Link href="/">
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

      <main className="px-5 pt-5 flex flex-col gap-5">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="relative w-full"
            style={{
              padding: '12px',
              backgroundColor: '#FCFBF7',
              border: '1px solid #E8DCC0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.07), inset 0 0 20px rgba(139,115,85,0.04)',
            }}
          >
            {/* Washi tape */}
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-12 h-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.6)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            />

            {/* Main image — photo if available, illustration fallback */}
            <div
              style={{
                height: '260px',
                border: '1px solid #E8DCC0',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: hasPhoto ? '#1a1a1a' : '#FAF7EF',
              }}
            >
              {hasPhoto ? (
                <img
                  src={photos[0]}
                  alt={flower.commonName}
                  className="w-full h-full object-cover"
                />
              ) : !illError ? (
                <img
                  src={illUrl}
                  alt={flower.commonName}
                  className="w-full h-full object-contain"
                  style={{ mixBlendMode: 'multiply', opacity: 0.92 }}
                  onError={() => setIllError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Flower2 className="w-20 h-20 opacity-20" style={{ color: '#9A8F7F' }} />
                </div>
              )}

              {/* Illustration sticker — bottom-right corner, only when photo is showing */}
              {hasPhoto && !illError && (
                <div
                  className="absolute bottom-3 right-3"
                  style={{ transform: 'rotate(3deg)' }}
                >
                  <div
                    style={{
                      width: '88px',
                      height: '88px',
                      backgroundColor: '#FCFBF7',
                      border: '3px solid #FCFBF7',
                      boxShadow: '0 3px 12px rgba(0,0,0,0.25)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={illUrl}
                      alt="illustration"
                      className="w-full h-full object-contain"
                      style={{ mixBlendMode: 'multiply', opacity: 0.95 }}
                      onError={() => setIllError(true)}
                    />
                  </div>
                </div>
              )}

              {/* Museum number watermark */}
              <p
                className="absolute bottom-2 left-3 text-sm pointer-events-none"
                style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', color: hasPhoto ? 'rgba(255,255,255,0.4)' : '#D4CBB3' }}
              >
                {flower.latinName.split(' ')[0].charAt(0)}. {flower.latinName.split(' ')[1]}
              </p>
            </div>

            {/* Label row */}
            <div className="mt-2 flex justify-between items-center px-0.5">
              <p className="text-xs uppercase tracking-widest" style={{ color: '#C4BBA5' }}>
                {hasPhoto ? 'Your photo' : 'Illustration'}
              </p>
              {hasPhoto && !illError && (
                <p className="text-xs uppercase tracking-widest" style={{ color: '#C4BBA5' }}>
                  Illustration ↘
                </p>
              )}
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
          <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '14px', color: '#736959' }}>
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
          <p style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '16px', color: '#986E5D' }}>
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
            <p className="text-sm" style={{ color: '#5C5346' }}>{flower.datePressed}</p>
          </div>
          {flower.plantFamily && (
            <div>
              <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#9A8F7F' }}>Family</p>
              <p className="text-sm" style={{ color: '#5C5346' }}>{flower.plantFamily}</p>
            </div>
          )}
        </motion.div>

        {/* Season row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#9A8F7F' }}>In Bloom</p>
          <div className="flex gap-1.5">
            {ALL_MONTHS_SHORT.map((m, i) => {
              const active = bloomMonths.includes(i);
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className="uppercase"
                    style={{ fontSize: '8px', color: active ? '#986E5D' : '#C4BBA5' }}
                  >
                    {m}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: active ? '#986E5D' : '#E8DCC0' }}
                  />
                </div>
              );
            })}
          </div>
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
