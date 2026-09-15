"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";

const NAV = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/katalog", label: "Katalog & Harga" },
  { href: "/admin/banner", label: "Banner Hero" },
  { href: "/admin/ulasan", label: "Ulasan" },
  { href: "/admin/keunggulan", label: "Keunggulan" },
  { href: "/admin/pengaturan", label: "Identitas & Navigasi" },
];

export function AdminSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="lg:w-60 shrink-0">
      <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {NAV.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="shrink-0 lg:shrink">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cx(
                  "block rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
