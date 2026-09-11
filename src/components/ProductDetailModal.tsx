import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Check, 
  Copy, 
  Sparkles, 
  ShoppingBag,
  Plus,
  Minus,
  Ruler
} from 'lucide-react';
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
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onOrderNow,
}) => {
  if (!product) return null;

  const isClothing = product.category === 'balochi-heritage' || product.category === 'women' || product.category === 'men';
  
  // Available sizes including Custom Size for apparel
  const availableSizes = React.useMemo(() => {
    const list = [...(product.sizes || [])];
    if (isClothing && !list.includes('Custom Size')) {
      list.push('Custom Size');
    }
    return list;
  }, [product.sizes, isClothing]);

  // Gallery images list
  const allImages = React.useMemo(() => {
    const set = new Set<string>();
    if (product.heroImage) set.add(product.heroImage);
    if (product.galleryImages) {
      product.galleryImages.forEach((img) => set.add(img));
    }
    return Array.from(set);
  }, [product]);

  const [activeImage, setActiveImage] = useState<string>(product.heroImage);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.defaultSize || (availableSizes.length > 0 ? availableSizes[0] : 'Standard')
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const isReadyStock = product.status === 'ready-stock';

  const handleCopyDetails = () => {
    const text = `NOORBAL Order Details:
Product: ${product.name}
Size: ${selectedSize}
Quantity: ${quantity}
Price: PKR ${(product.pricePKR * quantity).toLocaleString()}
Delivery: 2–3 Days Nationwide Express
Order Channel: Official Website Checkout`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrimaryOrderNow = () => {
    onOrderNow(product, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div 
        id="product-detail-modal-card"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E5DFD5] overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-[#2B231E] hover:bg-[#2B231E] hover:text-white transition-all shadow-md active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Smooth Image Crossfade Showcase */}
        <div className="md:w-1/2 relative bg-[#F4F0E8] flex flex-col items-center justify-center min-h-[340px] md:min-h-[520px] overflow-hidden">
          
          <div className="w-full h-full relative aspect-[4/5] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={product.name}
                initial={{ opacity: 0.4, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.4 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full h-full object-cover object-center max-h-[520px]"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </div>

          {/* Floating Stock Badge */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
              isReadyStock 
                ? 'bg-[#2B231E]/90 text-[#DFBF88] border border-[#C9A468]/50 backdrop-blur-xs' 
                : 'bg-[#2B231E]/90 text-white border border-[#C9A468]/50 backdrop-blur-xs'
            }`}>
              {isReadyStock ? '● Ready-Stock (Dispatches in 24h)' : '✦ Made-to-Order (Bespoke)'}
            </span>
          </div>

          {/* Thumbnail Strip if multiple images */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 z-10">
              <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-xl flex items-center gap-2 border border-white/20 shadow-lg">
                {allImages.map((img, idx) => (
                  <button
                    key={`thumb-${idx}`}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-11 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img
                        ? 'border-[#C9A468] scale-105 ring-1 ring-white'
                        : 'border-white/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Product Specs & Ordering Interface */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[550px] md:max-h-[640px]">
          
          <div className="space-y-4">
            
            {/* Header metadata */}
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C9A468] font-bold">
                {product.subtitle}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B231E] mt-1 leading-tight">
                {product.name}
              </h2>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 py-2 border-b border-[#E5DFD5]">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2B231E]">
                {formatPrice(product.pricePKR, currency)}
              </span>
              {currency !== 'PKR' && (
                <span className="text-xs text-gray-500 font-sans">
                  (Base: PKR {product.pricePKR.toLocaleString()})
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#5C5046] leading-relaxed">
              {product.description}
            </p>

            {/* Craft & Fabric Specs */}
            <div className="space-y-2 py-2 px-3.5 bg-[#FAF8F5] rounded-xl border border-[#E5DFD5]/80 text-xs">
              <div className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A468] mt-0.5 shrink-0" />
                <p><strong>Artisan Craft:</strong> {product.craftDetails}</p>
              </div>
              <div className="flex items-start gap-2">
                <Ruler className="w-3.5 h-3.5 text-[#C9A468] mt-0.5 shrink-0" />
                <p><strong>Material / Composition:</strong> {product.fabric}</p>
              </div>
            </div>

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#2B231E]">
                    Select Size / Fit:
                  </label>
                  <span className="text-[11px] text-[#8D7B68]">
                    Selected: <strong className="text-[#2B231E]">{selectedSize}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
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
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2B231E]">
                Quantity:
              </label>
              <div className="inline-flex items-center border border-[#E5DFD5] rounded-xl bg-white p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-gray-600 hover:bg-[#FAF8F5] rounded-lg transition-colors active:scale-95"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-[#2B231E]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-gray-600 hover:bg-[#FAF8F5] rounded-lg transition-colors active:scale-95"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Trust Matrix Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DFD5]">
                <Truck className="w-4 h-4 text-[#C9A468] shrink-0" />
                <div>
                  <strong className="block text-[#2B231E] font-semibold">2–3 Days Delivery</strong>
                  <span className="text-gray-500">Express courier tracking</span>
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

          {/* Action CTAs */}
          <div className="pt-6 space-y-2.5">
            
            {/* Primary CTA: ORDER NOW */}
            <button
              id="modal-order-now-btn"
              type="button"
              onClick={handlePrimaryOrderNow}
              className="w-full py-4 px-4 bg-[#2B231E] hover:bg-[#3D322B] text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4 text-[#DFBF88]" />
              <span>ORDER NOW</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              {/* Wishlist toggle */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-[#2B231E] border-[#E5DFD5] hover:border-[#C9A468]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-rose-600' : ''}`} />
                <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              {/* Instagram Channel Link */}
              <a
                id="modal-order-instagram-btn"
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-white hover:bg-[#FAF8F5] text-[#2B231E] font-sans font-medium text-xs rounded-xl border border-[#E5DFD5] hover:border-[#C9A468] transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <InstagramBrandIcon className="w-4 h-4 text-[#E1306C]" />
                <span>Instagram</span>
              </a>
            </div>

            {/* Support: Secondary WhatsApp Inquiry */}
            <a
              href={buildOrderInquiryWhatsAppUrl(product, selectedSize, quantity)}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-[#FAF8F5] hover:bg-gray-100 text-gray-700 text-xs flex items-center justify-center gap-2 border border-[#E5DFD5] transition-colors"
            >
              <WhatsAppBrandIcon className="w-4 h-4 text-[#25D366]" />
              <span>Need help? WhatsApp us</span>
            </a>

            {/* Copy order details text button */}
            <button
              type="button"
              onClick={handleCopyDetails}
              className="w-full py-1 text-[11px] text-gray-400 hover:text-[#2B231E] flex items-center justify-center gap-1 transition-colors"
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

      </div>

    </div>
  );
};
