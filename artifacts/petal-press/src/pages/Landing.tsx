import { Link } from "wouter";
import { motion } from "framer-motion";
import { FlowerIcon } from "@/components/FlowerIcon";

const BLOBS = [
  "M 0.488,0.026 C 0.593,0.030 0.711,0.114 0.792,0.192 C 0.874,0.270 0.977,0.394 0.978,0.496 C 0.979,0.599 0.881,0.727 0.799,0.807 C 0.718,0.887 0.594,0.974 0.488,0.976 C 0.382,0.978 0.230,0.901 0.163,0.821 C 0.096,0.741 0.088,0.604 0.088,0.496 C 0.088,0.388 0.096,0.249 0.163,0.171 C 0.230,0.092 0.383,0.023 0.488,0.026 Z",
  "M 0.490,0.007 C 0.589,0.003 0.725,0.105 0.802,0.186 C 0.878,0.268 0.946,0.389 0.950,0.497 C 0.955,0.606 0.906,0.765 0.830,0.837 C 0.753,0.908 0.601,0.930 0.490,0.927 C 0.380,0.925 0.242,0.894 0.165,0.823 C 0.088,0.751 0.023,0.599 0.030,0.497 C 0.037,0.396 0.131,0.296 0.208,0.215 C 0.284,0.133 0.391,0.012 0.490,0.007 Z",
  "M 0.487,0.054 C 0.591,0.046 0.743,0.080 0.820,0.151 C 0.896,0.223 0.949,0.374 0.947,0.484 C 0.946,0.593 0.889,0.727 0.813,0.809 C 0.736,0.891 0.593,0.976 0.487,0.974 C 0.381,0.971 0.253,0.876 0.176,0.795 C 0.100,0.713 0.024,0.584 0.027,0.484 C 0.031,0.383 0.121,0.265 0.197,0.194 C 0.274,0.122 0.384,0.061 0.487,0.054 Z",
];

function InlineBlob({
  src, alt, size, style, blobIndex = 0,
}: {
  src: string; alt: string; size: number; style?: React.CSSProperties; blobIndex?: number;
}) {
  const id = `lb-${blobIndex}-${Math.floor(Math.random() * 9999)}`;
  const d = BLOBS[blobIndex % BLOBS.length];
  return (
    <div style={{ position: "absolute", width: size, height: size, ...style }}>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        </defs>
      </svg>
      <div style={{
        width: "100%", height: "100%",
        clipPath: `url(#${id})`,
        overflow: "hidden",
        boxShadow: "0 6px 28px rgba(0,0,0,0.16)",
      }}>
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
}

const STEPS = [
  { icon: "✦", label: "Photograph", desc: "Snap any flower on your walk" },
  { icon: "✿", label: "Identify", desc: "Get the name, family & meaning" },
  { icon: "⋯", label: "Collect", desc: "Build your personal garden index" },
];

export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F5EFD8", fontFamily: "system-ui, sans-serif" }}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 pt-8 pb-2">
        <div className="flex items-center gap-2">
          <FlowerIcon size={18} color="#c5d07d" />
          <span style={{ fontFamily: "Fraunces, serif", fontSize: "17px", color: "#3D362D", letterSpacing: "-0.01em" }}>
            Petal Press
          </span>
        </div>
        <Link href="/signin">
          <span style={{ fontSize: "13px", color: "#736959", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Sign in
          </span>
        </Link>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 pt-10 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "clamp(32px, 9vw, 42px)",
            lineHeight: 1.15,
            color: "#2C2721",
            letterSpacing: "-0.025em",
            maxWidth: 320,
          }}
        >
          Your walk,<br />pressed into a garden.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          style={{ fontSize: "14px", color: "#736959", lineHeight: 1.65, maxWidth: 280, marginTop: 14 }}
        >
          Photograph flowers in your neighborhood. Get them identified and given their secret meanings. Keep them forever.
        </motion.p>
      </div>

      {/* Overlapping blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
        style={{ position: "relative", width: "100%", height: 260, marginTop: 8 }}
      >
        <InlineBlob
          src="/images/forget-me-not.jpg"
          alt="Forget-me-not"
          size={170}
          blobIndex={0}
          style={{ left: "6%", top: 28, transform: "rotate(-7deg)", zIndex: 1 }}
        />
        <InlineBlob
          src="/images/hydrangea.jpg"
          alt="Hydrangea"
          size={192}
          blobIndex={1}
          style={{ left: "50%", top: 0, transform: "translateX(-50%) rotate(3deg)", zIndex: 3 }}
        />
        <InlineBlob
          src="/images/california-poppy.jpg"
          alt="California Poppy"
          size={165}
          blobIndex={2}
          style={{ right: "6%", top: 32, transform: "rotate(-4deg)", zIndex: 2 }}
        />
      </motion.div>

      {/* Steps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex justify-center gap-0 px-4 pt-10 pb-2"
      >
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-start gap-0" style={{ flex: 1, maxWidth: 120 }}>
            <div className="flex flex-col items-center text-center px-3">
              <span style={{ fontSize: "20px", lineHeight: 1, marginBottom: 8, color: "#c5d07d" }}>
                {step.icon}
              </span>
              <p style={{ fontFamily: "Fraunces, serif", fontSize: "13px", color: "#3D362D", marginBottom: 3, fontWeight: 600 }}>
                {step.label}
              </p>
              <p style={{ fontSize: "11px", color: "#9A8F7F", lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 1, height: 36, backgroundColor: "#D4CBB3", marginTop: 6, flexShrink: 0 }} />
            )}
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
        className="flex flex-col items-center gap-3 px-6 pt-8"
      >
        <Link href="/signin">
          <button
            style={{
              height: 52,
              paddingLeft: 32,
              paddingRight: 32,
              borderRadius: 999,
              backgroundColor: "#c5d07d",
              border: "none",
              cursor: "pointer",
              fontFamily: "Fraunces, serif",
              fontStyle: "italic",
              fontSize: "16px",
              color: "#3D362D",
              letterSpacing: "0.01em",
              boxShadow: "0 4px 20px rgba(197,208,125,0.5)",
            }}
          >
            Start your garden →
          </button>
        </Link>
        <p style={{ fontSize: "11px", color: "#C4BBA5" }}>free · no account needed to browse</p>
      </motion.div>

      {/* Footer */}
      <div className="mt-auto px-6 pb-8 pt-12 flex items-center justify-center gap-5">
        <Link href="/about">
          <span style={{ fontSize: "11px", color: "#C4BBA5", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            about
          </span>
        </Link>
        <Link href="/privacy">
          <span style={{ fontSize: "11px", color: "#C4BBA5", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            privacy
          </span>
        </Link>
        <a
          href="https://www.instagram.com/priscilla.png/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "11px", color: "#C4BBA5", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          by priscilla
        </a>
      </div>
    </div>
  );
}
