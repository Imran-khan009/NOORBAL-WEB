export type StockStatus = 'ready-stock' | 'made-to-order';

export type CategoryId = 
  | 'all'
  | 'balochi-heritage'
  | 'women'
  | 'men'
  | 'perfumes'
  | 'watches'
  | 'caps'
  | 'shoes'
  | 'lifestyle';

export type CurrencyCode = 'PKR' | 'USD' | 'AED' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateAgainstPKR: number; // 1 PKR = X foreign currency
  format: (amount: number) => string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: CategoryId;
  pricePKR: number;
  status: StockStatus;
  leadTime: string;
  heroImage: string;
  galleryImages?: string[];
  description: string;
  craftDetails: string;
  fabric: string;
  sizes: string[];
  defaultSize?: string;
  tags: string[];
  featured?: boolean;
  bestSeller?: boolean;
  rating: number;
  reviewCount: number;
}

export interface WishlistItem {
  product: Product;
  selectedSize?: string;
  addedAt: number;
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'product_view' | 'whatsapp_click' | 'instagram_click' | 'category_filter' | 'wishlist_add' | 'currency_change' | 'checkout_started' | 'order_placed';
  timestamp: string;
  details: string;
  productId?: string;
  productName?: string;
}

export type OrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Ready to Ship'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface CustomMeasurements {
  chest?: string;
  waist?: string;
  length?: string;
  notes?: string;
}

export interface CheckoutItem {
  product: Product;
  size: string;
  quantity: number;
  customMeasurements?: CustomMeasurements;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  country: string;
  province: string;
  city: string;
  area: string;
  address: string;
  postalCode: string;
  orderNotes?: string;
}

export interface Order {
  id: string; // The NOORBAL order number, e.g. NB-2026-XXXXX
  supabaseId?: string; // The database UUID from Supabase
  item: {
    productId: string;
    productName: string;
    variant?: string;
    size: string;
    quantity: number;
    unitPricePKR: number;
    subtotalPKR: number;
    heroImage: string;
    status: StockStatus;
    customMeasurements?: CustomMeasurements;
  };
  deliveryFeePKR: number;
  totalPKR: number;
  customer: CustomerInfo;
  orderType: StockStatus;
  orderStatus: OrderStatus;
  createdAt: string;
}

export interface SupabaseOrderRow {
  id?: string;
  order_number: string;
  customer_name: string;
  mobile_number: string;
  email: string | null;
  complete_address: string;
  province: string;
  city: string;
  area: string;
  postal_code: string;
  product_id: string;
  product_name: string;
  size_variant: string;
  quantity: number;
  price: number;
  delivery_fee: number;
  total: number;
  order_notes: string | null;
  order_status: string;
  order_date: string;
  created_at?: string;
}

