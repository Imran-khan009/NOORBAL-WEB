import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';
import { HERO_ASSETS } from '../data/products';
import { socialLinks } from '../config/socialLinks';
import { WhatsAppBrandIcon } from './SocialIcons';

interface HeroBannerProps {
  onExploreBalochi: () => void;
  onExploreCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreBalochi,
  onExploreCatalog,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants for staggered cinematic storytelling sequence
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#2B231E] text-[#FAF8F5]">
      {/* Decorative Subtle Ambient Glow / Light Movement */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_20%_25%,#C9A468_0%,transparent_50%)] animate-pulse"
        style={{ animationDuration: '8s' }}
      />
      <div 
        className="absolute -bottom-20 -right-20 w-96 h-96 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,#DFBF88_0%,transparent_70%)] blur-2xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Brand Story & Cinematic Text Sequence */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            
            {/* Pill Tag */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5]/10 border border-[#C9A468]/40 text-[#DFBF88] text-xs font-medium tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A468]" />
                <span>Authentic Balochi Craft · Modern Elegance</span>
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="font-serif text-3.5xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F5] leading-[1.12]">
                Light · Heritage · Softness
              </h1>
              <p className="text-sm sm:text-base text-[#FAF8F5]/80 font-sans font-normal max-w-xl leading-relaxed mx-auto lg:mx-0">
                NOORBAL bridges timeless Balochi needlework traditions with contemporary luxury fashion. Handcrafted dresses, signature oud fragrances, and prestige accessories for discerning women and men.
              </p>
            </motion.div>

            {/* Value Highlights Matrix */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-3 pt-2 pb-2 border-y border-white/10 max-w-md mx-auto lg:mx-0"
            >
              <div className="text-left space-y-0.5">
                <div className="flex items-center gap-1 text-[#C9A468] text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>2–3 Days</span>
                </div>
                <p className="text-[11px] text-white/60">Fast Nationwide Shipping</p>
              </div>

              <div className="text-left space-y-0.5">
                <div className="flex items-center gap-1 text-[#DFBF88] text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>7 Days Back</span>
                </div>
                <p className="text-[11px] text-white/60">Peace-of-Mind Warranty</p>
              </div>

              <div className="text-left space-y-0.5">
                <div className="flex items-center gap-1 text-[#C9A468] text-xs font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>100% Hand</span>
                </div>
                <p className="text-[11px] text-white/60">Artisan Needlework</p>
              </div>
            </motion.div>

            {/* CTA Button Group */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <button
                id="hero-explore-balochi-btn"
                type="button"
                onClick={onExploreBalochi}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#C9A468] hover:bg-[#DFBF88] text-[#2B231E] font-sans text-xs uppercase tracking-widest font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
              >
                <span>Explore Balochi Heritage</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                id="hero-whatsapp-order-btn"
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-sans text-xs uppercase tracking-widest font-semibold rounded-lg border border-white/20 hover:border-[#C9A468] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <WhatsAppBrandIcon className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Concierge</span>
              </a>
            </motion.div>

          </motion.div>

          {/* Right Column: Visual Showcase Framing with Ambient Movement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C9A468]/30 shadow-2xl bg-[#3A302A] group">
              <div className="product-image-container overflow-hidden" data-cursor="view">
                <img
                  src={HERO_ASSETS.banner}
                  alt="NOORBAL Balochi Heritage Collection"
                  className="w-full h-auto max-h-[500px] object-cover object-center transform group-hover:scale-104 transition-transform duration-1000 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Floating Featured Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#2B231E]/90 backdrop-blur-md p-4 rounded-xl border border-[#C9A468]/40 flex items-center justify-between shadow-lg">
                <div className="space-y-0.5">
                  <span className="text-[10px] tracking-widest uppercase text-[#C9A468] font-bold block">
                    Featured Masterpiece
                  </span>
                  <p className="text-xs sm:text-sm font-serif font-semibold text-white">
                    Mauve & Antique Gold Hand-Embroidered 3-Piece
                  </p>
                  <p className="text-[11px] text-white/70">
                    Ready-Stock (S/M/L/XL) · PKR 35,000
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onExploreBalochi}
                  className="text-xs px-3.5 py-2 bg-[#C9A468] hover:bg-[#DFBF88] text-[#2B231E] rounded-md font-bold uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-xs"
                >
                  View Dress
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
