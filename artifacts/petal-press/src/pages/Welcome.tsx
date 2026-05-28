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

      {/* Main content — vertically centred, no scroll */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6 min-h-0">

        {/* Scattered blob photos */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-full shrink-0"
          style={{ maxWidth: 300, height: 190 }}
        >
          {/* Forget-me-not — top left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="absolute"
            style={{ left: '4%', top: '5%', width: '44%', rotate: '-6deg' }}
          >
            <div style={{ paddingBottom: '100%', position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '62% 38% 46% 54% / 60% 44% 56% 40%',
                overflow: 'hidden',
                boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
                backgroundColor: '#1a1a1a',
              }}>
                <img src="/images/forget-me-not.png" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Poppy — top right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="absolute"
            style={{ right: '2%', top: '0%', width: '40%', rotate: '8deg' }}
          >
            <div style={{ paddingBottom: '100%', position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '48% 52% 58% 42% / 44% 58% 42% 56%',
                overflow: 'hidden',
                boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
                backgroundColor: '#1a1a1a',
              }}>
                <img src="/images/california-poppy.png" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Hydrangea — bottom left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute"
            style={{ left: '10%', bottom: '0%', width: '38%', rotate: '5deg' }}
          >
            <div style={{ paddingBottom: '100%', position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '52% 48% 40% 60% / 56% 40% 60% 44%',
                overflow: 'hidden',
                boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
                backgroundColor: '#1a1a1a',
              }}>
                <img src="/images/hydrangea.png" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Jasmine — bottom right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute"
            style={{ right: '6%', bottom: '4%', width: '36%', rotate: '-9deg' }}
          >
            <div style={{ paddingBottom: '100%', position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '44% 56% 52% 48% / 52% 44% 56% 48%',
                overflow: 'hidden',
                boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
                backgroundColor: '#1a1a1a',
              }}>
                <img src="/images/star-jasmine.png" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="flex flex-col gap-3 shrink-0"
        >
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '36px',
            lineHeight: 1.1,
            color: '#2C2721',
            letterSpacing: '-0.02em',
          }}>
            Welcome to<br />Petal Press
          </h1>
          <p style={{ fontSize: '15px', color: '#736959', lineHeight: 1.65, maxWidth: 260, margin: '0 auto' }}>
            a little diary for the flowers you find —
            discover what they're called & the secret
            meanings they've carried for centuries
          </p>
        </motion.div>

        {/* Tally waitlist */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full shrink-0"
          style={{ maxWidth: 360 }}
        >
          <iframe
            src="https://tally.so/embed/obkQo5?alignLeft=1&hideTitle=1&transparentBackground=1"
            width="100%"
            height="140"
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
        transition={{ delay: 0.7, duration: 0.6 }}
        className="px-6 pb-7 text-center shrink-0"
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
