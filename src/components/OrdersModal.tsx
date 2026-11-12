import React from 'react';
import { X, Package, Clock, CheckCircle2, Truck, MapPin, CreditCard, ChevronRight, User, LogIn, LogOut } from 'lucide-react';
import { Order } from '../types';
import { fmtCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext.tsx';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onShopClick: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onShopClick,
}) => {
  const { user, signInWithGoogle, signOut } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden max-h-[88vh] flex flex-col justify-between">
        {/* Header */}
        <div className="pb-4 border-b border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-black text-gray-950 font-display">
                  My Orders & Account
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Saved in Cloud SQL PostgreSQL database with live tracking.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Sign-In Banner */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200/80 text-xs">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-xs">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-extrabold text-gray-950">{user.displayName || 'VIP Member'}</div>
                    <div className="text-[11px] text-gray-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="text-gray-600">
                  <span className="font-bold text-gray-900">Sign in with Google</span> to sync orders across all your devices.
                </div>
                <button
                  onClick={signInWithGoogle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-950 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ml-3 shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center text-3xl mb-4">
                📦
              </div>
              <h3 className="text-base font-bold text-gray-900">No orders placed yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Once you place an order, your tracking details, estimated delivery dates, and digital receipts will appear here.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onShopClick();
                }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-500 transition-colors cursor-pointer shadow-sm"
              >
                Browse Trending Products
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200 space-y-3"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200/80 text-xs">
                  <div>
                    <span className="font-extrabold text-gray-950">Order #{order.id}</span>
                    <span className="text-gray-400 mx-2">·</span>
                    <span className="text-gray-500">{order.createdAt}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{order.status}</span>
                  </span>
                </div>

                {/* Tracking Timeline Bar */}
                <div className="bg-white p-3 rounded-xl border border-gray-200/80 text-xs">
                  <div className="flex items-center justify-between font-bold text-gray-900 mb-2">
                    <span className="flex items-center gap-1.5 text-orange-600">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Estimated Delivery: {order.estimatedDelivery}</span>
                    </span>
                    <span className="text-gray-500 text-[11px]">Standard Express</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-center text-[10px] text-gray-500">
                    <div className="text-emerald-700 font-bold">
                      <div className="h-1 bg-emerald-500 rounded-full mb-1" />
                      <span>Confirmed</span>
                    </div>
                    <div className="text-emerald-700 font-bold">
                      <div className="h-1 bg-emerald-500 rounded-full mb-1" />
                      <span>Packed</span>
                    </div>
                    <div>
                      <div className="h-1 bg-orange-400 rounded-full mb-1" />
                      <span>In Transit</span>
                    </div>
                    <div>
                      <div className="h-1 bg-gray-200 rounded-full mb-1" />
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.product.emoji}</span>
                        <div>
                          <span className="font-bold text-gray-900">{item.product.name}</span>
                          <span className="text-gray-500 text-[11px] block">
                            Qty: {item.qty} {item.selectedSize ? `· Size: ${item.selectedSize}` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="font-extrabold text-gray-950">
                        {fmtCurrency(item.product.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer of Order */}
                <div className="pt-3 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate max-w-[200px]">
                      {order.customer.address}, {order.customer.city}
                    </span>
                  </div>

                  <div className="font-black text-sm text-gray-950 font-display">
                    Total: <span className="text-orange-600">{fmtCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-950 text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
