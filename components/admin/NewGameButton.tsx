"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { ActionResult } from "@/components/admin/fields";
import type { Game, GameCategory } from "@/types";

type AnyRecord = Record<string, unknown>;

interface NewGameButtonProps {
  games: Game[];
  categories: GameCategory[];
  action: (patch: AnyRecord) => Promise<ActionResult>;
}

export function NewGameButton({ games, categories, action }: NewGameButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const create = () => {
    const slug = `game-baru-${Date.now().toString(36)}`;

    const draft: Game = {
      id: slug,
      name: "Game Baru",
      cardTitle: "Game Baru",
      publisher: "",
      currency: "Diamond",
      category: categories[0]?.id ?? "",
      image: "/images/og-cover.jpg",
      imageWidth: 1200,
      imageHeight: 896,
      imageAlt: "Sampul Game Baru",
      needsZone: false,
      idHint: "",
      description: "",
      items: [{ label: "5 Diamond", price: 1000 }],
    };

    startTransition(async () => {
      const result = await action({ games: [...games, draft] });
      if (result.ok) router.push(`/admin/katalog/${slug}`);
    });
  };

  return (
    <button
      type="button"
      onClick={create}
      disabled={pending}
      className="rounded-full grad px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
    >
      {pending ? "Menambahkan..." : "+ Tambah game"}
    </button>
  );
}
