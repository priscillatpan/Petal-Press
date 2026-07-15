import { Link } from "wouter";
import { FlowerIcon } from "@/components/FlowerIcon";

export default function Privacy() {
  return (
    <div className="min-h-screen px-6 py-10" style={{ backgroundColor: "#FAF7EF", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="flex items-center gap-2 mb-8">
          <FlowerIcon size={18} color="#c5d07d" />
          <Link href="/">
            <span style={{ fontSize: "13px", color: "#9A8F7F", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              ← back
            </span>
          </Link>
        </div>

        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "28px", color: "#2C2721", marginBottom: "8px", lineHeight: 1.2 }}>
          Privacy & Terms
        </h1>
        <p style={{ fontSize: "12px", color: "#C4BBA5", marginBottom: "32px" }}>Last updated: June 2026</p>

        <div style={{ fontSize: "14px", color: "#736959", lineHeight: 1.75 }}>
          <p style={{ marginBottom: "20px" }}>
            Petal Press is a personal flower diary. Here's what you should know about how it works.
          </p>

          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "17px", color: "#3D362D", marginBottom: "8px", marginTop: "28px" }}>
            What we collect
          </h2>
          <p style={{ marginBottom: "12px" }}>
            When you sign up, we store your email address to identify your account. When you press a flower, we store the photo you upload, the flower's name and meaning, your notes, and the date.
          </p>

          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "17px", color: "#3D362D", marginBottom: "8px", marginTop: "28px" }}>
            Your data
          </h2>
          <p style={{ marginBottom: "12px" }}>
            <strong style={{ color: "#3D362D" }}>Data storage:</strong> Everything lives in your private garden. I don't read your entries, sell your data, or run ads. Ever.
          </p>
          <p style={{ marginBottom: "12px" }}>
            Your flower photos are stored privately and only accessible to you when signed in.
          </p>

          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "17px", color: "#3D362D", marginBottom: "8px", marginTop: "28px" }}>
            Third-party services
          </h2>
          <p style={{ marginBottom: "12px" }}>
            Petal Press uses Pl@ntNet for plant identification and Supabase for authentication and storage. Your photos are sent to Pl@ntNet only when you request an identification — they are not stored by us after processing.
          </p>

          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "17px", color: "#3D362D", marginBottom: "8px", marginTop: "28px" }}>
            Terms of use
          </h2>
          <ul style={{ paddingLeft: "20px", marginBottom: "12px" }}>
            <li>Petal Press is provided as-is, for personal use</li>
            <li>You're responsible for anything you add to your garden</li>
            <li>Don't use it to harm others</li>
          </ul>

          <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "17px", color: "#3D362D", marginBottom: "8px", marginTop: "28px" }}>
            Contact
          </h2>
          <p>
            Questions? Reach out on{" "}
            <a href="https://www.instagram.com/priscilla.png/" target="_blank" rel="noopener noreferrer"
              style={{ color: "#9A8F7F", textDecoration: "underline" }}>
              Instagram
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
