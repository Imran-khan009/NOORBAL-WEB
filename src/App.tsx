import React, { useState, useEffect } from 'react';
import { CurrencyCode, Product, CheckoutItem, Order } from './types';
import { PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryStrip } from './components/CategoryStrip';
import { ProductCatalog } from './components/ProductCatalog';
import { BalochiHeritageStory } from './components/BalochiHeritageStory';
import { TrustBadges } from './components/TrustBadges';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AnalyticsDrawer } from './components/AnalyticsDrawer';
import { SearchModal } from './components/SearchModal';
import { FloatingWhatsAppCTA } from './components/FloatingWhatsAppCTA';
import { Footer } from './components/Footer';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { CustomCursor } from './components/CustomCursor';
import { PageTransition } from './components/PageTransition';
import { ScrollReveal } from './components/ScrollReveal';
import { trackEvent } from './utils/analytics';

export default function App() {
  const [currency, setCurrency] = useState<CurrencyCode>('PKR');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('noorbal_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Dedicated Checkout & Order State
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('noorbal_wishlist', JSON.stringify(wishlist));
    } catch (err) {
      console.warn('Could not save wishlist', err);
    }
  }, [wishlist]);

  // Handle browser popstate for back button
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      if (!hash.includes('checkout') && !hash.includes('order-confirmed')) {
        setCheckoutItem(null);
        setConfirmedOrder(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track initial page view
  useEffect(() => {
    trackEvent('page_view', 'Customer visited NOORBAL storefront');
  }, []);

  const handleCurrencyChange = (code: CurrencyCode) => {
    setCurrency(code);
    trackEvent('currency_change', `Currency switched to ${code}`);
  };

  const handleSelectCategory = (catId: string) => {
    // If in checkout or confirmation, navigate back to store first
    if (checkoutItem || confirmedOrder) {
      setCheckoutItem(null);
      setConfirmedOrder(null);
      window.history.pushState({}, '', window.location.pathname);
    }
    
    setSelectedCategory(catId);
    trackEvent('category_filter', `Filtered collection to: ${catId}`);
    
    // Smooth scroll to catalog section
    setTimeout(() => {
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleNavigateToStory = () => {
    if (checkoutItem || confirmedOrder) {
      setCheckoutItem(null);
      setConfirmedOrder(null);
      window.history.pushState({}, '', window.location.pathname);
    }
    setTimeout(() => {
      const storyEl = document.getElementById('our-story-section');
      if (storyEl) {
        storyEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleNavigateToConnect = () => {
    if (checkoutItem || confirmedOrder) {
      setCheckoutItem(null);
      setConfirmedOrder(null);
      window.history.pushState({}, '', window.location.pathname);
    }
    setTimeout(() => {
      const connectEl = document.getElementById('footer-channels') || document.getElementById('footer-section');
      if (connectEl) {
        connectEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter((p) => p.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
      trackEvent('wishlist_add', `Saved to wishlist: ${product.name}`, {
        productId: product.id,
        productName: product.name,
      });
    }
  };

  const handleQuickView = (product: Product) => {
    setActiveModalProduct(product);
    trackEvent('product_view', `Viewed detail: ${product.name}`, {
      productId: product.id,
      productName: product.name,
    });
  };

  // Primary ORDER NOW checkout flow
  const handleInitiateCheckout = (product: Product, size?: string, quantity: number = 1) => {
    const chosenSize = size || product.defaultSize || (product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    
    setCheckoutItem({
      product,
      size: chosenSize,
      quantity: Math.max(1, quantity),
    });
    setConfirmedOrder(null);
    setActiveModalProduct(null);
    setIsWishlistOpen(false);

    window.history.pushState({ view: 'checkout' }, '', '#checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    trackEvent('checkout_started', `Started checkout for ${product.name} (${chosenSize}, Qty: ${quantity})`, {
      productId: product.id,
      productName: product.name,
    });
  };

  const handleOrderPlaced = (order: Order) => {
    setConfirmedOrder(order);
    setCheckoutItem(null);
    window.history.pushState({ view: 'confirmation' }, '', '#order-confirmed');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    trackEvent('order_placed', `Order ${order.id} placed successfully: ${order.item.productName} (PKR ${order.totalPKR.toLocaleString()})`, {
      productId: order.item.productId,
      productName: order.item.productName,
    });
  };

  const handleBackToStore = () => {
    setCheckoutItem(null);
    setConfirmedOrder(null);
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCheckoutQuantity = (qty: number) => {
    if (!checkoutItem) return;
    setCheckoutItem({
      ...checkoutItem,
      quantity: Math.max(1, qty),
    });
  };

  const handleUpdateCheckoutSize = (size: string) => {
    if (!checkoutItem) return;
    setCheckoutItem({
      ...checkoutItem,
      size,
    });
  };

  const currentViewKey = confirmedOrder ? 'confirmation' : checkoutItem ? 'checkout' : 'storefront';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2B231E] relative selection:bg-[#C9A468]/30">
      
      {/* Subtle Desktop Custom Cursor */}
      <CustomCursor />

      {/* Top Navbar with controls */}
      <Navbar
        currentCurrency={currency}
        onCurrencyChange={handleCurrencyChange}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateToStory={handleNavigateToStory}
        onNavigateToConnect={handleNavigateToConnect}
      />

      {/* Main Content Router with Cinematic Page Transition */}
      <main className="flex-1">
        <PageTransition viewKey={currentViewKey}>
          {confirmedOrder ? (
            <OrderConfirmationPage
              order={confirmedOrder}
              currency={currency}
              onContinueShopping={handleBackToStore}
            />
          ) : checkoutItem ? (
            <CheckoutPage
              checkoutItem={checkoutItem}
              currency={currency}
              onBackToStore={handleBackToStore}
              onOrderPlaced={handleOrderPlaced}
              onUpdateQuantity={handleUpdateCheckoutQuantity}
              onUpdateSize={handleUpdateCheckoutSize}
            />
          ) : (
            <>
              {/* Editorial Hero Banner with Motion */}
              <HeroBanner
                onExploreBalochi={() => handleSelectCategory('balochi-heritage')}
                onExploreCatalog={() => handleSelectCategory('all')}
              />

              {/* Category Navigation Strip */}
              <ScrollReveal direction="up" distance={15}>
                <CategoryStrip
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleSelectCategory}
                />
              </ScrollReveal>

              {/* Product Catalog Grid */}
              <ScrollReveal direction="up" distance={20}>
                <ProductCatalog
                  products={PRODUCTS}
                  selectedCategory={selectedCategory}
                  currency={currency}
                  wishlistIds={wishlist.map((w) => w.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={handleQuickView}
                  onOrderNow={(prod) => handleInitiateCheckout(prod)}
                />
              </ScrollReveal>

              {/* Balochi Heritage Story Section */}
              <ScrollReveal direction="up" distance={25}>
                <BalochiHeritageStory
                  onExploreBalochi={() => handleSelectCategory('balochi-heritage')}
                />
              </ScrollReveal>

              {/* Assurance & Trust Matrix */}
              <ScrollReveal direction="up" distance={15}>
                <TrustBadges />
              </ScrollReveal>
            </>
          )}
        </PageTransition>
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onNavigateToStory={handleNavigateToStory}
        onNavigateToConnect={handleNavigateToConnect}
      />

      {/* Persistent Floating WhatsApp Concierge Support */}
      <FloatingWhatsAppCTA />

      {/* Interactive Product Detail Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        currency={currency}
        isWishlisted={activeModalProduct ? wishlist.some((w) => w.id === activeModalProduct.id) : false}
        onClose={() => setActiveModalProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onOrderNow={(prod, size, qty) => handleInitiateCheckout(prod, size, qty)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        currency={currency}
        onRemoveFromWishlist={(id) => setWishlist(wishlist.filter((w) => w.id !== id))}
        onQuickView={handleQuickView}
        onOrderSingle={(prod) => handleInitiateCheckout(prod)}
      />

      {/* Live Business Intelligence / Analytics Drawer */}
      <AnalyticsDrawer
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        currency={currency}
        onSelectProduct={handleQuickView}
      />

    </div>
  );
}
