"use client";

import Link from "next/link";
import { useState } from "react";
import { HEADER_NAV } from "@/data/navigation";
import { cx } from "@/lib/cx";
import type { NavId } from "@/types";
import { GameSearch } from "./GameSearch";

interface MobileNavProps {
  active?: NavId | null;
}

/**
 * Menu navigasi khusus mobile — di HTML asli nav utama disembunyikan di bawah `lg`
 * dan tidak ada penggantinya, jadi halaman tidak bisa dinavigasi dari HP.
 */
export function MobileNav({ active = null }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        className="w-9 h-9 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center hover:bg-slate-50"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open ? (
        <div
          id="mobile-nav"
          className="absolute left-0 right-0 top-full bg-white border-b border-slate-200 shadow-lg px-4 py-4 space-y-4"
        >
          <GameSearch variant="mobile" />
          <nav className="flex flex-col text-sm font-semibold">
            {HEADER_NAV.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={item.id === active ? "page" : undefined}
                className={cx(
                  "py-2.5 border-b border-slate-100 last:border-b-0",
                  item.id === active ? "text-blue-600" : "text-slate-600",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
