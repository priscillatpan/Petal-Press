import { Link } from "wouter";
import { motion } from "framer-motion";
import { FlowerIcon } from "@/components/FlowerIcon";

const BLOBS = [
  "M 0.488,0.026 C 0.593,0.030 0.711,0.114 0.792,0.192 C 0.874,0.270 0.977,0.394 0.978,0.496 C 0.979,0.599 0.881,0.727 0.799,0.807 C 0.718,0.887 0.594,0.974 0.488,0.976 C 0.382,0.978 0.230,0.901 0.163,0.821 C 0.096,0.741 0.088,0.604 0.088,0.496 C 0.088,0.388 0.096,0.249 0.163,0.171 C 0.230,0.092 0.383,0.023 0.488,0.026 Z",
  "M 0.499,0.057 C 0.611,0.054 0.769,0.086 0.846,0.161 C 0.922,0.236 0.969,0.401 0.959,0.507 C 0.950,0.613 0.866,0.720 0.789,0.797 C 0.712,0.874 0.604,0.959 0.499,0.967 C 0.394,0.975 0.231,0.923 0.160,0.847 C 0.088,0.770 0.067,0.618 0.069,0.507 C 0.072,0.396 0.102,0.257 0.174,0.182 C 0.246,0.107 0.387,0.061 0.499,0.057 Z",
  "M 0.490,0.007 C 0.589,0.003 0.725,0.105 0.802,0.186 C 0.878,0.268 0.946,0.389 0.950,0.497 C 0.955,0.606 0.906,0.765 0.830,0.837 C 0.753,0.908 0.601,0.930 0.490,0.927 C 0.380,0.925 0.242,0.894 0.165,0.823 C 0.088,0.751 0.023,0.599 0.030,0.497 C 0.037,0.396 0.131,0.296 0.208,0.215 C 0.284,0.133 0.391,0.012 0.490,0.007 Z",
  "M 0.497,0.041 C 0.604,0.040 0.750,0.099 0.822,0.176 C 0.894,0.253 0.923,0.389 0.927,0.501 C 0.930,0.613 0.915,0.771 0.843,0.848 C 0.772,0.925 0.603,0.971 0.497,0.961 C 0.391,0.952 0.287,0.868 0.207,0.791 C 0.127,0.715 0.022,0.603 0.017,0.501 C 0.012,0.400 0.099,0.260 0.179,0.183 C 0.259,0.107 0.390,0.043 0.497,0.041 Z",
  "M 0.487,0.054 C 0.591,0.046 0.743,0.080 0.820,0.151 C 0.896,0.223 0.949,0.374 0.947,0.484 C 0.946,0.593 0.889,0.727 0.813,0.809 C 0.736,0.891 0.593,0.976 0.487,0.974 C 0.381,0.971 0.253,0.876 0.176,0.795 C 0.100,0.713 0.024,0.584 0.027,0.484 C 0.031,0.383 0.121,0.265 0.197,0.194 C 0.274,0.122 0.384,0.061 0.487,0.054 Z",
];

let blobCounter = 0;

