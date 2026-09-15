import type { OrderStatus } from "@/types";

export const ORDER_STATUSES: OrderStatus[] = ["menunggu", "dibayar", "selesai", "batal"];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  menunggu: "Menunggu pembayaran",
  dibayar: "Sudah dibayar",
  selesai: "Selesai",
  batal: "Dibatalkan",
};

export const ORDER_STATUS_CLASS: Record<OrderStatus, string> = {
  menunggu: "bg-amber-50 text-amber-700 border-amber-200",
  dibayar: "bg-blue-50 text-blue-700 border-blue-200",
  selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
  batal: "bg-slate-100 text-slate-600 border-slate-200",
};

/**
 * Label versi pembeli. Status "dibayar" artinya pembeli sudah menandai bayar
 * dan pesanannya sedang menunggu diverifikasi — dari sisi pembeli itu
 * "Sedang Diproses", bukan "Sudah dibayar".
 */
export const ORDER_STATUS_CUSTOMER_LABEL: Record<OrderStatus, string> = {
  menunggu: "Menunggu Pembayaran",
  dibayar: "Sedang Diproses",
  selesai: "Selesai",
  batal: "Dibatalkan",
};

export const ORDER_STATUS_CUSTOMER_CLASS: Record<OrderStatus, string> = {
  menunggu: "border-amber-200 bg-amber-50 text-amber-700",
  dibayar: "border-blue-200 bg-blue-50 text-blue-700",
  selesai: "border-emerald-200 bg-emerald-50 text-emerald-700",
  batal: "border-rose-200 bg-rose-50 text-rose-700",
};

export const isOrderStatus = (value: string): value is OrderStatus =>
  (ORDER_STATUSES as string[]).includes(value);
