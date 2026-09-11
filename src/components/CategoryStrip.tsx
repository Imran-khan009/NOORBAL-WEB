import React from 'react';
import { CATEGORIES } from '../data/products';
import { Sparkles, Shirt, Gem, Clock, Crown, Footprints, Droplets } from 'lucide-react';

interface CategoryStripProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'all': <Sparkles className="w-4 h-4 text-[#C9A468]" />,
  'balochi-heritage': <Crown className="w-4 h-4 text-[#C9A468]" />,
  'men': <Shirt className="w-4 h-4 text-[#C9A468]" />,
  'perfumes': <Gem className="w-4 h-4 text-[#C9A468]" />,
  'watches': <Clock className="w-4 h-4 text-[#C9A468]" />,
  'caps': <Crown className="w-4 h-4 text-[#C9A468]" />,
  'shoes': <Footprints className="w-4 h-4 text-[#C9A468]" />,
  'lifestyle': <Droplets className="w-4 h-4 text-[#C9A468]" />,
};

export const CategoryStrip: React.FC<CategoryStripProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full bg-white border-b border-[#E5DFD5] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#C9A468]" />
            <span className="text-xs uppercase tracking-widest font-sans font-bold text-[#2B231E]">
              Curated Collections
            </span>
          </div>
          <span className="text-xs text-[#8D7B68] font-sans">
            Showing verified authentic items
          </span>
        </div>

        {/* Scrollable category pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans font-medium transition-all ${
                  isSelected
                    ? 'bg-[#2B231E] text-[#FAF8F5] shadow-sm ring-1 ring-[#C9A468]'
                    : 'bg-[#FAF8F5] text-[#2B231E] hover:bg-[#E5DFD5]/60 border border-[#E5DFD5]'
                }`}
              >
                {CATEGORY_ICONS[cat.id] || <Sparkles className="w-3.5 h-3.5" />}
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-[#DFBF88]' : 'bg-black/5 text-[#8D7B68]'}`}>
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
