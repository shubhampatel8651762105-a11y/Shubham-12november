import React from 'react';
import { Calendar, Sparkles, Clock, CheckCircle2, ShieldCheck, ArrowRight, Database } from 'lucide-react';
import { SUPABASE_PROJECT_ID } from '../lib/supabase';

interface AppointmentBannerProps {
  onBookClick: () => void;
}

export const AppointmentBanner: React.FC<AppointmentBannerProps> = ({ onBookClick }) => {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complimentary Concierge Service</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white leading-tight">
              Book a 1-on-1 VIP Styling & Consultation Appointment
            </h2>

            <p className="text-sm text-gray-300 mt-2.5 leading-relaxed">
              Connect with our master stylists and luxury product specialists. Whether you need curated wardrobe styling, bespoke sizing advice, or a VIP hands-on unboxing demo, our experts are at your service.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/10 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Free Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Virtual or In-Store</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate">Supabase Connected: <strong className="text-white font-mono">{SUPABASE_PROJECT_ID.slice(0, 8)}...</strong></span>
              </div>
            </div>
          </div>

          {/* Right Action Card */}
          <div className="shrink-0 w-full lg:w-auto text-center lg:text-right">
            <button
              onClick={onBookClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Schedule VIP Appointment</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center justify-center lg:justify-end gap-2 text-[11px] text-gray-400 mt-3 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant confirmation & calendar invite</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
