import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { Badge, Game } from "@/types";

export function GameBanner({ game, badges }: { game: Game; badges: Badge[] }) {
  return (
    <section className="mt-3 rounded-3xl overflow-hidden relative glow bg-slate-900 min-h-[220px] md:min-h-[260px]">
      <Image
        src={game.image}
        alt={`Latar sampul ${game.name}`}
        width={game.imageWidth}
        height={game.imageHeight}
        priority
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#1f2833]/90 to-[#1d4ed8]/55" />

      <div className="relative p-6 md:p-9 flex flex-col md:flex-row items-start md:items-end gap-5">
        <Image
          src={game.image}
          alt={game.imageAlt}
          width={game.imageWidth}
          height={game.imageHeight}
          className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-white/25 shadow-2xl"
        />
        <div>
          <p className="text-[11px] font-extrabold tracking-[.2em] text-amber-300">
            TOP UP RESMI &amp; INSTAN
          </p>
          <h1 className="display text-3xl md:text-5xl font-black text-white leading-tight">
            {game.name}
          </h1>
          <p className="text-sm text-slate-300 mt-1">{game.publisher}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white"
              >
                <Icon name={badge.icon} className="w-3.5 h-3.5" />
                {badge.label}
              </span>
            ))}
          </div>
        </div>
        <p className="scribble text-white/85 text-xl md:ml-auto">Play · Top Up · Level Up</p>
      </div>
    </section>
  );
}
