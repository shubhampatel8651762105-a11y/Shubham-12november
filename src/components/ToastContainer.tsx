import React from 'react';
import { ToastMessage } from '../types';
import { ShoppingCart, Heart, Check, Info } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-gray-950/95 backdrop-blur-md text-white px-5 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2.5 border border-gray-800 animate-slide-up"
        >
          {toast.type === 'cart' ? (
            <ShoppingCart className="w-4 h-4 text-orange-500 shrink-0" />
          ) : toast.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Heart className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <span>{toast.text}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-gray-400 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
