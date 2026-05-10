import React from "react";
import { ArrowLeft, Bookmark } from "lucide-react";

export default function HerbariumEntry() {
  return (
    <div className="min-h-screen w-full relative flex flex-col font-serif" style={{ backgroundColor: "#F5EFD8", color: "#2C2A25" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=IM+Fell+English:ital@0;1&display=swap');
        
        .font-fraunces { font-family: 'Fraunces', serif; }
        .font-im-fell { font-family: 'IM Fell English', serif; }
        
        .washi-tape {
          background-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transform: rotate(-1deg);
          border-left: 2px dashed rgba(0,0,0,0.1);
          border-right: 2px dashed rgba(0,0,0,0.1);
        }
        
        .pencil-line {
          border-color: rgba(44, 42, 37, 0.3);
        }
        
        .ruled-line {
          border-bottom: 1px solid rgba(44, 42, 37, 0.15);
        }
      `}} />

      {/* Top Nav */}
      <div className="flex items-center justify-between p-6 pb-2">
        <button className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors">
          <ArrowLeft size={20} className="text-[#2C2A25]" strokeWidth={1.5} />
        </button>
        <button className="p-2 -mr-2 rounded-full hover:bg-black/5 transition-colors">
          <Bookmark size={20} className="text-[#2C2A25]" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-12">
        {/* Specimen Frame */}
        <div className="relative w-full aspect-square mt-4 mb-8 border pencil-line p-3">
          <div className="w-full h-full border pencil-line relative flex items-center justify-center overflow-hidden bg-[#Fdfcf7] mix-blend-multiply">
            {/* The mix-blend-multiply helps the white bg of the generated image blend with the parchment */}
            <img 
              src="/__mockup/images/herbarium-entry-rose.png" 
              alt="Wild Rose Illustration"
              className="w-full h-full object-cover mix-blend-multiply opacity-90 scale-105"
            />
            {/* Corner mounting tapes */}
            <div className="absolute top-2 left-2 w-6 h-1.5 bg-[#E8DEc3] -rotate-45" />
            <div className="absolute top-2 right-2 w-6 h-1.5 bg-[#E8DEc3] rotate-45" />
            <div className="absolute bottom-2 left-2 w-6 h-1.5 bg-[#E8DEc3] rotate-45" />
            <div className="absolute bottom-2 right-2 w-6 h-1.5 bg-[#E8DEc3] -rotate-45" />
          </div>
        </div>

        {/* Header section */}
        <div className="flex flex-col items-center mb-6">
          <div className="washi-tape px-6 py-2 mb-3">
            <h1 className="font-fraunces italic text-2xl font-light tracking-wide text-center">Wild Rose</h1>
          </div>
          <p className="font-im-fell italic text-[#6b665c] text-lg tracking-wider">Rosa canina</p>
        </div>

        {/* Divider */}
        <div className="w-full border-t pencil-line my-6" />

        {/* Details grid */}
        <div className="space-y-6">
          
          {/* Floriography */}
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8577] mb-1 font-medium">Language of Flowers</span>
            <span className="font-fraunces italic text-xl">Secret love</span>
          </div>

          {/* Found info */}
          <div className="flex justify-between px-4">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8577] mb-1">Found</span>
              <span className="font-im-fell italic text-lg">June 3</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8577] mb-1">Location</span>
              <span className="font-im-fell italic text-lg">Dolores Park</span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t pencil-line my-6" />

          {/* Seasonality */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8577] mb-3 font-medium">In Bloom</span>
            <div className="flex gap-2">
              {['J','F','M','A','M','J','J','A','S','O','N','D'].map((month, i) => {
                const isHighlighted = i >= 4 && i <= 6; // May to July
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className="text-[9px] font-medium text-[#8c8577]">{month}</span>
                    <div className={"w-1.5 h-1.5 rounded-full " + (isHighlighted ? "bg-[#D97742]" : "bg-[#d4cdbd]")} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t pencil-line my-6" />

          {/* Notes */}
          <div className="flex flex-col mt-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c8577] mb-2 font-medium">Field Notes</span>
            <div className="w-full ruled-line py-2">
              <span className="font-im-fell italic text-[#8c8577] text-lg">Add a note...</span>
            </div>
            <div className="w-full ruled-line py-2 h-8" />
            <div className="w-full ruled-line py-2 h-8" />
          </div>

        </div>

        {/* Progress note */}
        <div className="mt-12 mb-4 text-center">
          <span className="font-im-fell italic text-[#8c8577] text-sm">5 of 7 pressed</span>
        </div>
      </div>
    </div>
  );
}
