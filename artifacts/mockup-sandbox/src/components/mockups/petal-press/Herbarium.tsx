import React, { useState } from 'react';

// Flower data
const flowers = [
  {
    id: '1',
    name: 'Wild Rose',
    latin: 'Rosa canina',
    meaning: 'Secret love',
    date: 'June 3',
    location: 'Dolores Park',
    image: '/__mockup/images/herbarium-rose.png',
    discovered: true,
  },
  {
    id: '2',
    name: 'Lavender',
    latin: 'Lavandula',
    meaning: 'Devotion',
    date: 'May 12',
    location: 'Mission District',
    image: '/__mockup/images/herbarium-lavender.png',
    discovered: true,
  },
  {
    id: '3',
    name: 'California Poppy',
    latin: 'Eschscholzia',
    meaning: 'Dreams',
    date: 'Apr 28',
    location: 'Twin Peaks',
    image: '/__mockup/images/herbarium-poppy.png',
    discovered: true,
  },
  {
    id: '4',
    name: 'Jasmine',
    latin: 'Jasminum',
    meaning: 'Grace',
    date: 'May 30',
    location: 'Noe Valley',
    image: '/__mockup/images/herbarium-jasmine.png',
    discovered: true,
  },
  {
    id: '5',
    name: 'Forget-me-not',
    latin: 'Myosotis',
    meaning: 'True love',
    date: 'June 1',
    location: 'Glen Canyon',
    image: '/__mockup/images/herbarium-forgetmenot.png',
    discovered: true,
  },
  {
    id: '6',
    name: 'Unknown',
    latin: '???',
    meaning: '???',
    date: '',
    location: '',
    image: '',
    discovered: false,
  },
  {
    id: '7',
    name: 'Unknown',
    latin: '???',
    meaning: '???',
    date: '',
    location: '',
    image: '',
    discovered: false,
  },
];

