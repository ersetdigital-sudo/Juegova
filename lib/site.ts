const FALLBACK_URL = "https://juegova.net";

/** Locale & bahasa situs — bagian dari kode, bukan konten yang diubah dari admin. */
export const SITE_LOCALE = "id_ID";
export const SITE_LANG = "id";

/** Ukuran kartu sosial yang dipakai untuk og:image dan twitter:image. */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/**
 * Origin canonical situs, urutan prioritas:
 * 1. NEXT_PUBLIC_SITE_URL — set manual kalau deploy ke domain lain.
 * 2. Domain produksi dari Vercel — otomatis ikut custom domain begitu dipasang.
 * 3. Domain brand default.
 */
export function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return FALLBACK_URL;
}

export const siteUrl = resolveSiteUrl().replace(/\/$/, "");

export const absoluteUrl = (path = "/") =>
  `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
