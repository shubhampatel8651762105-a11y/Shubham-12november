import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { CategorySection } from './components/CategorySection';
import { ProductCatalog } from './components/ProductCatalog';
import { BestsellersSection } from './components/BestsellersSection';
import { FlashSaleBanner } from './components/FlashSaleBanner';
import { ReviewsSection } from './components/ReviewsSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { MarketInsightsModal } from './components/MarketInsightsModal';
import { WishlistModal } from './components/WishlistModal';
import { OrdersModal } from './components/OrdersModal';
import { SearchModal } from './components/SearchModal';
import { AppointmentModal } from './components/AppointmentModal';
import { AppointmentBanner } from './components/AppointmentBanner';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { PRODUCTS } from './data/products';
import { Product, CartItem, Order, ToastMessage, ProductCategory, Appointment } from './types';
import { useAuth } from './context/AuthContext.tsx';
import { Calendar } from 'lucide-react';

export default function App() {
  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shubhamvip_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist set persisted in localStorage
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('shubhamvip_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set([2, 4]);
    } catch {
      return new Set([2, 4]);
    }
  });

  // Orders state persisted in localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('shubhamvip_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }

    // Default sample order
    return [
      {
        id: 'SV829410',
        createdAt: 'Just now',
        items: [
          {
            product: PRODUCTS[0],
            qty: 1,
            selectedSize: 'L',
            selectedColor: 'Pitch Black',
          },
          {
            product: PRODUCTS[4],
            qty: 1,
            selectedColor: 'Matte Charcoal',
          },
        ],
        subtotal: 4998,
        discount: 749,
        shipping: 0,
        total: 4249,
        couponCode: 'VIP15',
        customer: {
          name: 'Shubham Patel',
          phone: '9876543210',
          email: 'shubhampatel@example.com',
          address: '402 Greenfield Heights, Linking Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          pin: '400050',
          paymentMethod: 'UPI (PhonePe / GPay / Paytm)',
        },
        status: 'Packed',
        estimatedDelivery: 'Tomorrow, 5:00 PM',
      },
    ];
  });

  const { user, idToken } = useAuth();

  // Modals & Navigation
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMarketInsightsOpen, setIsMarketInsightsOpen] = useState(false);
  const [marketInsightsProduct, setMarketInsightsProduct] = useState<Product | null>(null);

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Coupon state
  const [couponCode, setCouponCode] = useState<string>('');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load orders from Cloud SQL database
  useEffect(() => {
    const fetchDbOrders = async () => {
      try {
        const headers: Record<string, string> = {};
        if (idToken) headers['Authorization'] = `Bearer ${idToken}`;
        const query = user?.email ? `?email=${encodeURIComponent(user.email)}` : '';
        const res = await fetch(`/api/orders${query}`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
            setOrders(data.orders);
          }
        }
      } catch (err) {
        console.error('Failed to load orders from database:', err);
      }
    };

    fetchDbOrders();
  }, [user, idToken]);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shubhamvip_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('shubhamvip_wishlist', JSON.stringify(Array.from(wishlistIds)));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('shubhamvip_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Toast trigger
  const showToast = (text: string, type: 'cart' | 'success' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Items Map (for quick lookup in cards)
  const cartItemsMap = useMemo(() => {
    const map: Record<number, number> = {};
    cart.forEach((item) => {
      map[item.product.id] = (map[item.product.id] || 0) + item.qty;
    });
    return map;
  }, [cart]);

  // Subtotals
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!couponCode) return 0;
    if (couponCode === 'VIP15') return Math.round(cartSubtotal * 0.15);
    if (couponCode === 'VIP70') return Math.round(cartSubtotal * 0.20);
    if (couponCode === 'WELCOME10') return Math.round(cartSubtotal * 0.10);
    return 0;
  }, [cartSubtotal, couponCode]);

  const shippingAmount = cartSubtotal >= 499 || cart.length === 0 ? 0 : 49;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingAmount);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    qty: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].qty += qty;
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            qty,
            selectedSize: selectedSize || (product.sizes ? product.sizes[0] : undefined),
            selectedColor: selectedColor || (product.colors ? product.colors[0].name : undefined),
          },
        ];
      }
    });

    showToast(`🛒 ${product.name} added to your bag!`, 'cart');
  };

  const handleUpdateCartQty = (productId: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: number) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`Removed ${item.product.name} from bag`, 'info');
    }
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`Removed from wishlist`, 'info');
      } else {
        next.add(product.id);
        showToast(`❤️ Added ${product.name} to wishlist!`, 'success');
      }
      return next;
    });
  };

  const handleRemoveFromWishlist = (productId: number) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
    showToast('Removed from wishlist', 'info');
  };

  const handleMoveWishlistToCart = (product: Product) => {
    handleAddToCart(product);
    handleRemoveFromWishlist(product.id);
  };

  const handleAddAllWishlistToCart = () => {
    wishlistProducts.forEach((p) => {
      handleAddToCart(p);
    });
    setWishlistIds(new Set());
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    showToast('All wishlist items moved to your bag!', 'cart');
  };

  const wishlistProducts = useMemo(() => {
    return PRODUCTS.filter((p) => wishlistIds.has(p.id));
  }, [wishlistIds]);

  // Coupon handling
  const handleApplyCoupon = (code: string): boolean => {
    const validCoupons = ['VIP15', 'VIP70', 'WELCOME10'];
    if (validCoupons.includes(code)) {
      setCouponCode(code);
      showToast(`🎉 Coupon ${code} applied successfully!`, 'success');
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    showToast('Coupon removed', 'info');
  };

  // Buy Now immediate checkout flow
  const handleBuyNow = (
    product: Product,
    qty: number = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    handleAddToCart(product, qty, selectedSize, selectedColor);
    setIsCheckoutOpen(true);
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setCouponCode('');
    showToast(`🎉 Order #${newOrder.id} confirmed!`, 'success');
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
  };

  const scrollToCatalog = () => {
    const elem = document.getElementById('catalog');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCategories = () => {
    const elem = document.getElementById('categories');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-orange-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        wishlistCount={wishlistIds.size}
        ordersCount={orders.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={handleSelectCategory}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with interactive floating cards */}
        <Hero
          onShopClick={scrollToCatalog}
          onExploreCategories={scrollToCategories}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={handleAddToCart}
          sampleProducts={PRODUCTS}
        />

        {/* Value Guarantees Strip */}
        <TrustBar />

        {/* Categories Explorer */}
        <CategorySection
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* Product Catalog with Search, Filters, and Quick Actions */}
        <ProductCatalog
          products={PRODUCTS}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          cartItemsMap={cartItemsMap}
          wishlistIds={wishlistIds}
          onAddToCart={handleAddToCart}
          onUpdateCartQty={handleUpdateCartQty}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
          onOpenMarketInsights={(p) => {
            setMarketInsightsProduct(p);
            setIsMarketInsightsOpen(true);
          }}
        />

        {/* VIP Styling & Product Consultation Appointment Banner (Supabase Backend) */}
        <AppointmentBanner onBookClick={() => setIsAppointmentOpen(true)} />

        {/* Best Sellers Showcase */}
        <BestsellersSection
          products={PRODUCTS}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
          onViewAllCatalog={scrollToCatalog}
        />

        {/* Promo Countdown Banners */}
        <FlashSaleBanner
          onShopSale={scrollToCatalog}
          onCopyCoupon={(code) => {
            handleApplyCoupon(code);
            showToast(`Coupon code ${code} copied to clipboard!`, 'success');
          }}
        />

        {/* Customer Reviews & Trust Badges */}
        <ReviewsSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat: ProductCategory) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAppointment={() => setIsAppointmentOpen(true)}
      />

      {/* Slide-in Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        couponCode={couponCode}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        discountAmount={discountAmount}
      />

      {/* Complete Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={cartSubtotal}
        discount={discountAmount}
        shipping={shippingAmount}
        total={grandTotal}
        couponCode={couponCode}
        onOrderPlaced={handleOrderPlaced}
        onViewOrders={() => {
          setIsCheckoutOpen(false);
          setIsOrdersOpen(true);
        }}
      />

      {/* Product Detail / Quick View Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={quickViewProduct ? wishlistIds.has(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenMarketInsights={(p) => {
          setMarketInsightsProduct(p);
          setIsMarketInsightsOpen(true);
        }}
      />

      {/* Live Google Search Grounded Market Insights Modal */}
      <MarketInsightsModal
        product={marketInsightsProduct}
        isOpen={isMarketInsightsOpen}
        onClose={() => setIsMarketInsightsOpen(false)}
      />

      {/* Wishlist Modal / Drawer */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveWishlistToCart}
        onAddAllToCart={handleAddAllWishlistToCart}
      />

      {/* Orders & Account Tracker Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onShopClick={() => {
          setIsOrdersOpen(false);
          scrollToCatalog();
        }}
      />

      {/* Quick Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={PRODUCTS}
        onSelectProduct={(p) => setQuickViewProduct(p)}
        onAddToCart={handleAddToCart}
      />

      {/* VIP Appointment Booking Modal with Supabase Backend */}
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        onAppointmentBooked={(appt) => {
          showToast(`📅 VIP Appointment scheduled for ${appt.appointmentDate}!`, 'success');
        }}
      />

      {/* Floating Quick Action Button: Book Appointment */}
      <button
        onClick={() => setIsAppointmentOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-full shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer font-extrabold text-xs border border-white/25 group"
        title="Book VIP Styling & Consultation Appointment (Supabase Backend: nkeaoppxgdgnrtlbhutd)"
        aria-label="Book VIP Appointment"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <Calendar className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Book VIP Appointment</span>
        <span className="sm:hidden">Book</span>
      </button>

      {/* Elegant Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
