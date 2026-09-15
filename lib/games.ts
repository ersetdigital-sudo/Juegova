import type { Game, GameCategory } from "@/types";

export const getGamePath = (id: string) => `/game/${id}`;

export const findGame = (games: Game[], id: string | null | undefined) =>
  games.find((game) => game.id === id);

export const getGameIds = (games: Game[]) => games.map((game) => game.id);

/** Kategori yang urutannya mengikuti daftar kategori tapi hanya yang punya game. */
export function getCategoriesInUse(games: Game[], categories: GameCategory[]): GameCategory[] {
  return categories.filter((category) => games.some((game) => game.category === category.id));
}

/** Harga item termurah — dipakai untuk label "Mulai dari ..." di kartu game. */
export function getStartingPrice(game: Game) {
  if (game.items.length === 0) return 0;
  return Math.min(...game.items.map((item) => item.price));
}

export function getPriceRange(game: Game) {
  if (game.items.length === 0) return { low: 0, high: 0 };
  const prices = game.items.map((item) => item.price);
  return { low: Math.min(...prices), high: Math.max(...prices) };
}
