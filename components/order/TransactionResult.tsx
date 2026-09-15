import Link from "next/link";
import { ClockBadgeIcon, SearchIcon } from "@/components/ui/Icon";
import { cx } from "@/lib/cx";
import { formatDateTime, formatRupiah } from "@/lib/format";
import {
  ORDER_STATUS_CUSTOMER_CLASS,
  ORDER_STATUS_CUSTOMER_LABEL,
} from "@/lib/orders/status";
import type { Order } from "@/types";

const ROW = "min-w-0";

export function TransactionResult({ order }: { order: Order }) {
  const rows = [
    { label: "Game", value: order.gameName },
    { label: "Item", value: order.itemLabel },
    { label: "Tujuan", value: order.accountId, mono: true },
    { label: "Metode pembayaran", value: order.paymentMethod },
    { label: "Waktu transaksi", value: formatDateTime(new Date(order.createdAt)) },
  ];

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4 sm:px-6">
        <div className="mr-auto min-w-0">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Order ID
          </p>
          <p className="mono truncate text-base font-extrabold text-slate-900">{order.invoice}</p>
        </div>
        <span
          className={cx(
            "rounded-full border px-3 py-1 text-[11px] font-bold",
            ORDER_STATUS_CUSTOMER_CLASS[order.status],
          )}
        >
          {ORDER_STATUS_CUSTOMER_LABEL[order.status]}
        </span>
      </header>

      <dl className="grid gap-x-6 gap-y-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
        {rows.map((row) => (
          <div key={row.label} className={ROW}>
            <dt className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {row.label}
            </dt>
            <dd className={cx("mt-0.5 text-sm font-bold text-slate-800", row.mono && "mono")}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
        <span className="text-sm text-slate-500">Total</span>
        <span className="display ml-auto text-2xl font-black text-blue-600">
          {formatRupiah(order.total)}
        </span>
      </div>

      {order.status === "menunggu" ? (
        <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
          <Link
            href={`/pembayaran/${encodeURIComponent(order.invoice)}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/25 transition-transform grad hover:brightness-110 active:scale-[.98] sm:w-auto"
          >
            Lanjutkan Pembayaran
          </Link>
          <p className="mt-2 text-[11px] text-slate-500">
            Pesanan ini belum dibayar. Selesaikan sebelum waktunya habis.
          </p>
        </div>
      ) : null}
    </section>
  );
}

export function TransactionNotFound({ invoice }: { invoice: string }) {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        <SearchIcon className="h-6 w-6" />
      </span>
      <p className="mt-4 text-sm font-extrabold text-slate-700">Transaksi tidak ditemukan</p>
      <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-slate-500">
        Periksa kembali Order ID kamu — pastikan tidak ada huruf yang tertukar. Formatnya seperti{" "}
        <span className="mono font-bold text-slate-600">JGV-260915-4821</span>.
      </p>
      <p className="mono mt-3 text-[11px] text-slate-400">Yang dicari: {invoice}</p>
      <Link
        href="/#bantuan"
        className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
      >
        <ClockBadgeIcon className="h-3.5 w-3.5" />
        Butuh bantuan? Hubungi CS
      </Link>
    </div>
  );
}
