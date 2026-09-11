import React from 'react';
import { CATEGORIES } from '../data/products';
import { Sparkles, Shirt, Gem, Clock, Crown, Footprints, Droplets } from 'lucide-react';

interface CategoryStripProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'all': <Sparkles className="w-3.5 h-3.5" />,
  'balochi-heritage': <Crown className="w-3.5 h-3.5" />,
  'men': <Shirt className="w-3.5 h-3.5" />,
  'perfumes': <Gem className="w-3.5 h-3.5" />,
  'watches': <Clock className="w-3.5 h-3.5" />,
  'caps': <Crown className="w-3.5 h-3.5" />,
  'shoes': <Footprints className="w-3.5 h-3.5" />,
  'lifestyle': <Droplets className="w-3.5 h-3.5" />,
};

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div id="curated-categories-section" className="w-full bg-[#FAF8F5] border-b border-[#E5DFD5] py-3.5 sm:py-4 sticky top-14 sm:top-16 z-30 shadow-2xs backdrop-blur-md bg-[#FAF8F5]/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#C9A468] animate-pulse" />
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-sans font-semibold text-[#2B231E]">
                Curated Collections
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#8D7B68] font-sans mt-0.5">
              Explore our signature categories
            </p>
          </div>
          <span className="text-[11px] sm:text-xs text-[#8D7B68] font-sans hidden xs:inline uppercase tracking-wider">
            Swipe to filter →
          </span>
        </div>

        {/* Horizontal scrollable pills with smooth momentum */}
        <div className="flex items-center gap-2 overflow-x-auto scroll-smooth no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 min-h-[42px] rounded-full text-xs sm:text-sm font-sans font-medium transition-all cursor-pointer active:scale-95 shrink-0 select-none ${
                  isSelected
                    ? 'bg-[#2B231E] text-white shadow-sm ring-2 ring-[#C9A468] font-semibold'
                    : 'bg-white text-[#2B231E] hover:bg-[#FAF8F5] border border-[#E5DFD5] hover:border-[#C9A468]/50'
                }`}
              >
                <span className={isSelected ? 'text-[#DFBF88]' : 'text-[#C9A468]'}>
                  {CATEGORY_ICONS[cat.id] || <Sparkles className="w-3.5 h-3.5" />}
                </span>
                <span>{cat.label}</span>
                <span 
                  className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-sans font-medium transition-colors ${
                    isSelected ? 'bg-white/20 text-[#DFBF88]' : 'bg-black/5 text-[#8D7B68]'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
