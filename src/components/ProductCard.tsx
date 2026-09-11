import React, { useState } from 'react';
import { Heart, Eye, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  viewMode?: '1-col' | '2-col';
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOrderNow: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  viewMode = '1-col',
  onToggleWishlist,
  onQuickView,
  onOrderNow,
  onAddToCart,
}) => {
  const [addedAnim, setAddedAnim] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);
  const isReadyStock = product.status === 'ready-stock';

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setAddedAnim(true);
      setTimeout(() => setAddedAnim(false), 1800);
    } else {
      onOrderNow(product);
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartPulse(true);
    setTimeout(() => setHeartPulse(false), 400);
    onToggleWishlist(product);
  };

  return (
    <article 
      id={`product-card-${product.id}`}
      className={`group relative bg-white rounded-2xl sm:rounded-3xl border border-[#E5DFD5] overflow-hidden hover:border-[#C9A468] hover:shadow-xl transition-all duration-300 flex flex-col justify-between active:scale-[0.99] ${
        viewMode === '1-col' ? 'shadow-xs' : 'shadow-2xs'
      }`}
    >
      {/* Top Media Container with Cursor Hook */}
      <div 
        className="product-image-container relative aspect-[4/5] bg-[#F4F0E8] overflow-hidden cursor-pointer select-none" 
        onClick={() => onQuickView(product)}
        data-cursor="view"
      >
        {/* Product Image with Controlled Soft Zoom */}
        <img
          src={product.heroImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Ambient Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Status Badges: Ready-Stock vs Made-to-Order */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isReadyStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-sans font-semibold bg-[#2B231E]/90 backdrop-blur-xs text-[#DFBF88] border border-[#C9A468]/40 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              Ready-Stock (2–3 Days)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-sans font-semibold bg-[#2B231E]/90 backdrop-blur-xs text-[#DFBF88] border border-[#C9A468]/40 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#C9A468]" />
              Made-to-Order Bespoke
            </span>
          )}

          {product.bestSeller && (
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-[#C9A468] text-[#2B231E] shadow-xs">
              Popular
            </span>
          )}
        </div>

        {/* Wishlist Button - 44px Touch Target with Pulse */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-2.5 right-2.5 w-11 h-11 rounded-full backdrop-blur-md transition-all z-10 flex items-center justify-center cursor-pointer ${
            heartPulse ? 'scale-125' : 'active:scale-90'
          } ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md ring-1 ring-rose-200'
              : 'bg-white/90 text-[#2B231E] hover:bg-white hover:text-[#C9A468] shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
        </button>

        {/* Hover Quick View Trigger (Desktop) */}
        <div className="hidden sm:flex absolute inset-x-3 bottom-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2.5 px-3 bg-white/95 hover:bg-white text-[#2B231E] text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className={`p-4 sm:p-5 flex-1 flex flex-col justify-between ${viewMode === '1-col' ? 'space-y-3' : 'space-y-2'}`}>
        
        <div>
          {/* Subtitle / Category metadata */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-[11px] text-[#8D7B68] font-sans font-semibold uppercase tracking-wider line-clamp-1">
              {product.subtitle}
            </p>
            <span className="text-xs text-amber-500 font-sans font-semibold shrink-0 flex items-center gap-0.5">
              ★ {product.rating}
            </span>
          </div>

          {/* Product Name - Editorial Serif Cormorant Garamond 500/600 */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-serif text-base sm:text-lg font-medium sm:font-semibold text-[#2B231E] hover:text-[#C9A468] transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>

          {/* Short description in 1-column layout - Manrope 14px / 1.6 */}
          {viewMode === '1-col' && (
            <p className="text-xs sm:text-sm text-[#5C5046] font-sans line-clamp-2 mt-1.5 leading-[1.6]">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing & Stock Guarantee - Prices in Manrope Sans */}
        <div className="pt-2 border-t border-[#E5DFD5]/70 flex items-baseline justify-between">
          <div>
            <span className="font-sans text-base sm:text-lg font-bold text-[#2B231E]">
              {formatPrice(product.pricePKR, currency)}
            </span>
            {currency !== 'PKR' && (
              <span className="block text-[11px] text-gray-400 font-sans font-medium">
                (PKR {product.pricePKR.toLocaleString()})
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#8D7B68] font-sans font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A468]" />
            7D Warranty
          </span>
        </div>

        {/* Action Button Section: Add to Cart + Details */}
        <div className="pt-1 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Add to Cart / Order Now Button */}
            <button
              id={`btn-order-now-${product.id}`}
              type="button"
              onClick={handleAddToCartClick}
              className={`flex-1 min-h-[44px] py-3 px-3.5 font-sans uppercase tracking-wider font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.97] cursor-pointer ${
                addedAnim 
                  ? 'bg-[#25D366] text-white border border-[#25D366]' 
                  : 'bg-[#2B231E] hover:bg-[#3D322B] text-white border border-[#C9A468]/40 hover:border-[#C9A468]'
              }`}
            >
              {addedAnim ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#DFBF88]" />
                  <span>{onAddToCart ? 'Add to Cart' : 'Order Now'}</span>
                </>
              )}
            </button>

            {/* Instant Order Now / Fast Checkout */}
            <button
              type="button"
              onClick={() => onOrderNow(product)}
              className="min-h-[44px] px-3.5 bg-[#FAF8F5] hover:bg-[#E5DFD5]/60 text-[#2B231E] border border-[#E5DFD5] hover:border-[#C9A468] rounded-xl font-sans text-xs sm:text-sm font-semibold flex items-center justify-center active:scale-95 transition-all cursor-pointer"
              title="Buy Immediately"
            >
              Buy
            </button>
          </div>

          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="text-xs font-sans font-medium text-gray-500 hover:text-[#2B231E] flex items-center justify-center gap-1 transition-colors py-0.5 group/link cursor-pointer min-h-[36px]"
          >
            <span>View Details & Sizing</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C9A468] transition-transform group-hover/link:translate-x-0.5" />
          </button>
        </div>

      </div>
    </article>
  );
};
