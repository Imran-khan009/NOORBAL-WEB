import { Product } from '../types';

export const NOORBAL_CONTACT = {
  rawPhone: '03130267697',
  internationalPhone: '923130267697',
  displayPhone: '+92 313 0267697',
  email: 'noorbal.offical@gmail.com',
  instagram: 'noorbal.official',
  instagramUrl: 'https://instagram.com/noorbal.official',
  deliveryTimeline: '2–3 Days Nationwide',
  warranty: '7 Days Return Warranty',
};

export function buildWhatsAppOrderUrl(product: Product, size?: string): string {
  const sizeText = size ? ` (Selected Size: ${size})` : '';
  const message = `Assalam-o-Alaikum NOORBAL,

I would like to order:
*${product.name}*${sizeText}
Price: PKR ${product.pricePKR.toLocaleString()}
Status: ${product.status === 'ready-stock' ? 'Ready-Stock (2–3 Days Delivery)' : 'Made-to-Order'}

Please confirm availability and share payment/delivery steps for my city.
Thank you!`;

  return `https://wa.me/${NOORBAL_CONTACT.internationalPhone}?text=${encodeURIComponent(message)}`;
}

export function buildOrderInquiryWhatsAppUrl(product: Product, size?: string, quantity: number = 1): string {
  const sizeText = size ? ` (Size: ${size})` : '';
  const message = `Assalam-o-Alaikum NOORBAL Concierge,

I have a query regarding:
*${product.name}*${sizeText}
Quantity: ${quantity}
Price: PKR ${(product.pricePKR * quantity).toLocaleString()}

Could you please guide me on sizing/details? Thank you!`;

  return `https://wa.me/${NOORBAL_CONTACT.internationalPhone}?text=${encodeURIComponent(message)}`;
}

export function buildConfirmedOrderWhatsAppUrl(orderId: string, productName: string, totalPKR: number): string {
  const message = `Assalam-o-Alaikum NOORBAL,

I have submitted Order *#${orderId}* on your website for *${productName}* (Total: PKR ${totalPKR.toLocaleString()}).

I would like to verify my order details. Thank you!`;

  return `https://wa.me/${NOORBAL_CONTACT.internationalPhone}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppConciergeUrl(): string {
  const message = `Assalam-o-Alaikum NOORBAL,

I am visiting your official website and would like assistance with your luxury collection and custom orders.`;
  return `https://wa.me/${NOORBAL_CONTACT.internationalPhone}?text=${encodeURIComponent(message)}`;
}


