import React, { useState } from 'react';
import { Search, Heart, User, ShoppingBag, Menu, X, Sparkles, Tag, ShieldCheck, Truck, Calendar } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  ordersCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onOpenSearch: () => void;
  onSelectCategory: (cat: string) => void;
  onOpenAppointment?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  ordersCount,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenSearch,
  onSelectCategory,
  onOpenAppointment,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);

  const handleNavClick = (sectionId: string, categoryFilter?: string) => {
    setMobileMenuOpen(false);
    if (categoryFilter) {
      onSelectCategory(categoryFilter);
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all">
      {/* Top Announcement Bar */}
      {showTopBar && (
        <div className="bg-gray-950 text-white text-xs py-2 px-4 relative flex items-center justify-between border-b border-gray-800">
          <div className="mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-medium">
            <span className="inline-flex items-center gap-1.5 text-gray-200">
              <Truck className="w-3.5 h-3.5 text-orange-400" />
              <span>Free Delivery Over ₹499 across India</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-orange-300">
              <Tag className="w-3.5 h-3.5 text-orange-400" />
              <span>Extra 15% Off with code <strong>VIP15</strong></span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Genuine Guaranteed</span>
            </span>
          </div>
          <button
            onClick={() => setShowTopBar(false)}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors text-xs"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-950 font-display">
              Shubham<span className="text-orange-600 font-black">VIP</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-700">
            <button
              onClick={() => handleNavClick('hero')}
              className="hover:text-orange-600 transition-colors cursor-pointer py-1"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className="hover:text-orange-600 transition-colors cursor-pointer py-1"
            >
              Shop
            </button>
            <button
              onClick={() => handleNavClick('catalog')}
              className="hover:text-orange-600 transition-colors cursor-pointer py-1"
            >
              New Arrivals
            </button>
            <button
              onClick={() => handleNavClick('bestsellers')}
              className="hover:text-orange-600 transition-colors cursor-pointer py-1"
            >
              Best Sellers
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className="hover:text-orange-600 transition-colors cursor-pointer py-1"
            >
              Categories
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="hover:text-orange-600 transition-colors cursor-pointer py-1"
            >
              Reviews
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-orange-600 transition-colors cursor-pointer py-1"
            >
              Contact
            </button>
            {onOpenAppointment && (
              <button
                onClick={onOpenAppointment}
                className="text-orange-600 hover:text-orange-700 font-bold transition-colors cursor-pointer py-1 flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* VIP Appointment CTA Button */}
            {onOpenAppointment && (
              <button
                onClick={onOpenAppointment}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 text-orange-700 font-bold text-xs border border-orange-200 transition-all cursor-pointer shadow-2xs hover:scale-102"
                title="Book VIP Consultation Appointment (Supabase Backend)"
              >
                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                <span>Book Appointment</span>
              </button>
            )}

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all cursor-pointer"
              title="Search Products"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all cursor-pointer"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account / Orders Trigger */}
            <button
              onClick={onOpenOrders}
              className="relative p-2.5 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all cursor-pointer"
              title="My Orders & Account"
              aria-label="My Orders & Account"
            >
              <User className="w-5 h-5" />
              {ordersCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {ordersCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gray-950 hover:bg-orange-600 text-white px-3.5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 active:scale-95 cursor-pointer ml-1"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-orange-500 text-white text-xs font-black px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-gray-700 hover:text-gray-950 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-5 py-4 space-y-3 animate-fade-down shadow-xl">
          <button
            onClick={() => handleNavClick('hero')}
            className="w-full text-left py-2 font-semibold text-gray-800 hover:text-orange-600"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('catalog')}
            className="w-full text-left py-2 font-semibold text-gray-800 hover:text-orange-600"
          >
            Shop All Products
          </button>
          <button
            onClick={() => handleNavClick('bestsellers')}
            className="w-full text-left py-2 font-semibold text-gray-800 hover:text-orange-600"
          >
            Best Sellers
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className="w-full text-left py-2 font-semibold text-gray-800 hover:text-orange-600"
          >
            Browse Categories
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            className="w-full text-left py-2 font-semibold text-gray-800 hover:text-orange-600"
          >
            Customer Reviews
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full text-left py-2 font-semibold text-gray-800 hover:text-orange-600"
          >
            Contact & Support
          </button>

          {onOpenAppointment && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAppointment();
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-orange-50 font-bold text-orange-700 flex items-center justify-between border border-orange-200"
            >
              <span className="flex items-center gap-2 text-xs">
                <Calendar className="w-4 h-4 text-orange-600" />
                Book VIP Appointment
              </span>
              <span className="text-[10px] bg-orange-600 text-white font-extrabold px-2 py-0.5 rounded-md uppercase">
                Supabase
              </span>
            </button>
          )}

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>🇮🇳 All India Fast Delivery</span>
            <span className="text-orange-600 font-bold">Code: VIP15 for 15% off</span>
          </div>
        </div>
      )}
    </header>
  );
};
