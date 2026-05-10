import React, { useState } from 'react';

export function FieldJournal() {
  const [selectedFlower, setSelectedFlower] = useState<number | null>(null);

  const flowers = [
    {
      id: 1,
      name: "Rose",
      latin: "Rosa canina",
      meaning: "Secret love",
      date: "June 3",
      location: "Dolores Park",
      image: "/__mockup/images/journal-rose.png",
      rotation: -1.5,
      washi: "red"
    },
    {
      id: 2,
      name: "Lavender",
      latin: "Lavandula",
      meaning: "Devotion",
      date: "May 12",
      location: "Mission District",
      image: "/__mockup/images/journal-lavender.png",
      rotation: 1.2,
      washi: "blue"
    },
    {
      id: 3,
      name: "California Poppy",
      latin: "Eschscholzia",
      meaning: "Dreams",
      date: "Apr 28",
      location: "Twin Peaks",
      image: "/__mockup/images/journal-poppy.png",
      rotation: -0.5,
      washi: "yellow"
    },
    {
      id: 4,
      name: "Jasmine",
      latin: "Jasminum",
      meaning: "Grace",
      date: "May 30",
      location: "Noe Valley",
      image: "/__mockup/images/journal-jasmine.png",
      rotation: 2.1,
      washi: "none"
    },
    {
      id: 5,
      name: "Forget-me-not",
      latin: "Myosotis",
      meaning: "True love",
      date: "June 1",
      location: "Glen Canyon",
      image: "/__mockup/images/journal-forgetmenot.png",
      rotation: -1.8,
      washi: "blue"
    }
  ];

  return (
    <div className="w-[390px] h-[844px] bg-[#FAFAF5] relative overflow-hidden text-[#1B3A5C] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&display=swap');
        
        .font-handwritten {
          font-family: 'Caveat', cursive;
        }
        
        .font-heading {
          font-family: 'Fraunces', serif;
        }

        .journal-lines {
          background-image: repeating-linear-gradient(transparent, transparent 31px, rgba(27, 58, 92, 0.1) 31px, rgba(27, 58, 92, 0.1) 32px);
          background-size: 100% 32px;
          background-position: 0 4px;
        }

        .washi-tape {
          position: absolute;
          width: 60px;
          height: 15px;
          background-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transform: rotate(-3deg);
          z-index: 10;
          opacity: 0.8;
          mix-blend-mode: multiply;
        }

        .washi-red { background-color: rgba(230, 100, 100, 0.4); }
        .washi-blue { background-color: rgba(100, 150, 230, 0.4); }
        .washi-yellow { background-color: rgba(230, 200, 100, 0.4); }

        .polaroid-shadow {
          box-shadow: 2px 4px 8px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05);
        }

        .torn-edge {
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), 98% 100%, 96% calc(100% - 5px), 94% 100%, 92% calc(100% - 8px), 90% 100%, 88% calc(100% - 4px), 86% 100%, 84% calc(100% - 9px), 82% 100%, 80% calc(100% - 5px), 78% 100%, 76% calc(100% - 10px), 74% 100%, 72% calc(100% - 6px), 70% 100%, 68% calc(100% - 8px), 66% 100%, 64% calc(100% - 4px), 62% 100%, 60% calc(100% - 9px), 58% 100%, 56% calc(100% - 5px), 54% 100%, 52% calc(100% - 10px), 50% 100%, 48% calc(100% - 4px), 46% 100%, 44% calc(100% - 8px), 42% 100%, 40% calc(100% - 5px), 38% 100%, 36% calc(100% - 9px), 34% 100%, 32% calc(100% - 4px), 30% 100%, 28% calc(100% - 10px), 26% 100%, 24% calc(100% - 6px), 22% 100%, 20% calc(100% - 8px), 18% 100%, 16% calc(100% - 4px), 14% 100%, 12% calc(100% - 9px), 10% 100%, 8% calc(100% - 5px), 6% 100%, 4% calc(100% - 10px), 2% 100%, 0 calc(100% - 5px));
        }
      `}</style>

      {/* Header */}
      <div className="pt-12 pb-6 px-6 relative z-10 flex justify-center">
        <div className="bg-[#FAF5E6] border border-[#E0D5B5] px-6 py-2 rounded-sm shadow-sm transform -rotate-1 relative">
          <div className="absolute top-1/2 -left-2 w-4 h-4 rounded-full bg-[#FAFAF5] border border-[#E0D5B5] transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-[#FAFAF5] border border-[#E0D5B5] transform -translate-y-1/2"></div>
          <h1 className="font-heading text-2xl font-bold tracking-wider text-[#2A2A2A]">My Garden</h1>
        </div>
      </div>

      {/* Main Journal Area */}
      <div className="h-full px-4 overflow-y-auto pb-32 journal-lines">
        <div className="grid grid-cols-2 gap-4 gap-y-8 pt-4">
          {flowers.map((flower) => (
            <div 
              key={flower.id} 
              className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
              style={{ transform: "rotate(" + flower.rotation + "deg)" }}
              onClick={() => setSelectedFlower(flower.id)}
            >
              {flower.washi !== 'none' && (
                <div className={"washi-tape washi-" + flower.washi + " -top-2 left-4"} />
              )}
              
              <div className="bg-white p-2 pb-6 polaroid-shadow rounded-sm flex flex-col items-center">
                <div className="w-full aspect-square bg-[#F0F0F0] relative overflow-hidden mb-2">
                  <img 
                    src={flower.image} 
                    alt={flower.name}
                    className="w-full h-full object-cover mix-blend-multiply opacity-90"
                  />
                </div>
                <div className="font-handwritten text-xl text-center leading-none">
                  {flower.name}
                </div>
                <div className="font-handwritten text-sm text-[#8C3A3A] text-center mt-1">
                  {flower.date}
                </div>
              </div>
            </div>
          ))}

          {/* Blank Slots */}
          {[1, 2].map((i) => (
            <div key={"blank-" + i} className="relative flex flex-col items-center justify-center p-2" style={{ transform: i === 1 ? 'rotate(1deg)' : 'rotate(-1.5deg)' }}>
               <div className="w-full aspect-square border-2 border-dashed border-[#1B3A5C]/30 rounded-sm flex items-center justify-center mb-2">
                 <span className="font-handwritten text-[#1B3A5C]/50 text-xl text-center px-4">press a flower here</span>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Entry Overlay */}
      {selectedFlower && (
        <div className="absolute inset-0 bg-[#1B3A5C]/20 backdrop-blur-sm z-50 flex items-end justify-center pb-0 animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={() => setSelectedFlower(null)} />
          
          <div className="w-full h-[85%] bg-[#FAFAF5] journal-lines rounded-t-3xl shadow-2xl relative flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#1B3A5C]/20 rounded-full" />
            
            <button 
              className="absolute top-6 right-6 font-handwritten text-2xl text-[#1B3A5C]/60 hover:text-[#1B3A5C]"
              onClick={() => setSelectedFlower(null)}
            >
              ✕
            </button>

            {flowers.filter(f => f.id === selectedFlower).map(flower => (
              <div key={flower.id} className="p-8 pt-12 overflow-y-auto h-full flex flex-col">
                <div className="relative self-center mb-8 transform -rotate-2">
                  <div className="washi-tape washi-yellow -top-3 left-1/2 transform -translate-x-1/2 rotate-1" />
                  <div className="bg-white p-3 pb-8 polaroid-shadow rounded-sm w-[240px]">
                    <div className="w-full aspect-square bg-gray-100 mb-3">
                      <img 
                        src={flower.image} 
                        alt={flower.name}
                        className="w-full h-full object-cover mix-blend-multiply opacity-95"
                      />
                    </div>
                    <div className="font-handwritten text-3xl text-center">{flower.name}</div>
                  </div>
                </div>

                <div className="space-y-6 mt-4">
                  <div>
                    <h3 className="font-heading text-sm uppercase tracking-widest text-[#1B3A5C]/50 mb-1">Scientific Name</h3>
                    <p className="font-handwritten text-2xl pl-2 italic">{flower.latin}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-heading text-sm uppercase tracking-widest text-[#1B3A5C]/50 mb-1">Floriography</h3>
                    <p className="font-handwritten text-3xl pl-2 text-[#8C3A3A]">{flower.meaning}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-[#1B3A5C]/10 pt-4">
                    <div>
                      <h3 className="font-heading text-sm uppercase tracking-widest text-[#1B3A5C]/50 mb-1">Date Found</h3>
                      <p className="font-handwritten text-2xl pl-2">{flower.date}</p>
                    </div>
                    <div>
                      <h3 className="font-heading text-sm uppercase tracking-widest text-[#1B3A5C]/50 mb-1">Location</h3>
                      <p className="font-handwritten text-2xl pl-2 leading-tight">{flower.location}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-dashed border-[#1B3A5C]/30">
                    <p className="font-handwritten text-xl text-[#1B3A5C]/70 leading-relaxed">
                      Pressed carefully between the pages of a heavy book. Still retains some of its original color.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
