"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, isAuthorized, startSession } from "@/lib/admin/auth";
import { writeCatalog } from "@/lib/content/catalog";
import { CONTENT_TAG, getContentSnapshot, saveSiteContent } from "@/lib/content/store";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { isSupabaseConfigured, supabaseFetch } from "@/lib/content/config";
import { updateOrderStatus } from "@/lib/orders/store";
import { isOrderStatus } from "@/lib/orders/status";
import type { ActionResult, Game, OrderStatus, SiteContent, TopUpItem } from "@/types";

/** `games` tidak ikut di sini karena katalog disimpan di tabelnya sendiri. */
const CONTENT_KEYS = new Set(Object.keys(DEFAULT_CONTENT).filter((key) => key !== "games"));

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Gabung rekursif: objek digabung, array diganti utuh. Ini yang membuat editor
 * bisa menyimpan hanya satu bagian, mis. { navigation: { header: [...] } }
 * tanpa menghapus footerMenu dan footerAbout.
 */
function deepMerge<T>(base: T, patch: unknown): T {
  if (!isPlainObject(patch)) return patch as T;
  if (!isPlainObject(base)) return patch as T;

  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    result[key] = deepMerge(result[key], value);
  }
  return result as T;
}

function refreshPublicPages() {
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

/**
 * Menyimpan satu bagian konten presentasi (banner, ulasan, pengaturan, dst).
 * Katalog game lewat saveCatalog() karena tabelnya beda.
 */
export async function saveContentPatch(patch: Partial<SiteContent>): Promise<ActionResult> {
  if (!(await isAuthorized())) {
    return { ok: false, message: "Sesi tidak sah. Silakan login ulang." };
  }

  const unknownKey = Object.keys(patch).find((key) => !CONTENT_KEYS.has(key));
  if (unknownKey) {
    return { ok: false, message: `Bagian "${unknownKey}" tidak dikenal.` };
  }

  try {
    const { content } = await getContentSnapshot();
    await saveSiteContent(deepMerge(content, patch));
    refreshPublicPages();
    return { ok: true, message: "Perubahan tersimpan." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal menyimpan perubahan.",
    };
  }
}

const text = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const num = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

/** Rapikan data yang datang dari form supaya tabel tidak diisi nilai aneh. */
function normalizeGame(raw: unknown): Game | null {
  if (!isPlainObject(raw)) return null;

  const name = text(raw.name).trim();
  const id = slugify(text(raw.id).trim() || name);
  if (!id || !name) return null;

  const items = Array.isArray(raw.items) ? raw.items : [];
  const normalizedItems: TopUpItem[] = items
    .filter((item): item is Record<string, unknown> => isPlainObject(item))
    .map((item) => ({ label: text(item.label).trim(), price: Math.max(0, Math.round(num(item.price))) }))
    .filter((item) => item.label.length > 0);

  return {
    id,
    name,
    cardTitle: text(raw.cardTitle, name).trim() || name,
    publisher: text(raw.publisher).trim(),
    currency: text(raw.currency).trim(),
    category: text(raw.category).trim(),
    image: text(raw.image).trim(),
    imageWidth: Math.round(num(raw.imageWidth, 1200)) || 1200,
    imageHeight: Math.round(num(raw.imageHeight, 896)) || 896,
    imageAlt: text(raw.imageAlt, `Sampul game ${name}`).trim(),
    needsZone: Boolean(raw.needsZone),
    idHint: text(raw.idHint).trim(),
    description: text(raw.description).trim(),
    items: normalizedItems,
  };
}

/** Menyimpan seluruh katalog ke tabel games + game_items. */
export async function saveCatalog(games: Game[]): Promise<ActionResult> {
  if (!(await isAuthorized())) {
    return { ok: false, message: "Sesi tidak sah. Silakan login ulang." };
  }

  if (!Array.isArray(games)) {
    return { ok: false, message: "Data katalog tidak valid." };
  }

  const normalized = games.map(normalizeGame).filter((game): game is Game => game !== null);

  const seen = new Set<string>();
  for (const game of normalized) {
    if (seen.has(game.id)) {
      return { ok: false, message: `Slug "${game.id}" dipakai lebih dari satu game.` };
    }
    seen.add(game.id);
  }

  try {
    await writeCatalog(normalized);
    refreshPublicPages();
    return { ok: true, message: "Katalog tersimpan." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal menyimpan katalog.",
    };
  }
}

/** Ubah status pesanan dari dashboard. */
export async function setOrderStatus(id: string, status: string): Promise<ActionResult> {
  if (!(await isAuthorized())) {
    return { ok: false, message: "Sesi tidak sah. Silakan login ulang." };
  }
  if (!isOrderStatus(status)) {
    return { ok: false, message: "Status tidak dikenal." };
  }

  try {
    await updateOrderStatus(id, status as OrderStatus);
    revalidatePath("/admin/pesanan");
    return { ok: true, message: "Status diperbarui." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui status.",
    };
  }
}

/** Kembalikan konten DAN katalog ke isi awal. */
export async function resetContent(): Promise<ActionResult> {
  if (!(await isAuthorized())) {
    return { ok: false, message: "Sesi tidak sah. Silakan login ulang." };
  }

  try {
    if (isSupabaseConfigured()) {
      await supabaseFetch("games?select=id", { method: "DELETE" });
    } else {
      await fs.rm(path.join(process.cwd(), "content", "catalog.json"), { force: true });
    }

    await fs.rm(path.join(process.cwd(), "content", "site.json"), { force: true });
    refreshPublicPages();
    return { ok: true, message: "Konten dan katalog dikembalikan ke isi awal." };
  } catch {
    return { ok: false, message: "Tidak bisa mengembalikan isi awal di server ini." };
  }
}

export async function loginAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const password = String(formData.get("password") ?? "");
  const success = await startSession(password);
  if (!success) return { ok: false, message: "Password salah." };
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}
