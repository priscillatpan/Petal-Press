import { motion } from "framer-motion";
import { Link } from "wouter";
import { FlowerIcon } from "@/components/FlowerIcon";

export default function Onboarding() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: '#F5EFD8' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="text-7xl mb-7 select-none" style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.08))' }}>
          🌸
        </div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', color: '#3D362D', marginBottom: '12px', lineHeight: 1.2 }}>
          Welcome to Petal Press
        </h1>
        <p style={{ fontSize: '15px', color: '#9A8F7F', lineHeight: 1.65, maxWidth: '260px', marginBottom: '36px' }}>
          Your garden is empty. Press your first flower to start your collection.
        </p>
        <Link href="/capture">
          <button
            className="flex items-center gap-2.5 h-14 px-7 rounded-full active:scale-95 transition-transform"
            style={{ backgroundColor: '#c5d07d', boxShadow: '0 4px 20px rgba(197,208,125,0.55)' }}
          >
            <FlowerIcon size={22} color="#3D362D" />
            <span style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: '16px', color: '#3D362D' }}>
              add your first flower
            </span>
          </button>
        </Link>
        <Link href="/garden">
          <button
            className="mt-5"
            style={{ fontSize: '12px', color: '#B8AFA0', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.03em' }}
          >
            go to my garden
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
