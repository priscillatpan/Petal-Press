import React, { useState } from 'react';
import { X, MapPin, Calendar, Search } from 'lucide-react';

const mockFlowers = [
  {
    id: 1,
    num: "001",
    name: "Rose",
    latin: "Rosa canina",
    meaning: "Secret love",
    date: "June 3, 2024",
    location: "Dolores Park",
    discovered: true,
    image: "/__mockup/images/critterdex-rose.png",
    season: "Summer"
  },
  {
    id: 2,
    num: "002",
    name: "Lavender",
    latin: "Lavandula",
    meaning: "Devotion",
    date: "May 12, 2024",
    location: "Mission District",
    discovered: true,
    image: "/__mockup/images/critterdex-lavender.png",
    season: "Spring"
  },
  {
    id: 3,
    num: "003",
    name: "California Poppy",
    latin: "Eschscholzia",
    meaning: "Dreams",
    date: "Apr 28, 2024",
    location: "Twin Peaks",
    discovered: true,
    image: "/__mockup/images/critterdex-poppy.png",
    season: "Spring"
  },
  {
    id: 4,
    num: "004",
    name: "Jasmine",
    latin: "Jasminum",
    meaning: "Grace",
    date: "May 30, 2024",
    location: "Noe Valley",
    discovered: true,
    image: "/__mockup/images/critterdex-jasmine.png",
    season: "Spring"
  },
  {
    id: 5,
    num: "005",
    name: "Forget-me-not",
    latin: "Myosotis",
    meaning: "True love",
    date: "June 1, 2024",
    location: "Glen Canyon",
    discovered: true,
    image: "/__mockup/images/critterdex-forgetmenot.png",
    season: "Summer"
  },
  {
    id: 6,
    num: "006",
    name: "Magnolia",
    latin: "Magnolia grandiflora",
    meaning: "Dignity",
    date: "Mar 15, 2024",
    location: "Presidio",
    discovered: true,
    image: "/__mockup/images/critterdex-magnolia.png",
    season: "Spring"
  },
  { id: 7, num: "007", name: "???", latin: "???", meaning: "???", date: "-", location: "-", discovered: false, image: "/__mockup/images/critterdex-rose.png", season: "Summer" },
  { id: 8, num: "008", name: "???", latin: "???", meaning: "???", date: "-", location: "-", discovered: false, image: "/__mockup/images/critterdex-lavender.png", season: "Fall" },
  { id: 9, num: "009", name: "???", latin: "???", meaning: "???", date: "-", location: "-", discovered: false, image: "/__mockup/images/critterdex-poppy.png", season: "Summer" },
  { id: 10, num: "010", name: "???", latin: "???", meaning: "???", date: "-", location: "-", discovered: false, image: "/__mockup/images/critterdex-jasmine.png", season: "Winter" },
  { id: 11, num: "011", name: "???", latin: "???", meaning: "???", date: "-", location: "-", discovered: false, image: "/__mockup/images/critterdex-forgetmenot.png", season: "Spring" },
  { id: 12, num: "012", name: "???", latin: "???", meaning: "???", date: "-", location: "-", discovered: false, image: "/__mockup/images/critterdex-magnolia.png", season: "Fall" },
];

const SEASONS = ["All", "Spring", "Summer", "Fall", "Winter"];

