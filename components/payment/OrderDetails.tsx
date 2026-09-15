import { cx } from "@/lib/cx";

interface OrderDetailsProps {
  invoice: string;
  game: string;
  uid: string;
  item: string;
  orderedAt: string;
}

export function OrderDetails({ invoice, game, uid, item, orderedAt }: OrderDetailsProps) {
  const rows = [
    { label: "No. Invoice", value: invoice, mono: true },
    { label: "Game", value: game },
    { label: "User ID", value: uid },
    { label: "Item", value: item },
    { label: "Waktu Pesan", value: orderedAt },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <h2 className="display text-lg font-extrabold">Detail Pesanan</h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-3">
            <dt className="text-slate-500">{row.label}</dt>
            <dd className={cx("font-bold text-right", row.mono && "mono")}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
