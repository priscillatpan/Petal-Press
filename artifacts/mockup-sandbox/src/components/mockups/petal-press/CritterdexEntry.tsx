import React from 'react';
import { ArrowLeft, Bookmark, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';

export default function CritterdexEntry() {
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const activeMonths = [5, 6, 7]; // Jun, Jul, Aug (0-indexed)

  return (
    <div className="w-full h-full min-h-[100dvh] flex flex-col bg-[#0F1F2E] text-[#F2E8D0] overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        .font-fraunces { font-family: 'Fraunces', serif; }
        .font-space { font-family: 'Space Mono', monospace; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-between p-4 z-10 sticky top-0 bg-[#0F1F2E]/90 backdrop-blur-sm">
        <button className="p-2 -ml-2 text-[#C9A84C] active:opacity-70 transition-opacity">
          <ArrowLeft size={24} />
        </button>
        <div className="font-space text-[#C9A84C] tracking-wider text-sm font-bold">
          No. 001
        </div>
        <button className="p-2 -mr-2 text-[#C9A84C] active:opacity-70 transition-opacity">
          <Bookmark size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {/* Photo Panel */}
        <div className="relative w-full aspect-[4/5] max-h-[45vh] border-b-2 border-t-2 border-[#C9A84C]">
          <img 
            src="/__mockup/images/critterdex-entry-rose.png" 
            alt="Deep red rose"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#C9A84C]/20 to-transparent mix-blend-overlay pointer-events-none" />
          
          <div className="absolute bottom-4 left-4 z-10">
            <div className="bg-[#0F1F2E]/80 backdrop-blur-md border border-[#C9A84C] px-3 py-1 font-space text-[10px] tracking-widest text-[#C9A84C] uppercase">
              Discovered
            </div>
          </div>
        </div>

        {/* Content Section - Cream */}
        <div className="bg-[#F2E8D0] text-[#0F1F2E] px-6 py-8 rounded-b-3xl shadow-lg relative z-20 -mt-2">
          <h1 className="font-fraunces text-4xl mb-1 text-[#0F1F2E]">Rose</h1>
          <p className="font-fraunces italic text-lg text-[#0F1F2E]/70 mb-6">Rosa canina</p>
          
          <hr className="border-[#C9A84C]/30 mb-6" />
          
          <div className="space-y-6">
            {/* Meaning */}
            <div>
              <h3 className="font-space text-xs uppercase tracking-widest text-[#0F1F2E]/50 mb-2">Language of Flowers</h3>
              <p className="font-fraunces italic text-2xl text-[#0F1F2E]">Secret love</p>
            </div>

            {/* Season Chart */}
            <div>
              <h3 className="font-space text-xs uppercase tracking-widest text-[#0F1F2E]/50 mb-3">Season</h3>
              <div className="flex justify-between items-center bg-[#0F1F2E]/5 p-2 rounded-xl">
                {months.map((month, idx) => (
                  <div 
                    key={idx} 
                    className={"w-6 h-6 rounded-full flex items-center justify-center font-space text-[10px] transition-colors " + 
                      (activeMonths.includes(idx) 
                        ? "bg-[#C9A84C] text-[#0F1F2E] font-bold" 
                        : "text-[#0F1F2E]/40"
                      )}
                  >
                    {month}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navy Bottom Section */}
        <div className="px-6 pt-8 pb-4 space-y-6">
          {/* Found Tags */}
          <div>
            <h3 className="font-space text-xs uppercase tracking-widest text-[#C9A84C]/70 mb-3">Discovery Log</h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-[#F2E8D0] text-[#0F1F2E] px-3 py-1.5 rounded-full font-space text-xs">
                <Calendar size={14} className="text-[#C9A84C]" />
                <span>June 3</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F2E8D0] text-[#0F1F2E] px-3 py-1.5 rounded-full font-space text-xs">
                <MapPin size={14} className="text-[#C9A84C]" />
                <span>Dolores Park</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#16293D] p-5 rounded-2xl border border-[#C9A84C]/20">
            <h3 className="font-space text-xs uppercase tracking-widest text-[#C9A84C]/70 mb-2">Field Notes</h3>
            <p className="font-fraunces italic text-[#F2E8D0]/40">No notes yet...</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0F1F2E] via-[#0F1F2E]/90 to-transparent flex justify-between items-center pointer-events-none">
        <button className="w-10 h-10 rounded-full bg-[#16293D] border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] pointer-events-auto active:bg-[#C9A84C] active:text-[#0F1F2E] transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="font-space text-[10px] text-[#C9A84C]/50 tracking-widest">001 / 151</div>
        <button className="w-10 h-10 rounded-full bg-[#16293D] border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] pointer-events-auto active:bg-[#C9A84C] active:text-[#0F1F2E] transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
