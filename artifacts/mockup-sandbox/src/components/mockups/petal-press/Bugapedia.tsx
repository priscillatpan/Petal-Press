import React, { useState } from 'react';
import { Check } from 'lucide-react';

const FLOWERS = {
  rose: {
    id: 'rose',
    name: 'Wild Rose',
    latin: 'Rosa canina',
    meaning: 'Secret love',
    season: [5, 6, 7], // Jun, Jul, Aug (0-indexed month)
    date: 'Jun 12, 2023',
    location: 'Dolores Park',
    image: '/__mockup/images/buga-rose.png',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    latin: 'Lavandula',
    meaning: 'Serenity & grace',
    season: [5, 6, 7],
    date: 'Jul 4, 2023',
    location: 'Dolores Park',
    image: '/__mockup/images/buga-lavender.png',
  },
  poppy: {
    id: 'poppy',
    name: 'California Poppy',
    latin: 'Eschscholzia californica',
    meaning: 'Success & imagination',
    season: [2, 3, 4],
    date: 'Apr 22, 2023',
    location: 'Dolores Park',
    image: '/__mockup/images/buga-poppy.png',
  },
  jasmine: {
    id: 'jasmine',
    name: 'Star Jasmine',
    latin: 'Trachelospermum',
    meaning: 'Amiability',
    season: [4, 5, 6],
    date: 'May 18, 2023',
    location: 'Mission District',
    image: '/__mockup/images/buga-jasmine.png',
  },
  forgetmenot: {
    id: 'forgetmenot',
    name: 'Forget-me-not',
    latin: 'Myosotis',
    meaning: 'True love & memories',
    season: [3, 4, 5],
    date: 'May 2, 2023',
    location: 'Mission District',
    image: '/__mockup/images/buga-forgetmenot.png',
  }
};

