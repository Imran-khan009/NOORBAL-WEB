import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  // Lock body scroll when drawer is open
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

  const totalPKR = cartItems.reduce((sum, item) => sum + item.product.pricePKR * item.quantity, 0);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <motion.div
            id="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between z-10 border-l border-[#E5DFD5] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#E5DFD5] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2B231E] text-[#C9A468] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-medium sm:font-semibold text-[#2B231E]">
                    Your Cart ({totalCount})
                  </h2>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#8D7B68] font-sans font-semibold">
                    NOORBAL Luxury Storefront
                  </span>
                </div>
              </div>

              <button
                type="button"
                id="close-cart-btn"
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#2B231E] hover:bg-black/5 active:scale-90 transition-all"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Strip */}
            <div className="bg-[#2B231E] text-[#FAF8F5] py-2 px-4 text-center text-xs flex items-center justify-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-[#C9A468]" />
              <span>Complimentary 2–3 Days Express Delivery Across Pakistan</span>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-center text-gray-400">
                    <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-medium sm:font-semibold text-[#2B231E]">Your Cart is Empty</h3>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-xs font-sans leading-relaxed">
                      Discover handcrafted Balochi heirloom dresses, signature oud fragrances, and prestige accessories.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onContinueShopping();
                    }}
                    className="mt-2 px-6 py-3 bg-[#2B231E] hover:bg-[#3D322B] text-white font-sans text-xs uppercase tracking-wider font-bold rounded-xl shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-3.5 bg-white rounded-2xl border border-[#E5DFD5] shadow-2xs flex gap-3 sm:gap-3.5 items-center group transition-all hover:border-[#C9A468]/50"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#E5DFD5]">
                      <img
                        src={item.product.heroImage}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-serif text-sm font-medium sm:font-semibold text-[#2B231E] leading-snug line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#8D7B68] font-sans">
                        Size: <span className="text-[#2B231E] font-medium">{item.size}</span>
                        {item.color && (
                          <>
                            <span className="mx-1.5 text-gray-300">|</span>
                            Color: <span className="text-[#2B231E] font-medium">{item.color}</span>
                          </>
                        )}
                      </p>
                      <p className="font-sans text-sm font-bold text-[#2B231E]">
                        {formatPrice(item.product.pricePKR, currency)}
                      </p>

                      {/* Stepper + Delete */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="inline-flex items-center rounded-lg border border-[#E5DFD5] bg-[#FAF8F5] p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-[#2B231E] active:scale-90"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold font-sans text-[#2B231E]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-[#2B231E] active:scale-90"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors active:scale-90 cursor-pointer"
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

            {/* Bottom Checkout Action */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-[#E5DFD5] bg-white space-y-3.5 shadow-lg">
                {/* Cost Breakdown */}
                <div className="space-y-1.5 text-xs font-sans text-[#5C5046]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#2B231E]">
                      {formatPrice(totalPKR, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#25D366]">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Shipping</span>
                    </span>
                    <span className="font-semibold">FREE (PKR 0)</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base font-sans font-bold text-[#2B231E] pt-2 border-t border-[#E5DFD5]">
                    <span>Total</span>
                    <span>{formatPrice(totalPKR, currency)}</span>
                  </div>
                  {currency !== 'PKR' && (
                    <p className="text-[10px] text-gray-400 text-right">
                      (Base: PKR {totalPKR.toLocaleString()})
                    </p>
                  )}
                </div>

                {/* Checkout Button - Champagne Gold Pill */}
                <button
                  type="button"
                  id="proceed-to-checkout-btn"
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full min-h-[48px] py-3.5 px-4 bg-[#C9A468] hover:bg-[#DFBF88] text-[#2B231E] font-sans font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust Line */}
                <div className="flex items-center justify-center gap-3 text-[11px] text-gray-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A468]" />
                    <span>Cash on Delivery</span>
                  </span>
                  <span>·</span>
                  <span>7 Days Return</span>
                  <span>·</span>
                  <span>Direct WhatsApp Help</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
