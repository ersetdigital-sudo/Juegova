import { DEFAULT_GAME_ID, GAME_CATEGORIES, GAMES } from "@/data/games";
import type { Game, GameCategory } from "@/types";

export const getAllGames = (): Game[] => GAMES;

export const getGameIds = (): string[] => GAMES.map((game) => game.id);

export const getGamePath = (id: string) => `/game/${id}`;

/** Id game yang dipakai kalau URL lama tidak menyertakan parameter apa pun. */
export const defaultGameId = DEFAULT_GAME_ID;

export const findGame = (id: string | null | undefined): Game | undefined =>
  GAMES.find((game) => game.id === id);

/** Kategori yang urutannya mengikuti GAME_CATEGORIES tapi hanya yang punya game. */
export function getCategoriesInUse(games: Game[] = GAMES): GameCategory[] {
  return GAME_CATEGORIES.filter((category) =>
    games.some((game) => game.category === category.id),
  );
}

/** Harga item termurah — dipakai untuk label "Mulai dari ..." di kartu game. */
export const getStartingPrice = (game: Game) =>
  game.items.reduce((min, item) => Math.min(min, item.price), Number.POSITIVE_INFINITY);

export const getPriceRange = (game: Game) => ({
  low: getStartingPrice(game),
  high: game.items.reduce((max, item) => Math.max(max, item.price), 0),
});
