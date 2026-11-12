import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Heart, Eye, ShoppingCart, Star, Search, SlidersHorizontal, Check, Plus, Minus, ChevronDown, ArrowUpDown, Flame, Globe } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { fmtCurrency } from '../utils/formatters';

export type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'featured';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  cartItemsMap: Record<number, number>; // productId -> quantity
  wishlistIds: Set<number>;
  onAddToCart: (product: Product) => void;
  onUpdateCartQty: (productId: number, delta: number) => void;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenMarketInsights?: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  cartItemsMap,
  wishlistIds,
  onAddToCart,
  onUpdateCartQty,
  onToggleWishlist,
  onQuickView,
  onOpenMarketInsights,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Price range slider state
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const priceDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target as Node)) {
        setIsPriceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const sortOptions: { value: SortOption; label: string; description: string; icon?: string }[] = [
    { value: 'popularity', label: 'Popularity (Most Popular)', description: 'Best rated and top-selling products first' },
    { value: 'price-asc', label: 'Price: Low to High', description: 'Affordable finds first' },
    { value: 'price-desc', label: 'Price: High to Low', description: 'Premium collections first' },
    { value: 'rating', label: 'Highest Rated', description: 'Top 5-star customer ratings' },
    { value: 'discount', label: 'Biggest Discount', description: 'Highest percentage savings' },
    { value: 'featured', label: 'Featured / New Arrivals', description: 'Latest additions to our catalog' },
  ];

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || 'Sort Products';

  const categoriesList: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Products' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'beauty', label: 'Beauty' },
    { id: 'sports', label: 'Fitness' },
    { id: 'home', label: 'Home Decor' },
    { id: 'accessories', label: 'Accessories' },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesQuery =
          !searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = p.price <= maxPrice;
        return matchesCat && matchesQuery && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'popularity') {
          // Popularity: reviewsCount * rating, weighted with bestsellers and hot tags
          const popA = a.reviewsCount * a.rating + (a.badge === 'BESTSELLER' ? 500 : 0) + (a.badge === 'HOT' ? 250 : 0);
          const popB = b.reviewsCount * b.rating + (b.badge === 'BESTSELLER' ? 500 : 0) + (b.badge === 'HOT' ? 250 : 0);
          return popB - popA;
        }
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.disc - a.disc;
        return a.id - b.id; // default featured
      });
  }, [products, selectedCategory, searchQuery, sortBy, maxPrice]);

  return (
    <section id="catalog" className="py-14 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-widest">
              <span>Curated Selection</span>
              <span>·</span>
              <span>100% Verified Quality</span>
            </div>
            <h2 className="text-3xl font-black text-gray-950 font-display mt-1">
              New Arrivals & Trending Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredProducts.length} items curated for style, performance, and everyday durability.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-gray-50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

              {/* Price Filter Range Slider Dropdown */}
              <div className="relative" ref={priceDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsPriceDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    maxPrice < 15000 || isPriceDropdownOpen
                      ? 'bg-white border-orange-500 text-orange-600 shadow-md ring-2 ring-orange-500/20'
                      : 'bg-gray-50 hover:bg-white border-gray-200 text-gray-800 hover:border-gray-300 shadow-xs'
                  }`}
                  aria-expanded={isPriceDropdownOpen}
                  aria-haspopup="true"
                  aria-label="Price range slider filter"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="text-gray-500 font-medium">Max Price:</span>
                  <span className="font-extrabold text-gray-900">
                    {maxPrice >= 15000 ? 'All (₹15k+)' : `≤ ${fmtCurrency(maxPrice)}`}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                      isPriceDropdownOpen ? 'rotate-180 text-orange-600' : ''
                    }`}
                  />
                </button>

                {/* Range Slider Popover Menu */}
                {isPriceDropdownOpen && (
                  <div
                    className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/90 p-4 z-30 animate-scale-in"
                    role="region"
                    aria-label="Price range filter"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                      <span className="text-xs font-bold text-gray-900">Filter by Maximum Price</span>
                      {maxPrice < 15000 && (
                        <button
                          type="button"
                          onClick={() => setMaxPrice(15000)}
                          className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Price display badge */}
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs text-gray-500 font-medium">Selected Budget</span>
                      <span className="text-sm font-black text-orange-600 font-display">
                        {maxPrice >= 15000 ? 'All Prices (₹15,000+)' : `Up to ${fmtCurrency(maxPrice)}`}
                      </span>
                    </div>

                    {/* Range Slider Input */}
                    <div className="space-y-1.5 py-1">
                      <input
                        type="range"
                        min={500}
                        max={15000}
                        step={250}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                        <span>₹500</span>
                        <span>₹5,000</span>
                        <span>₹10,000</span>
                        <span>₹15,000+</span>
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Quick Price Presets
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <button
                          type="button"
                          onClick={() => setMaxPrice(1500)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${
                            maxPrice === 1500
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          Under ₹1,500
                        </button>
                        <button
                          type="button"
                          onClick={() => setMaxPrice(4000)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${
                            maxPrice === 4000
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          Under ₹4,000
                        </button>
                        <button
                          type="button"
                          onClick={() => setMaxPrice(9000)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${
                            maxPrice === 9000
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          Under ₹9,000
                        </button>
                        <button
                          type="button"
                          onClick={() => setMaxPrice(15000)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${
                            maxPrice >= 15000
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                          }`}
                        >
                          All Prices
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative" ref={sortDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsSortDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isSortDropdownOpen
                      ? 'bg-white border-orange-500 text-orange-600 shadow-md ring-2 ring-orange-500/20'
                      : 'bg-gray-50 hover:bg-white border-gray-200 text-gray-800 hover:border-gray-300 shadow-xs'
                  }`}
                  aria-expanded={isSortDropdownOpen}
                  aria-haspopup="listbox"
                  aria-label="Sort products dropdown"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="text-gray-500 font-medium">Sort:</span>
                  <span className="font-extrabold text-gray-900">{currentSortLabel}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                      isSortDropdownOpen ? 'rotate-180 text-orange-600' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Popover Menu */}
                {isSortDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/90 py-2 z-30 animate-scale-in"
                    role="listbox"
                    aria-label="Sort options"
                  >
                    <div className="px-3 py-1.5 border-b border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <span>Sort Catalog By</span>
                      <span className="text-orange-600 font-extrabold">{filteredProducts.length} items</span>
                    </div>

                    <div className="p-1 space-y-0.5">
                      {sortOptions.map((opt) => {
                        const isSelected = sortBy === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSortBy(opt.value);
                              setIsSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between group cursor-pointer ${
                              isSelected
                                ? 'bg-orange-50/80 text-orange-700 font-bold'
                                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-950 font-medium'
                            }`}
                            role="option"
                            aria-selected={isSelected}
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                {opt.value === 'popularity' && (
                                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 shrink-0" />
                                )}
                                <span className={isSelected ? 'text-gray-950 font-extrabold' : ''}>
                                  {opt.label}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 font-normal">
                                {opt.description}
                              </p>
                            </div>

                            {isSelected && (
                              <Check className="w-4 h-4 text-orange-600 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Price Filter Banner */}
          {maxPrice < 15000 && (
            <div className="flex items-center gap-2 mb-6 bg-orange-50/80 border border-orange-200 rounded-xl px-4 py-2.5 text-xs animate-fade-in">
              <span className="text-gray-600 font-medium">Active Price Filter:</span>
              <span className="font-extrabold text-orange-950 bg-white px-2.5 py-0.5 rounded-lg border border-orange-200 shadow-2xs">
                Budget ≤ {fmtCurrency(maxPrice)}
              </span>
              <span className="text-gray-500 text-[11px]">({filteredProducts.length} items match)</span>
              <button
                type="button"
                onClick={() => setMaxPrice(15000)}
                className="ml-auto text-xs font-bold text-orange-600 hover:text-orange-800 hover:underline cursor-pointer"
              >
                Clear Price Filter ✕
              </button>
            </div>
          )}

        {/* Category Pills Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-gray-950 text-white shadow-sm ring-2 ring-gray-950/20'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-950'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-gray-900">No matching products found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              We couldn't find any items matching "{searchQuery}". Try searching for sneakers, hoodie, watch, or change the category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
                setSortBy('popularity');
                setMaxPrice(15000);
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const inWishlist = wishlistIds.has(product.id);
              const cartQty = cartItemsMap[product.id] || 0;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-gray-200/90 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                >
                  {/* Top Badges & Actions */}
                  <div className="relative aspect-[4/3] bg-gradient-to-tr from-gray-50 to-gray-100 p-4 flex items-center justify-center overflow-hidden">
                    {/* Badge */}
                    {product.badge && (
                      <span
                        className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm z-10 tracking-wider ${
                          product.badge === 'NEW'
                            ? 'bg-gray-950 text-white'
                            : product.badge === 'SALE'
                            ? 'bg-orange-600 text-white'
                            : product.badge === 'BESTSELLER'
                            ? 'bg-amber-500 text-gray-950'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {product.badge === 'SALE' ? `-${product.disc}% OFF` : product.badge}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all z-10 cursor-pointer ${
                        inWishlist
                          ? 'bg-rose-50 text-rose-600 scale-110'
                          : 'bg-white/90 text-gray-500 hover:text-rose-600 hover:scale-110'
                      }`}
                      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      aria-label="Wishlist toggle"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
                    </button>

                    {/* Quick View and Market Insights Button Hover Overlay */}
                    <div className="absolute inset-0 bg-gray-950/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-10 pointer-events-none group-hover:pointer-events-auto p-2">
                      <button
                        onClick={() => onQuickView(product)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 rounded-xl text-xs font-bold shadow-lg hover:bg-orange-600 hover:text-white transition-all transform scale-95 group-hover:scale-100 cursor-pointer w-36 justify-center"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>
                      {onOpenMarketInsights && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenMarketInsights(product);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-blue-700 transition-all transform scale-95 group-hover:scale-100 cursor-pointer w-36 justify-center"
                          title="Live Google Search Market Insights"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Market Insights</span>
                        </button>
                      )}
                    </div>

                    {/* Product Central Emoji Illustration */}
                    <div
                      onClick={() => onQuickView(product)}
                      className="text-6xl sm:text-7xl cursor-pointer transform group-hover:scale-110 transition-transform duration-300 select-none drop-shadow-md"
                    >
                      {product.emoji}
                    </div>

                    {/* Stock status indicator */}
                    <span className="absolute bottom-2 left-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name */}
                      <h3
                        onClick={() => onQuickView(product)}
                        className="text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1 cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Tagline or feature */}
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {product.tagline || product.description}
                      </p>

                      {/* Ratings */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-900">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Price and Cart Action */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-base font-extrabold text-gray-950 font-display">
                          {fmtCurrency(product.price)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {fmtCurrency(product.mrp)}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 ml-auto">
                          {product.disc}% OFF
                        </span>
                      </div>

                      {/* Dynamic Cart Button */}
                      {cartQty > 0 ? (
                        <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl p-1 text-xs">
                          <button
                            onClick={() => onUpdateCartQty(product.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white text-orange-600 hover:bg-orange-600 hover:text-white flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer"
                            title="Decrease Quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-extrabold text-orange-950 px-2 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            {cartQty} in cart
                          </span>
                          <button
                            onClick={() => onUpdateCartQty(product.id, 1)}
                            className="w-7 h-7 rounded-lg bg-white text-orange-600 hover:bg-orange-600 hover:text-white flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer"
                            title="Increase Quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(product)}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-950 hover:bg-orange-600 text-white text-xs font-bold transition-all duration-200 active:scale-98 cursor-pointer shadow-sm group-hover:shadow-md"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
