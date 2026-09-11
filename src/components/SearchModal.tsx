import React, { useState } from 'react';
import { X, Search, Sparkles } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: CurrencyCode;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 flex items-start justify-center pt-16 sm:pt-24 animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5DFD5] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E5DFD5] flex items-center gap-3 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-[#C9A468]" />
          <input
            id="site-search-input"
            type="text"
            placeholder="Search Balochi dresses, perfumes, watches, caps, shoes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none font-sans text-sm sm:text-base text-[#2B231E] placeholder-gray-400"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-gray-400 hover:text-[#2B231E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {searchTerm.trim() === '' ? (
            <div className="py-8 text-center text-xs text-gray-500 space-y-2">
              <Sparkles className="w-6 h-6 text-[#C9A468] mx-auto opacity-75" />
              <p>Type to search the NOORBAL luxury collection...</p>
              <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                {['Balochi', 'Mauve Dress', 'Oud Perfume', 'Moonphase', 'Cap', 'Leather Pumps'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setSearchTerm(sample)}
                    className="px-2.5 py-1 bg-[#FAF8F5] border border-[#E5DFD5] rounded-full text-[11px] text-[#2B231E] hover:border-[#C9A468]"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              No products found for &ldquo;{searchTerm}&rdquo;. Try another term.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E5DFD5] cursor-pointer transition-colors"
              >
                <img
                  src={item.heroImage}
                  alt={item.name}
                  className="w-14 h-16 object-cover rounded-lg bg-[#F4F0E8] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-bold text-[#2B231E] truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#8D7B68] truncate">
                    {item.subtitle}
                  </p>
                  <p className="font-serif text-xs font-bold text-[#2B231E] mt-0.5">
                    {formatPrice(item.pricePKR, currency)} · {item.status === 'ready-stock' ? 'Ready-Stock' : 'Made-to-Order'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
