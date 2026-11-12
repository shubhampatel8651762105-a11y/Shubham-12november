import React, { useState } from 'react';
import { Sparkles, Mail, Check, Heart, ShieldCheck } from 'lucide-react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenOrders: () => void;
  onOpenAppointment?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenOrders, onOpenAppointment }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer id="contact" className="bg-gray-950 text-white pt-16 pb-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-extrabold shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-display">
                Shubham<span className="text-orange-500">VIP</span>
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              India's favorite curated lifestyle destination. Discover trending urban fashion, smart wearables, premium audio gear, and wellness essentials delivered straight to your doorstep.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Secure Checkout</span>
              </span>
              <span>·</span>
              <span>Cash on Delivery</span>
            </div>
          </div>

          {/* Categories Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => onSelectCategory('fashion')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Fashion & Apparel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('electronics')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Smart Electronics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('beauty')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Beauty & Skincare
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('sports')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Sports & Fitness
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('home')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Home & Living
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('accessories')}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Watches & Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Help Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={onOpenOrders}
                  className="hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              {onOpenAppointment && (
                <li>
                  <button
                    onClick={onOpenAppointment}
                    className="text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>📅 Book VIP Appointment</span>
                  </button>
                </li>
              )}
              <li>
                <a href="#hero" className="hover:text-orange-400 transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-orange-400 transition-colors">
                  30-Day Easy Returns
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-orange-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-orange-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#hero" className="hover:text-orange-400 transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Get VIP Exclusive Deals
            </h4>
            <p className="text-xs text-gray-400">
              Subscribe to receive weekly flash sale alerts, promo codes, and secret discounts up to 70% off.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You're subscribed! Use code <strong>VIP15</strong> for 15% off.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Join
                </button>
              </form>
            )}

            <div className="flex items-center gap-4 pt-2 text-xs text-gray-400">
              <span>📘 Facebook</span>
              <span>📸 Instagram</span>
              <span>🐦 Twitter/X</span>
              <span>▶️ YouTube</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2025 ShubhamVIP. All rights reserved. Crafted with care for extraordinary shoppers.</p>

          <div className="flex items-center gap-3 text-base select-none">
            <span title="UPI">📱 UPI</span>
            <span title="Credit Card">💳 Visa</span>
            <span title="MasterCard">💳 MasterCard</span>
            <span title="RuPay">🇮🇳 RuPay</span>
            <span title="Cash on Delivery">💵 COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
