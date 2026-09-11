import React from 'react';
import { Heart, Eye, Sparkles, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOrderNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onOrderNow,
}) => {
  const isReadyStock = product.status === 'ready-stock';

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl border border-[#E5DFD5] overflow-hidden hover:border-[#C9A468] hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1"
    >
      {/* Top Media Container with Cursor Hook */}
      <div 
        className="product-image-container relative aspect-[4/5] bg-[#F4F0E8] overflow-hidden cursor-pointer" 
        onClick={() => onQuickView(product)}
        data-cursor="view"
      >
        {/* Product Image with Controlled Soft Zoom */}
        <img
          src={product.heroImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Ambient Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Status Badges: Ready-Stock vs Made-to-Order */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isReadyStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold bg-[#2B231E]/90 backdrop-blur-sm text-[#DFBF88] border border-[#C9A468]/40 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
              Ready-Stock (2–3 Days)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold bg-[#2B231E]/90 backdrop-blur-sm text-[#DFBF88] border border-[#C9A468]/40 shadow-xs">
              <Sparkles className="w-3 h-3 text-[#C9A468]" />
              Made-to-Order Bespoke
            </span>
          )}

          {product.bestSeller && (
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-[#C9A468] text-[#2B231E] shadow-xs">
              Popular
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 active:scale-90 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md scale-105'
              : 'bg-white/85 text-[#2B231E] hover:bg-white hover:text-[#C9A468] shadow-xs'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2.5 px-3 bg-white/95 hover:bg-white text-[#2B231E] text-xs font-semibold rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Subtitle / Category metadata */}
          <p className="text-[11px] text-[#8D7B68] font-sans font-medium uppercase tracking-wider mb-1 line-clamp-1">
            {product.subtitle}
          </p>

          {/* Product Name */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-serif text-base sm:text-lg font-bold text-[#2B231E] hover:text-[#C9A468] transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing & Stock Guarantee */}
        <div className="pt-2 border-t border-[#E5DFD5]/60 flex items-baseline justify-between">
          <div>
            <span className="font-serif text-lg sm:text-xl font-bold text-[#2B231E]">
              {formatPrice(product.pricePKR, currency)}
            </span>
            {currency !== 'PKR' && (
              <span className="block text-[10px] text-gray-400">
                (PKR {product.pricePKR.toLocaleString()})
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#8D7B68] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A468]" />
            7D Warranty
          </span>
        </div>

        {/* Action Button: Primary ORDER NOW */}
        <div className="pt-1 flex flex-col gap-1.5">
          <button
            id={`btn-order-now-${product.id}`}
            type="button"
            onClick={() => onOrderNow(product)}
            className="w-full py-2.5 px-3 bg-[#2B231E] hover:bg-[#3D322B] text-white text-xs font-sans uppercase tracking-wider font-bold rounded-lg shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 border border-[#C9A468]/30 group-hover:border-[#C9A468] active:scale-[0.98]"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#DFBF88]" />
            <span>ORDER NOW</span>
          </button>

          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="text-[11px] font-medium text-gray-500 hover:text-[#2B231E] flex items-center justify-center gap-1 transition-colors py-1 group/link"
          >
            <span>View Details & Sizing</span>
            <ArrowRight className="w-3 h-3 text-[#C9A468] transition-transform group-hover/link:translate-x-0.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
