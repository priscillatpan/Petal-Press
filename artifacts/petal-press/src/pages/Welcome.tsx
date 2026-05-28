import { motion } from "framer-motion";

const BLOBS = [
  { src: "/images/forget-me-not.png",   rotate: "-7deg",  radius: "62% 38% 46% 54% / 60% 44% 56% 40%" },
  { src: "/images/california-poppy.png", rotate: "4deg",   radius: "48% 52% 58% 42% / 44% 58% 42% 56%" },
  { src: "/images/hydrangea.png",        rotate: "-3deg",  radius: "52% 48% 40% 60% / 56% 40% 60% 44%" },
];

export default function Welcome() {
  return (
    <div
      className="h-screen flex flex-col overflow-hidden px-6"
      style={{ backgroundColor: '#FAF7EF' }}
    >
      <div className="flex flex-col items-center text-center gap-4 pt-10">

        {/* Three blob photos */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center justify-center gap-3"
        >
          {BLOBS.map(({ src, rotate, radius }, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                width: 88,
                height: 88,
                flexShrink: 0,
                transform: `rotate(${rotate})`,
                borderRadius: radius,
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                backgroundColor: "#1a1a1a",
              }}
            >
              <img
                src={src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                draggable={false}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <h1 style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '34px',
            lineHeight: 1.1,
            color: '#2C2721',
            letterSpacing: '-0.02em',
          }}>
            Petal Press<br />is coming soon!
          </h1>
          <p style={{ fontSize: '14px', color: '#736959', lineHeight: 1.6, maxWidth: 250, margin: '0 auto' }}>
            a little diary for the flowers you find:
            discover what they're called & their hidden meanings
          </p>
        </motion.div>

        {/* Tally waitlist */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="w-full"
          style={{ maxWidth: 360 }}
        >
          <iframe
            src="https://tally.so/embed/obkQo5?alignLeft=1&hideTitle=1&transparentBackground=1"
            width="100%"
            height="240"
            frameBorder={0}
            title="Join the Petal Press waitlist"
            style={{ border: 'none' }}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
          />
        </motion.div>
      </div>

      {/* Footer pinned to bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-auto pb-6 text-center"
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
