import Link from "next/link";
import { HEADER_NAV } from "@/data/navigation";
import { cx } from "@/lib/cx";
import type { NavId } from "@/types";
import { GameSearch } from "./GameSearch";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

interface SiteHeaderProps {
  /** Menu yang sedang aktif — dicetak biru seperti di HTML asli. */
  active?: NavId | null;
  /** Kolom pencarian hanya ada di beranda pada HTML asli. */
  showSearch?: boolean;
}

export function SiteHeader({ active = null, showSearch = false }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 h-16 flex items-center gap-4">
        <Logo gradientId="logo-header" />

        <nav className="hidden lg:flex items-center gap-6 ml-4 text-sm font-semibold">
          {HEADER_NAV.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              aria-current={item.id === active ? "page" : undefined}
              className={cx(
                item.id === active ? "text-blue-600" : "text-slate-600 hover:text-blue-600",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {showSearch ? <GameSearch /> : null}

        <div className="flex items-center gap-2 ml-auto">
          <a
            href="#"
            className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-bold border border-slate-300 text-blue-700 hover:bg-slate-50"
          >
            Login
          </a>
          <a
            href="#"
            className="inline-flex px-4 py-2 rounded-full text-sm font-bold text-white grad glow"
          >
            Daftar
          </a>
          <MobileNav active={active} />
        </div>
      </div>
    </header>
  );
}
