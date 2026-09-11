import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PKR: {
    code: 'PKR',
    symbol: 'PKR',
    rateAgainstPKR: 1,
    format: (amt: number) => `PKR ${amt.toLocaleString('en-PK')}`
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rateAgainstPKR: 1 / 278, // ~278 PKR per USD
    format: (amt: number) => `$${(amt / 278).toFixed(0)}`
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    rateAgainstPKR: 1 / 75.7, // ~75.7 PKR per AED
    format: (amt: number) => `AED ${(amt / 75.7).toFixed(0)}`
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rateAgainstPKR: 1 / 355, // ~355 PKR per GBP
    format: (amt: number) => `£${(amt / 355).toFixed(0)}`
  }
};

export function formatPrice(pricePKR: number, currencyCode: CurrencyCode): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.PKR;
  return config.format(pricePKR);
}
