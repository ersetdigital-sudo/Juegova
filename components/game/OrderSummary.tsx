import { BoltIcon } from "@/components/ui/Icon";

interface OrderSummaryProps {
  gameName: string;
  userId: string;
  itemLabel: string;
  paymentName: string;
  total: string;
  error: string | null;
  onBuy: () => void;
}

export function OrderSummary({
  gameName,
  userId,
  itemLabel,
  paymentName,
  total,
  error,
  onBuy,
}: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="display text-lg font-extrabold">Ringkasan Pesanan</h2>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Game</dt>
          <dd className="font-bold text-right">{gameName}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">User ID</dt>
          <dd className="font-bold text-right">{userId}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Item</dt>
          <dd className="font-bold text-right">{itemLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Pembayaran</dt>
          <dd className="font-bold text-right">{paymentName}</dd>
        </div>
      </dl>

      <div className="mt-4 pt-4 border-t border-slate-300 flex justify-between items-center">
        <span className="text-sm text-slate-500">Total</span>
        <span className="display text-2xl font-black text-blue-600">{total}</span>
      </div>

      <button
        type="button"
        onClick={onBuy}
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-full grad text-white font-extrabold text-sm glow"
      >
        <BoltIcon className="w-4 h-4" />
        Beli Sekarang
      </button>

      {error ? (
        <p role="alert" className="mt-2 text-[11px] font-bold text-red-600 text-center">
          {error}
        </p>
      ) : null}

      <p className="mt-3 text-[11px] text-slate-500 text-center">
        Dengan membeli, kamu setuju pada Syarat &amp; Ketentuan Juegova.
      </p>
    </div>
  );
}
