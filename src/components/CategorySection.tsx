import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { ProductCategory } from '../types';

interface CategorySectionProps {
  selectedCategory: string;
  onSelectCategory: (category: ProductCategory | 'all') => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="py-12 bg-gray-50/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              Explore Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-display mt-1">
              Shop by Categories
            </h2>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-800 hover:text-orange-600 transition-colors group cursor-pointer"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  const catalogElem = document.getElementById('catalog');
                  if (catalogElem) {
                    catalogElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`group relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border text-center flex flex-col items-center justify-between min-h-[170px] ${
                  isSelected
                    ? 'bg-white border-orange-500 shadow-lg ring-2 ring-orange-500/20 -translate-y-1'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Visual Icon Container */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${cat.bgGradient} flex items-center justify-center text-3xl mb-3 shadow-sm transition-transform duration-300 group-hover:scale-110`}
                >
                  {cat.emoji}
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                </div>

                {/* Quick Link */}
                <div className="mt-2 text-[11px] font-bold text-orange-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
