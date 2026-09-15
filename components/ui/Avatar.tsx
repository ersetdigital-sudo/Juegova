import { cx } from "@/lib/cx";
import type { AccentVariant } from "@/types";

const ACCENT_CLASS: Record<AccentVariant, string> = {
  grad: "grad",
  blue: "bg-gradient-to-br from-blue-500 to-sky-400",
  amber: "bg-gradient-to-br from-amber-400 to-orange-400",
};

interface AvatarProps {
  initials: string;
  accent: AccentVariant;
  /** md = kartu testimoni beranda, sm = ulasan di halaman game. */
  size?: "sm" | "md";
}

export function Avatar({ initials, accent, size = "md" }: AvatarProps) {
  return (
    <span
      className={cx(
        "shrink-0 rounded-full text-xs font-bold text-white flex items-center justify-center",
        size === "md" ? "w-10 h-10" : "w-8 h-8",
        ACCENT_CLASS[accent],
      )}
    >
      {initials}
    </span>
  );
}
