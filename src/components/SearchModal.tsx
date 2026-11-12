import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { fmtCurrency } from '../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularSearches = ['Sneakers', 'Hoodie', 'Watch', 'Headphone', 'Serum', 'Bottle', 'Yoga'];

  const matchedProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 pt-16 sm:pt-24">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl z-10 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center gap-3 bg-gray-50/50">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products by title, category, or features..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-gray-900 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-700 text-xs rounded-full cursor-pointer"
            >
              ✕
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="p-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Popular Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="max-h-96 overflow-y-auto p-4 divide-y divide-gray-100">
            {matchedProducts.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-xs">
                No products found matching "<strong className="text-gray-900">{query}</strong>". Try a different keyword!
              </div>
            ) : (
              matchedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p);
                    onClose();
                  }}
                  className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                      {p.emoji}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                        <span className="capitalize">{p.category}</span>
                        <span>·</span>
                        <span className="font-bold text-gray-900">{fmtCurrency(p.price)}</span>
                        <span className="line-through text-gray-400">{fmtCurrency(p.mrp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(p);
                      }}
                      className="p-2 bg-gray-100 hover:bg-orange-600 hover:text-white text-gray-700 rounded-lg transition-colors cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
