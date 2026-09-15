import { cx } from "@/lib/cx";
import type { PaymentMethod } from "@/types";

interface PaymentPickerProps {
  methods: PaymentMethod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PaymentPicker({ methods, selectedId, onSelect }: PaymentPickerProps) {
  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {methods.map((method) => (
        <button
          key={method.id}
          type="button"
          onClick={() => onSelect(method.id)}
          aria-pressed={method.id === selectedId}
          className={cx(
            "pay rounded-xl border-2 border-slate-200 p-3 text-left hover:border-amber-400 transition",
            method.id === selectedId && "sel",
          )}
        >
          <p className="text-[13px] font-extrabold">{method.name}</p>
          <p className="text-[10px] text-slate-500">
            {method.type === "qris" ? "Scan QR" : "Transfer"}
          </p>
        </button>
      ))}
    </div>
  );
}
