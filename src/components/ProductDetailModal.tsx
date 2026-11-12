import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Check, ArrowRight, Globe } from 'lucide-react';
import { Product } from '../types';
import { fmtCurrency } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number, selectedSize?: string, selectedColor?: string) => void;
  onBuyNow: (product: Product, qty: number, selectedSize?: string, selectedColor?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenMarketInsights?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
  onOpenMarketInsights,
}) => {
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors ? product.colors[0].name : undefined
  );
  const [pinCode, setPinCode] = useState('');
  const [pinStatus, setPinStatus] = useState<string | null>(null);

  if (!product) return null;

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pinCode.trim())) {
      setPinStatus('⚡ Express Delivery Available: Dispatches in 24 hours!');
    } else {
      setPinStatus('Please enter a valid 6-digit Indian PIN code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image & Badges */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center text-8xl relative border border-gray-200/80 shadow-inner">
              {product.badge && (
                <span className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-md bg-orange-600 text-white shadow-sm uppercase">
                  {product.badge === 'SALE' ? `-${product.disc}% OFF` : product.badge}
                </span>
              )}

              <button
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md transition-transform hover:scale-110 cursor-pointer ${
                  isWishlisted ? 'text-rose-600' : 'text-gray-400 hover:text-rose-600'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>

              <span className="select-none transform transition-transform hover:scale-110 duration-300">
                {product.emoji}
              </span>
            </div>

            {/* Guarantees mini strip */}
            <div className="w-full grid grid-cols-3 gap-2 mt-4 text-center text-[10px] text-gray-500 font-medium">
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                <Truck className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                <span>Fast Shipping</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span>100% Genuine</span>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                <RotateCcw className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span>30-Day Return</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Options */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                {product.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950 font-display mt-0.5">
                {product.name}
              </h2>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-900">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-2 pb-3 border-b border-gray-100">
              <span className="text-2xl font-black text-gray-950 font-display">
                {fmtCurrency(product.price)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {fmtCurrency(product.mrp)}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Save {product.disc}%
              </span>
            </div>

            {/* Live Google Search Market Insights Trigger */}
            {onOpenMarketInsights && (
              <button
                type="button"
                onClick={() => onOpenMarketInsights(product)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3.5 bg-blue-50/90 hover:bg-blue-100 text-blue-800 border border-blue-200/80 rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-12 transition-transform" />
                <span>Live Google Search Price & Trend Insights</span>
                <span className="text-[10px] bg-blue-200/70 text-blue-900 px-1.5 py-0.5 rounded font-black">AI Grounded</span>
              </button>
            )}

            {/* Description */}
            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Size Options (if applicable) */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-gray-950 text-white shadow-sm ring-2 ring-gray-950/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Options (if applicable) */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">
                  Color: <span className="font-medium text-gray-600">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                        selectedColor === c.name
                          ? 'border-orange-500 scale-110 shadow-sm'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features Bullet points */}
            {product.features && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-gray-900 mb-1.5">Key Highlights</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-gray-600">
                  {product.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* PIN Code Delivery Checker */}
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 text-xs">
              <span className="font-bold text-gray-800 block mb-1">Check Delivery Estimate</span>
              <form onSubmit={handleCheckDelivery} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit PIN"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>
              {pinStatus && (
                <p className={`text-[10px] mt-1 font-semibold ${pinStatus.includes('Available') ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {pinStatus}
                </p>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shrink-0">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-gray-900">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={() => {
                  onAddToCart(product, qty, selectedSize, selectedColor);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gray-950 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              {/* Buy Now CTA */}
              <button
                onClick={() => {
                  onBuyNow(product, qty, selectedSize, selectedColor);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-600/25"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
