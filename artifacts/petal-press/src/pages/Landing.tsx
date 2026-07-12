import { Link } from "wouter";
import { FlowerIcon } from "@/components/FlowerIcon";

const SCALE = 250 / 390;
const IFRAME_H = 520;

export default function Landing() {
  return (
    <div style={{
      height: "100dvh", overflow: "hidden",
      backgroundColor: "#F5EFD8", position: "relative",
      display: "flex", flexDirection: "column",
      fontFamily: "system-ui, sans-serif",
    }}>

      {/* Sign in */}
      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        <Link href="/signin">
          <span style={{ fontSize: "13px", color: "#736959", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Sign in
          </span>
        </Link>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 1, padding: "0 24px", textAlign: "center",
        gap: 0,
      }}>

        {/* Title */}
        <p style={{ fontSize: "11px", color: "#9A8F7F", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, marginTop: 0 }}>
          welcome to
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
          <h1 style={{
            fontFamily: "Fraunces, serif",
            fontSize: "clamp(28px, 8vw, 36px)",
            lineHeight: 1.1,
            color: "#2C2721",
            letterSpacing: "-0.025em",
            margin: 0,
          }}>
            Petal Press
          </h1>
          <FlowerIcon size={22} color="#c5d07d" />
        </div>

        {/* Tagline */}
        <p style={{
          fontFamily: "Fraunces, serif",
          fontSize: "14px",
          color: "#9A8F7F",
          lineHeight: 1.65,
          maxWidth: 240,
          marginBottom: 24,
          marginTop: 0,
        }}>
          a little diary for the flowers you find:
          discover their names & hidden meanings
        </p>

        {/* CTA */}
        <Link href="/signin">
          <button style={{
            height: 48, paddingLeft: 26, paddingRight: 26,
            borderRadius: 999, backgroundColor: "#c5d07d",
            border: "none", cursor: "pointer",
            fontFamily: "Fraunces, serif",
            fontSize: "15px", color: "#3D362D", letterSpacing: "0.01em",
            boxShadow: "0 4px 18px rgba(197,208,125,0.48)",
            marginBottom: 20,
          }}>
            Start your garden →
          </button>
        </Link>

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
          <div style={{
            backgroundColor: "#EDE5D0",
            padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 5,
            borderBottom: "1px solid #D4CBB3",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#E88FA5", flexShrink: 0 }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#F0A860", flexShrink: 0 }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#c5d07d", flexShrink: 0 }} />
            <span style={{ fontSize: "9px", color: "#9A8F7F", fontFamily: "system-ui", letterSpacing: "0.01em", marginLeft: 8 }}>
              your garden ♡
            </span>
          </div>

          {/* Scaled iframe */}
          <div style={{ width: 250, height: IFRAME_H * SCALE, overflow: "hidden", position: "relative", backgroundColor: "#F5EFD8" }}>
            <iframe
              src="/demo"
              title="Petal Press preview"
              scrolling="no"
              style={{
                width: 390, height: IFRAME_H,
                border: "none",
                transform: `scale(${SCALE})`,
                transformOrigin: "top left",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", paddingBottom: 16, zIndex: 1, flexShrink: 0 }}>
        <p style={{ fontSize: "11px", color: "#C4BBA5" }}>
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
