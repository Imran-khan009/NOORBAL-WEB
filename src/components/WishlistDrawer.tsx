import React, { useEffect } from 'react';
import { X, Trash2, Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { NOORBAL_CONTACT } from '../utils/whatsapp';
import { WhatsAppIcon } from './WhatsAppIcon';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  currency: CurrencyCode;
  onRemoveFromWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
  onOrderSingle: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  currency,
  onRemoveFromWishlist,
  onQuickView,
  onOrderSingle,
}) => {
  // Lock body scroll when drawer is active
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

  if (!isOpen) return null;

  const handleOrderAllWhatsApp = () => {
    if (wishlist.length === 0) return;

    const listText = wishlist
      .map((item, idx) => `${idx + 1}. *${item.name}* (PKR ${item.pricePKR.toLocaleString()})`)
      .join('\n');

    const totalPKR = wishlist.reduce((sum, item) => sum + item.pricePKR, 0);

    const message = `Assalam-o-Alaikum NOORBAL,

I would like to order my saved wishlist collection:
${listText}

*Total Estimated:* PKR ${totalPKR.toLocaleString()}
Delivery Timeline: ${NOORBAL_CONTACT.deliveryTimeline}

Please confirm availability and sharing banking/delivery details. Thank you!`;

    const url = `https://wa.me/${NOORBAL_CONTACT.internationalPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-3 sm:pl-10">
        
        <div 
          className="w-screen max-w-md bg-white shadow-2xl border-l border-[#E5DFD5] flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E5DFD5] flex items-center justify-between bg-[#FAF8F5]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h3 className="font-serif text-base sm:text-lg font-medium sm:font-semibold text-[#2B231E]">
                Saved Wishlist ({wishlist.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-black/5 text-[#2B231E] flex items-center justify-center active:scale-90 transition-all cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Items */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5">
            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Heart className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-sm text-gray-500 font-sans">
                  Your wishlist is currently empty.
                </p>
                <p className="text-xs text-[#8D7B68] font-sans">
                  Click the heart icon on any product to save it here for easy ordering.
                </p>
              </div>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-[#E5DFD5] bg-[#FAF8F5] hover:border-[#C9A468] transition-colors"
                >
                  <img
                    src={item.heroImage}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-lg bg-white shrink-0 cursor-pointer"
                    onClick={() => {
                      onQuickView(item);
                      onClose();
                    }}
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 
                        onClick={() => {
                          onQuickView(item);
                          onClose();
                        }}
                        className="font-serif text-sm font-medium sm:font-semibold text-[#2B231E] line-clamp-1 cursor-pointer hover:text-[#C9A468]"
                      >
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#8D7B68] font-sans mt-0.5">
                        {item.status === 'ready-stock' ? 'Ready-Stock (2–3 Days)' : 'Made-to-Order'}
                      </p>
                      <p className="font-sans text-sm font-bold text-[#2B231E] mt-1">
                        {formatPrice(item.pricePKR, currency)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => onOrderSingle(item)}
                        className="text-xs font-sans font-semibold text-[#2B231E] hover:text-[#C9A468] flex items-center gap-1.5 transition-colors active:scale-95 py-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#C9A468]" />
                        <span>Order Now</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveFromWishlist(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors active:scale-90 cursor-pointer"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {wishlist.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E5DFD5] bg-[#FAF8F5] space-y-3">
              <div className="flex justify-between items-center text-sm font-sans">
                <span className="text-[#5C5046]">Estimated Total:</span>
                <span className="font-sans text-lg font-bold text-[#2B231E]">
                  {formatPrice(
                    wishlist.reduce((acc, curr) => acc + curr.pricePKR, 0),
                    currency
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={handleOrderAllWhatsApp}
                className="w-full min-h-[46px] py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-sans text-xs uppercase tracking-wider font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Order All Items via WhatsApp</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
