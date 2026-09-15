import { StarIcon } from "@/components/ui/Icon";
import { cx } from "@/lib/cx";

const STAR_COUNT = 5;

interface StarsProps {
  className?: string;
  label?: string;
}

/**
 * Bintang rating sebagai SVG (bukan lagi glyph ★) supaya ukuran dan jaraknya
 * konsisten di semua device. Tetap <p> agar tinggi barisnya sama seperti sebelumnya.
 */
export function Stars({ className, label = "Rating 5 dari 5" }: StarsProps) {
  return (
    <p role="img" aria-label={label} className={cx("text-amber-500", className)}>
      <span className="inline-flex items-center gap-[0.12em] align-middle">
        {Array.from({ length: STAR_COUNT }, (_, index) => (
          <StarIcon key={index} className="w-[0.95em] h-[0.95em]" />
        ))}
      </span>
    </p>
  );
}
