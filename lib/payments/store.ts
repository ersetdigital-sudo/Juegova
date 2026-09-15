import { promises as fs } from "node:fs";
import path from "node:path";
import { DEFAULT_PAYMENT_METHODS } from "@/data/payments";
import { errorMessage, isSupabaseConfigured, supabaseFetch } from "@/lib/content/config";
import type { PaymentMethod } from "@/types";

const PAYMENTS_FILE = path.join(process.cwd(), "content", "payments.json");
const TABLE = "payment_methods";

interface PaymentRow {
  id: string;
  name: string;
  type: string;
  account_label: string;
  account_number: string | null;
  account_name: string | null;
  qr_image: string | null;
  logo: string | null;
  instructions: string[] | null;
  is_active: boolean;
  sort_order: number;
}

const toMethod = (row: PaymentRow): PaymentMethod => ({
  id: row.id,
  name: row.name,
  type: row.type === "qris" ? "qris" : "transfer",
  accountLabel: row.account_label,
  accountNumber: row.account_number ?? "",
  accountName: row.account_name ?? "",
  qrImage: row.qr_image ?? "",
  logo: row.logo ?? "",
  instructions: Array.isArray(row.instructions) ? row.instructions : [],
  isActive: row.is_active,
});

const toRow = (method: PaymentMethod, index: number) => ({
  id: method.id,
  name: method.name,
  type: method.type,
  account_label: method.accountLabel,
  account_number: method.accountNumber || null,
  account_name: method.accountName || null,
  qr_image: method.qrImage || null,
  logo: method.logo || null,
  instructions: method.instructions,
  is_active: method.isActive,
  sort_order: index,
  updated_at: new Date().toISOString(),
});

export { PAYMENT_TYPE_LABEL, isPaymentMethodReady } from "./shared";

async function readFromSupabase(): Promise<PaymentMethod[]> {
  const response = await supabaseFetch(`${TABLE}?select=*&order=sort_order.asc`);
  return ((await response.json()) as PaymentRow[]).map(toMethod);
}

async function readFromFile(): Promise<PaymentMethod[] | null> {
  try {
    const raw = await fs.readFile(PAYMENTS_FILE, "utf8");
    const parsed = JSON.parse(raw) as { methods?: PaymentMethod[] };
    return parsed.methods ?? null;
  } catch {
    return null;
  }
}

export interface PaymentSnapshot {
  methods: PaymentMethod[];
  error: string | null;
}

/** Semua metode (termasuk yang nonaktif) — untuk dashboard admin. */
export async function getPaymentSnapshot(): Promise<PaymentSnapshot> {
  const fallback = await readFromFile();

  if (isSupabaseConfigured()) {
    try {
      const methods = await readFromSupabase();
      if (methods.length > 0) return { methods, error: null };
      return { methods: fallback ?? DEFAULT_PAYMENT_METHODS, error: null };
    } catch (error) {
      console.error("[pembayaran] gagal dibaca:", errorMessage(error));
      return {
        methods: fallback ?? DEFAULT_PAYMENT_METHODS,
        error: "Metode pembayaran gagal dimuat dari penyimpanan.",
      };
    }
  }

  return { methods: fallback ?? DEFAULT_PAYMENT_METHODS, error: null };
}

/** Hanya metode aktif — dipakai halaman publik. */
export async function listActivePaymentMethods(): Promise<PaymentMethod[]> {
  const { methods } = await getPaymentSnapshot();
  return methods.filter((method) => method.isActive);
}

export async function findPaymentMethod(id: string | null): Promise<PaymentMethod | null> {
  if (!id) return null;
  const { methods } = await getPaymentSnapshot();
  return methods.find((method) => method.id === id) ?? null;
}

async function writeToSupabase(methods: PaymentMethod[]) {
  const rows = methods.map(toRow);

  if (rows.length > 0) {
    await supabaseFetch(TABLE, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(rows),
    });
  }

  const keepIds = methods.map((method) => method.id);
  const notIn = keepIds.length > 0 ? `&id=not.in.(${keepIds.join(",")})` : "";
  await supabaseFetch(`${TABLE}?select=id${notIn}`, { method: "DELETE" });
}

async function writeToFile(methods: PaymentMethod[]) {
  await fs.mkdir(path.dirname(PAYMENTS_FILE), { recursive: true });
  await fs.writeFile(PAYMENTS_FILE, `${JSON.stringify({ methods }, null, 2)}\n`, "utf8");
}

export async function writePaymentMethods(methods: PaymentMethod[]): Promise<void> {
  if (isSupabaseConfigured()) {
    await writeToSupabase(methods);
    return;
  }

  try {
    await writeToFile(methods);
  } catch {
    throw new Error(
      "Perubahan tidak bisa disimpan di server ini. Hubungi pengembang untuk mengaktifkan penyimpanan permanen.",
    );
  }
}
