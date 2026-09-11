import React, { useState } from 'react';
import { Sparkles, Sun, Feather, ArrowRight, Play, Award, CheckCircle } from 'lucide-react';
import mauveDressImg from '../assets/images/balochi_dress_mauve_1789105472348.jpg';
import heroBannerImg from '../assets/images/noorbal_hero_banner_1789105444694.jpg';

interface BalochiHeritageStoryProps {
  onExploreBalochi: () => void;
}

export const BalochiHeritageStory: React.FC<BalochiHeritageStoryProps> = ({
  onExploreBalochi,
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <section id="our-story-section" className="py-12 sm:py-18 lg:py-24 bg-[#F4F0E8] border-y border-[#E5DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Editorial Story Layout (Screen 7 Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-center">
          
          {/* Visual Showcase with Play Aesthetic & High-Resolution Media */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C9A468]/40 group bg-[#2B231E]">
              <img
                src={heroBannerImg}
                alt="NOORBAL Balochi Artisan Needlework Heritage"
                className="w-full h-auto object-cover max-h-[380px] sm:max-h-[500px] group-hover:scale-103 transition-transform duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />
              
              {/* Soft Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                  aria-label="Play artisan craft documentary"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C9A468]/90 hover:bg-[#DFBF88] text-[#2B231E] flex items-center justify-center shadow-2xl backdrop-blur-xs transition-all transform hover:scale-108 active:scale-95 group/play border-2 border-white cursor-pointer"
                >
                  <Play className="w-7 h-7 fill-current ml-1 text-[#2B231E] transition-transform group-hover/play:scale-110" />
                </button>
              </div>

              {/* Bottom Quote Card Overlay */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#2B231E]/90 backdrop-blur-md text-[#FAF8F5] border border-[#C9A468]/40 text-xs shadow-xl">
                <p className="font-serif italic text-xs sm:text-sm text-[#DFBF88] mb-1 leading-snug">
                  “To bring Balochi heritage, craftsmanship, and modern elegance together in products people can proudly wear and use.”
                </p>
                <span className="text-[10px] tracking-widest uppercase text-white/70 block">
                  — The NOORBAL Philosophy
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Brand Narrative & Badges */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A468]/15 text-[#8D7B68] text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A468]" />
                <span>Our Heritage</span>
              </div>
              
              <h2 className="font-serif text-[26px] sm:text-[30px] lg:text-[34px] font-medium sm:font-semibold text-[#2B231E] leading-[1.15]">
                Living Traditions of Balochistan Crafted for the Contemporary World
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#5C5046] font-sans leading-[1.6]">
              NOORBAL bridges timeless Balochi needlework traditions with contemporary luxury fashion. Handcrafted dresses, signature oud fragrances, and prestige accessories for discerning women and men across Pakistan and worldwide.
            </p>

            <p className="text-sm sm:text-base text-[#5C5046]/90 font-sans leading-[1.6]">
              Each geometric pattern and silk stitch is passed down from mother to daughter across generations in the valleys of Balochistan. We preserve this sacred heritage with dignified artisan remuneration and modern silhouettes.
            </p>

            {/* 3 Heritage Badges (Screen 7) */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E5DFD5] text-xs font-sans font-semibold text-[#2B231E] shadow-2xs">
                <CheckCircle className="w-3.5 h-3.5 text-[#C9A468]" />
                <span>100% Handcrafted</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E5DFD5] text-xs font-sans font-semibold text-[#2B231E] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A468]" />
                <span>Authentic Balochi Craft</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E5DFD5] text-xs font-sans font-semibold text-[#2B231E] shadow-2xs">
                <Award className="w-3.5 h-3.5 text-[#C9A468]" />
                <span>Timeless Elegance</span>
              </span>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                id="story-explore-collection-btn"
                type="button"
                onClick={onExploreBalochi}
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-[#2B231E] hover:bg-[#3D322B] text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 group active:scale-[0.98] cursor-pointer"
              >
                <span>DISCOVER OUR STORY</span>
                <ArrowRight className="w-4 h-4 text-[#DFBF88] transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>

        </div>

        {/* The 3 Pillars (Light · Heritage · Softness) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-[#E5DFD5]">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#C9A468] border border-[#E5DFD5]">
              <Sun className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-medium sm:font-semibold text-[#2B231E]">Light</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-sans leading-[1.5]">
              Clean, radiant, and contemporary presentation that shines with quiet prestige and clarity.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#C9A468] border border-[#E5DFD5]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-medium sm:font-semibold text-[#2B231E]">Heritage</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-sans leading-[1.5]">
              100% authentic Balochi identity and traditional needlework preserved with dignity and pride.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5DFD5] space-y-2 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#C9A468] border border-[#E5DFD5]">
              <Feather className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg font-medium sm:font-semibold text-[#2B231E]">Softness</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-sans leading-[1.5]">
              Uncompromising comfort, tactile warmth, and breathable luxury in every bespoke stitch.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
