"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { Logo } from "@/components/layout/Logo";
import {
  DashboardIcon,
  ExternalLinkIcon,
  GamepadIcon,
  ImageIcon,
  LogoutIcon,
  ReceiptIcon,
  SlidersIcon,
  SparklesIcon,
  StarIcon,
} from "@/components/ui/Icon";
import { cx } from "@/lib/cx";

const NAV = [
  { href: "/admin", label: "Ringkasan", Icon: DashboardIcon },
  { href: "/admin/pesanan", label: "Pesanan", Icon: ReceiptIcon },
  { href: "/admin/katalog", label: "Katalog & Harga", Icon: GamepadIcon },
  { href: "/admin/banner", label: "Banner Hero", Icon: ImageIcon },
  { href: "/admin/ulasan", label: "Ulasan", Icon: StarIcon },
  { href: "/admin/keunggulan", label: "Keunggulan", Icon: SparklesIcon },
  { href: "/admin/pengaturan", label: "Identitas & Navigasi", Icon: SlidersIcon },
];

function isActivePath(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

interface AdminNavProps {
  brandName: string;
  authEnabled: boolean;
}

/** Panel navigasi vertikal untuk layar besar. */
export function AdminSidebar({ brandName, authEnabled }: AdminNavProps) {
  const pathname = usePathname() ?? "";

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-100 px-5 py-5">
        <Logo name={brandName} gradientId="admin-logo" asLink={false} />
        <p className="mt-2 text-[11px] font-semibold tracking-wide text-slate-400">
          Panel Admin
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map(({ href, label, Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cx(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-blue-50 via-blue-50/70 to-transparent text-blue-700 ring-1 ring-inset ring-blue-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              {active ? (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-blue-500 to-blue-700" />
              ) : null}
              <span
                className={cx(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors",
                  active
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
                    : "text-slate-400 group-hover:bg-white group-hover:text-slate-600 group-hover:shadow-sm",
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400">
            <ExternalLinkIcon className="h-4 w-4" />
          </span>
          Lihat situs
        </Link>
        {authEnabled ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400">
                <LogoutIcon className="h-4 w-4" />
              </span>
              Keluar
            </button>
          </form>
        ) : null}
      </div>
    </aside>
  );
}

/** Strip navigasi horizontal yang hanya tampil di layar kecil. */
export function AdminMobileNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="border-b border-slate-200 bg-white lg:hidden">
      <ul className="no-bar flex gap-2 overflow-x-auto px-4 py-3">
        {NAV.map(({ href, label, Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors",
                  active
                    ? "text-white grad shadow-sm"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
