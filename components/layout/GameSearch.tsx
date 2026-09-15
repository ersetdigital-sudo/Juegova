"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { getGamePath } from "@/lib/games";
import type { Game } from "@/types";

interface GameSearchProps {
  games: Game[];
  /** desktop = kolom di header, mobile = kolom di dalam menu mobile. */
  variant?: "desktop" | "mobile";
}

export function GameSearch({ games, variant = "desktop" }: GameSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return games;
    return games.filter((game) =>
      `${game.name} ${game.cardTitle} ${game.publisher} ${game.currency}`
        .toLowerCase()
        .includes(term),
    );
  }, [games, query]);

  // Badge "Ctrl K" di HTML asli cuma hiasan — di sini benar-benar berfungsi.
  useEffect(() => {
    if (variant !== "desktop") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [variant]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const select = (id: string) => {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(getGamePath(id));
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const first = results[0];
      if (first) select(first.id);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={cx(
        "relative",
        variant === "desktop" && "hidden md:flex flex-1 max-w-xl mx-auto",
      )}
    >
      <label className="w-full relative block">
        <svg
          className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
          placeholder="Cari game atau item yang ingin kamu top up..."
          aria-label="Cari game"
          className={cx(
            "w-full bg-slate-100 rounded-full pl-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300",
            variant === "desktop" ? "pr-16" : "pr-4",
          )}
        />
        {variant === "desktop" ? (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-md px-2 py-0.5 pointer-events-none">
            Ctrl K
          </span>
        ) : null}
      </label>

      {open ? (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500">
              Game &quot;{query}&quot; belum tersedia.
            </p>
          ) : (
            results.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => select(game.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
              >
                <Image
                  src={game.image}
                  alt={game.imageAlt}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-800 truncate">
                    {game.cardTitle}
                  </span>
                  <span className="block text-[11px] text-slate-500 truncate">
                    {game.publisher}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
