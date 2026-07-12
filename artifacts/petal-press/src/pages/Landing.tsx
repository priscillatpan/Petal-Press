import { Link } from "wouter";

const BLOBS = [
  "M 0.488,0.026 C 0.593,0.030 0.711,0.114 0.792,0.192 C 0.874,0.270 0.977,0.394 0.978,0.496 C 0.979,0.599 0.881,0.727 0.799,0.807 C 0.718,0.887 0.594,0.974 0.488,0.976 C 0.382,0.978 0.230,0.901 0.163,0.821 C 0.096,0.741 0.088,0.604 0.088,0.496 C 0.088,0.388 0.096,0.249 0.163,0.171 C 0.230,0.092 0.383,0.023 0.488,0.026 Z",
  "M 0.499,0.057 C 0.611,0.054 0.769,0.086 0.846,0.161 C 0.922,0.236 0.969,0.401 0.959,0.507 C 0.950,0.613 0.866,0.720 0.789,0.797 C 0.712,0.874 0.604,0.959 0.499,0.967 C 0.394,0.975 0.231,0.923 0.160,0.847 C 0.088,0.770 0.067,0.618 0.069,0.507 C 0.072,0.396 0.102,0.257 0.174,0.182 C 0.246,0.107 0.387,0.061 0.499,0.057 Z",
  "M 0.490,0.007 C 0.589,0.003 0.725,0.105 0.802,0.186 C 0.878,0.268 0.946,0.389 0.950,0.497 C 0.955,0.606 0.906,0.765 0.830,0.837 C 0.753,0.908 0.601,0.930 0.490,0.927 C 0.380,0.925 0.242,0.894 0.165,0.823 C 0.088,0.751 0.023,0.599 0.030,0.497 C 0.037,0.396 0.131,0.296 0.208,0.215 C 0.284,0.133 0.391,0.012 0.490,0.007 Z",
  "M 0.497,0.041 C 0.604,0.040 0.750,0.099 0.822,0.176 C 0.894,0.253 0.923,0.389 0.927,0.501 C 0.930,0.613 0.915,0.771 0.843,0.848 C 0.772,0.925 0.603,0.971 0.497,0.961 C 0.391,0.952 0.287,0.868 0.207,0.791 C 0.127,0.715 0.022,0.603 0.017,0.501 C 0.012,0.400 0.099,0.260 0.179,0.183 C 0.259,0.107 0.390,0.043 0.497,0.041 Z",
  "M 0.487,0.054 C 0.591,0.046 0.743,0.080 0.820,0.151 C 0.896,0.223 0.949,0.374 0.947,0.484 C 0.946,0.593 0.889,0.727 0.813,0.809 C 0.736,0.891 0.593,0.976 0.487,0.974 C 0.381,0.971 0.253,0.876 0.176,0.795 C 0.100,0.713 0.024,0.584 0.027,0.484 C 0.031,0.383 0.121,0.265 0.197,0.194 C 0.274,0.122 0.384,0.061 0.487,0.054 Z",
];

