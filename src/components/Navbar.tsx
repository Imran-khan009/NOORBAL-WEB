import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Search, 
  Menu, 
  X, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Truck,
  ChevronRight,
  Home,
  ShoppingBag,
  Crown,
  Layers,
  Info,
  Mail
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../utils/currency';
import { socialLinks, SOCIAL_CHANNELS } from '../config/socialLinks';
import { WhatsAppBrandIcon, getPlatformIcon } from './SocialIcons';
import { NoorbalLogo } from './NoorbalLogo';

interface NavbarProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  wishlistCount: number;
  cartCount?: number;
  onOpenWishlist: () => void;
  onOpenCart?: () => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenSearch: () => void;
  onNavigateToStory: () => void;
  onNavigateToConnect?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCurrency,
  onCurrencyChange,
  wishlistCount,
  cartCount = 0,
  onOpenWishlist,
  onOpenCart,
  onSelectCategory,
  onOpenSearch,
  onNavigateToStory,
  onNavigateToConnect,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  // Smooth header compression on scroll down, returns on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 45 && currentScrollY > lastScrollY) {
        setIsScrolledDown(true); // scrolling down
      } else if (currentScrollY < lastScrollY || currentScrollY <= 20) {
        setIsScrolledDown(false); // scrolling up or at top
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll lock when mobile navigation drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleHomeClick = () => {
    onSelectCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopClick = () => {
    onSelectCategory('all');
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleCuratedClick = () => {
    onSelectCategory('all');
    setTimeout(() => {
      const el = document.getElementById('curated-categories-section') || document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleConnectClick = () => {
    if (onNavigateToConnect) {
      onNavigateToConnect();
    } else {
      const el = document.getElementById('footer-channels') || document.getElementById('footer-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/98 backdrop-blur-md border-b border-[#E5DFD5] transition-all duration-300">
      
      {/* Top Announcement Strip - Extremely Compact & Smoothly Compressing */}
      <div 
        className={`bg-[#2B231E] text-[#FAF8F5] transition-all duration-300 border-b border-[#C9A468]/20 overflow-hidden ${
          isScrolledDown ? 'max-h-0 py-0 opacity-0' : 'max-h-10 py-1.5 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-sans font-medium tracking-wider uppercase">
          <div className="flex items-center gap-2 sm:gap-3 mx-auto sm:mx-0 whitespace-nowrap">
            <span className="inline-flex items-center gap-1 text-[#C9A468]">
              <Truck className="w-3 h-3" />
              <span>2–3 Days Nationwide</span>
            </span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1 text-[#DFBF88]">
              <ShieldCheck className="w-3 h-3" />
              <span>7 Days Return</span>
            </span>
            <span className="text-white/30">·</span>
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-white/90 hover:text-[#25D366] transition-colors active:scale-95"
            >
              <WhatsAppBrandIcon className="w-3 h-3 text-[#25D366]" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3 text-white/75 shrink-0 text-[11px]">
            <button 
              type="button"
              onClick={handleConnectClick} 
              className="hover:text-[#C9A468] transition-colors underline-offset-2 hover:underline cursor-pointer"
            >
              Connect with NOORBAL
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar - 56px to 64px Tall */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolledDown ? 'h-14 sm:h-15' : 'h-15 sm:h-16'}`}>
          
          {/* Mobile Menu Trigger (☰) */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="w-11 h-11 flex items-center justify-center text-[#2B231E] hover:text-[#C9A468] transition-all rounded-xl active:scale-90 hover:bg-black/5"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 stroke-[1.8]" />
            </button>
          </div>

          {/* NOORBAL Brand Logo & Tagline */}
          <div 
            className="flex flex-col items-center lg:items-start cursor-pointer group select-none py-1" 
            onClick={handleHomeClick}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-[#C9A468]/70 group-hover:border-[#C9A468] group-hover:scale-105 transition-all duration-300 flex items-center justify-center bg-[#221C18] shrink-0">
                <NoorbalLogo size="100%" className="w-full h-full" alt="NOORBAL Logo" />
              </div>
              <span className="font-serif font-medium sm:font-semibold tracking-[0.22em] text-[#2B231E] group-hover:text-[#1A1512] transition-colors text-lg sm:text-2xl">
                NOORBAL
              </span>
            </div>
            <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.28em] uppercase text-[#8D7B68] font-sans font-medium -mt-0.5 group-hover:text-[#C9A468] transition-colors">
              Light · Heritage · Softness
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-sans font-medium tracking-wider uppercase text-[#2B231E]">
            <button 
              id="nav-home"
              onClick={handleHomeClick} 
              className="hover:text-[#C9A468] transition-colors py-1 relative group"
            >
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A468] transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              id="nav-shop"
              onClick={handleShopClick} 
              className="hover:text-[#C9A468] transition-colors py-1 relative group"
            >
              <span>Shop</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A468] transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              id="nav-balochi"
              onClick={() => onSelectCategory('balochi-heritage')} 
              className="hover:text-[#C9A468] transition-colors py-1 flex items-center gap-1.5 relative group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A468]" />
              <span>Balochi Heritage</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A468] transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              id="nav-story"
              onClick={onNavigateToStory} 
              className="hover:text-[#C9A468] transition-colors py-1 relative group"
            >
              <span>Our Story</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A468] transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              id="nav-connect"
              onClick={handleConnectClick} 
              className="hover:text-[#C9A468] transition-colors py-1 relative group"
            >
              <span>Connect</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A468] transition-all duration-300 group-hover:w-full" />
            </button>
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            {/* Currency Selector (e.g. 🌐 PKR) */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-sans font-semibold rounded-lg border border-[#E5DFD5] bg-white text-[#2B231E] hover:border-[#C9A468] transition-all active:scale-95 shadow-2xs"
                title="Change Currency"
              >
                <Globe className="w-3.5 h-3.5 text-[#C9A468]" />
                <span>{currentCurrency}</span>
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-34 bg-white rounded-xl shadow-xl border border-[#E5DFD5] py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        onCurrencyChange(code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#FAF8F5] transition-colors ${
                        currentCurrency === code ? 'text-[#C9A468] font-bold bg-[#FAF8F5]' : 'text-[#2B231E]'
                      }`}
                    >
                      <span>{code}</span>
                      <span className="text-gray-400 text-[11px]">{CURRENCIES[code].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Trigger (⌕ Search) */}
            <button
              id="header-search-btn"
              type="button"
              onClick={onOpenSearch}
              className="w-10 h-10 flex items-center justify-center text-[#2B231E] hover:text-[#C9A468] transition-all rounded-full hover:bg-black/5 active:scale-90"
              title="Search Catalog"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Cart Trigger (Hidden on small mobile if bottom nav has it, but clickable everywhere) */}
            {onOpenCart && (
              <button
                id="header-cart-btn"
                type="button"
                onClick={onOpenCart}
                className="relative w-10 h-10 flex items-center justify-center text-[#2B231E] hover:text-[#C9A468] transition-all rounded-full hover:bg-black/5 active:scale-90"
                title="View Cart"
                aria-label={`Cart (${cartCount} items)`}
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[17px] h-[17px] px-1 bg-[#C9A468] text-[#2B231E] text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in shadow-2xs">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Wishlist Trigger */}
            <button
              id="header-wishlist-btn"
              type="button"
              onClick={onOpenWishlist}
              className="hidden sm:flex relative w-10 h-10 items-center justify-center text-[#2B231E] hover:text-[#C9A468] transition-all rounded-full hover:bg-black/5 active:scale-90"
              title="View Saved Wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[17px] h-[17px] px-1 bg-[#2B231E] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in shadow-2xs">
                  {wishlistCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Luxury Mobile Navigation Drawer (Screen 2 Mockup Style) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          
          {/* Backdrop with Fade */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel - Dark Luxury Charcoal Theme */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-[#1A1614] text-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-left duration-300 border-r border-[#C9A468]/30">
            
            {/* Top Brand Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C9A468] flex items-center justify-center bg-[#221C18] shrink-0">
                  <NoorbalLogo size="100%" className="w-full h-full" alt="NOORBAL Logo" />
                </div>
                <div>
                  <span className="font-serif text-lg font-medium sm:font-semibold tracking-[0.2em] text-[#FAF8F5] block">
                    NOORBAL
                  </span>
                  <span className="text-[8.5px] tracking-[0.25em] uppercase text-[#DFBF88] font-sans">
                    Light · Heritage · Softness
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links with Stagger Effect */}
            <div className="p-5 space-y-2 flex-1 overflow-y-auto">
              {/* Home */}
              <button
                type="button"
                onClick={() => {
                  handleHomeClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-3 rounded-xl hover:bg-white/5 transition-all flex items-center justify-between text-sm font-medium text-white/90 hover:text-white group"
              >
                <span className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-[#C9A468]" />
                  <span>Home</span>
                </span>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#C9A468] transition-colors" />
              </button>

              {/* Shop */}
              <button
                type="button"
                onClick={() => {
                  handleShopClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-3 rounded-xl hover:bg-white/5 transition-all flex items-center justify-between text-sm font-medium text-white/90 hover:text-white group"
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#C9A468]" />
                  <span>Shop</span>
                </span>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#C9A468] transition-colors" />
              </button>

              {/* Balochi Heritage */}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('balochi-heritage');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#C9A468]/40 transition-all flex items-center justify-between text-sm font-semibold text-[#DFBF88] group shadow-xs"
              >
                <span className="flex items-center gap-3">
                  <Crown className="w-4 h-4 text-[#C9A468]" />
                  <span>Balochi Heritage</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#C9A468]" />
              </button>

              {/* Collections */}
              <button
                type="button"
                onClick={() => {
                  handleCuratedClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-3 rounded-xl hover:bg-white/5 transition-all flex items-center justify-between text-sm font-medium text-white/90 hover:text-white group"
              >
                <span className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-[#C9A468]" />
                  <span>Collections</span>
                </span>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#C9A468] transition-colors" />
              </button>

              {/* About NOORBAL */}
              <button
                type="button"
                onClick={() => {
                  onNavigateToStory();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-3 rounded-xl hover:bg-white/5 transition-all flex items-center justify-between text-sm font-medium text-white/90 hover:text-white group"
              >
                <span className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-[#C9A468]" />
                  <span>About NOORBAL</span>
                </span>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#C9A468] transition-colors" />
              </button>

              {/* Contact */}
              <button
                type="button"
                onClick={() => {
                  handleConnectClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-3 rounded-xl hover:bg-white/5 transition-all flex items-center justify-between text-sm font-medium text-white/90 hover:text-white group"
              >
                <span className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C9A468]" />
                  <span>Contact</span>
                </span>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[#C9A468] transition-colors" />
              </button>

              {/* WhatsApp Concierge Banner Button (Screen 2) */}
              <div className="pt-2">
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#221C18] to-[#2B231E] border border-[#C9A468]/50 flex items-center gap-3 text-white font-medium text-xs shadow-md active:scale-[0.98] transition-all group hover:border-[#C9A468]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
                    <WhatsAppBrandIcon className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-semibold text-white">WhatsApp Concierge</span>
                    <span className="block text-[10px] text-white/60">Instant personal shopping assistance</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#C9A468]" />
                </a>
              </div>

              {/* Quick Search & Currency Utilities */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between text-xs text-white/80"
                >
                  <span className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-[#C9A468]" />
                    <span>Search Products</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                </button>

                <div className="flex items-center justify-between py-2 px-3 text-xs text-white/80">
                  <span className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#C9A468]" />
                    <span>Currency</span>
                  </span>
                  <span className="text-[#DFBF88] font-bold">{currentCurrency}</span>
                </div>
              </div>
            </div>

            {/* Bottom Social Media Channels */}
            <div className="p-5 border-t border-white/10 bg-black/20 space-y-3">
              <div className="flex items-center justify-center gap-3">
                {SOCIAL_CHANNELS.map((ch) => (
                  <a
                    key={ch.id}
                    href={ch.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`NOORBAL on ${ch.name}`}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C9A468] hover:text-[#2B231E] flex items-center justify-center text-white transition-all active:scale-90"
                  >
                    {getPlatformIcon(ch.id, 'w-4 h-4')}
                  </a>
                ))}
              </div>
              <p className="text-[10px] text-center text-white/40 font-mono">
                © {new Date().getFullYear()} NOORBAL. Light · Heritage · Softness
              </p>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
