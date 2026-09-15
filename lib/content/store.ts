import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { DEFAULT_CONTENT } from "./defaults";
import type { SiteContent, StorageDriver } from "@/types";

/** Tag cache — ditembak saat admin menyimpan supaya halaman publik ikut segar. */
export const CONTENT_TAG = "site-content";

const CONTENT_FILE = path.join(process.cwd(), "content", "site.json");
const SUPABASE_TABLE = "site_content";
const SUPABASE_ROW_ID = "main";

export interface ContentSnapshot {
  content: SiteContent;
  driver: StorageDriver;
  /** Diisi kalau backend utama gagal — ditampilkan di dashboard admin. */
  error: string | null;
}

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/**
 * Backend Supabase opsional. Sengaja pakai REST API langsung (PostgREST) supaya
 * tidak perlu menambah dependency hanya untuk satu tabel berisi satu baris.
 *
 * Tabel yang dibutuhkan:
 *   create table site_content (
 *     id text primary key,
 *     data jsonb not null,
 *     updated_at timestamptz not null default now()
 *   );
 */
function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export const isSupabaseConfigured = () => supabaseConfig() !== null;

async function readFromSupabase({ url, key }: { url: string; key: string }) {
  const response = await fetch(
    `${url}/rest/v1/${SUPABASE_TABLE}?id=eq.${SUPABASE_ROW_ID}&select=data`,
    {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${(await response.text()).slice(0, 160)}`);
  }

  const rows = (await response.json()) as { data?: SiteContent }[];
  return rows[0]?.data ?? null;
}

async function writeToSupabase({ url, key }: { url: string; key: string }, content: SiteContent) {
  const response = await fetch(`${url}/rest/v1/${SUPABASE_TABLE}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify([
      { id: SUPABASE_ROW_ID, data: content, updated_at: new Date().toISOString() },
    ]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${(await response.text()).slice(0, 160)}`);
  }
}

async function readFromFile(): Promise<SiteContent | null> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    return JSON.parse(raw) as SiteContent;
  } catch {
    return null;
  }
}

async function writeToFile(content: SiteContent) {
  try {
    await fs.mkdir(path.dirname(CONTENT_FILE), { recursive: true });
    await fs.writeFile(CONTENT_FILE, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  } catch {
    throw new Error(
      "Filesystem di server ini read-only, jadi perubahan tidak bisa disimpan. " +
        "Sambungkan Supabase dengan mengisi env SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
}

/** Selalu membaca sumber terbaru — dipakai halaman admin yang tidak boleh kena cache. */
export async function getContentSnapshot(): Promise<ContentSnapshot> {
  const supabase = supabaseConfig();
  const local = await readFromFile();

  if (supabase) {
    try {
      const remote = await readFromSupabase(supabase);
      if (remote) return { content: remote, driver: "supabase", error: null };
      // Tabel masih kosong: pakai isi lokal/awal sampai admin menyimpan pertama kali.
      return { content: local ?? DEFAULT_CONTENT, driver: "supabase", error: null };
    } catch (error) {
      return {
        content: local ?? DEFAULT_CONTENT,
        driver: "file",
        error: `Gagal membaca dari Supabase: ${errorMessage(error)}`,
      };
    }
  }

  if (local) return { content: local, driver: "file", error: null };
  return { content: DEFAULT_CONTENT, driver: "default", error: null };
}

export async function saveSiteContent(content: SiteContent): Promise<StorageDriver> {
  const supabase = supabaseConfig();
  if (supabase) {
    await writeToSupabase(supabase, content);
    return "supabase";
  }
  await writeToFile(content);
  return "file";
}

/**
 * Versi ber-cache untuk halaman publik, supaya halaman tetap bisa di-prerender.
 * Di-invalidasi lewat revalidateTag(CONTENT_TAG) setiap admin menyimpan.
 */
export const getSiteContent = unstable_cache(
  async (): Promise<SiteContent> => (await getContentSnapshot()).content,
  ["site-content"],
  { tags: [CONTENT_TAG] },
);
