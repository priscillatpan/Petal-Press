import { motion } from "framer-motion";
import { FlowerIcon } from "@/components/FlowerIcon";

export default function Welcome() {
  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: '#FAF7EF' }}
    >
      {/* Top nav */}
      <div className="flex items-center justify-between px-6 pt-8 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <FlowerIcon size={18} color="#c5d07d" />
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', color: '#3D362D', letterSpacing: '-0.01em' }}>
            Petal Press
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#9A8F7F', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Coming soon
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4 min-h-0">

        {/* Flower emoji */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ fontSize: '44px', lineHeight: 1 }}
        >
          🌸
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '34px',
            lineHeight: 1.1,
            color: '#2C2721',
            letterSpacing: '-0.02em',
          }}>
            Welcome to<br />Petal Press
          </h1>
          <p style={{ fontSize: '14px', color: '#736959', lineHeight: 1.6, maxWidth: 250, margin: '0 auto' }}>
            a little diary for the flowers you find —
            discover what they're called & the secret
            meanings they've carried for centuries
          </p>
        </motion.div>

        {/* Tally waitlist */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full shrink-0"
          style={{ maxWidth: 360 }}
        >
          <iframe
            src="https://tally.so/embed/obkQo5?alignLeft=1&hideTitle=1&transparentBackground=1"
            width="100%"
            height="230"
            frameBorder={0}
            title="Join the Petal Press waitlist"
            style={{ border: 'none' }}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
          />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="px-6 pb-6 text-center shrink-0"
      >
        <p style={{ fontSize: '12px', color: '#C4BBA5' }}>
          made with love by{' '}
          <a
            href="https://www.instagram.com/priscilla.png/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#9A8F7F', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            priscilla
          </a>
        </p>
      </motion.div>
    </div>
  );
}
