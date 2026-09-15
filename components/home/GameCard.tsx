import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/Icon";
import { formatRupiahRange } from "@/lib/format";
import { getGamePath, getStartingPrice } from "@/lib/games";
import type { Game } from "@/types";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={getGamePath(game.id)}
      className="game-card group relative block rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] glow"
    >
      <Image
        src={game.image}
        alt={game.imageAlt}
        width={game.imageWidth}
        height={game.imageHeight}
        sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 400px"
        className="card-img absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-4 flex items-end">
        <div>
          <h3 className="display text-white font-extrabold text-lg leading-tight">
            {game.cardTitle}
          </h3>
          <p className="text-[11px] text-white/70 mt-0.5">
            {formatRupiahRange(getStartingPrice(game))}
          </p>
        </div>
        <span className="ml-auto w-9 h-9 rounded-full bg-white/20 border border-white/40 backdrop-blur flex items-center justify-center text-white group-hover:grad">
          <ArrowRightIcon className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
