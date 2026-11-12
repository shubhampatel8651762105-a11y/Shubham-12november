export type ProductCategory = 'fashion' | 'electronics' | 'beauty' | 'sports' | 'home' | 'accessories';

export interface Product {
  id: number;
  name: string;
  tagline?: string;
  description: string;
  price: number;
  mrp: number;
  disc: number;
  emoji: string;
  bgGradient: string;
  category: ProductCategory;
  rating: number;
  reviewsCount: number;
  badge?: 'NEW' | 'SALE' | 'BESTSELLER' | 'HOT';
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  features: string[];
  inStock: boolean;
  deliveryDays: string;
  specs?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  qty: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  paymentMethod: 'Cash on Delivery' | 'UPI (PhonePe / GPay / Paytm)' | 'Credit / Debit Card' | 'Net Banking';
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  customer: CustomerDetails;
  status: 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'cart';
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  meetingMode?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: string;
  savedToSupabase?: boolean;
}

