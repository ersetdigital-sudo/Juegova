"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, isAuthorized, startSession } from "@/lib/admin/auth";
import { CONTENT_TAG, getContentSnapshot, saveSiteContent } from "@/lib/content/store";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import type { ActionResult, SiteContent } from "@/types";

const CONTENT_KEYS = new Set(Object.keys(DEFAULT_CONTENT));

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

/**
 * Menyimpan satu bagian konten (patch digabung secara rekursif).
 *
 * Dashboard ini hanya untuk admin, tapi tetap diverifikasi: kalau ADMIN_PASSWORD
 * sudah di-set, semua aksi tulis menolak sesi yang tidak sah.
 */
export async function saveContentPatch(
  patch: Partial<SiteContent>,
): Promise<ActionResult> {
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
    revalidateTag(CONTENT_TAG);
    revalidatePath("/", "layout");
    return { ok: true, message: "Perubahan tersimpan." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal menyimpan perubahan.",
    };
  }
}

/** Menghapus override tersimpan sehingga situs kembali ke isi awal di folder data/. */
export async function resetContent(): Promise<ActionResult> {
  if (!(await isAuthorized())) {
    return { ok: false, message: "Sesi tidak sah. Silakan login ulang." };
  }

  try {
    await fs.rm(path.join(process.cwd(), "content", "site.json"), { force: true });
    revalidateTag(CONTENT_TAG);
    revalidatePath("/", "layout");
    return { ok: true, message: "Konten dikembalikan ke isi awal." };
  } catch {
    return { ok: false, message: "Tidak bisa menghapus konten tersimpan di server ini." };
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
