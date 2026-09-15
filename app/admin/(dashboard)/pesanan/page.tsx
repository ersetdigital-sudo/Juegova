import Link from "next/link";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { cx } from "@/lib/cx";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { listOrders } from "@/lib/orders/store";
import { ORDER_STATUSES, ORDER_STATUS_CLASS, ORDER_STATUS_LABEL, isOrderStatus } from "@/lib/orders/status";
import { isSupabaseConfigured } from "@/lib/content/config";

export const metadata = { title: "Pesanan", robots: { index: false, follow: false } };

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requested = first(params.status);
  const filter = requested && isOrderStatus(requested) ? requested : null;

  let orders: Awaited<ReturnType<typeof listOrders>> = [];
  let error: string | null = null;

  try {
    orders = await listOrders(200);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Gagal membaca pesanan.";
  }

  const visible = filter ? orders.filter((order) => order.status === filter) : orders;

  const counts = ORDER_STATUSES.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));

  const revenue = orders
    .filter((order) => order.status === "dibayar" || order.status === "selesai")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <>
      <header>
        <h1 className="text-lg font-extrabold text-slate-900">Pesanan</h1>
        <p className="mt-1 text-xs text-slate-500">
          {isSupabaseConfigured() ? (
            <>
              Tersimpan di tabel <code className="rounded bg-slate-100 px-1">orders</code>. Pesanan
              dibuat otomatis saat pelanggan menekan “Beli Sekarang”.
            </>
          ) : (
            "Supabase belum aktif, jadi pesanan hanya tersimpan di file lokal."
          )}
        </p>
      </header>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </p>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/pesanan"
            className={cx(
              "rounded-full px-3 py-1.5 text-[11px] font-bold",
              filter === null
                ? "bg-blue-600 text-white"
                : "border border-slate-300 text-slate-600 hover:bg-slate-50",
            )}
          >
            Semua ({orders.length})
          </Link>
          {counts.map(({ status, count }) => (
            <Link
              key={status}
              href={`/admin/pesanan?status=${status}`}
              className={cx(
                "rounded-full px-3 py-1.5 text-[11px] font-bold",
                filter === status
                  ? "bg-blue-600 text-white"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-50",
              )}
            >
              {ORDER_STATUS_LABEL[status]} ({count})
            </Link>
          ))}
          <span className="ml-auto text-xs font-bold text-slate-700">
            Total dibayar: {formatRupiah(revenue)}
          </span>
        </div>
      </section>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white px-5 py-6 text-center text-xs text-slate-400">
          {orders.length === 0
            ? "Belum ada pesanan masuk."
            : "Tidak ada pesanan dengan status ini."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {visible.map((order) => (
              <li key={order.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="mono text-xs font-extrabold text-slate-800">
                    {order.invoice}
                  </span>
                  <span
                    className={cx(
                      "rounded-full border px-2 py-0.5 text-[10px] font-bold",
                      ORDER_STATUS_CLASS[order.status],
                    )}
                  >
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatDateTime(new Date(order.createdAt))}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <Link
                      href={`/pembayaran/${encodeURIComponent(order.invoice)}`}
                      target="_blank"
                      className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Halaman bayar
                    </Link>
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </div>
                </div>

                <dl className="mt-3 grid gap-x-6 gap-y-1 text-[11px] sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="text-slate-400">Game</dt>
                    <dd className="font-bold text-slate-700">{order.gameName}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Nominal</dt>
                    <dd className="font-bold text-slate-700">{order.itemLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Akun</dt>
                    <dd className="mono font-bold text-slate-700">{order.accountId}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Metode</dt>
                    <dd className="font-bold text-slate-700">{order.paymentMethod}</dd>
                  </div>
                </dl>

                <p className="mt-2 text-[11px] text-slate-500">
                  Subtotal {formatRupiah(order.subtotal)} + biaya {formatRupiah(order.fee)} − diskon{" "}
                  {formatRupiah(order.discount)} ={" "}
                  <b className="text-blue-600">{formatRupiah(order.total)}</b>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
