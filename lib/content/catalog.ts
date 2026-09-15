import { promises as fs } from "node:fs";
import path from "node:path";
import { GAMES } from "@/data/games";
import { errorMessage, isSupabaseConfigured, supabaseFetch } from "./config";
import type { Game, TopUpItem } from "@/types";

const CATALOG_FILE = path.join(process.cwd(), "content", "catalog.json");

interface GameRow {
  id: string;
  name: string;
  card_title: string;
  publisher: string;
  currency: string;
  category: string;
  image: string;
  image_width: number;
  image_height: number;
  image_alt: string;
  needs_zone: boolean;
  id_hint: string;
  description: string;
  sort_order: number;
}

interface ItemRow {
  game_id: string;
  label: string;
  price: number;
  sort_order: number;
}

const toGame = (row: GameRow, items: ItemRow[]): Game => ({
  id: row.id,
  name: row.name,
  cardTitle: row.card_title,
  publisher: row.publisher,
  currency: row.currency,
  category: row.category,
  image: row.image,
  imageWidth: row.image_width,
  imageHeight: row.image_height,
  imageAlt: row.image_alt,
  needsZone: row.needs_zone,
  idHint: row.id_hint,
  description: row.description,
  items: items.map((item) => ({ label: item.label, price: item.price })),
});

export interface CatalogSnapshot {
  games: Game[];
  /** Diisi kalau tabel gagal dibaca — ditampilkan di dashboard admin. */
  error: string | null;
}

async function readFromSupabase(): Promise<Game[]> {
  const [gamesResponse, itemsResponse] = await Promise.all([
    supabaseFetch("games?select=*&order=sort_order.asc"),
    supabaseFetch("game_items?select=*&order=sort_order.asc"),
  ]);

  const rows = (await gamesResponse.json()) as GameRow[];
  const itemRows = (await itemsResponse.json()) as ItemRow[];

  return rows.map((row) =>
    toGame(
      row,
      itemRows.filter((item) => item.game_id === row.id),
    ),
  );
}

async function readFromFile(): Promise<Game[] | null> {
  try {
    const raw = await fs.readFile(CATALOG_FILE, "utf8");
    const parsed = JSON.parse(raw) as { games?: Game[] };
    return parsed.games ?? null;
  } catch {
    return null;
  }
}

/** Selalu baca langsung dari sumbernya — untuk halaman admin. */
export async function getCatalogSnapshot(): Promise<CatalogSnapshot> {
  const fallback = await readFromFile();

  if (isSupabaseConfigured()) {
    try {
      const games = await readFromSupabase();
      if (games.length > 0) return { games, error: null };
      // Tabel masih kosong: pakai isi lokal/awal sampai admin menyimpan.
      return { games: fallback ?? GAMES, error: null };
    } catch (error) {
      return {
        games: fallback ?? GAMES,
        error: `Gagal membaca katalog dari Supabase: ${errorMessage(error)}`,
      };
    }
  }

  return { games: fallback ?? GAMES, error: null };
}

export async function readCatalog(): Promise<Game[]> {
  return (await getCatalogSnapshot()).games;
}

async function writeToSupabase(games: Game[]) {
  // Ganti utuh katalognya: cukup untuk satu admin, dan menghindari
  // perbedaan antara daftar di form dan isi tabel.
  const gameRows = games.map((game, index) => ({
    id: game.id,
    name: game.name,
    card_title: game.cardTitle,
    publisher: game.publisher,
    currency: game.currency,
    category: game.category,
    image: game.image,
    image_width: game.imageWidth,
    image_height: game.imageHeight,
    image_alt: game.imageAlt,
    needs_zone: game.needsZone,
    id_hint: game.idHint,
    description: game.description,
    sort_order: index,
    updated_at: new Date().toISOString(),
  }));

  const itemRows = games.flatMap((game) =>
    game.items.map((item: TopUpItem, index: number) => ({
      game_id: game.id,
      label: item.label,
      price: item.price,
      sort_order: index,
    })),
  );

  if (gameRows.length > 0) {
    await supabaseFetch("games", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(gameRows),
    });
  }

  // Hapus game yang sudah tidak ada di daftar (item ikut terhapus lewat FK cascade).
  const keepIds = games.map((game) => game.id);
  const notIn = keepIds.length > 0 ? `&id=not.in.(${keepIds.join(",")})` : "";
  await supabaseFetch(`games?select=id${notIn}`, { method: "DELETE" });

  // Tulis ulang nominalnya supaya urutan dan harga persis seperti di form.
  if (games.length > 0) {
    const inGames = `game_id=in.(${keepIds.join(",")})`;
    await supabaseFetch(`game_items?select=id&${inGames}`, { method: "DELETE" });
  }
  if (itemRows.length > 0) {
    await supabaseFetch("game_items", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(itemRows),
    });
  }
}

async function writeToFile(games: Game[]) {
  await fs.mkdir(path.dirname(CATALOG_FILE), { recursive: true });
  await fs.writeFile(CATALOG_FILE, `${JSON.stringify({ games }, null, 2)}\n`, "utf8");
}

export async function writeCatalog(games: Game[]): Promise<void> {
  if (isSupabaseConfigured()) {
    await writeToSupabase(games);
    return;
  }

  try {
    await writeToFile(games);
  } catch {
    throw new Error(
      "Filesystem di server ini read-only. Sambungkan Supabase supaya perubahan katalog bisa disimpan.",
    );
  }
}