function FloatingBlob({
  src, alt, size, top, left, right, bottom, floatClass, blobIndex = 0, opacity = 0.88,
}: {
  src: string; alt: string; size: number;
  top?: string | number; left?: string | number; right?: string | number; bottom?: string | number;
  floatClass: string; blobIndex?: number; opacity?: number;
}) {
  const uid = `fl-${blobIndex}-${++blobCounter}`;
  const d = BLOBS[blobIndex % BLOBS.length];
  return (
    <div
      className={floatClass}
      style={{
        position: "absolute",
        width: size,
        height: size,
        top, left, right, bottom,
        pointerEvents: "none",
        zIndex: 0,
        opacity,
      }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <clipPath id={uid} clipPathUnits="objectBoundingBox"><path d={d} /></clipPath>
        </defs>
      </svg>
      <div style={{
        width: "100%", height: "100%",
        clipPath: `url(#${uid})`,
        overflow: "hidden",
        boxShadow: "0 4px 18px rgba(0,0,0,0.14)",
      }}>
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
}

const SCALE = 260 / 390;
const IFRAME_H = 560;

function AppPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      style={{
        width: 260,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)",
        border: "1.5px solid #D4CBB3",
        position: "relative",
        zIndex: 2,
        flexShrink: 0,
      }}
    >
      {/* Browser chrome bar */}
      <div style={{
        backgroundColor: "#EDE5D0",
        padding: "9px 12px",
        display: "flex",
        alignItems: "center",
        gap: 5,
        borderBottom: "1px solid #D4CBB3",
      }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: "#E88FA5" }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: "#F0A860" }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: "#c5d07d" }} />
        <div style={{
          flex: 1, height: 14, marginLeft: 8,
          backgroundColor: "#D4CBB3", borderRadius: 6,
        }} />
      </div>

      {/* Scaled iframe */}
      <div style={{ width: 260, height: IFRAME_H * SCALE, overflow: "hidden", position: "relative", backgroundColor: "#F5EFD8" }}>
        <iframe
          src="/demo"
          title="Petal Press preview"
          scrolling="no"
          style={{
            width: 390,
            height: IFRAME_H,
            border: "none",
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "#F5EFD8", position: "relative" }}
    >
      {/* Floating flowers */}
      <FloatingBlob src="/images/forget-me-not.jpg"    alt="" size={88}  top="6%"  left="-12px" floatClass="float-a" blobIndex={0} opacity={0.80} />
      <FloatingBlob src="/images/california-poppy.jpg" alt="" size={72}  top="9%"  right="-8px" floatClass="float-c" blobIndex={2} opacity={0.75} />
      <FloatingBlob src="/images/star-jasmine.jpg"     alt="" size={80}  top="34%" left="-18px" floatClass="float-b" blobIndex={4} opacity={0.70} />
      <FloatingBlob src="/images/hydrangea.jpg"        alt="" size={76}  top="38%" right="-14px" floatClass="float-d" blobIndex={1} opacity={0.72} />
      <FloatingBlob src="/images/forget-me-not.jpg"    alt="" size={64}  bottom="18%" left="4px"  floatClass="float-e" blobIndex={3} opacity={0.65} />
      <FloatingBlob src="/images/california-poppy.jpg" alt="" size={70}  bottom="14%" right="0px" floatClass="float-b" blobIndex={2} opacity={0.68} />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 pt-8 pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <FlowerIcon size={17} color="#c5d07d" />
          <span style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: "#3D362D", letterSpacing: "-0.01em" }}>
            Petal Press
          </span>
        </div>
        <Link href="/signin">
          <span style={{ fontSize: "13px", color: "#736959", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Sign in
          </span>
        </Link>
      </nav>

      {/* Hero text */}
      <div className="flex flex-col items-center text-center px-8 pt-6 pb-5 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "30px",
            lineHeight: 1.2,
            color: "#2C2721",
            letterSpacing: "-0.025em",
            maxWidth: 260,
          }}
        >
          Your walk,<br />pressed into a garden.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ fontSize: "13px", color: "#736959", lineHeight: 1.65, maxWidth: 240, marginTop: 10 }}
        >
          Photograph a flower, get its name and secret meaning, keep it forever.
        </motion.p>
      </div>

      {/* App preview mockup */}
      <div className="flex justify-center relative z-10">
        <AppPreview />
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex flex-col items-center gap-2 px-6 pt-7 relative z-10"
      >
        <Link href="/signin">
          <button style={{
            height: 50,
            paddingLeft: 28,
            paddingRight: 28,
            borderRadius: 999,
            backgroundColor: "#c5d07d",
            border: "none",
            cursor: "pointer",
            fontFamily: "Fraunces, serif",
            fontStyle: "italic",
            fontSize: "15px",
            color: "#3D362D",
            letterSpacing: "0.01em",
            boxShadow: "0 4px 20px rgba(197,208,125,0.5)",
          }}>
            Start your garden →
          </button>
        </Link>
        <p style={{ fontSize: "11px", color: "#C4BBA5" }}>free · no account needed to browse</p>
      </motion.div>

      {/* Footer */}
      <div className="mt-auto px-6 pb-8 pt-10 flex items-center justify-center relative z-10">
        <p style={{ fontSize: "12px", color: "#C4BBA5" }}>
          © 2026{" "}
          <a
            href="https://www.instagram.com/priscilla.png/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#C4BBA5", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            Priscilla
          </a>
          {" — "}
          <Link href="/privacy">
            <span style={{ color: "#C4BBA5", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>terms</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
