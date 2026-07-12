import { Link } from "wouter";
import { FlowerIcon } from "@/components/FlowerIcon";

export default function Privacy() {
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
          Privacy Policy
        </h1>

        <div style={{ fontSize: "13px", color: "#736959", lineHeight: 1.75 }} className="space-y-5">
          <p style={{ color: "#9A8F7F", fontSize: "12px" }}>Last updated: July 2026</p>

          <section className="space-y-2">
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: "#3D362D" }}>What we collect</h2>
            <p>
              When you sign in, we store your email address to identify your account. Your flower entries — photos, names, notes, and locations — are stored in your private garden and are only accessible to you.
            </p>
          </section>

          <section className="space-y-2">
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: "#3D362D" }}>Photos & identification</h2>
            <p>
              Flower photos you upload are sent to Pl@ntNet for identification. Pl@ntNet's own privacy policy applies to that processing. Photos are stored securely and are not shared with anyone else.
            </p>
          </section>

          <section className="space-y-2">
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: "#3D362D" }}>Third-party services</h2>
            <p>
              We use Supabase for authentication and storage, and OpenAI to generate flower meanings. Neither service receives your personal information beyond what is necessary to provide the feature.
            </p>
          </section>

          <section className="space-y-2">
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: "#3D362D" }}>Your data</h2>
            <p>
              You can delete your account and all associated data at any time by contacting us. We don't sell data, run ads, or share your information with third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "16px", color: "#3D362D" }}>Contact</h2>
            <p>
              Questions? Reach out on{" "}
              <a
                href="https://www.instagram.com/priscilla.png/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#736959", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                Instagram
              </a>
              .
            </p>
          </section>
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
