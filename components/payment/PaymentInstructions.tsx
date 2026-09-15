"use client";

import { useState } from "react";
import type { PaymentInstruction } from "@/lib/payment-instructions";
import { PaymentQr } from "./PaymentQr";

interface PaymentInstructionsProps {
  paymentName: string;
  instruction: PaymentInstruction;
  /** Dipakai sebagai benih pola QR. */
  qrSeed: string;
}

export function PaymentInstructions({
  paymentName,
  instruction,
  qrSeed,
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
        <div className="mt-5 text-center">
          <p className="text-sm text-slate-600">
            Scan QR di bawah pakai aplikasi e-wallet atau m-banking apa pun.
          </p>
          <div className="mt-4 inline-block p-4 rounded-2xl border-2 border-slate-200 bg-white">
            <PaymentQr seed={qrSeed} />
          </div>
          <p className="mt-3 text-[11px] text-slate-500">
            QR berlaku sampai waktu pembayaran habis.
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-xs font-bold text-slate-600">{instruction.label}</p>
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
            <p className="mono text-lg font-extrabold mr-auto break-all">{instruction.code}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-full grad text-white text-[11px] font-bold shrink-0"
            >
              {copyLabel}
            </button>
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
