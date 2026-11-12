import React from 'react';
import { ArrowRight, Star, ShoppingCart, Sparkles, TrendingUp } from 'lucide-react';
import { Product } from '../types';
import { fmtCurrency } from '../utils/formatters';

interface HeroProps {
  onShopClick: () => void;
  onExploreCategories: () => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  sampleProducts: Product[];
}

export const Hero: React.FC<HeroProps> = ({
  onShopClick,
  onExploreCategories,
  onQuickView,
  onAddToCart,
  sampleProducts,
}) => {
  // Select 4 showcase products
  const sneaker = sampleProducts.find((p) => p.id === 2) || sampleProducts[1];
  const watch = sampleProducts.find((p) => p.id === 4) || sampleProducts[3];
  const headphone = sampleProducts.find((p) => p.id === 3) || sampleProducts[2];
  const bottle = sampleProducts.find((p) => p.id === 5) || sampleProducts[4];

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-gray-50/60 pt-10 pb-16 sm:pb-24 border-b border-gray-100">
      {/* Decorative ambient blurred blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none -z-10 transform -translate-y-1/2" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-100/50 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-700 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>Trending Summer 2025 Collection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.08] font-display">
              Discover Products <br className="hidden sm:inline" />
              You'll <span className="text-orange-600 underline decoration-orange-300 decoration-wavy decoration-2">Love</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
              Shop the latest trending streetwear, intelligent electronics, beauty serums, and fitness essentials curated for modern living. Unbeatable prices, guaranteed authenticity, and express delivery.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onShopClick}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-base shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 transition-all duration-200 active:scale-95 cursor-pointer group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreCategories}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-900 font-bold text-base border-2 border-gray-900 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>Explore Categories</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  JD
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  SK
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  AM
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  RV
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-gray-900">4.9/5</span>
                <span className="text-gray-500">· Loved by <strong className="text-gray-900 font-semibold">50,000+</strong> shoppers</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column with Model and Floating Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Center Visual Canvas */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl bg-gradient-to-tr from-orange-300 via-amber-200 to-rose-200 p-1 shadow-2xl flex flex-col justify-between overflow-hidden group">
              {/* Subtle animated pattern */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-white/20 pointer-events-none" />

              {/* Central Fashion Visual Icon & Details */}
              <div className="h-full w-full flex flex-col items-center justify-center relative p-6 text-center select-none">
                <div className="w-36 h-36 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-7xl shadow-inner mb-4 transition-transform duration-500 group-hover:scale-110">
                  ✨
                </div>
                <div className="inline-block px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-gray-900 uppercase tracking-widest shadow-sm mb-2">
                  Summer Trendsetter 2025
                </div>
                <h3 className="text-2xl font-black text-gray-950 font-display drop-shadow-sm">
                  Exclusive Curations
                </h3>
                <p className="text-xs text-gray-800 font-medium max-w-xs mt-1">
                  Tap any card around to inspect specs or quick-add to your bag.
                </p>
              </div>

              {/* Bottom Tag */}
              <div className="bg-white/85 backdrop-blur-md px-4 py-2.5 mx-4 mb-4 rounded-xl flex items-center justify-between text-xs font-bold text-gray-900 shadow-sm">
                <span className="flex items-center gap-1.5 text-orange-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Live Flash Deals
                </span>
                <span className="text-gray-500 font-medium">Up to 70% Off</span>
              </div>
            </div>

            {/* Floating Product Card 1: Air Max Pro (Top Left) */}
            {sneaker && (
              <div
                onClick={() => onQuickView(sneaker)}
                className="absolute -top-3 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl p-3 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex items-center gap-3 z-20 group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {sneaker.emoji}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-gray-900 truncate max-w-[120px]">
                    {sneaker.name}
                  </div>
                  <div className="text-xs font-black text-orange-600">
                    {fmtCurrency(sneaker.price)}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold">
                    -{sneaker.disc}% OFF
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(sneaker);
                  }}
                  className="p-1.5 bg-gray-900 hover:bg-orange-600 text-white rounded-lg transition-colors ml-1"
                  title="Quick Add"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Floating Product Card 2: Smart Watch (Top Right) */}
            {watch && (
              <div
                onClick={() => onQuickView(watch)}
                className="absolute top-10 -right-4 sm:-right-8 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl p-3 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex items-center gap-3 z-20 group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {watch.emoji}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-gray-900 truncate max-w-[120px]">
                    {watch.name}
                  </div>
                  <div className="text-xs font-black text-orange-600">
                    {fmtCurrency(watch.price)}
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold">
                    ★ {watch.rating} ({watch.reviewsCount})
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(watch);
                  }}
                  className="p-1.5 bg-gray-900 hover:bg-orange-600 text-white rounded-lg transition-colors ml-1"
                  title="Quick Add"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Floating Product Card 3: ANC Headphones (Bottom Left) */}
            {headphone && (
              <div
                onClick={() => onQuickView(headphone)}
                className="absolute -bottom-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl p-3 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex items-center gap-3 z-20 group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {headphone.emoji}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-gray-900 truncate max-w-[120px]">
                    {headphone.name}
                  </div>
                  <div className="text-xs font-black text-orange-600">
                    {fmtCurrency(headphone.price)}
                  </div>
                  <div className="text-[10px] text-blue-600 font-bold">
                    Hi-Res Audio
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(headphone);
                  }}
                  className="p-1.5 bg-gray-900 hover:bg-orange-600 text-white rounded-lg transition-colors ml-1"
                  title="Quick Add"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Floating Product Card 4: Insulated Flask (Bottom Right) */}
            {bottle && (
              <div
                onClick={() => onQuickView(bottle)}
                className="absolute bottom-6 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-2xl p-3 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex items-center gap-3 z-20 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {bottle.emoji}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-gray-900 truncate max-w-[110px]">
                    {bottle.name}
                  </div>
                  <div className="text-xs font-black text-orange-600">
                    {fmtCurrency(bottle.price)}
                  </div>
                  <div className="text-[10px] text-amber-700 font-bold">
                    24h Cold Lock
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(bottle);
                  }}
                  className="p-1.5 bg-gray-900 hover:bg-orange-600 text-white rounded-lg transition-colors ml-1"
                  title="Quick Add"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
