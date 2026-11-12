import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Banknote, QrCode, ArrowRight } from 'lucide-react';
import { CartItem, CustomerDetails, Order } from '../types';
import { fmtCurrency, calculateDeliveryDate } from '../utils/formatters';

import { useAuth } from '../context/AuthContext.tsx';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  onOrderPlaced: (order: Order) => void;
  onViewOrders: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  shipping,
  total,
  couponCode,
  onOrderPlaced,
  onViewOrders,
}) => {
  const { user, idToken } = useAuth();

  const [form, setForm] = useState<CustomerDetails>({
    name: user?.displayName || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin: '',
    paymentMethod: 'Cash on Delivery',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync user info into form if user logs in while modal is open
  React.useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errors: Partial<Record<keyof CustomerDetails, string>> = {};
    if (!form.name.trim()) errors.name = 'Please enter your full name';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!form.address.trim()) errors.address = 'Please enter your street address';
    if (!form.city.trim()) errors.city = 'Please enter your city';
    if (!form.pin.trim() || !/^\d{6}$/.test(form.pin.trim())) {
      errors.pin = 'Please enter a valid 6-digit PIN code';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newOrder: Order = {
      id: 'SV' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...items],
      subtotal,
      discount,
      shipping,
      total,
      couponCode,
      customer: { ...form },
      status: 'Confirmed',
      estimatedDelivery: calculateDeliveryDate(3),
    };

    // Save to Cloud SQL PostgreSQL via backend API
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify(newOrder),
      });
    } catch (err) {
      console.error('Failed to persist order to Cloud SQL:', err);
    }

    setConfirmedOrder(newOrder);
    onOrderPlaced(newOrder);
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrder ? (
          /* Success Screen */
          <div className="text-center py-6">
            <div className="w-18 h-18 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Payment & Order Confirmed
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-display mt-2">
              Thank You for Shopping!
            </h2>

            <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
              Your order <strong className="text-gray-950">#{confirmedOrder.id}</strong> has been placed and is being packed by our fulfillment center.
            </p>

            {/* Order Receipt Box */}
            <div className="bg-gray-50 rounded-2xl p-4 my-6 text-left border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between pb-2 border-b border-gray-200 font-bold text-gray-900">
                <span>Estimated Delivery</span>
                <span className="text-orange-600">{confirmedOrder.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deliver To</span>
                <span className="font-semibold text-gray-800 text-right">
                  {confirmedOrder.customer.name}, {confirmedOrder.customer.city} ({confirmedOrder.customer.pin})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Mode</span>
                <span className="font-semibold text-gray-800">{confirmedOrder.customer.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-extrabold text-gray-950">
                <span>Total Paid</span>
                <span className="text-orange-600">{fmtCurrency(confirmedOrder.total)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  handleClose();
                  onViewOrders();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gray-950 hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Track in My Orders
              </button>

              <button
                onClick={handleClose}
                className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                Fast & Secure
              </span>
              <h2 className="text-2xl font-black text-gray-950 font-display mt-0.5">
                Complete Your Order
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shubham Patel"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      formErrors.name ? 'border-rose-500 bg-rose-50' : 'border-gray-200'
                    } focus:outline-none focus:border-orange-500`}
                  />
                  {formErrors.name && (
                    <span className="text-[10px] text-rose-600 mt-0.5 block">{formErrors.name}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      formErrors.phone ? 'border-rose-500 bg-rose-50' : 'border-gray-200'
                    } focus:outline-none focus:border-orange-500`}
                  />
                  {formErrors.phone && (
                    <span className="text-[10px] text-rose-600 mt-0.5 block">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address (for order updates)
                </label>
                <input
                  type="email"
                  placeholder="e.g. shubham@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat / House no, Building, Street, Area"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    formErrors.address ? 'border-rose-500 bg-rose-50' : 'border-gray-200'
                  } focus:outline-none focus:border-orange-500`}
                />
                {formErrors.address && (
                  <span className="text-[10px] text-rose-600 mt-0.5 block">{formErrors.address}</span>
                )}
              </div>

              {/* City, State & PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      formErrors.city ? 'border-rose-500 bg-rose-50' : 'border-gray-200'
                    } focus:outline-none focus:border-orange-500`}
                  />
                  {formErrors.city && (
                    <span className="text-[10px] text-rose-600 mt-0.5 block">{formErrors.city}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 bg-white"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Other">Other States</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="6 digits"
                    maxLength={6}
                    value={form.pin}
                    onChange={(e) => setForm({ ...form, pin: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      formErrors.pin ? 'border-rose-500 bg-rose-50' : 'border-gray-200'
                    } focus:outline-none focus:border-orange-500`}
                  />
                  {formErrors.pin && (
                    <span className="text-[10px] text-rose-600 mt-0.5 block">{formErrors.pin}</span>
                  )}
                </div>
              </div>

              {/* Payment Method Radio Options */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === 'Cash on Delivery'
                        ? 'border-orange-500 bg-orange-50/50 font-bold text-gray-950 ring-1 ring-orange-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'Cash on Delivery'}
                      onChange={() => setForm({ ...form, paymentMethod: 'Cash on Delivery' })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <Banknote className="w-4 h-4 text-orange-600" />
                    <span>Cash on Delivery (COD)</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === 'UPI (PhonePe / GPay / Paytm)'
                        ? 'border-orange-500 bg-orange-50/50 font-bold text-gray-950 ring-1 ring-orange-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'UPI (PhonePe / GPay / Paytm)'}
                      onChange={() => setForm({ ...form, paymentMethod: 'UPI (PhonePe / GPay / Paytm)' })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>UPI (GPay / PhonePe)</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === 'Credit / Debit Card'
                        ? 'border-orange-500 bg-orange-50/50 font-bold text-gray-950 ring-1 ring-orange-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'Credit / Debit Card'}
                      onChange={() => setForm({ ...form, paymentMethod: 'Credit / Debit Card' })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Credit / Debit Card</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      form.paymentMethod === 'Net Banking'
                        ? 'border-orange-500 bg-orange-50/50 font-bold text-gray-950 ring-1 ring-orange-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'Net Banking'}
                      onChange={() => setForm({ ...form, paymentMethod: 'Net Banking' })}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Net Banking</span>
                  </label>
                </div>
              </div>

              {/* Order Summary Box */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
                <div className="font-bold text-gray-900 mb-1 flex items-center justify-between">
                  <span>Order Items ({items.length})</span>
                  <span className="text-gray-500 text-[11px]">Free delivery applied</span>
                </div>

                <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 divide-y divide-gray-100">
                  {items.map((i) => (
                    <div key={i.product.id} className="flex justify-between items-center text-gray-600 pt-1">
                      <span className="truncate max-w-[200px]">
                        {i.product.emoji} {i.product.name} × {i.qty}
                      </span>
                      <span className="font-semibold text-gray-900 shrink-0">
                        {fmtCurrency(i.product.price * i.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-200 space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{fmtCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({couponCode})</span>
                      <span>-{fmtCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : fmtCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-200 text-sm font-extrabold text-gray-950 font-display">
                    <span>Final Amount</span>
                    <span className="text-orange-600">{fmtCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-600/30 transition-all duration-200 active:scale-98 cursor-pointer mt-2"
              >
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 text-center">
                <Truck className="w-3.5 h-3.5 text-orange-600" />
                <span>Estimated dispatch in 24 hours · Real-time SMS tracking</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