let _uid = 0;
function FloatingBlob({ src, size, top, left, right, bottom, floatClass, blobIndex = 0, opacity = 0.82, delay = "0s" }: {
  src: string; size: number;
  top?: string; left?: string; right?: string; bottom?: string;
  floatClass: string; blobIndex?: number; opacity?: number; delay?: string;
}) {
  const uid = `fb${++_uid}`;
  return (
    <div className={floatClass} style={{ position: "absolute", width: size, height: size, top, left, right, bottom, pointerEvents: "none", zIndex: 0, opacity, animationDelay: delay }}>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs><clipPath id={uid} clipPathUnits="objectBoundingBox"><path d={BLOBS[blobIndex % BLOBS.length]} /></clipPath></defs>
      </svg>
      <div style={{ width: "100%", height: "100%", clipPath: `url(#${uid})`, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.13)" }}>
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
}

const SCALE = 250 / 390;
const IFRAME_H = 520;

export default function Landing() {
  return (
    <div style={{ height: "100dvh", overflow: "hidden", backgroundColor: "#F5EFD8", position: "relative", display: "flex", flexDirection: "column" }}>

      {/* ── Floating flowers ── */}
      <FloatingBlob src="/images/forget-me-not.jpg"    size={90}  top="3%"   left="-16px" floatClass="float-a" blobIndex={0} opacity={0.78} delay="0s" />
      <FloatingBlob src="/images/california-poppy.jpg" size={68}  top="5%"   right="-10px" floatClass="float-c" blobIndex={2} opacity={0.72} delay="1.1s" />
      <FloatingBlob src="/images/hydrangea.jpg"        size={58}  top="28%"  right="-14px" floatClass="float-b" blobIndex={1} opacity={0.65} delay="0.6s" />
      <FloatingBlob src="/images/star-jasmine.jpg"     size={74}  top="30%"  left="-18px"  floatClass="float-e" blobIndex={4} opacity={0.68} delay="2s" />
      <FloatingBlob src="/images/california-poppy.jpg" size={56}  bottom="22%" left="8px"  floatClass="float-d" blobIndex={3} opacity={0.60} delay="0.4s" />
      <FloatingBlob src="/images/forget-me-not.jpg"    size={62}  bottom="18%" right="4px" floatClass="float-a" blobIndex={2} opacity={0.62} delay="1.8s" />
      <FloatingBlob src="/images/hydrangea.jpg"        size={48}  bottom="6%"  left="22%"  floatClass="float-c" blobIndex={0} opacity={0.50} delay="0.9s" />
      <FloatingBlob src="/images/star-jasmine.jpg"     size={44}  top="52%"   right="-8px" floatClass="float-e" blobIndex={3} opacity={0.48} delay="3s" />

      {/* ── Sign in link ── */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        <Link href="/signin">
          <span style={{ fontSize: "13px", color: "#736959", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Sign in
          </span>
        </Link>
      </div>

      {/* ── Main content (centered, no scroll) ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0, zIndex: 1, padding: "0 24px", textAlign: "center" }}>

        {/* Title */}
        <h1 style={{
          fontFamily: "Fraunces, serif",
          fontSize: "clamp(40px, 11vw, 52px)",
          lineHeight: 1.1,
          color: "#2C2721",
          letterSpacing: "-0.03em",
          marginBottom: 10,
        }}>
          Petal Press
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: "13px",
          color: "#9A8F7F",
          lineHeight: 1.6,
          maxWidth: 230,
          marginBottom: 28,
          fontStyle: "italic",
        }}>
          a little diary for the flowers you find —<br />
          discover their names & hidden meanings
        </p>

        {/* App preview mockup */}
        <div style={{
          width: 250,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 20px 56px rgba(0,0,0,0.16), 0 4px 14px rgba(0,0,0,0.09)",
          border: "1.5px solid #D4CBB3",
          marginBottom: 24,
          flexShrink: 0,
        }}>
          {/* Browser bar */}
          <div style={{ backgroundColor: "#EDE5D0", padding: "8px 12px", display: "flex", alignItems: "center", gap: 5, borderBottom: "1px solid #D4CBB3" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#E88FA5", flexShrink: 0 }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#F0A860", flexShrink: 0 }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#c5d07d", flexShrink: 0 }} />
            <div style={{ flex: 1, height: 16, backgroundColor: "#FAF7EF", borderRadius: 6, marginLeft: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "9px", color: "#9A8F7F", fontFamily: "system-ui", letterSpacing: "0.01em" }}>your garden ♡</span>
            </div>
          </div>
          {/* Scaled iframe */}
          <div style={{ width: 250, height: IFRAME_H * SCALE, overflow: "hidden", position: "relative", backgroundColor: "#F5EFD8" }}>
            <iframe src="/demo" title="Petal Press preview" scrolling="no" style={{ width: 390, height: IFRAME_H, border: "none", transform: `scale(${SCALE})`, transformOrigin: "top left", pointerEvents: "none" }} />
          </div>
        </div>

        {/* CTA */}
        <Link href="/signin">
          <button style={{
            height: 48, paddingLeft: 26, paddingRight: 26, borderRadius: 999,
            backgroundColor: "#c5d07d", border: "none", cursor: "pointer",
            fontFamily: "Fraunces, serif", fontStyle: "italic", fontSize: "15px",
            color: "#3D362D", letterSpacing: "0.01em",
            boxShadow: "0 4px 18px rgba(197,208,125,0.48)",
            marginBottom: 8,
          }}>
            Start your garden →
          </button>
        </Link>
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: "center", paddingBottom: 16, zIndex: 1, flexShrink: 0 }}>
        <p style={{ fontSize: "11px", color: "#C4BBA5" }}>
          © 2026{" "}
          <a href="https://www.instagram.com/priscilla.png/" target="_blank" rel="noopener noreferrer"
            style={{ color: "#C4BBA5", textDecoration: "underline", textUnderlineOffset: "3px" }}>
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
