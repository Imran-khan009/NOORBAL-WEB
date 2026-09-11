import React from 'react';
import { Sparkles, Heart, Sun, Feather, ArrowRight } from 'lucide-react';
import mauveDressImg from '../assets/images/balochi_dress_mauve_1789105472348.jpg';

interface BalochiHeritageStoryProps {
  onExploreBalochi: () => void;
}

export const BalochiHeritageStory: React.FC<BalochiHeritageStoryProps> = ({
  onExploreBalochi,
}) => {
  return (
    <section id="our-story-section" className="py-16 sm:py-24 bg-[#F4F0E8] border-y border-[#E5DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Visual Portrait */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C9A468]/30">
              <img
                src={mauveDressImg}
                alt="Balochi Artisan Hand Embroidery"
                className="w-full h-auto object-cover max-h-[520px]"
                referrerPolicy="no-referrer"
              />
              
              {/* Quote Card Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#2B231E]/90 backdrop-blur-md text-[#FAF8F5] border border-[#C9A468]/40 text-xs">
                <p className="font-serif italic text-sm text-[#DFBF88] mb-1">
                  “To bring Balochi heritage, craftsmanship, and modern elegance together in products people can proudly wear and use.”
                </p>
                <span className="text-[10px] tracking-widest uppercase text-white/70 block">
                  — The NOORBAL Philosophy
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Brand Narrative & Three Pillars */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A468]/15 text-[#8D7B68] text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A468]" />
                <span>The Spirit of Balochistan</span>
              </div>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B231E] leading-tight">
                Generations of Needlework Crafted for the Modern World
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#5C5046] font-sans leading-relaxed">
              Balochi embroidery is not simply fashion; it is living art. Each geometric pattern and intricate stitch is handed down from mother to daughter across generations in the valleys of Balochistan. What once took months of solitary artisan dedication is now respectfully elevated into modern silhouettes.
            </p>

            {/* The 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              <div className="p-4 rounded-xl bg-white border border-[#E5DFD5] space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#C9A468] border border-[#E5DFD5]">
                  <Sun className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#2B231E]">Light</h4>
                <p className="text-xs text-gray-600 leading-normal">
                  Clean, radiant, and contemporary presentation that shines with quiet prestige.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E5DFD5] space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#C9A468] border border-[#E5DFD5]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#2B231E]">Heritage</h4>
                <p className="text-xs text-gray-600 leading-normal">
                  100% authentic Balochi identity and traditional needlework preserved with dignity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E5DFD5] space-y-2 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#C9A468] border border-[#E5DFD5]">
                  <Feather className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#2B231E]">Softness</h4>
                <p className="text-xs text-gray-600 leading-normal">
                  Uncompromising comfort, tactile warmth, and breathable luxury in every piece.
                </p>
              </div>

            </div>

            {/* Link to collection */}
            <div className="pt-3">
              <button
                id="story-explore-collection-btn"
                onClick={onExploreBalochi}
                className="px-6 py-3 bg-[#2B231E] hover:bg-[#3D322B] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow transition-all flex items-center gap-2 group"
              >
                <span>View Hand-Embroidered Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#C9A468]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
