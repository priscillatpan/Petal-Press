import { motion } from "framer-motion";
import { FlowerIcon } from "@/components/FlowerIcon";

export default function Welcome() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#FAF7EF' }}
    >
      {/* Top nav */}
      <div className="flex items-center justify-between px-6 pt-8 pb-2">
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

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8 py-8">

        {/* Scattered blob photos */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-full"
          style={{ maxWidth: 320, height: 210 }}
        >
          {/* Forget-me-not — top left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: -6 }}
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
            style={{ right: '2%', top: '0%', width: '40%', transform: 'rotate(8deg)' }}
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
            style={{ left: '10%', bottom: '0%', width: '38%', transform: 'rotate(5deg)' }}
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
            style={{ right: '6%', bottom: '4%', width: '36%', transform: 'rotate(-9deg)' }}
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
          className="flex flex-col gap-3"
        >
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '38px',
            lineHeight: 1.1,
            color: '#2C2721',
            letterSpacing: '-0.02em',
          }}>
            Your personal<br />flower diary
          </h1>
          <p style={{ fontSize: '15px', color: '#736959', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
            Photograph flowers on your walks. Get them identified and given their floriography meaning. Collect them in a beautiful garden.
          </p>
        </motion.div>

        {/* Tally waitlist */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full"
          style={{ maxWidth: 360 }}
        >
          <iframe
            src="https://tally.so/embed/obkQo5?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            width="100%"
            height="160"
            frameBorder={0}
            title="Join the Petal Press waitlist"
            style={{ border: 'none' }}
          />
        </motion.div>

        {/* Feature hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="flex gap-6 justify-center"
        >
          {[
            { icon: "📸", label: "Photograph" },
            { icon: "🌿", label: "Identify" },
            { icon: "📖", label: "Collect" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span style={{ fontSize: '22px' }}>{icon}</span>
              <span style={{ fontSize: '11px', color: '#9A8F7F', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p style={{ fontSize: '11px', color: '#C4BBA5' }}>
          made with care for curious walkers
        </p>
      </div>
    </div>
  );
}
