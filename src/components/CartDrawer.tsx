import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { fmtCurrency } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
  onProceedToCheckout: () => void;
  couponCode: string;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  discountAmount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  couponCode,
  onApplyCoupon,
  onRemoveCoupon,
  discountAmount,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const freeShippingThreshold = 499;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingAmount = isFreeShipping || items.length === 0 ? 0 : 49;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = onApplyCoupon(couponInput.trim().toUpperCase());
    if (success) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon. Try "VIP15" or "VIP70"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-base font-extrabold text-gray-950 font-display">
                Shopping Bag ({totalItemsCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="bg-orange-50/80 px-5 py-3 border-b border-orange-100 text-xs">
              {isFreeShipping ? (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Congratulations! You qualify for <strong>FREE Delivery</strong></span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between font-semibold text-gray-700 mb-1.5">
                    <span>Add {fmtCurrency(freeShippingThreshold - subtotal)} more for <strong>FREE Delivery</strong></span>
                    <span>{Math.round((subtotal / freeShippingThreshold) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Body: Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center text-3xl mb-4">
                  🛒
                </div>
                <h3 className="text-base font-bold text-gray-900">Your bag is empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Looks like you haven't added anything yet. Explore our fresh collection and find products you'll love!
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition-colors shadow-sm cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-3.5 first:pt-0 last:pb-0">
                  {/* Item Image / Emoji */}
                  <div className="w-18 h-18 rounded-xl bg-gray-100 flex items-center justify-center text-3xl shrink-0 border border-gray-200/80">
                    {item.product.emoji}
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-gray-900 truncate" title={item.product.name}>
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-gray-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedSize && (
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded mr-2">
                        Size: {item.selectedSize}
                      </span>
                    )}

                    <div className="text-xs font-extrabold text-orange-600 mt-1">
                      {fmtCurrency(item.product.price)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => onUpdateQty(item.product.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-gray-900">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.product.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-[11px] font-bold text-gray-700 ml-auto">
                        {fmtCurrency(item.product.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Subtotals & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-200 bg-gray-50/70 space-y-4">
              {/* Coupon Code Input */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Coupon <strong>{couponCode}</strong> applied (-{fmtCurrency(discountAmount)})</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Have a coupon? Try VIP15"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 uppercase font-mono focus:outline-none focus:border-orange-500 bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[10px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{fmtCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{fmtCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shippingAmount === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      fmtCurrency(shippingAmount)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-sm font-black text-gray-950 font-display">
                  <span>Grand Total</span>
                  <span className="text-lg text-orange-600">{fmtCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-600/25 transition-all duration-200 active:scale-98 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Safe & Encrypted Checkout · Cash on Delivery Available</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
