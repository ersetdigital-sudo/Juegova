import Link from "next/link";
import { getCatalogSnapshot } from "@/lib/content/catalog";
import { getContentSnapshot } from "@/lib/content/store";
import { formatRupiah } from "@/lib/format";
import { getStartingPrice } from "@/lib/games";
import { listOrders } from "@/lib/orders/store";
import { ORDER_STATUS_LABEL } from "@/lib/orders/status";

export const metadata = { title: "Ringkasan", robots: { index: false, follow: false } };

export default async function AdminDashboardPage() {
  const [content, catalog, orders] = await Promise.all([
    getContentSnapshot(),
    getCatalogSnapshot(),
    listOrders(5),
  ]);

  const games = catalog.games;
  const totalItems = games.reduce((sum, game) => sum + game.items.length, 0);
  const pendingOrders = orders.filter((order) => order.status === "menunggu").length;

  const stats = [
    { label: "Game", value: games.length, href: "/admin/katalog" },
    { label: "Baris harga", value: totalItems, href: "/admin/katalog" },
    { label: "Pesanan terbaru", value: orders.length, href: "/admin/pesanan" },
    { label: "Banner hero", value: content.content.heroSlides.length, href: "/admin/banner" },
    { label: "Ulasan", value: content.content.testimonials.length, href: "/admin/ulasan" },
  ];

  return (
    <>
      <header>
        <h1 className="text-lg font-extrabold text-slate-900">Ringkasan</h1>
        <p className="mt-1 text-xs text-slate-500">
          Semua konten halaman publik bisa diubah dari sini, dan pesanan masuk tercatat di database.
        </p>
      </header>

      {catalog.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {catalog.error}
        </p>
      ) : null}

      {pendingOrders > 0 ? (
        <Link
          href="/admin/pesanan"
          className="block rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800"
        >
          <b>{pendingOrders} pesanan</b> masih menunggu pembayaran. Klik untuk melihat.
        </Link>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300"
          >
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-[11px] font-bold text-slate-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-extrabold text-slate-800">Harga termurah per game</h2>
          <span className="ml-auto text-[11px] text-slate-400">tabel games + game_items</span>
        </header>
        <ul className="divide-y divide-slate-100">
          {games.map((game) => (
            <li key={game.id} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">{game.name}</p>
                <p className="text-[11px] text-slate-400">{game.items.length} nominal</p>
              </div>
              <span className="ml-auto text-xs font-bold text-blue-600">
                {formatRupiah(getStartingPrice(game))}
              </span>
              <Link
                href={`/admin/katalog/${game.id}`}
                className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
              >
                Kelola
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-extrabold text-slate-800">Pesanan terbaru</h2>
          <Link
            href="/admin/pesanan"
            className="ml-auto text-[11px] font-bold text-blue-600 hover:underline"
          >
            Lihat semua
          </Link>
        </header>
        {orders.length === 0 ? (
          <p className="px-5 py-4 text-xs text-slate-400">
            Belum ada pesanan. Pesanan tercatat otomatis begitu ada yang menekan “Beli Sekarang”.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <span className="mono text-[11px] font-bold text-slate-700">{order.invoice}</span>
                <span className="truncate text-xs text-slate-600">
                  {order.gameName} · {order.itemLabel}
                </span>
                <span className="ml-auto text-xs font-bold text-slate-800">
                  {formatRupiah(order.total)}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
