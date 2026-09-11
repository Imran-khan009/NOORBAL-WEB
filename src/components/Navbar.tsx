import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  Menu, 
  X, 
  Globe, 
  BarChart3, 
  Sparkles, 
  ShieldCheck, 
  Truck,
  ArrowRight,
  Share2
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../utils/currency';
import { NOORBAL_CONTACT } from '../utils/whatsapp';
import { socialLinks } from '../config/socialLinks';
import { WhatsAppBrandIcon } from './SocialIcons';
import { NoorbalLogo } from './NoorbalLogo';

interface NavbarProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenAnalytics: () => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenSearch: () => void;
  onNavigateToStory: () => void;
  onNavigateToConnect?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCurrency,
  onCurrencyChange,
  wishlistCount,
  onOpenWishlist,
  onOpenAnalytics,
  onSelectCategory,
  onOpenSearch,
  onNavigateToStory,
  onNavigateToConnect,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

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

  const handleConnectClick = () => {
    if (onNavigateToConnect) {
      onNavigateToConnect();
    } else {
      const el = document.getElementById('footer-channels') || document.getElementById('footer-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5DFD5] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#2B231E] text-[#FAF8F5] text-xs py-2 px-4 tracking-wider uppercase">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center font-sans font-medium text-[11px]">
          <div className="flex items-center gap-3 justify-center">
            <span className="inline-flex items-center gap-1 text-[#C9A468]">
              <Truck className="w-3.5 h-3.5" />
              {NOORBAL_CONTACT.deliveryTimeline}
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="inline-flex items-center gap-1 text-[#DFBF88]">
              <ShieldCheck className="w-3.5 h-3.5" />
              {NOORBAL_CONTACT.warranty}
            </span>
          </div>

          <div className="flex items-center gap-3 text-white/80">
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-[#25D366] transition-colors"
            >
              <WhatsAppBrandIcon className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp Concierge</span>
            </a>
            <span className="text-white/30">·</span>
            <button 
              type="button"
              onClick={handleConnectClick} 
              className="hover:text-[#C9A468] transition-colors underline-offset-2 hover:underline"
            >
              Connect with NOORBAL
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2B231E] hover:text-[#C9A468] focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Monogram */}
          <div 
            className="flex flex-col items-center lg:items-start cursor-pointer group" 
            onClick={handleHomeClick}
          >
            <div className="flex items-center gap-2.5">
              {/* Official NOORBAL Golden Crescent Logo */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shadow-sm border border-[#C9A468]/60 group-hover:border-[#C9A468] group-hover:scale-105 transition-all duration-300 flex items-center justify-center bg-[#221C18]">
                <NoorbalLogo size="100%" className="w-full h-full" alt="NOORBAL Luxury Logo" />
              </div>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.22em] text-[#2B231E] group-hover:text-[#1A1512] transition-colors">
                NOORBAL
              </span>
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#8D7B68] font-sans font-medium mt-0.5 group-hover:text-[#C9A468] transition-colors">
              Light · Heritage · Softness
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-sans font-medium tracking-wide text-[#2B231E]">
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
              className="hover:text-[#C9A468] transition-colors py-1 relative group flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C9A468]" />
              <span>Connect</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A468] transition-all duration-300 group-hover:w-full" />
            </button>
          </nav>

          {/* Right Action Utilities */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Currency Selector */}
            <div className="relative">
              <button
                id="currency-selector-btn"
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-sans font-semibold rounded-lg border border-[#E5DFD5] bg-white text-[#2B231E] hover:border-[#C9A468] transition-all hover:shadow-2xs active:scale-95"
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

            {/* Search Trigger */}
            <button
              id="header-search-btn"
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-[#2B231E] hover:text-[#C9A468] transition-all rounded-full hover:bg-black/5 active:scale-90"
              title="Search Collection"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Trigger with Counter */}
            <button
              id="header-wishlist-btn"
              type="button"
              onClick={onOpenWishlist}
              className="relative p-2 text-[#2B231E] hover:text-[#C9A468] transition-all rounded-full hover:bg-black/5 active:scale-90"
              title="View Wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A468] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* BI Analytics Drawer Button */}
            <button
              id="header-bi-btn"
              type="button"
              onClick={onOpenAnalytics}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#2B231E] hover:text-[#C9A468] bg-[#E5DFD5]/40 hover:bg-[#E5DFD5] transition-all rounded-lg border border-[#E5DFD5] active:scale-95"
              title="Business Intelligence & Performance Analytics"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#C9A468]" />
              <span className="font-sans font-medium">BI Insights</span>
            </button>

            {/* WhatsApp Concierge Support Button */}
            <a
              id="header-whatsapp-cta"
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 bg-[#2B231E] hover:bg-[#3D322B] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-lg shadow-2xs transition-all border border-[#C9A468]/50 hover:border-[#C9A468] transform hover:-translate-y-0.5 active:translate-y-0"
              title="Need help? Chat with NOORBAL Concierge"
            >
              <WhatsAppBrandIcon className="w-4 h-4 text-[#25D366]" />
              <span>Support</span>
            </a>
          </div>

        </div>
      </div>

      {/* Premium Cinematic Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5]/98 backdrop-blur-xl border-b border-[#E5DFD5] px-5 pt-4 pb-7 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8D7B68]">
              Navigation & Collections
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => {
                handleShopClick();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3.5 py-3 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E5DFD5] text-[#2B231E] transition-all flex items-center justify-between"
            >
              <span>Shop All</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A468]" />
            </button>

            <button
              onClick={() => {
                onSelectCategory('balochi-heritage');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3.5 py-3 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#C9A468] text-[#A98345] transition-all flex items-center justify-between"
            >
              <span>✦ Balochi Heritage</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C9A468]" />
            </button>

            <button
              onClick={() => {
                onSelectCategory('men');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E5DFD5] text-[#2B231E]"
            >
              Men’s Wear
            </button>

            <button
              onClick={() => {
                onSelectCategory('perfumes');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E5DFD5] text-[#2B231E]"
            >
              Fragrances
            </button>

            <button
              onClick={() => {
                onSelectCategory('watches');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E5DFD5] text-[#2B231E]"
            >
              Watches
            </button>

            <button
              onClick={() => {
                handleConnectClick();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#E5DFD5] text-[#2B231E] flex items-center justify-between"
            >
              <span>Social Hub</span>
              <Share2 className="w-3.5 h-3.5 text-[#C9A468]" />
            </button>
          </div>

          <div className="pt-2 border-t border-[#E5DFD5] flex items-center justify-between">
            <button
              onClick={() => {
                onNavigateToStory();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-serif italic text-[#C9A468] hover:underline"
            >
              Discover Our Balochi Craft Story →
            </button>
            <button
              onClick={() => {
                onOpenAnalytics();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-[#2B231E] flex items-center gap-1 font-medium underline"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#C9A468]" />
              BI Metrics
            </button>
          </div>

          {/* Mobile WhatsApp Concierge Support */}
          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2B231E] hover:bg-[#3D322B] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-xs transition-colors border border-[#C9A468]/40"
          >
            <WhatsAppBrandIcon className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp Concierge Support</span>
          </a>
        </div>
      )}
    </header>
  );
};
