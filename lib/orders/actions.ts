"use server";

import { revalidatePath } from "next/cache";
import { readActiveCatalog } from "@/lib/content/catalog";
import { findPaymentMethod } from "@/lib/payments/store";
import { calculatePricing } from "@/lib/pricing";
import type { ActionResult } from "@/types";
import { createOrder, findOrderByInvoice, updateOrderStatus } from "./store";

export interface CheckoutInput {
  gameId: string;
  itemLabel: string;
  accountId: string;
  /** Id metode pembayaran yang dipilih. Nama diambil server dari data metode. */
  paymentMethodId: string;
}

export type CheckoutResult =
  | { ok: true; invoice: string; total: number }
  | { ok: false; message: string };

/**
 * Membuat pesanan dari data yang dipilih pelanggan.
 *
 * HARGA DAN METODE TIDAK DIKIRIM DARI BROWSER. Yang dikirim cuma id game,
 * nama nominal, dan id metode — sisanya dicari di database. Jadi keduanya
 * tidak bisa dimanipulasi lewat request.
 */
export async function createCheckoutOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const accountId = input.accountId.trim();
  if (!accountId) return { ok: false, message: "User ID wajib diisi." };

  // Katalog aktif saja: game yang dinonaktifkan admin tidak bisa dipesan,
  // meski halamannya masih terbuka di browser pembeli.
  const [games, payment] = await Promise.all([
    readActiveCatalog(),
    findPaymentMethod(input.paymentMethodId),
  ]);

  const game = games.find((entry) => entry.id === input.gameId);
  if (!game) return { ok: false, message: "Game tidak ditemukan atau sudah tidak aktif." };

  const item = game.items.find((entry) => entry.label === input.itemLabel);
  if (!item) return { ok: false, message: "Nominal tidak ditemukan. Pilih ulang." };

  if (!payment || !payment.isActive) {
    return { ok: false, message: "Metode pembayaran tidak tersedia. Pilih metode lain." };
  }

  const pricing = calculatePricing(item.price);

  try {
    const order = await createOrder({
      gameId: game.id,
      gameName: game.name,
      itemLabel: item.label,
      accountId,
      paymentMethod: payment.name,
      paymentMethodId: payment.id,
      ...pricing,
    });

    revalidatePath("/admin/pesanan");
    return { ok: true, invoice: order.invoice, total: order.total };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal membuat pesanan.",
    };
  }
}

/**
 * Pelanggan menandai "sudah bayar". Ini cuma klaim, bukan verifikasi —
 * status akhirnya tetap ditentukan admin setelah cek mutasi.
 *
 * Perubahannya dibatasi: hanya boleh dari "menunggu" ke "dibayar", supaya
 * halaman publik tidak bisa dipakai mengubah pesanan yang sudah diproses.
 */
export async function markOrderPaid(invoice: string): Promise<ActionResult> {
  try {
    const order = await findOrderByInvoice(invoice);
    if (!order) return { ok: false, message: "Pesanan tidak ditemukan." };

    if (order.status === "dibayar" || order.status === "selesai") {
      return { ok: true, message: "Pesanan sudah ditandai dibayar." };
    }
    if (order.status !== "menunggu") {
      return { ok: false, message: "Pesanan ini sudah tidak aktif." };
    }

    await updateOrderStatus(order.id, "dibayar");
    revalidatePath("/admin/pesanan");
    return { ok: true, message: "Pesanan ditandai sudah dibayar." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui pesanan.",
    };
  }
}
