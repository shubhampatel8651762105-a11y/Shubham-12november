import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { fmtCurrency } from '../utils/formatters';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: number) => void;
  onMoveToCart: (product: Product) => void;
  onAddAllToCart: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onMoveToCart,
  onAddAllToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-rose-600 text-rose-600" />
              <h2 className="text-base font-extrabold text-gray-950 font-display">
                My Wishlist ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center text-3xl mb-4">
                  🤍
                </div>
                <h3 className="text-base font-bold text-gray-900">Your wishlist is empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Save your favorite fashion items, electronics, and daily essentials by clicking the heart icon on any card.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition-colors cursor-pointer shadow-sm"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              wishlistProducts.map((p) => (
                <div key={p.id} className="py-4 flex gap-3.5 first:pt-0 last:pb-0 items-center">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-3xl shrink-0 border border-gray-200/80">
                    {p.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate" title={p.name}>
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-black text-gray-950">
                        {fmtCurrency(p.price)}
                      </span>
                      <span className="text-[10px] text-gray-400 line-through">
                        {fmtCurrency(p.mrp)}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        -{p.disc}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onMoveToCart(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-950 hover:bg-orange-600 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(p.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-5 border-t border-gray-200 bg-gray-50/70">
              <button
                onClick={onAddAllToCart}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/25 transition-all cursor-pointer"
              >
                <span>Add All to Bag</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
