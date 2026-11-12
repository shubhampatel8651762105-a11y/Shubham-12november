import React, { useState, useEffect } from 'react';
import { Timer, Copy, Check, Sparkles } from 'lucide-react';

interface FlashSaleBannerProps {
  onShopSale: () => void;
  onCopyCoupon: (code: string) => void;
}

export const FlashSaleBanner: React.FC<FlashSaleBannerProps> = ({
  onShopSale,
  onCopyCoupon,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 45,
    seconds: 30,
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    onCopyCoupon(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Promo Card 1: Flash Sale */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white overflow-hidden shadow-xl flex flex-col justify-between">
            {/* Background Watermark/Emoji */}
            <div className="absolute -right-4 -bottom-6 text-9xl opacity-20 pointer-events-none select-none">
              👟
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs mb-4">
                <Timer className="w-3.5 h-3.5 text-amber-300" />
                <span>Limited Time Flash Deals</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
                Up To <span className="underline decoration-white/40">70% Off</span> <br />
                Hot Summer Essentials
              </h2>

              <p className="text-orange-100 text-sm mt-2 max-w-sm">
                Grab top-tier footwear, electronics, and wardrobe staples before the timer runs out.
              </p>

              {/* Countdown Blocks */}
              <div className="flex items-center gap-2.5 my-6">
                <div className="bg-black/35 backdrop-blur-md rounded-xl p-2.5 text-center min-w-[58px]">
                  <div className="text-xl sm:text-2xl font-black font-mono">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-orange-200">Days</div>
                </div>
                <span className="text-xl font-bold opacity-75">:</span>
                <div className="bg-black/35 backdrop-blur-md rounded-xl p-2.5 text-center min-w-[58px]">
                  <div className="text-xl sm:text-2xl font-black font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-orange-200">Hours</div>
                </div>
                <span className="text-xl font-bold opacity-75">:</span>
                <div className="bg-black/35 backdrop-blur-md rounded-xl p-2.5 text-center min-w-[58px]">
                  <div className="text-xl sm:text-2xl font-black font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-orange-200">Mins</div>
                </div>
                <span className="text-xl font-bold opacity-75">:</span>
                <div className="bg-black/35 backdrop-blur-md rounded-xl p-2.5 text-center min-w-[58px]">
                  <div className="text-xl sm:text-2xl font-black font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-orange-200">Secs</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onShopSale}
                className="px-6 py-3 rounded-xl bg-gray-950 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-lg cursor-pointer"
              >
                Shop Sale Now →
              </button>

              <div
                onClick={() => handleCopy('VIP70')}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-mono font-bold cursor-pointer transition-colors border border-white/25"
                title="Click to copy coupon code"
              >
                <span>Code: <strong>VIP70</strong></span>
                {copiedCode === 'VIP70' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/80" />
                )}
              </div>
            </div>
          </div>

          {/* Promo Card 2: New Collection Lookbook */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white overflow-hidden shadow-xl flex flex-col justify-between">
            {/* Background Emoji */}
            <div className="absolute -right-4 -bottom-6 text-9xl opacity-15 pointer-events-none select-none">
              👗
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs mb-4">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>New Arrival Showcase</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
                Summer 2025 <br />
                <span className="text-orange-500">Streetwear & Ethnic</span>
              </h2>

              <p className="text-gray-300 text-sm mt-2 max-w-sm leading-relaxed">
                Experience high-thread count organic cottons, breathable fabrics, and athletic silhouettes crafted for uncompromised all-day comfort.
              </p>

              {/* Perks list */}
              <div className="mt-6 space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>Free express shipping on prepaid orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>Complimentary eco-friendly dust bags included</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>Instant size exchange guarantee within 30 days</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6">
              <button
                onClick={onShopSale}
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-lg shadow-orange-600/30 cursor-pointer"
              >
                Explore Collection →
              </button>

              <div
                onClick={() => handleCopy('VIP15')}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-mono font-bold cursor-pointer transition-colors border border-white/15"
                title="Click to copy coupon code"
              >
                <span>Code: <strong>VIP15</strong> (15% Off)</span>
                {copiedCode === 'VIP15' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-white/80" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
