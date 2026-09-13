import React, { useState } from 'react';
import { 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Check,
  Package
} from 'lucide-react';
import { socialLinks, SOCIAL_CHANNELS } from '../config/socialLinks';
import { getPlatformIcon } from './SocialIcons';
import { NOORBAL_CONTACT } from '../utils/whatsapp';
import { NoorbalLogo } from './NoorbalLogo';

interface FooterProps {
  onSelectCategory: (categoryId: string) => void;
  onNavigateToStory: () => void;
  onNavigateToConnect?: () => void;
  onNavigateToAdmin?: () => void;
  onOpenTrackOrder?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateToStory,
  onNavigateToConnect,
  onNavigateToAdmin,
  onOpenTrackOrder,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToConnect = () => {
    if (onNavigateToConnect) {
      onNavigateToConnect();
    } else {
      const el = document.getElementById('connect-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer-section" className="bg-[#2B231E] text-[#FAF8F5] pt-16 pb-12 border-t-2 border-[#C9A468]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Brand Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm border border-[#C9A468]/50 flex items-center justify-center bg-[#221C18]">
                <NoorbalLogo size="100%" className="w-full h-full" alt="NOORBAL Logo" />
              </div>
              <span className="font-serif text-2xl font-medium sm:font-semibold tracking-[0.2em] text-[#FAF8F5]">
                NOORBAL
              </span>
            </div>

            <p className="text-xs tracking-[0.25em] uppercase text-[#DFBF88] font-sans font-medium">
              Light · Heritage · Softness
            </p>

            <p className="text-xs text-[#FAF8F5]/70 font-sans leading-relaxed">
              Preserving and elevating Balochi hand-embroidered artisanal luxury, royal fragrances, and prestige lifestyle accessories for women and men across Pakistan and worldwide.
            </p>

            {/* Official Social Channels in Footer */}
            <div id="footer-channels" className="space-y-2 pt-2">
              <span className="text-[11px] uppercase tracking-widest text-[#DFBF88] font-sans font-semibold block">
                Official Channels
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {SOCIAL_CHANNELS.map((ch) => (
                  <a
                    key={ch.id}
                    id={`footer-social-${ch.id}`}
                    href={ch.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`NOORBAL on ${ch.name}`}
                    title={`${ch.name}: ${ch.handle}`}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all transform hover:scale-110 duration-200 border border-white/10 hover:border-[#C9A468]"
                    style={{
                      color: '#FAF8F5',
                    }}
                  >
                    {getPlatformIcon(ch.id, 'w-4 h-4')}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Collections */}
          <div className="lg:col-span-2 space-y-3 font-sans">
            <h4 className="font-serif text-sm font-medium uppercase tracking-wider text-[#DFBF88]">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-white/80 font-sans">
              <li>
                <button 
                  onClick={() => onSelectCategory('balochi-heritage')} 
                  className="hover:text-[#C9A468] transition-colors text-left cursor-pointer"
                >
                  Balochi Heritage
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('men')} 
                  className="hover:text-[#C9A468] transition-colors text-left cursor-pointer"
                >
                  Men’s Wear
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('perfumes')} 
                  className="hover:text-[#C9A468] transition-colors text-left cursor-pointer"
                >
                  Royal Fragrances
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('watches')} 
                  className="hover:text-[#C9A468] transition-colors text-left cursor-pointer"
                >
                  Moonphase Horology
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('caps')} 
                  className="hover:text-[#C9A468] transition-colors text-left cursor-pointer"
                >
                  Signature Caps
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('shoes')} 
                  className="hover:text-[#C9A468] transition-colors text-left cursor-pointer"
                >
                  Artisan Footwear
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="lg:col-span-3 space-y-3 font-sans">
            <h4 className="font-serif text-sm font-medium uppercase tracking-wider text-[#DFBF88]">
              Assurance & Policies
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80 font-sans">
              <li className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#C9A468] shrink-0 mt-0.5" />
                <span>
                  <strong>2–3 Days Nationwide Delivery</strong>
                  <br /><span className="text-white/50">Dispatched via express courier tracking</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#DFBF88] shrink-0 mt-0.5" />
                <span>
                  <strong>7 Days Return Warranty</strong>
                  <br /><span className="text-white/50">Full support on all ready-stock items</span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A468] shrink-0 mt-0.5" />
                <span>
                  <strong>Concierge Assistance:</strong>
                  <br />
                  <a
                    href={socialLinks.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#DFBF88] hover:underline"
                  >
                    WhatsApp: 0313 0267697 →
                  </a>
                </span>
              </li>
              {onOpenTrackOrder && (
                <li className="pt-1">
                  <button
                    id="footer-track-order-btn"
                    type="button"
                    onClick={onOpenTrackOrder}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#C9A468] hover:text-[#2B231E] text-[#DFBF88] text-xs font-medium transition-all group"
                  >
                    <Package className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Track Order Nationwide →</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter / Exclusive Drops */}
          <div className="lg:col-span-3 space-y-3 font-sans">
            <h4 className="font-serif text-sm font-medium uppercase tracking-wider text-[#DFBF88]">
              Exclusive VIP Drops
            </h4>
            <p className="text-xs text-white/70 font-sans">
              Be the first to receive notifications about limited Balochi hand-embroidered releases and bespoke seasonal drops.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 pl-3 pr-10 text-xs bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C9A468] transition-colors font-sans"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to VIP newsletter"
                  className="absolute right-1.5 top-1.5 p-1.5 bg-[#C9A468] text-[#2B231E] rounded-md hover:bg-[#DFBF88] transition-all transform active:scale-90 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribed && (
                <p className="text-[11px] text-[#25D366] flex items-center gap-1 font-medium font-sans">
                  <Check className="w-3.5 h-3.5" />
                  <span>Welcome to NOORBAL VIP!</span>
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} NOORBAL. All rights reserved. Registered artisan trade.</p>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#25D366] transition-colors"
            >
              WhatsApp Support
            </a>
            <span>·</span>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#C9A468] transition-colors"
            >
              Instagram @noorbal.official
            </a>
            <span>·</span>
            <button
              onClick={scrollToConnect}
              className="hover:text-[#DFBF88] transition-colors cursor-pointer"
            >
              Social Hub
            </button>
            <span>·</span>
            <button
              onClick={onNavigateToAdmin}
              className="hover:text-[#C9A468] text-white/30 transition-colors cursor-pointer"
              title="Restricted Administrative Console"
            >
              Staff Portal
            </button>
            <span>·</span>
            <span>Made with Heritage in Pakistan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
