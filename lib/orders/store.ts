import { promises as fs } from "node:fs";
import path from "node:path";
import { isSupabaseConfigured, supabaseFetch } from "@/lib/content/config";
import { isOrderStatus } from "./status";
import type { Order, OrderStatus } from "@/types";

const ORDERS_FILE = path.join(process.cwd(), "content", "orders.json");

interface OrderRow {
  id: string;
  invoice: string;
  game_id: string | null;
  game_name: string;
  item_label: string;
  account_id: string;
  payment_method: string;
  subtotal: number;
  fee: number;
  discount: number;
  total: number;
  status: string;
  created_at: string;
}

const toOrder = (row: OrderRow): Order => ({
  id: row.id,
  invoice: row.invoice,
  gameId: row.game_id,
  gameName: row.game_name,
  itemLabel: row.item_label,
  accountId: row.account_id,
  paymentMethod: row.payment_method,
  subtotal: row.subtotal,
  fee: row.fee,
  discount: row.discount,
  total: row.total,
  status: isOrderStatus(row.status) ? row.status : "menunggu",
  createdAt: row.created_at,
});

export interface NewOrder {
  gameId: string | null;
  gameName: string;
  itemLabel: string;
  accountId: string;
  paymentMethod: string;
  subtotal: number;
  fee: number;
  discount: number;
  total: number;
}

/** JGV-YYMMDD-XXXX, sama seperti format di halaman pembayaran sebelumnya. */
function buildInvoice() {
  const now = new Date();
  const stamp = `${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `JGV-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
}

async function readFileOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeFileOrders(orders: Order[]) {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  await fs.writeFile(ORDERS_FILE, `${JSON.stringify(orders, null, 2)}\n`, "utf8");
}

/** Simpan pesanan baru. Invoice dibuat di sini, bukan diambil dari URL. */
export async function createOrder(input: NewOrder): Promise<Order> {
  if (!isSupabaseConfigured()) {
    const orders = await readFileOrders();
    const order: Order = {
      ...input,
      id: `local-${Date.now()}`,
      invoice: buildInvoice(),
      status: "menunggu",
      createdAt: new Date().toISOString(),
    };
    orders.unshift(order);
    await writeFileOrders(orders);
    return order;
  }

  // Constraint unique pada invoice jadi penjaga terakhir kalau nomornya bentrok.
  for (let attempt = 0; attempt < 5; attempt++) {
    const invoice = buildInvoice();

    try {
      const response = await supabaseFetch("orders", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify([
          {
            invoice,
            game_id: input.gameId,
            game_name: input.gameName,
            item_label: input.itemLabel,
            account_id: input.accountId,
            payment_method: input.paymentMethod,
            subtotal: input.subtotal,
            fee: input.fee,
            discount: input.discount,
            total: input.total,
          },
        ]),
      });

      const rows = (await response.json()) as OrderRow[];
      const row = rows[0];
      if (row) return toOrder(row);
    } catch (error) {
      // 409 = invoice sudah dipakai, coba nomor lain.
      if (!String(error).includes("409")) throw error;
    }
  }

  throw new Error("Gagal membuat nomor invoice unik. Coba lagi.");
}

export async function listOrders(limit = 100): Promise<Order[]> {
  if (!isSupabaseConfigured()) return readFileOrders();

  const response = await supabaseFetch(
    `orders?select=*&order=created_at.desc&limit=${limit}`,
  );
  return ((await response.json()) as OrderRow[]).map(toOrder);
}

export async function findOrderByInvoice(invoice: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    return (await readFileOrders()).find((order) => order.invoice === invoice) ?? null;
  }

  const response = await supabaseFetch(
    `orders?select=*&invoice=eq.${encodeURIComponent(invoice)}&limit=1`,
  );
  const rows = (await response.json()) as OrderRow[];
  return rows[0] ? toOrder(rows[0]) : null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (!isSupabaseConfigured()) {
    const orders = await readFileOrders();
    await writeFileOrders(
      orders.map((order) => (order.id === id ? { ...order, status } : order)),
    );
    return;
  }

  await supabaseFetch(`orders?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
  });
}
