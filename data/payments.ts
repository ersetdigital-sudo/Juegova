import type { PaymentMethod } from "@/types";

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "qris", name: "QRIS", group: "Semua e-wallet" },
  { id: "dana", name: "DANA", group: "E-wallet" },
  { id: "gopay", name: "GoPay", group: "E-wallet" },
  { id: "ovo", name: "OVO", group: "E-wallet" },
  { id: "shopeepay", name: "ShopeePay", group: "E-wallet" },
  { id: "bca-va", name: "BCA VA", group: "Bank Transfer" },
  { id: "bri-va", name: "BRI VA", group: "Bank Transfer" },
  { id: "alfamart", name: "Alfamart", group: "Retail" },
];

export const DEFAULT_PAYMENT_NAME = "QRIS";

/** Metode yang menampilkan QR untuk di-scan. */
export const EWALLET_NAMES = ["DANA", "GoPay", "OVO", "ShopeePay"];

export const VIRTUAL_ACCOUNT_MAP: Record<string, { label: string; prefix: string }> = {
  "BCA VA": { label: "Nomor Virtual Account BCA", prefix: "8081" },
  "BRI VA": { label: "Nomor Virtual Account BRI", prefix: "8873" },
};

export const RETAIL_PAYMENT_NAME = "Alfamart";
export const RETAIL_CODE_LABEL = "Kode Pembayaran Alfamart";