const GROUPS = [
  {
    id: 'dolores',
    name: 'Dolores Park',
    total: 3,
    items: ['rose', 'lavender', 'poppy']
  },
  {
    id: 'mission',
    name: 'Mission District',
    total: 4,
    items: ['jasmine', 'forgetmenot', null, null]
  }
];

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export default function Bugapedia() {
  const [selectedId, setSelectedId] = useState('rose');
  const selected = FLOWERS[selectedId as keyof typeof FLOWERS];

  return (
    <div className="relative w-full h-[100dvh] bg-[#1a1a1a] flex items-center justify-center overflow-hidden font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&family=Fredoka+One&display=swap');
      `}} />
      
      <div className="w-[390px] h-[844px] flex flex-col relative shadow-2xl overflow-hidden rounded-[24px]">
        {/* TOP LEFT PAGE */}
        <div className="h-[42%] bg-[#FBF6E9] p-5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="mb-4">
            <h1 className="text-[#4A8C7A] text-2xl" style={{ fontFamily: '"Fredoka One", cursive' }}>My Pressings</h1>
            <p className="text-[#4A8C7A]/70 text-sm font-medium tracking-wide">SF Neighborhoods</p>
          </div>

          <div className="flex flex-col gap-5 pb-8">
            {GROUPS.map((group) => (
              <div key={group.id} className="flex flex-col gap-2">
                <h2 className="text-[#4A8C7A] text-sm font-bold flex items-center gap-1">
                  {group.name} 
                  <span className="opacity-60 font-normal">({group.items.filter(Boolean).length}/{group.total})</span>
                </h2>
                
                <div className="grid grid-cols-4 gap-2">
                  {group.items.map((item, idx) => {
                    if (!item) {
                      return (
                        <div 
                          key={"empty-" + group.id + "-" + idx}
                          className="aspect-square rounded-[12px] w-full"
                          style={{
                            boxShadow: '0 0 0 3px #4A8C7A',
                            transform: idx % 2 === 0 ? 'rotate(-0.5deg)' : 'rotate(0.5deg)',
                            backgroundColor: 'transparent'
                          }}
                        />
                      );
                    }
                    
                    const isSelected = selectedId === item;
                    const flower = FLOWERS[item as keyof typeof FLOWERS];
                    
                    return (
                      <button
                        key={item}
                        onClick={() => setSelectedId(item)}
                        className={"relative aspect-square rounded-[12px] w-full overflow-hidden transition-transform active:scale-95 " + (isSelected ? "bg-[#4A8C7A]/10 scale-105 z-10" : "bg-white")}
                        style={{
                          boxShadow: isSelected ? '0 0 0 4px #4A8C7A, 0 4px 12px rgba(0,0,0,0.1)' : '0 0 0 3px #4A8C7A',
                          transform: isSelected ? 'rotate(0deg)' : idx % 2 === 0 ? 'rotate(-1.5deg)' : 'rotate(1.5deg)',
                        }}
                      >
                        <img 
                          src={flower.image} 
                          alt={flower.name} 
                          className="w-full h-full object-cover p-1 mix-blend-multiply" 
                        />
                        <div className="absolute bottom-1 right-1 bg-[#4A8C7A] text-[#FBF6E9] rounded-full p-[2px]">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BINDING SPINE */}
        <div 
          className="h-[10px] w-full shadow-inner z-20 relative"
          style={{
            backgroundColor: '#8B6914',
            backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            boxShadow: 'inset 0 4px 6px -2px rgba(0,0,0,0.4), inset 0 -4px 6px -2px rgba(0,0,0,0.4)'
          }}
        />

        {/* BOTTOM RIGHT PAGE */}
        <div className="h-[55%] bg-[#F5EDD8] p-6 flex flex-col items-center shadow-[inset_0_15px_15px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden">
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0xIDFIMnYxSDF6TTMgM0g0djFINDN6IiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPg==')] z-0"></div>
          
          <div className="relative z-10 flex flex-col items-center w-full h-full">
            <div 
              className="w-[140px] h-[140px] rounded-[24px] bg-white mt-2 mb-5 relative flex items-center justify-center overflow-hidden"
              style={{
                boxShadow: '0 8px 24px -4px rgba(74, 140, 122, 0.2), 0 0 0 1px rgba(74, 140, 122, 0.1)',
                transform: 'rotate(-2deg)'
              }}
            >
              <img 
                src={selected.image} 
                alt={selected.name}
                className="w-[120px] h-[120px] object-contain drop-shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#4A8C7A] text-[#FBF6E9] rounded-full p-1.5 shadow-lg flex items-center gap-1 pr-3 pl-2 transform rotate(2deg)">
                <Check size={14} strokeWidth={3} />
                <span className="text-[10px] font-bold tracking-wide uppercase">Pressed</span>
              </div>
            </div>

            <h2 className="text-[#2C4A41] text-3xl mb-1 text-center" style={{ fontFamily: '"Fraunces", serif' }}>
              {selected.name}
            </h2>
            <p className="text-[#4A8C7A]/80 italic text-sm mb-4 font-serif">
              {selected.latin}
            </p>

            <div className="bg-[#4A8C7A]/5 border border-[#4A8C7A]/10 rounded-xl p-4 w-full mb-5 text-center">
              <p className="text-[#8B6914] italic text-lg" style={{ fontFamily: '"Fraunces", serif' }}>
                "{selected.meaning}"
              </p>
            </div>

            <div className="w-full mb-6">
              <p className="text-[10px] uppercase tracking-widest text-[#4A8C7A]/60 font-bold mb-2 pl-1">Blooming Season</p>
              <div className="flex justify-between items-center bg-white/50 p-2 rounded-lg border border-[#4A8C7A]/10">
                {MONTHS.map((m, i) => {
                  const inSeason = selected.season.includes(i);
                  return (
                    <div 
                      key={i} 
                      className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors " + (inSeason ? "bg-[#4A8C7A] text-[#FBF6E9]" : "text-[#4A8C7A]/30")}
                    >
                      {m}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 w-full mt-auto">
              <div className="flex-1 bg-white/50 border border-[#4A8C7A]/10 rounded-lg p-3 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-widest text-[#4A8C7A]/60 font-bold mb-1">Found</span>
                <span className="text-sm font-medium text-[#2C4A41]">{selected.date}</span>
              </div>
              <div className="flex-1 bg-white/50 border border-[#4A8C7A]/10 rounded-lg p-3 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-widest text-[#4A8C7A]/60 font-bold mb-1">Location</span>
                <span className="text-sm font-medium text-[#2C4A41] truncate">{selected.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}