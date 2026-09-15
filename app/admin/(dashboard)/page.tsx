import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Metric } from "@/components/admin/Metric";
import {
  BadgeCheckIcon,
  ClockBadgeIcon,
  GamepadIcon,
  ReceiptIcon,
  WalletIcon,
} from "@/components/ui/Icon";
import { cx } from "@/lib/cx";
import { getCatalogSnapshot } from "@/lib/content/catalog";
import { getContentSnapshot } from "@/lib/content/store";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { getStartingPrice } from "@/lib/games";
import { ORDER_STATUS_CLASS, ORDER_STATUS_LABEL } from "@/lib/orders/status";
import { listOrders } from "@/lib/orders/store";

export const metadata = { title: "Ringkasan", robots: { index: false, follow: false } };

const CARD = "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm";

export default async function AdminDashboardPage() {
  const [content, catalog, orders] = await Promise.all([
    getContentSnapshot(),
    getCatalogSnapshot(),
    listOrders(5),
  ]);

  const games = catalog.games;
  const initialOrders = await listOrders(200).catch(() => []);
  const pending = initialOrders.filter((order) => order.status === "menunggu").length;
  const revenue = initialOrders
    .filter((order) => order.status === "dibayar" || order.status === "selesai")
    .reduce((sum, order) => sum + order.total, 0);
  const items = games.reduce((sum, game) => sum + game.items.length, 0);

  return (
    <>
      <AdminPageHeader
        title="Ringkasan"
        description="Pantau pesanan masuk dan kelola isi situs dari satu tempat."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total dibayar"
          value={formatRupiah(revenue)}
          Icon={WalletIcon}
          tone=""
          featured
        />
        <Metric
          label="Menunggu"
          value={pending}
          Icon={ClockBadgeIcon}
          tone="bg-amber-50 text-amber-600"
          hint="perlu diverifikasi"
        />
        <Metric
          label="Game aktif"
          value={games.length}
          Icon={GamepadIcon}
          tone="bg-blue-50 text-blue-600"
          hint={`${items} nominal`}
        />
        <Metric
          label="Pesanan"
          value={initialOrders.length}
          Icon={ReceiptIcon}
          tone="bg-emerald-50 text-emerald-600"
          hint="total tercatat"
        />
      </div>

      {pending > 0 ? (
        <Link
          href="/admin/pesanan?status=menunggu"
          className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-xs text-amber-800 transition-colors hover:bg-amber-100/70"
        >
          <ClockBadgeIcon className="mt-px h-4 w-4 shrink-0" />
          <p>
            <b>{pending} pesanan</b> masih menunggu pembayaran. Buka daftarnya untuk cek dan ubah
            status.
          </p>
        </Link>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className={CARD}>
          <header className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <GamepadIcon className="h-4 w-4" />
            </span>
            <h2 className="mr-auto text-sm font-extrabold text-slate-800">Harga per game</h2>
            <Link
              href="/admin/katalog"
              className="text-[11px] font-bold text-blue-600 hover:underline"
            >
              Kelola
            </Link>
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
              </li>
            ))}
          </ul>
        </section>

        <section className={CARD}>
          <header className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
              <ReceiptIcon className="h-4 w-4" />
            </span>
            <h2 className="mr-auto text-sm font-extrabold text-slate-800">Pesanan terbaru</h2>
            <Link
              href="/admin/pesanan"
              className="text-[11px] font-bold text-blue-600 hover:underline"
            >
              Lihat semua
            </Link>
          </header>

          {orders.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <BadgeCheckIcon className="h-6 w-6" />
              </span>
              <p className="mt-3 text-xs font-bold text-slate-600">Belum ada pesanan masuk</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Akan muncul otomatis begitu ada yang top up.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {orders.map((order) => (
                <li key={order.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="mono text-[11px] font-bold text-slate-700">{order.invoice}</p>
                    <p className="truncate text-[11px] text-slate-400">
                      {order.gameName} · {order.itemLabel} ·{" "}
                      {formatDateTime(new Date(order.createdAt))}
                    </p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-slate-800">
                    {formatRupiah(order.total)}
                  </span>
                  <span
                    className={cx(
                      "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                      ORDER_STATUS_CLASS[order.status],
                    )}
                  >
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {content.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-xs text-rose-700">
          Sebagian data gagal dimuat, jadi yang tampil mungkin sudah tidak sesuai.
        </p>
      ) : null}
    </>
  );
}
