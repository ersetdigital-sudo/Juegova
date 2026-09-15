/** Biaya layanan flat dan diskon promo — nilai sama dengan halaman pembayaran HTML asli. */
const SERVICE_FEE = 1000;
const DISCOUNT_RATE = 0.05;

export interface OrderPricing {
  subtotal: number;
  fee: number;
  discount: number;
  total: number;
}

export function calculatePricing(subtotal: number): OrderPricing {
  const discount = Math.round(subtotal * DISCOUNT_RATE);
  return {
    subtotal,
    fee: SERVICE_FEE,
    discount,
    total: subtotal + SERVICE_FEE - discount,
  };
}