export function Herbarium() {
  const [selectedFlower, setSelectedFlower] = useState(flowers[0]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 overflow-hidden font-['IM_Fell_English']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=IM+Fell+English:ital@0;1&display=swap');
        
        .herbarium-bg {
          background-color: #F5EFD8;
          background-image: 
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .museum-shadow {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 
                      0 2px 4px -1px rgba(0, 0, 0, 0.03),
                      inset 0 0 20px rgba(139, 115, 85, 0.05);
        }

        .paper-texture {
          position: relative;
        }
        
        .paper-texture::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 10;
          opacity: 0.5;
        }

        .washi-tape {
          background: rgba(255, 255, 255, 0.4);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 1px solid rgba(0,0,0,0.05);
          backdrop-filter: blur(2px);
        }

        .torn-edge {
          position: absolute;
          top: -8px;
          left: 0;
          right: 0;
          height: 10px;
          background: inherit;
          clip-path: polygon(0% 100%, 2% 20%, 4% 90%, 6% 15%, 8% 80%, 10% 10%, 12% 90%, 14% 25%, 16% 85%, 18% 10%, 20% 95%, 22% 20%, 24% 85%, 26% 15%, 28% 90%, 30% 10%, 32% 95%, 34% 20%, 36% 85%, 38% 15%, 40% 90%, 42% 10%, 44% 95%, 46% 20%, 48% 85%, 50% 15%, 52% 90%, 54% 10%, 56% 95%, 58% 20%, 60% 85%, 62% 15%, 64% 90%, 66% 10%, 68% 95%, 70% 20%, 72% 85%, 74% 15%, 76% 90%, 78% 10%, 80% 95%, 82% 20%, 84% 85%, 86% 15%, 88% 90%, 90% 10%, 92% 95%, 94% 20%, 96% 85%, 98% 15%, 100% 100%);
        }
      `}</style>

      {/* Mobile Device Container */}
      <div className="relative w-[390px] h-[844px] herbarium-bg paper-texture overflow-hidden flex flex-col text-[#4A4238]">
        
        {/* Header - Seasonality Dots */}
        <div className="pt-12 pb-6 px-6 z-20 relative">
          <h1 className="font-['Fraunces'] text-3xl text-center mb-4 tracking-wide text-[#3D362D]">Herbarium</h1>
          
          <div className="flex justify-between items-center max-w-[200px] mx-auto opacity-60">
            {['M', 'A', 'M', 'J', 'J', 'A'].map((month, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] uppercase tracking-widest">{month}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${i === 3 ? 'bg-[#986E5D]' : 'bg-[#D4CBB3]'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-64 z-20 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            {flowers.map((flower) => (
              <button 
                key={flower.id}
                onClick={() => flower.discovered && setSelectedFlower(flower)}
                className={`relative aspect-[3/4] p-3 flex flex-col items-center justify-between museum-shadow transition-all duration-300
                  ${flower.discovered ? 'bg-[#FCFBF7] hover:bg-white cursor-pointer hover:-translate-y-1' : 'bg-[#EFE8D0] opacity-60 cursor-default'}
                  ${selectedFlower?.id === flower.id ? 'ring-1 ring-[#986E5D] scale-[1.02]' : ''}
                `}
              >
                {/* Washi Tape Corner */}
                <div className="absolute -top-1 -right-1 w-6 h-2 rotate-45 washi-tape z-10" />
                <div className="absolute -bottom-1 -left-1 w-6 h-2 rotate-45 washi-tape z-10" />

                <div className="w-full flex-1 border border-[#E8DCC0] p-1 mb-2 relative flex items-center justify-center">
                  {flower.discovered ? (
                    <img 
                      src={flower.image} 
                      alt={flower.name}
                      className="w-full h-full object-contain mix-blend-multiply opacity-90 sepia-[0.1]"
                    />
                  ) : (
                    <div className="w-12 h-12 text-[#C4BBA5]">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="opacity-50">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="w-full text-center">
                  <p className="font-['Fraunces'] text-[11px] italic text-[#5C5346] truncate w-full px-1">
                    {flower.discovered ? flower.latin : 'Undiscovered'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Flower Bottom Sheet */}
        <div className="absolute bottom-0 left-0 right-0 h-[280px] bg-[#FCFBF7] z-30 museum-shadow transition-transform duration-500 ease-out translate-y-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="torn-edge"></div>
          
          <div className="p-6 h-full flex pt-8 relative">
            
            {/* Specimen Side */}
            <div className="w-[45%] h-full relative border-r border-dashed border-[#D4CBB3] pr-4 flex flex-col items-center justify-center">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-[rgba(255,255,255,0.7)] shadow-sm rotate-2 border border-[rgba(0,0,0,0.05)] z-10"></div>
              <img 
                src={selectedFlower.image} 
                alt={selectedFlower.name}
                className="w-full max-h-[160px] object-contain mix-blend-multiply drop-shadow-md sepia-[0.1]"
              />
            </div>

            {/* Info Side */}
            <div className="w-[55%] pl-5 flex flex-col justify-center">
              <h2 className="font-['Fraunces'] text-2xl text-[#2C2721] mb-1 leading-none">{selectedFlower.name}</h2>
              <p className="font-['Fraunces'] italic text-sm text-[#736959] mb-4 border-b border-[#E8DCC0] pb-2 inline-block">
                {selectedFlower.latin}
              </p>

              <div className="space-y-3 mt-2">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9A8F7F] mb-0.5">Meaning</p>
                  <p className="text-sm font-['Fraunces'] italic text-[#986E5D]">{selectedFlower.meaning}</p>
                </div>
                
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#9A8F7F] mb-0.5">Collected</p>
                  <p className="text-sm text-[#5C5346] leading-snug">
                    {selectedFlower.date}<br/>
                    <span className="text-xs text-[#736959]">{selectedFlower.location}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Museum Label Number */}
            <div className="absolute top-6 right-6 font-['Fraunces'] text-xl italic text-[#D4CBB3] opacity-60">
              No. 0{selectedFlower.id}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
