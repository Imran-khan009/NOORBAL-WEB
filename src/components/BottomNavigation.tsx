import React from 'react';
import { Home, Sparkles, Heart, ShoppingBag, Grid } from 'lucide-react';

interface BottomNavigationProps {
  currentView: 'home' | 'shop' | 'categories' | 'cart' | 'wishlist';
  cartCount: number;
  wishlistCount: number;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onNavigateCategories: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentView,
  cartCount,
  wishlistCount,
  onNavigateHome,
  onNavigateShop,
  onNavigateCategories,
  onOpenCart,
  onOpenWishlist,
}) => {
  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation Bar"
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-lg border-t border-[#E5DFD5] shadow-[0_-4px_20px_rgba(43,35,30,0.08)] safe-area-pb"
    >
      <div className="flex items-center justify-around h-16 px-1 max-w-md mx-auto">
        {/* Home */}
        <button
          type="button"
          id="bottom-nav-home"
          onClick={onNavigateHome}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-90 ${
            currentView === 'home' ? 'text-[#2B231E]' : 'text-[#8D7B68] hover:text-[#2B231E]'
          }`}
          aria-label="Navigate to Home"
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.4px] text-[#2B231E]' : 'text-[#8D7B68]'}`} />
            {currentView === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A468]" />
            )}
          </div>
          <span className={`text-[10px] tracking-wide mt-1 font-sans ${currentView === 'home' ? 'font-bold text-[#2B231E]' : 'font-medium'}`}>
            Home
          </span>
        </button>

        {/* Shop */}
        <button
          type="button"
          id="bottom-nav-shop"
          onClick={onNavigateShop}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-90 ${
            currentView === 'shop' ? 'text-[#2B231E]' : 'text-[#8D7B68] hover:text-[#2B231E]'
          }`}
          aria-label="Navigate to Shop"
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${currentView === 'shop' ? 'stroke-[2.4px] text-[#2B231E]' : 'text-[#8D7B68]'}`} />
            {currentView === 'shop' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A468]" />
            )}
          </div>
          <span className={`text-[10px] tracking-wide mt-1 font-sans ${currentView === 'shop' ? 'font-bold text-[#2B231E]' : 'font-medium'}`}>
            Shop
          </span>
        </button>

        {/* Categories / Curated */}
        <button
          type="button"
          id="bottom-nav-categories"
          onClick={onNavigateCategories}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-90 ${
            currentView === 'categories' ? 'text-[#2B231E]' : 'text-[#8D7B68] hover:text-[#2B231E]'
          }`}
          aria-label="Explore Categories"
        >
          <div className="relative">
            <Grid className={`w-5 h-5 ${currentView === 'categories' ? 'stroke-[2.4px] text-[#2B231E]' : 'text-[#8D7B68]'}`} />
            {currentView === 'categories' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A468]" />
            )}
          </div>
          <span className={`text-[10px] tracking-wide mt-1 font-sans ${currentView === 'categories' ? 'font-bold text-[#2B231E]' : 'font-medium'}`}>
            Categories
          </span>
        </button>

        {/* Cart */}
        <button
          type="button"
          id="bottom-nav-cart"
          onClick={onOpenCart}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-90 ${
            currentView === 'cart' ? 'text-[#2B231E]' : 'text-[#8D7B68] hover:text-[#2B231E]'
          }`}
          aria-label={`Shopping Cart (${cartCount} items)`}
        >
          <div className="relative">
            <div className={`w-6 h-6 flex items-center justify-center`}>
              <ShoppingBag className={`w-5 h-5 ${currentView === 'cart' ? 'stroke-[2.4px] text-[#2B231E]' : 'text-[#8D7B68]'}`} />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[17px] h-[17px] px-1 bg-[#C9A468] text-[#2B231E] text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs border border-white animate-in zoom-in-50">
                {cartCount}
              </span>
            )}
            {currentView === 'cart' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A468]" />
            )}
          </div>
          <span className={`text-[10px] tracking-wide mt-1 font-sans ${currentView === 'cart' ? 'font-bold text-[#2B231E]' : 'font-medium'}`}>
            Cart
          </span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          id="bottom-nav-wishlist"
          onClick={onOpenWishlist}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 active:scale-90 ${
            currentView === 'wishlist' ? 'text-[#2B231E]' : 'text-[#8D7B68] hover:text-[#2B231E]'
          }`}
          aria-label={`Saved Wishlist (${wishlistCount} items)`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${currentView === 'wishlist' ? 'stroke-[2.4px] fill-current text-rose-600' : 'text-[#8D7B68]'}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[17px] h-[17px] px-1 bg-[#2B231E] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs border border-white">
                {wishlistCount}
              </span>
            )}
            {currentView === 'wishlist' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A468]" />
            )}
          </div>
          <span className={`text-[10px] tracking-wide mt-1 font-sans ${currentView === 'wishlist' ? 'font-bold text-[#2B231E]' : 'font-medium'}`}>
            Saved
          </span>
        </button>
      </div>
    </nav>
  );
};
