const FALLBACK_URL = "https://juegova.net";

/**
 * URL canonical situs. Set NEXT_PUBLIC_SITE_URL di .env saat deploy ke domain lain
 * supaya metadata, sitemap, dan robots memakai domain yang benar.
 */
export const siteConfig = {
  name: "Juegova",
  legalName: "Juegova.net",
  tagline: "Top Up Game, Lebih Seru Setiap Hari",
  description:
    "Top up game favoritmu di Juegova — proses instan, aman, dan harga terbaik untuk Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Honkai: Star Rail, dan Valorant.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL).replace(/\/$/, ""),
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
