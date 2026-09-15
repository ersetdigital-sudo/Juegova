import { cx } from "@/lib/cx";

interface MetricProps {
  label: string;
  value: string | number;
  /** Class warna untuk kotak ikonnya. */
  tone: string;
  Icon: (props: { className?: string }) => React.ReactElement;
  /** Kartu utama: ikon gradasi brand dan angka lebih besar. */
  featured?: boolean;
  hint?: string;
}

export function Metric({ label, value, tone, Icon, featured = false, hint }: MetricProps) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm",
        featured ? "border-blue-100" : "border-slate-200",
      )}
    >
      {featured ? (
        <span className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-blue-500/5" />
      ) : null}

      <div className="relative flex items-center gap-3">
        <span
          className={cx(
            "grid h-11 w-11 shrink-0 place-items-center rounded-2xl",
            featured ? "text-white grad shadow-sm shadow-blue-600/30" : tone,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p
            className={cx(
              "display truncate font-black text-slate-900",
              featured ? "text-2xl" : "text-2xl",
            )}
          >
            {value}
          </p>
          {hint ? <p className="mt-0.5 truncate text-[11px] text-slate-400">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}
