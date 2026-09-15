import Link from "next/link";
import { BoltIcon } from "@/components/ui/Icon";
import { SOCIAL_LINKS } from "@/data/contact";
import { FOOTER_ABOUT, FOOTER_MENU } from "@/data/navigation";
import { cx } from "@/lib/cx";
import { siteConfig } from "@/lib/site";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

const SOCIAL_CLASS =
  "w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center";

interface SiteFooterProps {
  /** full = beranda (4 kolom), compact = halaman game & pembayaran. */
  variant?: "full" | "compact";
}

function BottomBar({ compact }: { compact: boolean }) {
  const bar = (
    <div
      className={cx(
        "max-w-[1280px] mx-auto px-4 lg:px-6 flex flex-wrap gap-2 justify-between text-[11px] text-slate-500",
        compact ? "py-6" : "py-4",
      )}
    >
      <p>
        © {new Date().getFullYear()} {siteConfig.legalName}. Semua hak dilindungi undang-undang.
      </p>
      <p className="scribble inline-flex items-center gap-1.5 text-sm text-blue-600">
        {siteConfig.footerNote}
        <BoltIcon className="w-4 h-4" />
      </p>
    </div>
  );

  if (compact) return bar;
  return <div className="border-t border-slate-200">{bar}</div>;
}

export function SiteFooter({ variant = "full" }: SiteFooterProps) {
  if (variant === "compact") {
    return (
      <footer className="bg-slate-50 border-t border-slate-200">
        <BottomBar compact />
      </footer>
    );
  }

  return (
    <footer id="bantuan" className="mt-14 bg-slate-50 border-t border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <Logo gradientId="logo-footer" asLink={false} />
          <p className="mt-3 text-xs text-slate-500">{siteConfig.tagline}.</p>
        </div>

        <div>
          <p className="text-sm font-extrabold">Dapatkan Info Promo Terbaru</p>
          <p className="text-xs text-slate-500 mt-1">
            Langganan newsletter dan jangan lewatkan promo menarik.
          </p>
          <NewsletterForm />
        </div>

        <div>
          <p className="text-sm font-extrabold">Menu</p>
          <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
            {FOOTER_MENU.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-blue-600">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-extrabold">Tentang Kami</p>
          <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
            {FOOTER_ABOUT.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-blue-600">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-sm font-extrabold">Ikuti Kami</p>
          <div className="mt-2 flex gap-2 text-slate-500 text-xs font-bold">
            {SOCIAL_LINKS.map((social) =>
              social.url ? (
                <a
                  key={social.short}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cx(SOCIAL_CLASS, "hover:text-blue-600")}
                >
                  {social.short}
                </a>
              ) : (
                // URL profil belum tersedia — HTML asli juga hanya menampilkan bulatan ini.
                <span key={social.short} title={social.label} className={SOCIAL_CLASS}>
                  {social.short}
                </span>
              ),
            )}
          </div>
          <p className="scribble mt-3 text-blue-600 text-base">{siteConfig.slogan}</p>
        </div>
      </div>

      <BottomBar compact={false} />
    </footer>
  );
}
