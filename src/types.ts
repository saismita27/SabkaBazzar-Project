export type LanguageCode = 'en' | 'hi' | 'or' | 'mr' | 'bn' | 'ta' | 'te' | 'gu';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  recommendedStates?: string[];
}

export type OrderState = 
  | 'Placed' 
  | 'Confirmed' 
  | 'Packed' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export interface Category {
  id: string;
  slug: string;
  name: Record<LanguageCode, string>;
  icon: string;
  subcategories: string[];
}

export interface ProductAlias {
  term: string;
  language: string;
  script: string;
}

export interface Product {
  id: string;
  categoryId: string;
  subCategory?: string;
  name: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  price: number;
  mrp: number;
  stock: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  sourceUrl?: string;
  brand: string;
  unit: string;
  variants?: string[];
  aliases: ProductAlias[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  gst: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderState;
  paymentMethod: 'COD' | 'UPI' | 'Card';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  shippingAddress: Address;
  idempotencyToken: string;
  createdAt: string;
  timeline: {
    status: OrderState;
    timestamp: string;
    note: string;
  }[];
}

export interface SupportTicket {
  id: string;
  userId: string;
  orderId?: string;
  type: 'order_issue' | 'kiosk_assistance' | 'refund' | 'general';
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  adminReply?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredLanguage: LanguageCode;
  selectedState?: string;
  role: 'customer' | 'admin';
}

export interface KioskHardwareEvent {
  eventId: number;
  kioskId: number;
  timestamp: string;
  source: string;
  rawPayload: string;
  handled: boolean;
}
