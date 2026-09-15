"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setOrderStatus } from "@/app/admin/actions";
import { cx } from "@/lib/cx";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, isOrderStatus } from "@/lib/orders/status";
import type { OrderStatus } from "@/types";

interface OrderStatusSelectProps {
  orderId: string;
  status: OrderStatus;
}

/** Warna select mengikuti status yang sedang aktif supaya mudah dipindai. */
const TONE: Record<OrderStatus, string> = {
  menunggu: "border-amber-200 bg-amber-50 text-amber-700",
  dibayar: "border-blue-200 bg-blue-50 text-blue-700",
  selesai: "border-emerald-200 bg-emerald-50 text-emerald-700",
  batal: "border-rose-200 bg-rose-50 text-rose-700",
};

export function OrderStatusSelect({ orderId, status }: OrderStatusSelectProps) {
  const router = useRouter();
  const [value, setValue] = useState<OrderStatus>(status);
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={value}
      disabled={pending}
      aria-label="Ubah status pesanan"
      onChange={(event) => {
        const next = event.target.value;
        if (!isOrderStatus(next)) return;
        setValue(next);
        startTransition(async () => {
          await setOrderStatus(orderId, next);
          router.refresh();
        });
      }}
      className={cx(
        "cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-bold shadow-sm transition-all outline-none hover:brightness-[.98] focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60",
        TONE[value],
      )}
    >
      {ORDER_STATUSES.map((option) => (
        <option key={option} value={option}>
          {ORDER_STATUS_LABEL[option]}
        </option>
      ))}
    </select>
  );
}
