'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  useCanteenConfig,
  isCanteenOpen,
} from '@/lib/canteen-config';
import { ProductItem, CartItem } from '@/types/canteen';
import { Navbar } from '@/components/Navbar';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { HeroSection } from '@/components/HeroSection';
import { CategoryBar } from '@/components/CategoryBar';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { StickyCartBar } from '@/components/StickyCartBar';
import { Footer } from '@/components/Footer';
import { InfoModal } from '@/components/InfoModal';
import { AiGourmetAssistantModal } from '@/components/AiGourmetAssistantModal';
import { OrderHistoryModal } from '@/components/OrderHistoryModal';
import { FirstVisitNoticeModal } from '@/components/FirstVisitNoticeModal';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import {
  Sparkles,
  AlertTriangle,
  Search,
  Compass,
  ArrowRight,
  Flame,
  Coffee,
  X,
  History,
  Heart,
} from 'lucide-react';

// Quick search suggestions for students
const QUICK_SEARCH_TAGS = [
  { label: '🥪 Karışık Tost', query: 'tost' },
  { label: '☕ Çay & Kahve', query: 'kahve' },
  { label: '🥤 Buz Gibi İçecek', query: 'içecek' },
  { label: '🍟 Çıtır Patates', query: 'patates' },
  { label: '🍰 Çikolatalı Kek', query: 'kek' },
  { label: '🥯 Çıtır Simit', query: 'simit' },
];

