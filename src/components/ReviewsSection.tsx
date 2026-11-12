import React from 'react';
import { Star, ShieldCheck, CheckCircle2, Award, Truck, Lock, ThumbsUp } from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-16 bg-gray-50/70 border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Overall Score */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>Verified Customer Stories</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 font-display tracking-tight">
            Loved By Over 50,000+ Shoppers
          </h2>

          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-base font-black text-gray-900">4.9 out of 5</span>
            <span className="text-gray-400">·</span>
            <span className="text-sm text-gray-500 font-medium">Based on 12,480+ verified reviews</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Stars and date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400">{t.date}</span>
                </div>

                {/* Comment */}
                <p className="text-xs text-gray-700 leading-relaxed italic mb-4">
                  "{t.comment}"
                </p>
              </div>

              {/* Author & Product */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-1">
                    <span>{t.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  </div>
                  <div className="text-[11px] text-gray-400">{t.city}</div>
                </div>

                <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md text-right line-clamp-1 max-w-[100px]">
                  {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-xs divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="flex items-center gap-3 pt-3 md:pt-0 md:px-3 first:pt-0">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Premium Quality</h4>
              <p className="text-[11px] text-gray-500">Guaranteed best materials</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 md:pt-0 md:px-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Fast 2-4 Day Delivery</h4>
              <p className="text-[11px] text-gray-500">Quick courier dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 md:pt-0 md:px-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Secure Checkout</h4>
              <p className="text-[11px] text-gray-500">Bank-grade 256-bit SSL</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 md:pt-0 md:px-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Satisfaction Promise</h4>
              <p className="text-[11px] text-gray-500">30-day effortless returns</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
