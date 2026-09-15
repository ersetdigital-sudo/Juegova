import Link from "next/link";
import { SearchIcon } from "@/components/ui/Icon";
import { cx } from "@/lib/cx";
import type { Game, NavItem, SiteSettings } from "@/types";
import { GameSearch } from "./GameSearch";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

interface SiteHeaderProps {
  settings: SiteSettings;
  nav: NavItem[];
  games: Game[];
  /** Menu yang sedang aktif — dicetak biru seperti di HTML asli. */
  active?: string | null;
  /** Kolom pencarian hanya ada di beranda pada HTML asli. */
  showSearch?: boolean;
}

export function SiteHeader({
  settings,
  nav,
  games,
  active = null,
  showSearch = false,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 h-16 flex items-center gap-4">
        <Logo name={settings.name} gradientId="logo-header" />

        <nav className="hidden lg:flex items-center gap-6 ml-4 text-sm font-semibold">
          {nav.map((item) => (
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

        {showSearch ? <GameSearch games={games} /> : null}

        <div className="flex items-center gap-2 ml-auto">
          {/* Juegova tidak butuh akun: pembeli langsung isi data pesanan lalu bayar. */}
          <Link
            href="/cek-transaksi"
            aria-current={active === "cek-transaksi" ? "page" : undefined}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold text-white grad glow sm:px-4"
          >
            <SearchIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Cek Transaksi</span>
            <span className="sm:hidden">Cek</span>
          </Link>
          <MobileNav nav={nav} games={games} active={active} />
        </div>
      </div>
    </header>
  );
}
