import { Link } from "wouter";
import { FlowerIcon } from "@/components/FlowerIcon";

export default function About() {
  return (
    <div className="min-h-screen px-6 py-10" style={{ backgroundColor: "#F5EFD8" }}>
      <div style={{ maxWidth: 340, margin: "0 auto" }}>
        <Link href="/">
          <div className="flex items-center gap-2 mb-10 cursor-pointer">
            <FlowerIcon size={16} color="#c5d07d" />
            <span style={{ fontFamily: "Fraunces, serif", fontSize: "15px", color: "#9A8F7F" }}>
              Petal Press
            </span>
          </div>
        </Link>

        <h1
          style={{
            fontFamily: "Fraunces, serif",
            fontSize: "28px",
            color: "#2C2721",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: 20,
          }}
        >
          About
        </h1>

        <div style={{ fontSize: "14px", color: "#736959", lineHeight: 1.75 }} className="space-y-4">
          <p>
            Petal Press is a personal flower diary for people who notice things on their walks — a patch of forget-me-nots at the base of a palm tree, a jasmine-covered fence so fragrant it stops you mid-stride.
          </p>
          <p>
            Photograph a flower, and Petal Press will identify it and find its floriography meaning — the secret language of flowers that Victorians used to send coded messages.
          </p>
          <p>
            Your garden grows with every walk. Over time it becomes something personal: a map of what you noticed, and what those flowers were quietly saying.
          </p>
          <p style={{ color: "#9A8F7F", fontSize: "13px" }}>
            Made with care by{" "}
            <a
              href="https://www.instagram.com/priscilla.png/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#736959", textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              Priscilla
            </a>
            .
          </p>
        </div>

        <div className="mt-10 pt-8" style={{ borderTop: "1px solid #E8DCC0" }}>
          <Link href="/">
            <span style={{ fontSize: "13px", color: "#9A8F7F", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              ← Back
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
