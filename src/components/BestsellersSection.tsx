import React from 'react';
import { ShoppingCart, Star, Flame, ArrowRight } from 'lucide-react';
import { BESTSELLERS } from '../data/products';
import { Product } from '../types';
import { fmtCurrency } from '../utils/formatters';

interface BestsellersSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onViewAllCatalog: () => void;
}

export const BestsellersSection: React.FC<BestsellersSectionProps> = ({
  products,
  onAddToCart,
  onQuickView,
  onViewAllCatalog,
}) => {
  return (
    <section id="bestsellers" className="py-14 bg-gray-50/80 border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-widest">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-display mt-1">
              Top Best Sellers This Week
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Highest rated by over 50,000 customers. Guaranteed best price & swift delivery.
            </p>
          </div>

          <button
            onClick={onViewAllCatalog}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-orange-600 transition-colors group cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Bestseller Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BESTSELLERS.map((bs) => {
            const fullProduct = products.find((p) => p.id === bs.productId) || products[0];

            return (
              <div
                key={bs.id}
                onClick={() => onQuickView(fullProduct)}
                className="bg-white rounded-2xl p-5 border border-gray-200/90 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Top Bar with Badge & Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-orange-600 text-white uppercase tracking-wider">
                      Bestseller
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{bs.category}</span>
                  </div>

                  {/* Centered Emoji Illustration */}
                  <div className="aspect-[5/3] rounded-xl bg-gray-50 flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-transform duration-300">
                    {bs.emoji}
                  </div>

                  {/* Title & Reviews */}
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {bs.name}
                  </h3>

                  <div className="flex items-center gap-1.5 mt-1 mb-2">
                    <div className="flex text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">{bs.rating}</span>
                    <span className="text-xs text-gray-400">({bs.reviewsCount})</span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {bs.desc}
                  </p>
                </div>

                {/* Bottom Price & Quick Add */}
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-base font-black text-gray-950 font-display">
                      {fmtCurrency(bs.price)}
                    </div>
                    <div className="text-[10px] text-gray-400 line-through">
                      {fmtCurrency(bs.mrp)}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(fullProduct);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