export function Critterdex() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedFlower, setSelectedFlower] = useState<typeof mockFlowers[0] | null>(null);

  const filteredFlowers = mockFlowers.filter(f => activeTab === "All" || f.season === activeTab);
  const discoveredCount = mockFlowers.filter(f => f.discovered).length;

  return (
    <div className="w-[390px] h-[844px] overflow-hidden relative flex flex-col bg-[#0F1F2E] text-[#F2E8D0]" style={{ fontFamily: 'var(--font-mono)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        
        :root {
          --font-mono: 'Space Mono', monospace;
          --font-serif: 'Fraunces', serif;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .flower-silhouette {
          filter: brightness(0) invert(0.1) sepia(1) hue-rotate(180deg) saturate(2);
          opacity: 0.8;
        }
      `}</style>

      {/* Header */}
      <div className="px-6 pt-14 pb-4 bg-[#0F1F2E] border-b border-[#2A3B4C] z-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-medium text-[#C9A84C] tracking-tight mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Index</h1>
            <p className="text-xs uppercase tracking-widest text-[#8B9DAF]">{discoveredCount} / {mockFlowers.length} Discovered</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-[#2A3B4C] flex items-center justify-center bg-[#152536]">
            <Search size={18} className="text-[#8B9DAF]" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {SEASONS.map(season => (
            <button
              key={season}
              onClick={() => setActiveTab(season)}
              className={"px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-colors " + (
                activeTab === season 
                  ? "bg-[#C9A84C] text-[#0F1F2E] font-bold" 
                  : "border border-[#2A3B4C] text-[#8B9DAF] hover:bg-[#152536]"
              )}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 bg-[#0A1520]">
        <div className="grid grid-cols-3 gap-3">
          {filteredFlowers.map(flower => (
            <button 
              key={flower.id}
              onClick={() => setSelectedFlower(flower)}
              className={"relative aspect-square rounded-xl overflow-hidden border " + (
                flower.discovered 
                  ? "border-[#C9A84C] bg-[#152536]" 
                  : "border-[#2A3B4C] bg-[#0F1F2E] opacity-70"
              ) + " transition-transform hover:scale-95 active:scale-90"}
            >
              <img 
                src={flower.image} 
                alt={flower.name}
                className={"w-full h-full object-cover " + (!flower.discovered ? 'flower-silhouette' : '')}
              />
              
              {/* Overlay grad */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-2 left-2 right-2 text-left">
                <div className="text-[10px] text-[#C9A84C] mb-0.5">No.{flower.num}</div>
                <div className="text-xs truncate" style={{ fontFamily: 'var(--font-serif)' }}>
                  {flower.discovered ? flower.name : "???"}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="h-24"></div> {/* Bottom spacing for scroll */}
      </div>

      {/* Detail Panel */}
      <div 
        className={"absolute bottom-0 left-0 right-0 bg-[#F2E8D0] text-[#0F1F2E] rounded-t-3xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 " + (
          selectedFlower ? "translate-y-0 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]" : "translate-y-[110%]"
        )}
        style={{ height: '70%' }}
      >
        {selectedFlower && (
          <div className="h-full flex flex-col p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="text-[#C9A84C] font-bold text-lg tracking-widest">
                No.{selectedFlower.num}
              </div>
              <button 
                onClick={() => setSelectedFlower(null)}
                className="p-2 rounded-full bg-[#E5D8B8] hover:bg-[#D5C8A8] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-5 mb-8">
              <div className="w-1/2 aspect-[4/5] rounded-xl overflow-hidden border-2 border-[#0F1F2E] relative bg-[#0F1F2E]">
                <img 
                  src={selectedFlower.image} 
                  alt={selectedFlower.name}
                  className={"w-full h-full object-cover " + (!selectedFlower.discovered ? 'flower-silhouette' : '')}
                />
                {!selectedFlower.discovered && (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl text-[#F2E8D0]/50" style={{ fontFamily: 'var(--font-serif)' }}>
                    ?
                  </div>
                )}
              </div>
              
              <div className="w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl font-medium mb-1 leading-tight" style={{ fontFamily: 'var(--font-serif)' }}>
                  {selectedFlower.discovered ? selectedFlower.name : "Unknown"}
                </h2>
                <div className="text-sm italic text-[#5C6D7E] mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                  {selectedFlower.discovered ? selectedFlower.latin : "Botanical name unknown"}
                </div>
                
                {selectedFlower.discovered && (
                  <div className="border-t border-[#D5C8A8] pt-3">
                    <div className="text-[10px] uppercase tracking-widest text-[#8B9DAF] mb-1">Meaning</div>
                    <div className="text-sm font-medium">"{selectedFlower.meaning}"</div>
                  </div>
                )}
              </div>
            </div>

            {selectedFlower.discovered ? (
              <div className="bg-[#E5D8B8] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-[#C9A84C]" />
                  <span>Found on <span className="font-bold">{selectedFlower.date}</span></span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-[#C9A84C]" />
                  <span>Recorded at <span className="font-bold">{selectedFlower.location}</span></span>
                </div>
              </div>
            ) : (
              <div className="bg-[#E5D8B8]/50 border border-dashed border-[#D5C8A8] rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <div className="text-[#8B9DAF] mb-2">
                  <Search size={24} />
                </div>
                <p className="text-sm text-[#5C6D7E]">This species has not been documented in your area yet. Keep exploring!</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Backdrop for detail panel */}
      {selectedFlower && (
        <div 
          className="absolute inset-0 bg-[#0F1F2E]/60 backdrop-blur-sm z-40"
          onClick={() => setSelectedFlower(null)}
        />
      )}
    </div>
  );
}
