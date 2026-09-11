import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  currency,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onOrderNow,
}) => {
  const [stockFilter, setStockFilter] = useState<'all' | StockStatus>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

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
    <section id="catalog-section" className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5DFD5]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C9A468] font-bold">
              NOORBAL Collection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B231E] mt-1">
              {currentCatInfo.label}
            </h2>
            <p className="text-xs sm:text-sm text-[#8D7B68] mt-1">
              {currentCatInfo.desc} · Showing {filtered.length} products
            </p>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Stock Filter Pills */}
            <div className="inline-flex rounded-xl border border-[#E5DFD5] bg-white p-1 text-xs font-medium shadow-2xs">
              <button
                type="button"
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  stockFilter === 'all' 
                    ? 'bg-[#2B231E] text-white shadow-xs' 
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
                    ? 'bg-[#2B231E] text-white shadow-xs' 
                    : 'text-[#2B231E] hover:bg-[#FAF8F5]'
                }`}
              >
                Ready-Stock (2–3D)
              </button>
              <button
                type="button"
                onClick={() => setStockFilter('made-to-order')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  stockFilter === 'made-to-order' 
                    ? 'bg-[#2B231E] text-white shadow-xs' 
                    : 'text-[#2B231E] hover:bg-[#FAF8F5]'
                }`}
              >
                Made-to-Order
              </button>
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white text-xs font-medium text-[#2B231E] focus:outline-none focus:border-[#C9A468] cursor-pointer shadow-2xs"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                >
                  <ProductCard
                    product={product}
                    currency={currency}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onQuickView={onQuickView}
                    onOrderNow={onOrderNow}
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
