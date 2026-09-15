"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { formatRupiah } from "@/lib/format";
import type { ActionResult, FieldDef } from "@/components/admin/fields";
import type { Game, GameCategory } from "@/types";
import { FieldGrid, Panel, SaveButton, StatusText } from "./fields";

const ITEM_FIELDS: FieldDef[] = [
  { name: "label", label: "Nama nominal", type: "text", placeholder: "86 Diamond" },
  { name: "price", label: "Harga (Rupiah)", type: "number", placeholder: "22000" },
];

interface GameEditorProps {
  games: Game[];
  gameIndex: number;
  categories: GameCategory[];
  /** Server action app/admin/actions.ts yang menulis ke tabel games/game_items. */
  action: (games: Game[]) => Promise<ActionResult>;
}

export function GameEditor({ games, gameIndex, categories, action }: GameEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<Game[]>(games);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const game = draft[gameIndex];
  if (!game) return null;

  const gameFields: FieldDef[] = [
    {
      name: "isActive",
      label: "Tampilkan di situs",
      type: "toggle",
      help: "Kalau dimatikan, game ini hilang dari beranda, daftar game, dan pencarian. Datanya tetap tersimpan di sini lengkap dengan harga, jadi bisa dinyalakan lagi kapan saja.",
    },
    { name: "name", label: "Nama lengkap", type: "text", help: "Dipakai untuk judul halaman & breadcrumb." },
    { name: "cardTitle", label: "Nama di kartu", type: "text", help: "Versi pendek untuk kartu di beranda." },
    { name: "publisher", label: "Publisher", type: "text" },
    { name: "currency", label: "Mata uang", type: "text", placeholder: "Diamond" },
    {
      name: "category",
      label: "Kategori",
      type: "select",
      options: categories.map((category) => ({ value: category.id, label: category.label })),
    },
    { name: "id", label: "Slug URL", type: "text", help: "Mengubah ini mengubah alamat halaman (/game/slug)." },
    {
      name: "image",
      label: "Gambar sampul",
      type: "image",
      placeholder: "/images/nama-file.webp",
      sizeFields: { width: "imageWidth", height: "imageHeight" },
      help: "Idealnya 1200x896 px. Ukuran terisi otomatis setelah upload.",
    },
    { name: "imageAlt", label: "Alt text gambar", type: "text" },
    { name: "imageWidth", label: "Lebar gambar asli (px)", type: "number" },
    { name: "imageHeight", label: "Tinggi gambar asli (px)", type: "number" },
    { name: "needsZone", label: "Butuh Server/Zone ID", type: "toggle", help: "Tampilkan kolom Server / Zone ID di form top up." },
    { name: "idHint", label: "Petunjuk letak User ID", type: "textarea", wide: true },
    { name: "description", label: "Deskripsi game", type: "textarea", wide: true },
  ];

  const mutateGame = (name: string, value: unknown) => {
    setDraft((current) =>
      current.map((entry, index) =>
        index === gameIndex ? ({ ...entry, [name]: value } as Game) : entry,
      ),
    );
    setStatus(null);
  };

  const mutateItems = (items: Game["items"]) => {
    setDraft((current) =>
      current.map((entry, index) => (index === gameIndex ? { ...entry, items } : entry)),
    );
    setStatus(null);
  };

  const save = (next: Game[], message?: string) =>
    startTransition(async () => {
      const result = await action(next);
      setStatus(result.ok && message ? { ok: true, message } : result);
      if (result.ok) router.refresh();
    });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    save(draft);
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= game.items.length) return;
    const items = [...game.items];
    const [moved] = items.splice(index, 1);
    items.splice(target, 0, moved);
    mutateItems(items);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Image
          src={game.image}
          alt={game.imageAlt || game.name}
          width={game.imageWidth || 1200}
          height={game.imageHeight || 896}
          className="h-14 w-14 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-slate-900">{game.name}</p>
          <p className="text-xs text-slate-500">
            {game.items.length} nominal · /game/{game.id}
          </p>
        </div>
      </div>

      <Panel
        title="Informasi game"
        description="Perubahan baru tampil di situs setelah tombol simpan ditekan."
        footer={
          <>
            <SaveButton pending={pending} />
            <StatusText status={status} />
          </>
        }
      >
        <FieldGrid
          fields={gameFields}
          values={game as unknown as Record<string, unknown>}
          onChange={mutateGame}
        />
      </Panel>

      <Panel
        title="Nominal & harga"
        description="Harga diisi angka penuh tanpa titik, contoh 22000."
        footer={
          <>
            <SaveButton
              pending={pending}
              label="Simpan nominal"
            />
            <StatusText status={status} />
            <span className="ml-auto text-[11px] text-slate-400">
              {game.items.length} nominal
            </span>
          </>
        }
      >
        <div className="space-y-2">
          {game.items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="flex flex-wrap items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
            >
              <div className="w-40 flex-1 space-y-1">
                <label className="block text-[11px] font-bold text-slate-500">Nama nominal</label>
                <input
                  value={item.label}
                  onChange={(event) =>
                    mutateItems(
                      game.items.map((entry, position) =>
                        position === index ? { ...entry, label: event.target.value } : entry,
                      ),
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm shadow-sm transition-colors outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div className="w-36 space-y-1">
                <label className="block text-[11px] font-bold text-slate-500">Harga (Rp)</label>
                <input
                  type="number"
                  value={item.price}
                  onChange={(event) =>
                    mutateItems(
                      game.items.map((entry, position) =>
                        position === index
                          ? { ...entry, price: Number(event.target.value) }
                          : entry,
                      ),
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm shadow-sm transition-colors outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <span className="pb-2 text-xs font-bold text-blue-600">
                {formatRupiah(item.price)}
              </span>
              <div className="flex items-center gap-1 pb-1">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  aria-label="Naikkan"
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:shadow-none"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === game.items.length - 1}
                  aria-label="Turunkan"
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:shadow-none"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => mutateItems(game.items.filter((_, position) => position !== index))}
                  aria-label="Hapus nominal"
                  className="rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-bold text-rose-600 shadow-sm transition-colors hover:bg-rose-50"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => mutateItems([...game.items, { label: "Nominal baru", price: 0 }])}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          + Tambah nominal
        </button>
      </Panel>

      <section className="overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/60 shadow-sm">
        <div className="px-5 py-5">
          <h2 className="text-sm font-extrabold text-rose-700">Hapus game</h2>
          <p className="mt-1 text-xs leading-relaxed text-rose-600">
            Menghapus game juga menghapus semua nominal dan halaman publiknya. Tindakan ini tidak
            bisa dibatalkan.
          </p>
          <button
            type="button"
            onClick={() => {
              const next = draft.filter((_, index) => index !== gameIndex);
              startTransition(async () => {
                const result = await action(next);
                if (result.ok) router.push("/admin/katalog");
                else setStatus(result);
              });
            }}
            disabled={pending}
            className="mt-3 rounded-full bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-rose-600/25 transition-transform hover:brightness-110 active:scale-[.98] disabled:opacity-60"
          >
            Hapus game ini
          </button>
        </div>
      </section>
    </form>
  );
}
