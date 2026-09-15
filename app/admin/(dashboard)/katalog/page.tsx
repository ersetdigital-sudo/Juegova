import Image from "next/image";
import Link from "next/link";
import { saveContentPatch } from "@/app/admin/actions";
import { NewGameButton } from "@/components/admin/NewGameButton";
import { formatRupiah } from "@/lib/format";
import { getStartingPrice } from "@/lib/games";
import { getContentSnapshot } from "@/lib/content/store";

export const metadata = { title: "Katalog & Harga", robots: { index: false, follow: false } };

export default async function AdminCatalogPage() {
  const { content } = await getContentSnapshot();

  return (
    <>
      <header className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-lg font-extrabold text-slate-900">Katalog & Harga</h1>
          <p className="mt-1 text-xs text-slate-500">
            {content.games.length} game terdaftar. Klik “Kelola” untuk mengubah nominal dan harga.
          </p>
        </div>
        <NewGameButton games={content.games} categories={content.categories} action={saveContentPatch} />
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <ul className="divide-y divide-slate-100">
          {content.games.map((game) => (
            <li key={game.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <Image
                src={game.image}
                alt={game.imageAlt || game.name}
                width={game.imageWidth || 1200}
                height={game.imageHeight || 896}
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">{game.cardTitle}</p>
                <p className="truncate text-[11px] text-slate-400">
                  {game.name} · /game/{game.id}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs font-extrabold text-blue-600">
                  {formatRupiah(getStartingPrice(game))}
                </p>
                <p className="text-[11px] text-slate-400">{game.items.length} nominal</p>
              </div>
              <Link
                href={`/admin/katalog/${game.id}`}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
              >
                Kelola
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
