"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { setOrderStatus } from "@/app/admin/actions";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, isOrderStatus } from "@/lib/orders/status";
import type { OrderStatus } from "@/types";

interface OrderStatusSelectProps {
  orderId: string;
  status: OrderStatus;
}

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
      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 disabled:opacity-60"
    >
      {ORDER_STATUSES.map((option) => (
        <option key={option} value={option}>
          {ORDER_STATUS_LABEL[option]}
        </option>
      ))}
    </select>
  );
}
