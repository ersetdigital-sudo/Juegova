import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { ClockBadgeIcon, BadgeCheckIcon, InboxIcon, WalletIcon } from "@/components/ui/Icon";
import { cx } from "@/lib/cx";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { listOrders } from "@/lib/orders/store";
import {
  ORDER_STATUSES,
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABEL,
  isOrderStatus,
} from "@/lib/orders/status";
import type { OrderStatus } from "@/types";

export const metadata = { title: "Pesanan", robots: { index: false, follow: false } };

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

type FilterKey = OrderStatus | "all";

/** Warna tiap status dipakai di filter dan di badge, jadi admin bisa scan cepat. */
const FILTER_STYLE: Record<FilterKey, { active: string; idle: string; dot: string }> = {
  all: {
    active: "border-slate-900 bg-slate-900 text-white",
    idle: "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
    dot: "bg-slate-400",
  },
  menunggu: {
    active: "border-amber-500 bg-amber-500 text-white",
    idle: "border-amber-200 bg-amber-50/60 text-amber-700 hover:border-amber-300",
    dot: "bg-amber-500",
  },
  dibayar: {
    active: "border-blue-600 bg-blue-600 text-white",
    idle: "border-blue-200 bg-blue-50/60 text-blue-700 hover:border-blue-300",
    dot: "bg-blue-500",
  },
  selesai: {
    active: "border-emerald-600 bg-emerald-600 text-white",
    idle: "border-emerald-200 bg-emerald-50/60 text-emerald-700 hover:border-emerald-300",
    dot: "bg-emerald-500",
  },
  batal: {
    active: "border-rose-500 bg-rose-500 text-white",
    idle: "border-rose-200 bg-rose-50/60 text-rose-700 hover:border-rose-300",
    dot: "bg-rose-500",
  },
};

function Metric({
  label,
  value,
  tone,
  Icon,
}: {
  label: string;
  value: number;
  tone: string;
  Icon: (props: { className?: string }) => React.ReactElement;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", tone)}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="display text-2xl font-black text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requested = first(params.status);
  const filter: FilterKey = requested && isOrderStatus(requested) ? requested : "all";

  let orders: Awaited<ReturnType<typeof listOrders>> = [];
  let failed = false;

  try {
    orders = await listOrders(200);
  } catch {
    failed = true;
  }

  const visible = filter === "all" ? orders : orders.filter((order) => order.status === filter);
  const countOf = (status: OrderStatus) =>
    orders.filter((order) => order.status === status).length;

  const revenue = orders
    .filter((order) => order.status === "dibayar" || order.status === "selesai")
    .reduce((sum, order) => sum + order.total, 0);

  const tabs: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: orders.length },
    ...ORDER_STATUSES.map((status) => ({
      key: status as FilterKey,
      label: ORDER_STATUS_LABEL[status],
      count: countOf(status),
    })),
  ];

  return (
    <>
      <AdminPageHeader
        title="Pesanan"
        description="Pesanan tercatat otomatis begitu pelanggan menekan “Beli Sekarang”. Verifikasi pembayaran lalu ubah statusnya di sini."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <span className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-blue-500/5" />
          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white grad shadow-sm shadow-blue-600/30">
              <WalletIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total dibayar
              </p>
              <p className="display truncate text-2xl font-black text-slate-900">
                {formatRupiah(revenue)}
              </p>
            </div>
          </div>
        </div>

        <Metric
          label="Menunggu pembayaran"
          value={countOf("menunggu")}
          tone="bg-amber-50 text-amber-600"
          Icon={ClockBadgeIcon}
        />
        <Metric
          label="Selesai"
          value={countOf("selesai")}
          tone="bg-emerald-50 text-emerald-600"
          Icon={BadgeCheckIcon}
        />
      </div>

      {failed ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-xs text-rose-700">
          Pesanan gagal dimuat. Coba muat ulang halaman ini.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const style = FILTER_STYLE[tab.key];
          const active = filter === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.key === "all" ? "/admin/pesanan" : `/admin/pesanan?status=${tab.key}`}
              className={cx(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all duration-200",
                active ? style.active : style.idle,
              )}
            >
              <span
                className={cx(
                  "h-1.5 w-1.5 rounded-full",
                  active ? "bg-white/80" : style.dot,
                )}
              />
              {tab.label}
              <span className={cx("tabular-nums", active ? "text-white/80" : "text-slate-400")}>
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
            <InboxIcon className="h-7 w-7" />
          </span>
          <p className="mt-4 text-sm font-extrabold text-slate-700">
            {orders.length === 0 ? "Belum ada pesanan masuk" : "Tidak ada pesanan di status ini"}
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
            {orders.length === 0
              ? "Pesanan akan muncul di sini begitu ada pelanggan yang menyelesaikan langkah top up di halaman game."
              : "Coba pilih status lain, atau kembali ke daftar semua pesanan."}
          </p>
          <Link
            href={orders.length === 0 ? "/#kategori" : "/admin/pesanan"}
            target={orders.length === 0 ? "_blank" : undefined}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/25 grad transition-transform hover:brightness-110 active:scale-[.98]"
          >
            {orders.length === 0 ? "Lihat halaman game" : "Lihat semua pesanan"}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((order) => (
            <li
              key={order.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-3.5">
                <span className="mono text-xs font-extrabold text-slate-800">{order.invoice}</span>
                <span
                  className={cx(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
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
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Halaman bayar
                  </Link>
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </div>
              </div>

              <div className="grid gap-4 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Game", value: order.gameName },
                  { label: "Nominal", value: order.itemLabel },
                  { label: "Akun", value: order.accountId, mono: true },
                  { label: "Metode", value: order.paymentMethod },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {row.label}
                    </p>
                    <p
                      className={cx(
                        "mt-0.5 truncate text-xs font-bold text-slate-700",
                        row.mono && "mono",
                      )}
                    >
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-[11px] text-slate-500">
                <span>
                  Subtotal <b className="text-slate-700">{formatRupiah(order.subtotal)}</b>
                </span>
                <span>
                  Biaya <b className="text-slate-700">{formatRupiah(order.fee)}</b>
                </span>
                <span>
                  Diskon <b className="text-slate-700">{formatRupiah(order.discount)}</b>
                </span>
                <span className="ml-auto text-xs">
                  Total{" "}
                  <b className="display text-base font-black text-blue-600">
                    {formatRupiah(order.total)}
                  </b>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
