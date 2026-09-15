"use client";

import Image from "next/image";
import { useState } from "react";
import { AlertIcon } from "@/components/ui/Icon";
import { formatRupiah } from "@/lib/format";
import type { PaymentInstruction } from "@/lib/payment-instructions";

interface PaymentInstructionsProps {
  paymentName: string;
  instruction: PaymentInstruction;
  /** Nominal yang harus dibayar, ditampilkan besar di sebelah QR. */
  total: number;
}

export function PaymentInstructions({
  paymentName,
  instruction,
  total,
}: PaymentInstructionsProps) {
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");
  const isQr = instruction.mode === "qr";

  const handleCopy = async () => {
    let succeeded = false;
    try {
      // Clipboard API hanya tersedia di secure context (https / localhost).
      await navigator.clipboard.writeText(instruction.code.replace(/\s/g, ""));
      succeeded = true;
    } catch {
      succeeded = false;
    }
    setCopyState(succeeded ? "ok" : "fail");
    window.setTimeout(() => setCopyState("idle"), 1500);
  };

  const copyLabel = copyState === "ok" ? "Tersalin!" : copyState === "fail" ? "Gagal" : "Salin";

  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-3">
        <h2 className="display text-lg font-extrabold mr-auto">Metode Pembayaran</h2>
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
          {paymentName}
        </span>
      </div>

      {isQr ? (
        <div className="mt-5">
          <p className="text-center text-sm text-slate-600">
            Scan QR di bawah pakai aplikasi e-wallet atau m-banking apa pun.
          </p>

          <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-center">
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-3">
              {instruction.qrImage ? (
                <div className="relative h-[260px] w-[260px]">
                  <Image
                    src={instruction.qrImage}
                    alt={`Kode QR pembayaran ${paymentName}`}
                    fill
                    sizes="260px"
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
              ) : (
                <div className="grid h-[260px] w-[260px] place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
                  <div>
                    <AlertIcon className="mx-auto h-6 w-6 text-amber-500" />
                    <p className="mt-2 text-xs font-bold text-slate-600">
                      Gambar QR belum diatur
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Hubungi CS lewat halaman Bantuan supaya pembayaranmu bisa dibantu.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full max-w-[260px] rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-center sm:text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Nominal yang harus dibayar
              </p>
              <p className="display mt-1 text-3xl font-black text-blue-700">
                {formatRupiah(total)}
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Pastikan nominalnya sama persis supaya pembayaran otomatis terverifikasi.
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-slate-500">
            QR berlaku sampai waktu pembayaran habis.
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-xs font-bold text-slate-600">{instruction.label}</p>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
            {instruction.accountName ? (
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  a.n. {instruction.accountName}
                </p>
                <p className="mono text-lg font-extrabold break-all">{instruction.code}</p>
              </div>
            ) : (
              <p className="mono mr-auto text-lg font-extrabold break-all">{instruction.code}</p>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="ml-auto shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold text-white grad"
            >
              {copyLabel}
            </button>
          </div>

          <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Nominal yang harus ditransfer
            </p>
            <p className="display text-2xl font-black text-blue-700">{formatRupiah(total)}</p>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Transfer tepat sampai digit terakhir supaya otomatis terverifikasi.
          </p>
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-slate-200">
        <h3 className="text-sm font-extrabold">Cara Bayar</h3>
        <ol className="mt-2 space-y-2 text-sm text-slate-600">
          {instruction.steps.map((step, index) => (
            <li key={step}>
              <b className="text-slate-800">{index + 1}.</b> {step}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