export default function HomePage() {
  const config = useCanteenConfig();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAutoSelectedCategory, setIsAutoSelectedCategory] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Modals state
  const [modalProduct, setModalProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // SSR-safe client mount detection using useSyncExternalStore
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const addToast = (text: string, type: 'success' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check first visit notice & load favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        try {
          const seenNotice =
            localStorage.getItem('gerze_student_project_notice_v2') ||
            localStorage.getItem('gerze_project_notice_seen');
          if (!seenNotice) {
            setIsNoticeOpen(true);
          }

          const savedFavs = localStorage.getItem('gerze_favorite_items');
          if (savedFavs) {
            setFavoriteIds(JSON.parse(savedFavs));
          }
        } catch {
          // Ignore JSON error
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Toggle favorite product
  const handleToggleFavorite = (productId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(productId);
      const updated = exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('gerze_favorite_items', JSON.stringify(updated));
      }
      addToast(
        exists ? 'Ürün favorilerden çıkarıldı.' : 'Ürün favorilere eklendi! ❤️'
      );
      return updated;
    });
  };

  // Canteen open/closed check - SSR safe with client hydration guard
  const canteenStatus = useMemo(() => {
    if (!isMounted) {
      return { isOpen: true, message: 'Siparişe Açık' };
    }
    return isCanteenOpen(config);
  }, [config, isMounted]);

  // Available products pool based on config
  const availablePool = useMemo(() => {
    return config.products.filter((p) => {
      if (!config.settings.devMode && config.settings.hideUnavailableProducts && !p.available) {
        return false;
      }
      return true;
    });
  }, [config]);

  // Search helper
  const matchesQuery = (p: ProductItem, q: string) => {
    const query = q.toLowerCase().trim();
    if (!query) return true;
    const nameMatch = p.name.toLowerCase().includes(query);
    const descMatch = p.description.toLowerCase().includes(query);
    const catMatch = p.category.toLowerCase().includes(query);
    return nameMatch || descMatch || catMatch;
  };

  // Category counts (dynamic based on search query)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    availablePool.forEach((p) => {
      if (searchQuery.trim() && !matchesQuery(p, searchQuery)) {
        return;
      }
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [availablePool, searchQuery]);

  // Automatic Category Selection Logic
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      setIsAutoSelectedCategory(false);
      return;
    }

    // Scroll gently to menu section on search
    const menuEl = document.getElementById('menu-section');
    if (menuEl && window.scrollY < 200) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }

    // 1. Direct Category Name Matching
    const matchedCategoryByName = config.categories.find(
      (c) =>
        c.name.toLowerCase().includes(trimmed) ||
        c.id.toLowerCase().includes(trimmed) ||
        (trimmed === 'içecek' && (c.id === 'sicak-icecek' || c.id === 'soguk-icecek'))
    );

    if (matchedCategoryByName) {
      setActiveCategory(matchedCategoryByName.id);
      setIsAutoSelectedCategory(true);
      return;
    }

    // 2. All matching products belong strictly to one single category
    const matchingProducts = availablePool.filter((p) => matchesQuery(p, trimmed));
    const matchingCategories = Array.from(new Set(matchingProducts.map((p) => p.category)));

    if (matchingCategories.length === 1) {
      setActiveCategory(matchingCategories[0]);
      setIsAutoSelectedCategory(true);
    } else if (matchingCategories.length > 1) {
      // If current category has 0 matches, auto switch to 'all' so student sees results
      if (activeCategory !== 'all' && (!categoryCounts[activeCategory] || categoryCounts[activeCategory] === 0)) {
        setActiveCategory('all');
        setIsAutoSelectedCategory(false);
      }
    }
  };

  // Manual category change
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    setIsAutoSelectedCategory(false);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsAutoSelectedCategory(false);
  };

  // Featured items ("Günün Önerileri")
  const featuredProducts = useMemo(() => {
    return availablePool.filter((p) => p.featured && p.available);
  }, [availablePool]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return availablePool.filter((product) => {
      // Category filter
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        return matchesQuery(product, searchQuery);
      }

      return true;
    });
  }, [availablePool, activeCategory, searchQuery]);

  // Cart totals
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const cartTotalAmount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cartItems]);

  // Add to cart from modal
  const handleAddToCart = (newItemData: Omit<CartItem, 'id'>) => {
    const extrasKey = newItemData.selectedExtras
      .map((e) => e.id)
      .sort()
      .join(',');
    const itemKey = `${newItemData.product.id}_${extrasKey}_${newItemData.note || ''}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + newItemData.quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: updated[existingIndex].unitPrice * newQty,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            ...newItemData,
            id: itemKey,
          },
        ];
      }
    });

    addToast(`${newItemData.product.name} sepete eklendi.`);
  };

  // Quick add (when product has no extras)
  const handleQuickAdd = (product: ProductItem) => {
    if (!product.available) {
      addToast('Bu ürün şu anda tükenmiştir.', 'warning');
      return;
    }

    const unitPrice = product.discountPrice ?? product.price;
    const itemKey = `${product.id}__`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: unitPrice * newQty,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            product,
            quantity: 1,
            selectedExtras: [],
            note: '',
            unitPrice,
            totalPrice: unitPrice,
          },
        ];
      }
    });

    addToast(`${product.name} sepete eklendi.`);
  };

  // Reorder all items from past order history
  const handleReorder = (itemsToReorder: CartItem[]) => {
    setCartItems((prev) => {
      let updatedCart = [...prev];
      itemsToReorder.forEach((item) => {
        const existingIdx = updatedCart.findIndex((i) => i.id === item.id);
        if (existingIdx > -1) {
          const newQty = updatedCart[existingIdx].quantity + item.quantity;
          updatedCart[existingIdx] = {
            ...updatedCart[existingIdx],
            quantity: newQty,
            totalPrice: updatedCart[existingIdx].unitPrice * newQty,
          };
        } else {
          updatedCart.push({ ...item });
        }
      });
      return updatedCart;
    });
    setIsCartOpen(true);
  };

  // Cart quantity updater
  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  // Remove single item from cart
  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  // Clear all items
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Scroll to menu
  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Theme styles based on config.theme
  const themeStyles = useMemo(() => {
    const t = config.theme;
    if (!t) return {};
    return {
      '--color-primary': t.primary,
      '--color-secondary': t.secondary,
      '--color-background': t.background,
      '--color-surface': t.surface,
      '--color-text': t.text,
      '--color-muted': t.muted,
      '--color-success': t.success,
      '--color-warning': t.warning,
      '--color-danger': t.danger,
    } as React.CSSProperties;
  }, [config.theme]);

  return (
    <div
      style={themeStyles}
      className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white pb-20 sm:pb-0"
    >
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Announcement Banner */}
      <AnnouncementBanner announcement={config.announcement} />

      {/* Main Navbar */}
      <Navbar
        config={config}
        cartCount={cartItemCount}
        cartTotal={cartTotalAmount}
        canteenStatus={canteenStatus}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenInfo={() => setIsInfoModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Canteen Closed Warning Box if not active */}
      {isMounted && !canteenStatus.isOpen && (
        <div className="bg-rose-500 text-white px-4 py-2.5 text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{canteenStatus.message}</span>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection
        config={config}
        onScrollToMenu={scrollToMenu}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* Sticky Category Bar with Advanced Search Integration */}
      <div id="menu-section">
        <CategoryBar
          categories={config.categories}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
          categoryCounts={categoryCounts}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
          isAutoSelected={isAutoSelectedCategory}
        />
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        {/* Quick Search Tag Chips + Order History Shortcut */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {/* History Shortcut Pill */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="text-xs px-3 py-1.5 rounded-full font-bold transition-all shrink-0 active:scale-95 border bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 flex items-center gap-1.5 shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Geçmiş Siparişlerim & Favoriler</span>
          </button>

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mx-1">
            •
          </span>

          {QUICK_SEARCH_TAGS.map((tag) => (
            <button
              key={tag.label}
              onClick={() => handleSearchChange(tag.query)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 active:scale-95 border ${
                searchQuery.toLowerCase() === tag.query.toLowerCase()
                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="text-xs px-2.5 py-1.5 rounded-full font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 shrink-0 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Temizle</span>
            </button>
          )}
        </div>

        {/* Fast Menu Decision Wizard Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 border border-emerald-500/30 p-5 sm:p-6 text-white shadow-md">
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/4 bottom-0 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-300 to-emerald-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg">
                <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-base sm:text-lg md:text-xl text-white tracking-tight">
                    Ne Yiyeceğine Karar Veremedin mi? 🎲
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full">
                    Hızlı Menü Sihirbazı
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Moduna (sınav, açlık, uykusuzluk) ve bütçene göre çalışan menü sihirbazımız 10 saniyede sana özel lezzeti önersin!
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 self-start md:self-center"
            >
              <Compass className="w-4 h-4 text-slate-950" />
              <span>Bana Menü Seç</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Suggestions ("Günün Önerileri") */}
        {activeCategory === 'all' && !searchQuery.trim() && featuredProducts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Günün Önerileri
                  </h2>
                  <p className="text-xs text-slate-500">
                    Kantinimizin en çok tercih edilen taze lezzetleri
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={`featured-${product.id}`}
                  product={product}
                  currency={config.currency}
                  onOpenDetail={setModalProduct}
                  onQuickAdd={handleQuickAdd}
                  disabled={isMounted && !canteenStatus.isOpen}
                  searchQuery={searchQuery}
                  isFavorite={favoriteIds.includes(product.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        {/* Regular Menu Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>
                  {activeCategory === 'all'
                    ? 'Tüm Menü'
                    : config.categories.find((c) => c.id === activeCategory)?.name || 'Menü'}
                </span>
                {searchQuery.trim() && (
                  <span className="text-xs font-normal text-slate-500">
                    (Arama: &ldquo;{searchQuery}&rdquo;)
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                {filteredProducts.length} çeşit lezzet listeleniyor
              </p>
            </div>

            {searchQuery.trim() && (
              <button
                onClick={handleClearSearch}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold self-start sm:self-auto underline"
              >
                Aramayı Temizle ve Tüm Menüyü Göster
              </button>
            )}
          </div>

          {/* Empty search results */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200/80 p-8">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">
                  Aradığınız lezzet bulunamadı
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  &ldquo;{searchQuery}&rdquo; ile eşleşen bir ürün yok. Farklı bir arama yapabilir veya Menü Sihirbazı&apos;ndan yardım alabilirsiniz.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Tüm Menüyü Göster
                </button>
                <button
                  onClick={() => setIsAiAssistantOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-xs hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Ne Yesem Diye Sor</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={config.currency}
                  onOpenDetail={setModalProduct}
                  onQuickAdd={handleQuickAdd}
                  disabled={isMounted && !canteenStatus.isOpen}
                  searchQuery={searchQuery}
                  isFavorite={favoriteIds.includes(product.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Sticky Mobile Cart Bar */}
      <StickyCartBar
        totalCount={cartItemCount}
        totalPrice={cartTotalAmount}
        currency={config.currency}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Footer */}
      <Footer
        config={config}
        onOpenNotice={() => setIsNoticeOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductModal
        product={modalProduct}
        currency={config.currency}
        isOpen={!!modalProduct}
        onClose={() => setModalProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={config.currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        config={config}
        onOrderCompleted={() => {
          setCartItems([]);
        }}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        config={config}
      />

      {/* Quick Menu Decision Wizard Modal */}
      <AiGourmetAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        config={config}
        onAddToCart={handleAddToCart}
        addToast={addToast}
      />

      {/* Order History & Favorites Modal */}
      <OrderHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        config={config}
        onReorder={handleReorder}
        onAddToCart={handleAddToCart}
        addToast={addToast}
      />

      {/* First Visit Student Project Notice Modal */}
      <FirstVisitNoticeModal
        isOpen={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        config={config}
      />
    </div>
  );
}
