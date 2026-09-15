import { cx } from "@/lib/cx";
import { formatRupiah } from "@/lib/format";
import type { TopUpItem } from "@/types";

interface NominalPickerProps {
  items: TopUpItem[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export function NominalPicker({ items, selectedIndex, onSelect }: NominalPickerProps) {
  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item, index) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onSelect(index)}
          aria-pressed={index === selectedIndex}
          className={cx(
            "opt text-left rounded-xl border-2 border-slate-200 p-3 hover:border-blue-400 transition",
            index === selectedIndex && "sel",
          )}
        >
          <p className="text-[13px] font-extrabold leading-tight">{item.label}</p>
          <p className="text-[12px] text-blue-600 font-bold mt-1">{formatRupiah(item.price)}</p>
        </button>
      ))}
    </div>
  );
}
