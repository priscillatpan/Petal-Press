import { motion } from "framer-motion";

const EMOJIS = ["🌸", "🌷", "🌼", "🌻", "🌺", "💐", "🍃"];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// A brief shower of flower emoji, used to celebrate a successful press/save.
export function FlowerBurst({ count = 18 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    left: randomBetween(2, 98),
    delay: randomBetween(0, 0.35),
    duration: randomBetween(1.3, 2.1),
    rotate: randomBetween(-100, 100),
    size: randomBetween(20, 34),
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: 0,
            fontSize: p.size,
          }}
        >
          {p.emoji}
        </motion.span>
      ))}
    </div>
  );
}
