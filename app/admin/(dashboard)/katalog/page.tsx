import Image from "next/image";
import Link from "next/link";
import { saveCatalog } from "@/app/admin/actions";
import { NewGameButton } from "@/components/admin/NewGameButton";
import { getContentSnapshot } from "@/lib/content/store";
import { getCatalogSnapshot } from "@/lib/content/catalog";
import { formatRupiah } from "@/lib/format";
import { getStartingPrice } from "@/lib/games";

export const metadata = { title: "Katalog & Harga", robots: { index: false, follow: false } };

export default async function AdminCatalogPage() {
  const [catalog, content] = await Promise.all([getCatalogSnapshot(), getContentSnapshot()]);
  const { games } = catalog;

  return (
    <>
      <header className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-lg font-extrabold text-slate-900">Katalog &amp; Harga</h1>
          <p className="mt-1 text-xs text-slate-500">
            {games.length} game terdaftar di tabel <code className="rounded bg-slate-100 px-1">games</code>{" "}
            dan{" "}
            <code className="rounded bg-slate-100 px-1">
              {games.reduce((sum, game) => sum + game.items.length, 0)}
            </code>{" "}
            baris harga di tabel <code className="rounded bg-slate-100 px-1">game_items</code>.
          </p>
        </div>
        <NewGameButton games={games} categories={content.content.categories} action={saveCatalog} />
      </header>

      {catalog.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {catalog.error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <ul className="divide-y divide-slate-100">
          {games.map((game) => (
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
