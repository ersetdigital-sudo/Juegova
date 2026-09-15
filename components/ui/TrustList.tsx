import { Icon } from "@/components/ui/Icon";
import type { TrustItem } from "@/types";

interface TrustListProps {
  items: TrustItem[];
}

/** Hanya daftar itemnya; pembungkus dan ukuran huruf diatur pemanggil. */
export function TrustList({ items }: TrustListProps) {
  return (
    <>
      {items.map((item) => (
        <p key={item.title} className="flex items-start gap-2">
          <Icon name={item.icon} className="mt-[2px] w-3.5 h-3.5 text-blue-600" />
          <span>
            <b>{item.title}</b> — {item.description}
          </span>
        </p>
      ))}
    </>
  );
}
