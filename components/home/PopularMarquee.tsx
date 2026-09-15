import Link from "next/link";
import { getAllGames, getGamePath } from "@/lib/games";

/**
 * Jumlah salinan track. Harus sama dengan pembagi di @keyframes marquee (app/globals.css),
 * supaya kecepatan gesernya tetap satu daftar per 28 detik berapa pun jumlah game-nya.
 */
const TRACK_COPIES = 4;

export function PopularMarquee() {
  const games = getAllGames();

  const run = games.map((game) => (
    <span key={game.id} className="flex items-center">
      <Link
        href={getGamePath(game.id)}
        className="mx-5 whitespace-nowrap hover:text-amber-300 transition-colors"
      >
        {game.cardTitle.toUpperCase()}
      </Link>
      <span className="text-blue-500/70">•</span>
    </span>
  ));

  return (
    <section className="mt-5 rounded-2xl bg-[#12131a] text-white overflow-hidden">
      <div className="flex items-stretch">
        <div className="shrink-0 self-center pl-4 pr-4 sm:pr-5 border-r border-white/10 py-3">
          <p className="text-[11px] sm:text-xs font-extrabold leading-tight">
            GAME
            <span className="sm:hidden">
              <br />
            </span>
            <span className="hidden sm:inline"> </span>
            POPULER
          </p>
          <p className="hidden sm:block text-[10px] text-white/45">Top up game favorit kamu</p>
        </div>

        <div className="marquee flex-1 py-3.5">
          <div className="marquee-track text-[12px] sm:text-[13px] font-extrabold tracking-wide text-white/70">
            {Array.from({ length: TRACK_COPIES }, (_, copyIndex) => (
              <div key={copyIndex} className="marquee-run" aria-hidden={copyIndex > 0}>
                {run}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
