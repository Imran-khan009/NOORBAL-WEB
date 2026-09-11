import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Columns, Grid, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Product, CurrencyCode, StockStatus } from '../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/products';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  currency: CurrencyCode;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOrderNow: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onOrderNow,
  onAddToCart,
}) => {
  const [stockFilter, setStockFilter] = useState<'all' | StockStatus>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [mobileViewMode, setMobileViewMode] = useState<'1-col' | '2-col'>('1-col');

  // Filter by category
  let filtered = selectedCategory === 'all' 
    ? products 
    : products.filter((p) => p.category === selectedCategory);

  // Filter by stock status
  if (stockFilter !== 'all') {
    filtered = filtered.filter((p) => p.status === stockFilter);
  }

  // Sort
  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.pricePKR - b.pricePKR);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.pricePKR - a.pricePKR);
  }

  const currentCatInfo = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <section id="catalog-section" className="py-10 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5DFD5]">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-wider text-[#C9A468] font-sans font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A468]" />
              <span>NEW ARRIVALS</span>
            </div>
            <h2 className="font-serif text-[26px] sm:text-[30px] lg:text-[34px] font-medium sm:font-semibold text-[#2B231E] mt-1 leading-[1.15]">
              {currentCatInfo.label === 'All Collections' ? 'Fresh Pieces, Inspired by Tradition' : currentCatInfo.label}
            </h2>
            <p className="text-sm sm:text-base text-[#8D7B68] font-sans leading-[1.6] mt-1">
              {currentCatInfo.desc} · Showing {filtered.length} products
            </p>
          </div>

          {/* Filter & View Mode Controls */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3">
            
            {/* Mobile View Toggle: 1-Column Editorial vs 2-Column Grid */}
            <div className="flex sm:hidden items-center border border-[#E5DFD5] rounded-xl bg-white p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setMobileViewMode('1-col')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all ${
                  mobileViewMode === '1-col'
                    ? 'bg-[#2B231E] text-white shadow-2xs'
                    : 'text-gray-500 hover:text-[#2B231E]'
                }`}
                title="1-Column Editorial View"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Editorial</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileViewMode('2-col')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-sans font-medium transition-all ${
                  mobileViewMode === '2-col'
                    ? 'bg-[#2B231E] text-white shadow-2xs'
                    : 'text-gray-500 hover:text-[#2B231E]'
                }`}
                title="2-Column Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>

            {/* Stock Filter Pills */}
            <div className="inline-flex rounded-xl border border-[#E5DFD5] bg-white p-1 text-xs font-sans font-medium shadow-2xs">
              <button
                type="button"
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  stockFilter === 'all' 
                    ? 'bg-[#2B231E] text-white shadow-xs font-semibold' 
                    : 'text-[#2B231E] hover:bg-[#FAF8F5]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStockFilter('ready-stock')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  stockFilter === 'ready-stock' 
                    ? 'bg-[#2B231E] text-white shadow-xs font-semibold' 
                    : 'text-[#2B231E] hover:bg-[#FAF8F5]'
                }`}
              >
                Ready-Stock
              </button>
              <button
                type="button"
                onClick={() => setStockFilter('made-to-order')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  stockFilter === 'made-to-order' 
                    ? 'bg-[#2B231E] text-white shadow-xs font-semibold' 
                    : 'text-[#2B231E] hover:bg-[#FAF8F5]'
                }`}
              >
                Bespoke
              </button>
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white text-xs font-sans font-medium text-[#2B231E] focus:outline-none focus:border-[#C9A468] cursor-pointer shadow-2xs"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* Product Grid with AnimatePresence */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E5DFD5] space-y-3">
            <p className="font-serif text-lg text-[#2B231E]">No items match this filter.</p>
            <p className="text-xs text-[#8D7B68]">
              Switch stock filter or select another category to view products.
            </p>
            <button
              onClick={() => setStockFilter('all')}
              className="px-5 py-2.5 bg-[#2B231E] text-white text-xs rounded-xl font-semibold hover:bg-[#3D322B] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className={`grid gap-4 sm:gap-6 ${
              mobileViewMode === '1-col' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}
          >
            <AnimatePresence>
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard
                    product={product}
                    currency={currency}
                    viewMode={mobileViewMode}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onQuickView={onQuickView}
                    onOrderNow={onOrderNow}
                    onAddToCart={onAddToCart}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </section>
  );
};
