import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft,
  Share2, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Ruler, 
  Sparkles, 
  Plus, 
  Minus, 
  Copy, 
  Check, 
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { buildOrderInquiryWhatsAppUrl } from '../utils/whatsapp';
import { socialLinks } from '../config/socialLinks';
import { WhatsAppBrandIcon, InstagramBrandIcon } from './SocialIcons';

interface ProductDetailModalProps {
  product: Product | null;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onOrderNow: (product: Product, size: string, quantity: number) => void;
  onAddToCart?: (product: Product, size: string, quantity: number) => void;
}

const COLOR_OPTIONS = [
  { name: 'Heritage Mauve', color: '#8E737F' },
  { name: 'Antique Gold', color: '#C9A468' },
  { name: 'Charcoal Black', color: '#2B231E' },
  { name: 'Warm Ivory', color: '#F4F0E8' },
];

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onOrderNow,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('Heritage Mauve');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [addedAnim, setAddedAnim] = useState<boolean>(false);

  // Initialize or reset selections when a new product is loaded
  useEffect(() => {
    if (product) {
      setSelectedSize(product.defaultSize || product.sizes[0] || 'Standard');
      setQuantity(1);
      setActiveImageIndex(0);
      setCopied(false);
      setAddedAnim(false);
    }
  }, [product]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const isReadyStock = product.status === 'ready-stock';
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['Standard One-Size'];
  const allImages = [product.heroImage, ...(product.galleryImages || [])];
  const activeImage = allImages[activeImageIndex] || product.heroImage;

  const handleCopyDetails = () => {
    const details = `*${product.name}*\nPrice: ${formatPrice(product.pricePKR, currency)}\nStatus: ${isReadyStock ? 'Ready-Stock' : 'Made-to-Order'}\nFabric: ${product.fabric}\nCraft: ${product.craftDetails}`;
    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NOORBAL — ${product.name}`,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        handleCopyDetails();
      }
    } else {
      handleCopyDetails();
    }
  };

  const handlePrimaryOrderNow = () => {
    onOrderNow(product, selectedSize, quantity);
  };

  const handlePrimaryAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedSize, quantity);
      setAddedAnim(true);
      setTimeout(() => setAddedAnim(false), 2000);
    } else {
      handlePrimaryOrderNow();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 lg:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="product-detail-modal-card"
        className="w-full max-w-4xl bg-white sm:rounded-3xl shadow-2xl border border-[#E5DFD5] overflow-hidden flex flex-col md:flex-row relative min-h-screen sm:min-h-0 max-h-[100dvh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Top Navigation Bar (Screen 5) */}
        <div className="md:hidden sticky top-0 z-30 bg-[#FAF8F5]/98 backdrop-blur-md border-b border-[#E5DFD5] px-4 py-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 -ml-1.5 rounded-full flex items-center justify-center text-[#2B231E] hover:bg-black/5 active:scale-90 transition-all"
            aria-label="Back to storefront"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="font-serif font-bold text-sm tracking-widest text-[#2B231E] uppercase">
            NOORBAL
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleWishlist(product)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#2B231E] hover:bg-black/5 active:scale-90 transition-all"
              aria-label="Toggle Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#2B231E] hover:bg-black/5 active:scale-90 transition-all"
              aria-label="Share product"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Close Button */}
        <button
          id="close-product-modal-btn"
          type="button"
          onClick={onClose}
          className="hidden md:flex absolute top-4 right-4 z-30 w-11 h-11 rounded-full bg-white/95 text-[#2B231E] hover:bg-[#2B231E] hover:text-white transition-all shadow-md active:scale-90 items-center justify-center border border-[#E5DFD5]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery with Slide Dots */}
        <div className="md:w-1/2 relative bg-[#F4F0E8] flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[540px] overflow-hidden shrink-0">
          
          <div className="w-full h-full relative aspect-[4/3] sm:aspect-[4/5] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={product.name}
                initial={{ opacity: 0.4, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.4 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full h-full object-cover object-center max-h-[420px] md:max-h-[540px]"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Prev/Next arrows on media */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs active:scale-90 transition-all border border-white/20"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % allImages.length)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs active:scale-90 transition-all border border-white/20"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Floating Stock Badge */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1">
            <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold shadow-md bg-[#2B231E]/90 text-[#DFBF88] border border-[#C9A468]/50 backdrop-blur-xs">
              {isReadyStock ? '● Ready-Stock (Dispatches in 24h)' : '✦ Made-to-Order Bespoke'}
            </span>
          </div>

          {/* Slide Pagination Dots / Thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 z-10">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeImageIndex === idx ? 'w-6 bg-[#C9A468]' : 'w-2 bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Show image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specs & Ordering Interface */}
        <div className="md:w-1/2 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto pb-24 md:pb-8">
          
          <div className="space-y-4">
            
            {/* Header metadata */}
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#C9A468] font-sans font-semibold">
                {product.subtitle}
              </span>
              <h2 className="font-serif text-[24px] sm:text-[28px] font-medium sm:font-semibold text-[#2B231E] mt-1 leading-tight">
                {product.name}
              </h2>

              {/* Rating & Reviews (4.8 ★ 24 Reviews) */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-sans font-semibold text-[#2B231E]">
                  {product.rating}
                </span>
                <span className="text-xs font-sans text-gray-400">
                  ({product.reviewCount} Verified Reviews)
                </span>
              </div>
            </div>

            {/* Pricing Section - Manrope Sans for Prices */}
            <div className="flex items-baseline gap-3 py-2 border-b border-[#E5DFD5]">
              <span className="font-sans text-2xl sm:text-3xl font-bold text-[#2B231E]">
                {formatPrice(product.pricePKR, currency)}
              </span>
              {currency !== 'PKR' && (
                <span className="text-xs text-gray-500 font-sans font-medium">
                  (Base: PKR {product.pricePKR.toLocaleString()})
                </span>
              )}
            </div>

            {/* Description - Manrope 14-16px, 1.6 line height */}
            <p className="text-sm sm:text-base text-[#5C5046] font-sans leading-[1.6]">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="space-y-2">
              <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#2B231E] block">
                Color: <span className="text-[#8D7B68] font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2.5">
                {COLOR_OPTIONS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedColor(item.name)}
                    className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                      selectedColor === item.name
                        ? 'ring-2 ring-[#C9A468] ring-offset-2 scale-110'
                        : 'border border-[#E5DFD5] hover:scale-105'
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                    aria-label={`Select ${item.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector Pills */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#2B231E]">
                    Select Size / Fit:
                  </label>
                  <span className="text-[11px] font-sans text-[#8D7B68]">
                    Selected: <strong className="text-[#2B231E]">{selectedSize}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`min-h-[40px] px-3.5 py-2 text-xs sm:text-sm font-sans font-medium rounded-xl border transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#2B231E] text-[#FAF8F5] border-[#2B231E] shadow-xs ring-1 ring-[#C9A468]'
                          : 'bg-white text-[#2B231E] border-[#E5DFD5] hover:border-[#C9A468]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#2B231E]">
                Quantity:
              </label>
              <div className="inline-flex items-center border border-[#E5DFD5] rounded-xl bg-white p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-[#FAF8F5] rounded-lg transition-colors active:scale-95 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-sans font-bold text-[#2B231E]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-[#FAF8F5] rounded-lg transition-colors active:scale-95 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Craft & Fabric Specs */}
            <div className="space-y-2 py-2.5 px-3.5 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5]/80 text-xs sm:text-sm font-sans">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A468] mt-0.5 shrink-0" />
                <p><strong>Artisan Craft:</strong> {product.craftDetails}</p>
              </div>
              <div className="flex items-start gap-2">
                <Ruler className="w-3.5 h-3.5 text-[#C9A468] mt-0.5 shrink-0" />
                <p><strong>Material / Composition:</strong> {product.fabric}</p>
              </div>
            </div>

            {/* Trust Matrix Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-sans">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DFD5]">
                <Truck className="w-4 h-4 text-[#C9A468] shrink-0" />
                <div>
                  <strong className="block text-[#2B231E] font-semibold">2–3 Days Delivery</strong>
                  <span className="text-gray-500">Nationwide courier tracking</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DFD5]">
                <ShieldCheck className="w-4 h-4 text-[#DFBF88] shrink-0" />
                <div>
                  <strong className="block text-[#2B231E] font-semibold">7 Days Warranty</strong>
                  <span className="text-gray-500">Full exchange policy</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action CTAs (Desktop / In-Flow) */}
          <div className="pt-6 space-y-2.5">
            
            {/* Primary Action Row: Add to Cart + Order Now */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrimaryAddToCart}
                className={`flex-1 py-3.5 px-4 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
                  addedAnim 
                    ? 'bg-[#25D366] text-white' 
                    : 'bg-[#2B231E] hover:bg-[#3D322B] text-white'
                }`}
              >
                {addedAnim ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#DFBF88]" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                id="modal-order-now-btn"
                type="button"
                onClick={handlePrimaryOrderNow}
                className="py-3.5 px-5 bg-[#C9A468] hover:bg-[#DFBF88] text-[#2B231E] font-sans font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <span>Order Now</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Wishlist toggle */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-[#2B231E] border-[#E5DFD5] hover:border-[#C9A468]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
                <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              {/* Instagram Link */}
              <a
                id="modal-order-instagram-btn"
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] py-2.5 px-3 bg-white hover:bg-[#FAF8F5] text-[#2B231E] font-sans font-medium text-xs rounded-xl border border-[#E5DFD5] hover:border-[#C9A468] transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <InstagramBrandIcon className="w-4 h-4 text-[#E1306C]" />
                <span>Instagram</span>
              </a>
            </div>

            {/* Secondary WhatsApp Inquiry */}
            <a
              href={buildOrderInquiryWhatsAppUrl(product, selectedSize, quantity)}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-gray-100 text-gray-700 text-xs flex items-center justify-center gap-2 border border-[#E5DFD5] transition-colors"
            >
              <WhatsAppBrandIcon className="w-4 h-4 text-[#25D366]" />
              <span>Need help? WhatsApp Concierge</span>
            </a>

            {/* Copy details */}
            <button
              type="button"
              onClick={handleCopyDetails}
              className="w-full py-1 text-[11px] text-gray-400 hover:text-[#2B231E] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600 font-semibold">Details copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy details to share</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Sticky Bottom Add to Cart Bar on Mobile (Screen 5) */}
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-lg border-t border-[#E5DFD5] p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3">
          <div>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#8D7B68] block">Total Price</span>
            <span className="font-sans text-base font-bold text-[#2B231E]">
              {formatPrice(product.pricePKR * quantity, currency)}
            </span>
          </div>

          <button
            type="button"
            onClick={handlePrimaryAddToCart}
            className={`flex-1 min-h-[46px] py-3 px-4 font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
              addedAnim 
                ? 'bg-[#25D366] text-white' 
                : 'bg-[#C9A468] text-[#2B231E] hover:bg-[#DFBF88]'
            }`}
          >
            {addedAnim ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#2B231E]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onToggleWishlist(product)}
            className="w-11 h-11 rounded-xl border border-[#E5DFD5] bg-white flex items-center justify-center active:scale-90 transition-all text-[#2B231E]"
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
          </button>
        </div>

      </div>

    </div>
  );
};
