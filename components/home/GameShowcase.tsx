"use client";

import { useMemo, useState } from "react";
import { ArrowRightIcon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cx } from "@/lib/cx";
import type { Game, GameCategory, SectionCopy } from "@/types";
import { GameCard } from "./GameCard";

/** Sentinel untuk chip "Semua" — id kategori lain datang dari data admin. */
const ALL_CATEGORIES = "all";

type Filter = string;

interface GameShowcaseProps {
  games: Game[];
  /** Hanya kategori yang punya game — chip kosong tidak ditampilkan. */
  categories: GameCategory[];
  heading: SectionCopy;
}

const CHIP_BASE = "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap";

export function GameShowcase({ games, categories, heading }: GameShowcaseProps) {
  const [filter, setFilter] = useState<Filter>(ALL_CATEGORIES);

  const visibleGames = useMemo(
    () =>
      filter === ALL_CATEGORIES
        ? games
        : games.filter((game) => game.category === filter),
    [filter, games],
  );

  const chips: { id: Filter; label: string }[] = [
    { id: ALL_CATEGORIES, label: "Semua" },
    ...categories.map((category) => ({ id: category.id, label: category.label })),
  ];

  return (
    <section id="kategori">
      <div className="flex flex-wrap items-end gap-4">
        <div className="mr-auto">
          <h2 className="display text-2xl md:text-3xl font-extrabold">{heading.title}</h2>
          <p className="text-sm text-slate-500 mt-1">{heading.subtitle}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 overflow-x-auto no-bar pb-1">
        {chips.map((chip) => {
          const isActive = chip.id === filter;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id)}
              aria-pressed={isActive}
              className={cx(
                CHIP_BASE,
                isActive ? "text-white grad" : "bg-slate-100 text-slate-600 hover:bg-slate-50",
              )}
            >
              {chip.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setFilter(ALL_CATEGORIES)}
          className="ml-auto hidden sm:inline-flex items-center gap-1 text-xs font-bold text-blue-600 whitespace-nowrap"
        >
          Lihat Semua
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {visibleGames.map((game, index) => (
          <Reveal key={game.id} delay={index * 0.05}>
            <GameCard game={game} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
