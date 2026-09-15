import Image from "next/image";
import Link from "next/link";
import { saveCatalog } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
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
      <AdminPageHeader
        title="Katalog & Harga"
        description={`${games.length} game dengan total ${games.reduce(
          (sum, game) => sum + game.items.length,
          0,
        )} nominal. Klik “Kelola” untuk mengubah informasi game, nominal, dan harganya.`}
        action={
          <NewGameButton games={games} categories={content.content.categories} action={saveCatalog} />
        }
      />

      {catalog.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-xs text-rose-700">
          {catalog.error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ul className="divide-y divide-slate-100">
          {games.map((game) => (
            <li
              key={game.id}
              className="flex flex-wrap items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50/70"
            >
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
