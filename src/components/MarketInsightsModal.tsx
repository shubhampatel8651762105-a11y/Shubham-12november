import React, { useState, useEffect } from 'react';
import { X, Globe, Sparkles, ExternalLink, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import { Product } from '../types';

interface MarketInsightsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

interface MarketInsightData {
  summary: string;
  sources: { title: string; uri: string }[];
}

export const MarketInsightsModal: React.FC<MarketInsightsModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [data, setData] = useState<MarketInsightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      fetchInsights(product.name, product.category);
    } else {
      setData(null);
      setError(null);
    }
  }, [isOpen, product]);

  const fetchInsights = async (productName: string, category: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/market-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, category }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const res = await response.json();
      if (res.success) {
        setData({
          summary: res.summary,
          sources: res.sources || [],
        });
      } else {
        throw new Error(res.error || 'Failed to fetch insights');
      }
    } catch (err: any) {
      console.error('Error fetching market insights:', err);
      setError('Unable to load live Google Search insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden max-h-[90vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Search Grounded Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-950 font-display">
              Live Market & Pricing Insights
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Real-time web trends, pricing context, and verified shopper consensus for{' '}
              <strong className="text-gray-900">{product.name}</strong>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {loading ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-sm font-bold text-gray-900">
                Searching the live web with Google Search...
              </div>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Analyzing recent buyer sentiment, real-time market price ranges, and verified comparisons via Gemini 3.8 Flash.
              </p>
            </div>
          ) : error ? (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs font-semibold text-rose-800">{error}</p>
              <button
                onClick={() => fetchInsights(product.name, product.category)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Search</span>
              </button>
            </div>
          ) : data ? (
            <div className="space-y-5">
              {/* Product Badge summary strip */}
              <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80">
                <div className="text-3xl p-1 bg-white rounded-xl shadow-xs">{product.emoji}</div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-950">{product.name}</h4>
                  <div className="text-[11px] text-gray-500">
                    Category: <span className="font-semibold text-gray-700 capitalize">{product.category}</span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Live Grounded</span>
                  </div>
                </div>
              </div>

              {/* Grounded Summary */}
              <div className="bg-gradient-to-br from-blue-50/50 via-white to-orange-50/30 p-5 rounded-2xl border border-blue-100 text-xs text-gray-800 leading-relaxed space-y-3 whitespace-pre-line shadow-xs">
                {data.summary}
              </div>

              {/* Web Sources & Citations */}
              {data.sources.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Referenced Web Sources & Verifications ({data.sources.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-all flex items-center justify-between text-xs group"
                      >
                        <span className="font-medium text-gray-800 group-hover:text-blue-700 truncate pr-2">
                          {src.title}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Powered by Gemini 3.8 Flash & Google Search tool</span>
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-950 text-white font-bold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
