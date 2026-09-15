"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/ui/Icon";
import { TrustList } from "@/components/ui/TrustList";
import { PAYMENT_TRUST_ITEMS } from "@/data/testimonials";
import { formatRupiah } from "@/lib/format";
import type { PaymentInstruction } from "@/lib/payment-instructions";
import type { OrderPricing } from "@/lib/pricing";
import { OrderDetails } from "./OrderDetails";
import { PaymentInstructions } from "./PaymentInstructions";

/** Batas waktu pembayaran, sama dengan HTML asli. */
const COUNTDOWN_SECONDS = 15 * 60;

interface CheckoutPanelProps {
  game: string;
  item: string;
  uid: string;
  paymentName: string;
  invoice: string;
  orderedAt: string;
  pricing: OrderPricing;
  instruction: PaymentInstruction;
}

export function CheckoutPanel({
  game,
  item,
  uid,
  paymentName,
  invoice,
  orderedAt,
  pricing,
  instruction,
}: CheckoutPanelProps) {
  const [deadline] = useState(() => Date.now() + COUNTDOWN_SECONDS * 1000);
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const [paid, setPaid] = useState(false);

  const expired = remaining <= 0;

  useEffect(() => {
    if (paid || expired) return;
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paid, expired, deadline]);

  // Tutup modal dengan Escape.
  useEffect(() => {
    if (!paid) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPaid(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paid]);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <>
      <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="space-y-5">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 flex flex-wrap items-center gap-4">
            <div className="mr-auto">
              <p className="text-sm font-extrabold">
                {expired ? "Waktu pembayaran sudah habis" : "Selesaikan pembayaran sebelum"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {expired
                  ? "Pesanan dibatalkan. Silakan buat pesanan baru."
                  : "Pesanan otomatis dibatalkan kalau waktunya habis."}
              </p>
            </div>
            <p className="mono display text-3xl font-black text-amber-600">
              {minutes}:{seconds}
            </p>
          </div>

          <PaymentInstructions
            paymentName={paymentName}
            instruction={instruction}
            qrSeed={`${invoice}${pricing.total}`}
          />

          <OrderDetails
            invoice={invoice}
            game={game}
            uid={uid}
            item={item}
            orderedAt={orderedAt}
          />

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-[12px] text-slate-600 space-y-1.5">
            <TrustList items={PAYMENT_TRUST_ITEMS} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="display text-lg font-extrabold">Ringkasan Pembayaran</h2>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Subtotal</dt>
                <dd className="font-bold">{formatRupiah(pricing.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Biaya Layanan</dt>
                <dd className="font-bold">{formatRupiah(pricing.fee)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Diskon</dt>
                <dd className="font-bold text-blue-600">- {formatRupiah(pricing.discount)}</dd>
              </div>
            </dl>

            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm text-slate-500">Total Bayar</span>
              <span className="display text-2xl font-black text-blue-600">
                {formatRupiah(pricing.total)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPaid(true)}
              disabled={expired}
              className="mt-4 w-full py-3 rounded-full grad text-white font-extrabold text-sm glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Saya Sudah Bayar
            </button>
            <Link
              href="/#kategori"
              className="mt-2 block text-center py-3 rounded-full border border-slate-300 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Batalkan Pesanan
            </Link>
            <p className="mt-3 text-[11px] text-slate-500 text-center">
              Butuh bantuan? Hubungi CS lewat halaman Bantuan.
            </p>
          </div>
        </aside>
      </div>

      {paid ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-success-title"
          onClick={() => setPaid(false)}
          className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-7 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-full grad flex items-center justify-center text-white">
              <CheckIcon className="w-8 h-8" />
            </div>
            <h3 id="payment-success-title" className="display text-2xl font-extrabold mt-4">
              Pembayaran Diterima!
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Pesanan <span className="mono font-bold">{invoice}</span> sedang diproses. Item akan
              masuk ke akunmu dalam hitungan detik.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block w-full py-3 rounded-full grad text-white font-extrabold text-sm"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
