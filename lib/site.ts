const FALLBACK_URL = "https://juegova.net";

/**
 * Origin canonical situs, urutan prioritas:
 * 1. NEXT_PUBLIC_SITE_URL — set manual kalau deploy ke domain lain.
 * 2. Domain produksi dari Vercel — otomatis ikut custom domain begitu dipasang.
 * 3. Domain brand default.
 *
 * Tanpa langkah 2, canonical/sitemap di deploy Vercel akan menunjuk ke domain
 * yang belum tentu aktif.
 */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return FALLBACK_URL;
}

export const siteConfig = {
  name: "Juegova",
  legalName: "Juegova.net",
  tagline: "Top Up Game, Lebih Seru Setiap Hari",
  description:
    "Top up game favoritmu di Juegova — proses instan, aman, dan harga terbaik untuk Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Honkai: Star Rail, dan Valorant.",
  url: resolveSiteUrl().replace(/\/$/, ""),
  locale: "id_ID",
  lang: "id",
  /** Kartu sosial 1200x630 (rasio 1.91:1). JPG, bukan WebP, karena preview Facebook/Twitter belum andal dengan WebP. */
  ogImage: "/images/og-cover.jpg",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterHandle: null as string | null,
  themeColor: "#1d4ed8",
  slogan: "#LevelUpBersamaJuegova",
  footerNote: "Dibuat untuk Gamers, oleh Gamers",
} as const;

export const absoluteUrl = (path = "/") => `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
