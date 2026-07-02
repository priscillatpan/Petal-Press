import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { FlowerIcon } from "@/components/FlowerIcon";
import { useAuth } from "@/context/AuthContext";

type Stage = "input" | "sent" | "error";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user, authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && user) setLocation("/garden");
  }, [user, authLoading, setLocation]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await signIn(email.trim());
      setStage("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStage("error");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return null;

  return (
    <div
      className="h-screen flex flex-col overflow-hidden px-6"
      style={{ backgroundColor: "#FAF7EF" }}
    >
      <div className="flex flex-col items-center text-center gap-6 pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <FlowerIcon size={48} color="#c5d07d" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="flex flex-col gap-2"
        >
          <h1
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "28px",
              lineHeight: 1.15,
              color: "#2C2721",
              letterSpacing: "-0.02em",
            }}
          >
            Open your garden
          </h1>
          <p style={{ fontSize: "14px", color: "#736959", lineHeight: 1.6, maxWidth: 268, margin: "0 auto" }}>
            Enter your email and we'll send a magic link — no password needed.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage !== "sent" ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="w-full flex flex-col gap-3"
              style={{ maxWidth: 320 }}
            >
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (stage === "error") setStage("input"); }}
                placeholder="your@email.com"
                required
                autoFocus
                autoComplete="email"
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  fontSize: "15px",
                  color: "#2C2721",
                  backgroundColor: "#FFF9ED",
                  border: stage === "error" ? "1.5px solid #c97b6a" : "1.5px solid #D4CBB3",
                  borderRadius: "12px",
                  outline: "none",
                  fontFamily: "system-ui, sans-serif",
                  transition: "border-color 0.15s",
                  boxSizing: "border-box",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "#c5d07d"; }}
                onBlur={e => { e.currentTarget.style.borderColor = stage === "error" ? "#c97b6a" : "#D4CBB3"; }}
              />

              {stage === "error" && (
                <p style={{ fontSize: "12px", color: "#c97b6a", textAlign: "left", marginTop: -4 }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                style={{
                  width: "100%",
                  padding: "13px",
                  fontSize: "14px",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  color: "#3D362D",
                  backgroundColor: loading || !email.trim() ? "#D4CBB3" : "#c5d07d",
                  border: "none",
                  borderRadius: "12px",
                  cursor: loading || !email.trim() ? "default" : "pointer",
                  transition: "background-color 0.15s",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                {loading ? "Sending…" : "Send magic link ✉︎"}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-3"
              style={{ maxWidth: 300 }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "#EBF0C8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                ✉︎
              </div>
              <p style={{ fontFamily: "Fraunces, serif", fontSize: "18px", color: "#2C2721", lineHeight: 1.3 }}>
                Check your email
              </p>
              <p style={{ fontSize: "13px", color: "#736959", lineHeight: 1.65 }}>
                We sent a magic link to{" "}
                <strong style={{ color: "#2C2721" }}>{email}</strong>.
                Tap it to open your garden.
              </p>
              <button
                onClick={() => { setStage("input"); setEmail(""); }}
                style={{
                  fontSize: "12px",
                  color: "#9A8F7F",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  marginTop: 4,
                }}
              >
                Use a different email
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: "12px", color: "#C4BBA5", marginTop: 4 }}
        >
          New here?{" "}
          <a
            href="/"
            style={{ color: "#9A8F7F", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            Join the waitlist
          </a>
        </motion.p>
      </div>

      <div className="mt-auto pb-6 text-center">
        <p style={{ fontSize: "12px", color: "#C4BBA5" }}>
          made with love by{" "}
          <a
            href="https://www.instagram.com/priscilla.png/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#9A8F7F", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            priscilla
          </a>
        </p>
      </div>
    </div>
  );
}
