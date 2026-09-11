import React, { useState, useRef } from 'react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import heroBannerImg from '../assets/images/noorbal_hero_banner_1789105444694.jpg';
import mauveDressImg from '../assets/images/balochi_dress_mauve_1789105472348.jpg';
import menKurtaImg from '../assets/images/men_kurta_charcoal_1789105549455.jpg';
import perfumeImg from '../assets/images/noorbal_perfume_amber_1789105490295.jpg';
import watchImg from '../assets/images/noorbal_heritage_watch_1789105506616.jpg';

interface FeaturedCollectionsCarouselProps {
  onSelectCategory: (categoryId: string) => void;
}

const FEATURED_CARDS = [
  {
    id: 'balochi-heritage',
    title: 'Balochi Heritage',
    subtitle: 'Traditional craftsmanship. Timeless beauty.',
    image: mauveDressImg,
    badge: 'Artisan Needlework',
    lead: 'Ready-Stock & Bespoke Heirloom Dresses',
  },
  {
    id: 'men',
    title: 'Men’s Collection',
    subtitle: 'Modern poise. Cultural silhouette.',
    image: menKurtaImg,
    badge: 'Contemporary Poise',
    lead: 'Tailored Minimalist Charcoal Kurtas',
  },
  {
    id: 'perfumes',
    title: 'Royal Fragrances',
    subtitle: 'Golden Amber & Aged Smoked Oud.',
    image: perfumeImg,
    badge: 'Extrait De Parfum',
    lead: 'Velvety Damascus Rose & Smoked Resin',
  },
  {
    id: 'watches',
    title: 'Prestige Accessories',
    subtitle: 'Moonphase Horology & Artisan Leather.',
    image: watchImg,
    badge: 'Fine Craftsmanship',
    lead: 'Celestial Moonphase & Burnished Leather',
  },
];

export const FeaturedCollectionsCarousel: React.FC<FeaturedCollectionsCarouselProps> = ({
  onSelectCategory,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const newIndex = Math.round(scrollLeft / (clientWidth * 0.85));
      setActiveIndex(Math.min(newIndex, FEATURED_CARDS.length - 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth * 0.85;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-5 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-wider text-[#C9A468]">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A468]" />
              <span>Featured Collections</span>
            </div>
            <h2 className="font-serif text-[26px] sm:text-[30px] lg:text-[32px] font-medium sm:font-semibold text-[#2B231E] mt-1 leading-[1.15]">
              Tradition in Every Detail
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="hidden sm:inline-flex items-center gap-1 font-sans text-xs sm:text-sm font-semibold text-[#C9A468] hover:text-[#A98345] transition-colors py-1"
          >
            <span>View All Collections</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Swipeable Snap Carousel Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-2 scroll-smooth"
        >
          {FEATURED_CARDS.map((card, idx) => (
            <div
              key={card.id}
              className="w-[85vw] sm:w-[380px] lg:w-[420px] shrink-0 snap-center rounded-2xl sm:rounded-3xl overflow-hidden bg-[#2B231E] text-white relative shadow-xl border border-[#C9A468]/30 group transition-all duration-300 hover:shadow-2xl"
            >
              {/* Media with smooth hover zoom */}
              <div 
                className="relative aspect-[4/5] sm:aspect-[16/11] overflow-hidden cursor-pointer"
                onClick={() => onSelectCategory(card.id)}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Vignette Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1512] via-black/20 to-transparent pointer-events-none" />

                {/* Badge Top Left */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-sans font-semibold tracking-wider uppercase bg-[#2B231E]/80 backdrop-blur-md text-[#DFBF88] border border-[#C9A468]/40 shadow-xs">
                    {card.badge}
                  </span>
                </div>
              </div>

              {/* Bottom Editorial Content */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-3 bg-gradient-to-t from-[#1A1512] via-[#1A1512]/90 to-transparent">
                <div className="space-y-1 min-w-0">
                  <h3 className="font-serif text-xl sm:text-2xl font-medium sm:font-semibold text-white leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/85 font-sans leading-[1.5]">
                    {card.subtitle}
                  </p>
                  <p className="text-xs text-[#DFBF88] font-sans font-semibold pt-0.5">
                    {card.lead}
                  </p>
                </div>

                {/* Champagne Gold Circular Action Button */}
                <button
                  type="button"
                  onClick={() => onSelectCategory(card.id)}
                  aria-label={`View ${card.title} collection`}
                  className="w-11 h-11 rounded-full bg-[#C9A468] hover:bg-[#DFBF88] text-[#2B231E] flex items-center justify-center shadow-md active:scale-90 transition-all shrink-0 cursor-pointer group-hover:rotate-[-45deg]"
                >
                  <ArrowRight className="w-5 h-5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {FEATURED_CARDS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-6 bg-[#C9A468]' : 'w-1.5 bg-[#E5DFD5]'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
