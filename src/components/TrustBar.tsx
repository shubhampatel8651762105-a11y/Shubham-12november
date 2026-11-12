import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export const TrustBar: React.FC = () => {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:px-4 first:pt-0">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Free Shipping</h4>
              <p className="text-xs text-gray-500">On all orders over ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:px-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Secure Payments</h4>
              <p className="text-xs text-gray-500">100% SSL & UPI Protected</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:px-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Easy 30-Day Returns</h4>
              <p className="text-xs text-gray-500">Hassle-free instant refund</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 pt-4 md:pt-0 md:px-4">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">24/7 VIP Support</h4>
              <p className="text-xs text-gray-500">Always here to help you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
