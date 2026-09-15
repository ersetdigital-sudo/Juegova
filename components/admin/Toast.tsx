"use client";

import { CheckIcon } from "@/components/ui/Icon";

interface ToastProps {
  message: string | null;
}

/** Notifikasi kecil di bawah layar, dipakai sebagai umpan balik setelah menyimpan. */
export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-lg"
    >
      <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500">
        <CheckIcon className="h-2.5 w-2.5" />
      </span>
      {message}
    </div>
  );
}
