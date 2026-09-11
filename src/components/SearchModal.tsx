import React, { useState, useEffect } from 'react';
import { X, Search, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: CurrencyCode;
  onSelectProduct: (product: Product) => void;
}

const POPULAR_SEARCHES = [
  'Balochi Dress',
  'Mauve Collection',
  'Oud Perfume',
  'Accessories',
  'Men’s Wear',
  'Moonphase Watch',
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('noorbal_recent_searches');
      return saved ? JSON.parse(saved) : ['Balochi heritage', 'Mauve & antique gold', 'Royal oud'];
    } catch {
      return ['Balochi heritage', 'Mauve & antique gold', 'Royal oud'];
    }
  });

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSelectQuery = (query: string) => {
    setSearchTerm(query);
    saveRecentSearch(query);
  };

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem('noorbal_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeRecentSearch = (query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== query);
      try {
        localStorage.setItem('noorbal_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.subtitle.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.tags.some((t) => t.toLowerCase().includes(term))
    );
  });

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-start justify-center pt-0 sm:pt-16 p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="search-modal-container"
        className="w-full max-w-2xl bg-white sm:rounded-3xl shadow-2xl border border-[#E5DFD5] overflow-hidden min-h-screen sm:min-h-0 max-h-[100dvh] sm:max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar (Screen 9) */}
        <div className="p-3.5 sm:p-4.5 border-b border-[#E5DFD5] flex items-center gap-3 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-[#C9A468] shrink-0" />
          <input
            id="site-search-input"
            type="text"
            placeholder="Search products, silk dresses, oud, timepieces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveRecentSearch(searchTerm);
            }}
            autoFocus
            className="w-full bg-transparent border-none outline-none font-sans text-sm sm:text-base text-[#2B231E] placeholder-gray-400 min-h-[44px]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 mr-1"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#2B231E] hover:bg-black/5 active:scale-95 transition-all shrink-0"
          >
            Cancel
          </button>
        </div>

        {/* Results / Default Suggestions View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {searchTerm.trim() === '' ? (
            <div className="space-y-6">
              
              {/* Popular Searches */}
              <div className="space-y-3">
                <span className="text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-wider text-[#8D7B68] block">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((query) => (
                    <button
                      key={query}
                      type="button"
                      onClick={() => handleSelectQuery(query)}
                      className="px-3.5 py-2 bg-[#FAF8F5] border border-[#E5DFD5] hover:border-[#C9A468] rounded-full text-xs font-sans font-medium text-[#2B231E] active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#C9A468]" />
                      <span>{query}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#E5DFD5]">
                  <span className="text-[11px] sm:text-xs font-sans font-semibold uppercase tracking-wider text-[#8D7B68] block">
                    Recent Searches
                  </span>
                  <div className="space-y-1">
                    {recentSearches.map((item) => (
                      <div
                        key={item}
                        onClick={() => handleSelectQuery(item)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] text-xs font-sans text-[#2B231E] cursor-pointer group transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#C9A468]" />
                          <span>{item}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(item, e)}
                          className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                          aria-label={`Remove ${item}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs sm:text-sm text-gray-500 space-y-2 font-sans">
              <p className="font-serif text-lg font-medium text-[#2B231E]">No matches found</p>
              <p>We couldn’t find products matching &ldquo;{searchTerm}&rdquo;.</p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-[#2B231E] text-white rounded-xl text-xs font-sans font-semibold cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-sans text-[#8D7B68] pb-1">
                <span>{filtered.length} products found</span>
                <span>Tap to view details</span>
              </div>

              <div className="divide-y divide-[#E5DFD5]">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      saveRecentSearch(searchTerm);
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="py-3 flex items-center gap-3 hover:bg-[#FAF8F5] p-2 rounded-xl cursor-pointer transition-colors group"
                  >
                    <div className="w-14 h-16 rounded-lg bg-[#FAF8F5] overflow-hidden border border-[#E5DFD5] shrink-0">
                      <img
                        src={product.heroImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] sm:text-[11px] text-[#8D7B68] uppercase font-sans font-semibold tracking-wider block line-clamp-1">
                        {product.subtitle}
                      </span>
                      <h4 className="font-serif text-sm sm:text-base font-medium sm:font-semibold text-[#2B231E] group-hover:text-[#C9A468] transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="font-sans text-xs sm:text-sm font-bold text-[#2B231E] mt-0.5">
                        {formatPrice(product.pricePKR, currency)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#C9A468] group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
