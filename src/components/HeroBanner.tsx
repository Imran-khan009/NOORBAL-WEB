import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_ASSETS } from '../data/products';
import mauveDressImg from '../assets/images/balochi_dress_mauve_1789105472348.jpg';
import perfumeImg from '../assets/images/noorbal_perfume_amber_1789105490295.jpg';

interface HeroBannerProps {
  onExploreBalochi: () => void;
  onExploreCatalog: () => void;
}

const HERO_SLIDES = [
  {
    id: 'heritage-craft',
    badge: 'Authentic Balochi Craft',
    headline: 'Timeless Heritage, Modern Elegance',
    description: 'Handcrafted with tradition, designed for today. Heirloom dresses and royal fragrances.',
    image: HERO_ASSETS.banner,
    tag: 'Ready-Stock & Bespoke',
    featureTitle: 'Mauve & Antique Gold 3-Piece',
    price: 'PKR 35,000',
  },
  {
    id: 'artisan-needlework',
    badge: '100% Handcrafted In Balochistan',
    headline: 'Living Art Woven Across Generations',
    description: 'Each geometric stitch honors centuries of Balochi maternal needlework craftsmanship.',
    image: mauveDressImg,
    tag: 'Artisan Heirloom',
    featureTitle: 'Pure Silk & Hand Needlework',
    price: 'PKR 35,000',
  },
  {
    id: 'royal-luxury',
    badge: 'Prestige Fragrances & Horology',
    headline: 'Amber, Smoked Oud & Celestial Horology',
    description: 'Exquisite extrait de parfum formulations and sapphire-crystal moonphase timepieces.',
    image: perfumeImg,
    tag: 'Signature Oud',
    featureTitle: 'Golden Amber & Damascus Rose',
    price: 'PKR 1,400',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreBalochi,
  onExploreCatalog,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance slide gently every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  // NASA-grade staggered animation variants for clean visual storytelling
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const badgeVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const headlineVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const descriptionVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const benefitsContainerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.12,
      },
    },
  };

  const benefitItemVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const ctaVariant = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#2B231E] text-[#FAF8F5]">
      {/* Subtle Ambient Radial Lighting */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_20%_25%,#C9A468_0%,transparent_50%)]"
      />
      <div 
        className="absolute -bottom-24 -right-24 w-96 h-96 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,#DFBF88_0%,transparent_70%)] blur-2xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-18 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Brand Story & Hierarchy Column */}
          <div className="lg:col-span-6 text-center lg:text-left order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="space-y-4 sm:space-y-5"
              >
                {/* 1. Heritage Badge */}
                <motion.div variants={badgeVariant} className="flex justify-center lg:justify-start">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5]/10 border border-[#C9A468]/50 text-[#DFBF88] text-[11px] sm:text-xs font-sans font-semibold tracking-wider uppercase shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A468]" />
                    <span>✦ {slide.badge}</span>
                  </div>
                </motion.div>

                {/* 2. Headline - Cormorant Garamond 36-42px mobile, 1.08-1.12 line height, 500/600 weight */}
                <motion.div variants={headlineVariant}>
                  <h1 className="font-serif text-[36px] sm:text-[42px] lg:text-[52px] font-medium sm:font-semibold text-[#FAF8F5] leading-[1.08] sm:leading-[1.12] max-w-xl mx-auto lg:mx-0">
                    {slide.headline}
                  </h1>
                </motion.div>

                {/* 3. Clean Sans-Serif Description - Manrope 14-16px, 1.6 line height */}
                <motion.div variants={descriptionVariant}>
                  <p className="text-sm sm:text-base text-[#FAF8F5]/85 font-sans leading-[1.6] max-w-lg mx-auto lg:mx-0">
                    {slide.description}
                  </p>
                </motion.div>

                {/* 4. Compact 3 Key Trust Points */}
                <motion.div
                  variants={benefitsContainerVariant}
                  className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 max-w-md mx-auto lg:mx-0"
                >
                  <motion.div variants={benefitItemVariant} className="text-center lg:text-left space-y-0.5">
                    <div className="flex items-center justify-center lg:justify-start gap-1 text-[#C9A468] text-xs font-sans font-semibold">
                      <Truck className="w-3.5 h-3.5 shrink-0" />
                      <span>2–3 Days</span>
                    </div>
                    <p className="text-[11px] text-white/60 font-sans">Nationwide Express</p>
                  </motion.div>

                  <motion.div variants={benefitItemVariant} className="text-center lg:text-left space-y-0.5 border-x border-white/10 px-1">
                    <div className="flex items-center justify-center lg:justify-start gap-1 text-[#DFBF88] text-xs font-sans font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>7 Days</span>
                    </div>
                    <p className="text-[11px] text-white/60 font-sans">Return Guarantee</p>
                  </motion.div>

                  <motion.div variants={benefitItemVariant} className="text-center lg:text-left space-y-0.5">
                    <div className="flex items-center justify-center lg:justify-start gap-1 text-[#C9A468] text-xs font-sans font-semibold">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span>100%</span>
                    </div>
                    <p className="text-[11px] text-white/60 font-sans">Handcrafted</p>
                  </motion.div>
                </motion.div>

                {/* 5. Primary CTA - Manrope 12-14px */}
                <motion.div
                  variants={ctaVariant}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1"
                >
                  <button
                    id="hero-explore-collection-btn"
                    type="button"
                    onClick={onExploreBalochi}
                    className="min-h-[48px] px-8 py-3.5 bg-[#C9A468] hover:bg-[#DFBF88] text-[#2B231E] font-sans text-xs sm:text-sm uppercase tracking-wider font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>EXPLORE COLLECTION</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={onExploreCatalog}
                    className="min-h-[48px] px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-sans text-xs sm:text-sm uppercase tracking-wider font-semibold rounded-xl border border-white/20 hover:border-[#C9A468] transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>VIEW ALL PIECES</span>
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Featured Visual Media Column */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C9A468]/30 shadow-2xl bg-[#3A302A] group">
              
              {/* Image Crossfade with smooth ease */}
              <div 
                className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden cursor-pointer"
                onClick={onExploreBalochi}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.headline}
                    initial={{ opacity: 0.3, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.3 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-1000 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
              </div>

              {/* Editorial Caption Bar */}
              <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 bg-[#2B231E]/90 backdrop-blur-md p-3 sm:p-3.5 rounded-xl border border-[#C9A468]/40 flex items-center justify-between shadow-xl gap-2">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[11px] tracking-wider uppercase text-[#C9A468] font-sans font-semibold block">
                    {slide.tag}
                  </span>
                  <p className="text-sm sm:text-base font-serif font-medium text-white truncate">
                    {slide.featureTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-[#DFBF88] font-sans font-semibold">
                    {slide.price}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onExploreBalochi}
                  className="min-h-[40px] px-4 py-2 bg-[#C9A468] hover:bg-[#DFBF88] text-[#2B231E] rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shrink-0 cursor-pointer"
                >
                  View
                </button>
              </div>

              {/* Prev / Next Slide Chevrons (Desktop) */}
              <div className="hidden sm:flex absolute top-3.5 right-3.5 gap-1.5 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
                  }}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 active:scale-90 transition-all"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
                  }}
                  className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 active:scale-90 transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Pagination Dots Underneath */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-6 bg-[#C9A468]' : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
