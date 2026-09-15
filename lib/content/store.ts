import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_cache } from "next/cache";
import { DEFAULT_CONTENT } from "./defaults";
import { getCatalogSnapshot } from "./catalog";
import { errorMessage, isSupabaseConfigured, supabaseFetch, supabaseConfig } from "./config";
import type { SiteContent, StorageDriver } from "@/types";

/** Tag cache — ditembak setiap admin menyimpan supaya halaman publik ikut segar. */
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

/**
 * Katalog game TIDAK ikut di sini — punya tabel sendiri (games/game_items)
 * supaya harga bisa di-query dan dilihat sebagai baris biasa di database.
 */
async function readFromSupabase(): Promise<SiteContent | null> {
  const response = await supabaseFetch(`${SUPABASE_TABLE}?id=eq.${SUPABASE_ROW_ID}&select=data`);
  const rows = (await response.json()) as { data?: SiteContent }[];
  return rows[0]?.data ?? null;
}

async function writeToSupabase(content: SiteContent) {
  const { url, key } = supabaseConfig();
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
    throw new Error(`Supabase ${response.status}: ${(await response.text()).slice(0, 180)}`);
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
  const local = await readFromFile();

  if (isSupabaseConfigured()) {
    try {
      const remote = await readFromSupabase();
      if (remote) {
        return { content: stripGames(remote), driver: "supabase", error: null };
      }
      return { content: stripGames(local ?? DEFAULT_CONTENT), driver: "supabase", error: null };
    } catch (error) {
      return {
        content: stripGames(local ?? DEFAULT_CONTENT),
        driver: "file",
        error: `Gagal membaca dari Supabase: ${errorMessage(error)}`,
      };
    }
  }

  if (local) return { content: stripGames(local), driver: "file", error: null };
  return { content: DEFAULT_CONTENT, driver: "default", error: null };
}

/** Buang katalog dari dokumen konten — sumbernya tabel, bukan JSON. */
function stripGames(content: SiteContent): SiteContent {
  return { ...content, games: [] };
}

export async function saveSiteContent(content: SiteContent): Promise<StorageDriver> {
  const { games: _ignored, ...withoutGames } = content;

  if (isSupabaseConfigured()) {
    await writeToSupabase(withoutGames as SiteContent);
    return "supabase";
  }

  await writeToFile(withoutGames as SiteContent);
  return "file";
}

/**
 * Versi ber-cache untuk halaman publik: konten presentasi dari satu dokumen,
 * katalog dari tabelnya sendiri. Halaman tetap bisa di-prerender karena hasil
 * gabungannya yang di-cache, lalu di-invalidasi lewat revalidateTag.
 */
export const getSiteContent = unstable_cache(
  async (): Promise<SiteContent> => {
    const [content, catalog] = await Promise.all([getContentSnapshot(), getCatalogSnapshot()]);
    return { ...content.content, games: catalog.games };
  },
  ["site-content"],
  { tags: [CONTENT_TAG] },
);
