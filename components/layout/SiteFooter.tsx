import Link from "next/link";
import { BoltIcon } from "@/components/ui/Icon";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { activeSocials, socialPlatformLabel } from "@/data/social";
import { cx } from "@/lib/cx";
import type { NavigationContent, SiteSettings } from "@/types";
import { Logo } from "./Logo";

const SOCIAL_CLASS =
  "flex h-7 w-7 items-center justify-center rounded-full bg-white border border-slate-200";

interface SiteFooterProps {
  settings: SiteSettings;
  navigation: NavigationContent;
  /** full = beranda (3 kolom), compact = halaman game & pembayaran. */
  variant?: "full" | "compact";
}

function BottomBar({ settings, compact }: { settings: SiteSettings; compact: boolean }) {
  const bar = (
    <div
      className={cx(
        "max-w-[1280px] mx-auto px-4 lg:px-6 flex flex-wrap gap-2 justify-between text-[11px] text-slate-500",
        compact ? "py-6" : "py-4",
      )}
    >
      <p>
        © {new Date().getFullYear()} {settings.legalName}. Semua hak dilindungi undang-undang.
      </p>
      <p className="scribble inline-flex items-center gap-1.5 text-sm text-blue-600">
        {settings.footerNote}
        <BoltIcon className="w-4 h-4" />
      </p>
    </div>
  );

  if (compact) return bar;
  return <div className="border-t border-slate-200">{bar}</div>;
}

export function SiteFooter({ settings, navigation, variant = "full" }: SiteFooterProps) {
  // Platform tanpa URL tidak ditampilkan sama sekali di footer.
  const socials = activeSocials(settings.socials);

  if (variant === "compact") {
    return (
      <footer className="bg-slate-50 border-t border-slate-200">
        <BottomBar settings={settings} compact />
      </footer>
    );
  }

  return (
    <footer id="bantuan" className="mt-14 bg-slate-50 border-t border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <Logo name={settings.name} gradientId="logo-footer" asLink={false} />
          <p className="mt-3 text-xs text-slate-500">{settings.tagline}.</p>
        </div>

        <div>
          <p className="text-sm font-extrabold">Menu</p>
          <ul className="mt-3 space-y-1.5 text-xs text-slate-500">
            {navigation.footerMenu.map((item) => (
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
            {navigation.footerAbout.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-blue-600">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {socials.length > 0 ? (
            <>
              <p className="mt-4 text-sm font-extrabold">Ikuti Kami</p>
              <div className="mt-2 flex gap-2">
                {socials.map((social) => {
                  const label = socialPlatformLabel(social.id);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className={cx(
                        SOCIAL_CLASS,
                        "text-slate-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600",
                      )}
                    >
                      <SocialIcon platform={social.id} className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            </>
          ) : null}
          <p className="scribble mt-3 text-blue-600 text-base">{settings.slogan}</p>
        </div>
      </div>

      <BottomBar settings={settings} compact={false} />
    </footer>
  );
}
