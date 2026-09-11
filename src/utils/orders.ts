import { Order, CheckoutItem, CustomerInfo, OrderStatus, SupabaseOrderRow, StockStatus } from '../types';

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `NB-${year}-${randomNum}`;
}

/**
 * Builds the exact database payload to be stored in Supabase `orders` table.
 * All requested customer and product attributes are mapped strictly.
 */
export function buildSupabaseOrderPayload(
  checkoutItem: CheckoutItem,
  customer: CustomerInfo,
  deliveryFeePKR: number = 0,
  orderNumber?: string
): SupabaseOrderRow {
  const subtotal = checkoutItem.product.pricePKR * checkoutItem.quantity;
  const total = subtotal + deliveryFeePKR;
  const num = orderNumber || generateOrderNumber();

  return {
    order_number: num,
    customer_name: customer.fullName.trim(),
    mobile_number: customer.phone.trim(),
    email: customer.email?.trim() || null,
    complete_address: customer.address.trim(),
    province: customer.province.trim(),
    city: customer.city.trim(),
    area: customer.area.trim(),
    postal_code: customer.postalCode.trim(),
    product_id: checkoutItem.product.id,
    product_name: checkoutItem.product.name,
    size_variant: checkoutItem.size || 'Standard',
    quantity: checkoutItem.quantity,
    price: checkoutItem.product.pricePKR,
    delivery_fee: deliveryFeePKR,
    total: total,
    order_notes: customer.orderNotes?.trim() || null,
    order_status: 'Pending',
    order_date: new Date().toISOString(),
  };
}

/**
 * Maps the saved Supabase order record back into the application Order model
 */
export function mapSupabaseRowToOrder(
  row: SupabaseOrderRow,
  originalItem: CheckoutItem,
  customerInfo: CustomerInfo
): Order {
  return {
    id: row.order_number,
    supabaseId: row.id,
    item: {
      productId: row.product_id,
      productName: row.product_name,
      variant: originalItem.product.subtitle,
      size: row.size_variant,
      quantity: row.quantity,
      unitPricePKR: Number(row.price),
      subtotalPKR: Number(row.price) * row.quantity,
      heroImage: originalItem.product.heroImage,
      status: originalItem.product.status as StockStatus,
      customMeasurements: originalItem.customMeasurements,
    },
    deliveryFeePKR: Number(row.delivery_fee),
    totalPKR: Number(row.total),
    customer: customerInfo,
    orderType: originalItem.product.status as StockStatus,
    orderStatus: (row.order_status || 'Pending') as OrderStatus,
    createdAt: row.order_date || row.created_at || new Date().toISOString(),
  };
}
