"use server";

import { revalidatePath } from "next/cache";
import { getCatalogSnapshot } from "@/lib/content/catalog";
import { calculatePricing } from "@/lib/pricing";
import type { ActionResult } from "@/types";
import { createOrder, findOrderByInvoice, updateOrderStatus } from "./store";

export interface CheckoutInput {
  gameId: string;
  itemLabel: string;
  accountId: string;
  paymentMethod: string;
}

export type CheckoutResult =
  | { ok: true; invoice: string; total: number }
  | { ok: false; message: string };

/**
 * Membuat pesanan dari data yang dipilih pelanggan.
 *
 * HARGA TIDAK DIKIRIM DARI BROWSER. Yang dikirim cuma id game dan nama nominal,
 * lalu harganya dicari di database. Jadi harga di URL tidak bisa dimanipulasi.
 */
export async function createCheckoutOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const accountId = input.accountId.trim();
  if (!accountId) return { ok: false, message: "User ID wajib diisi." };

  const { games } = await getCatalogSnapshot();

  const game = games.find((entry) => entry.id === input.gameId);
  if (!game) return { ok: false, message: "Game tidak ditemukan atau sudah tidak aktif." };

  const item = game.items.find((entry) => entry.label === input.itemLabel);
  if (!item) return { ok: false, message: "Nominal tidak ditemukan. Pilih ulang." };

  const pricing = calculatePricing(item.price);

  try {
    const order = await createOrder({
      gameId: game.id,
      gameName: game.name,
      itemLabel: item.label,
      accountId,
      paymentMethod: input.paymentMethod,
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
