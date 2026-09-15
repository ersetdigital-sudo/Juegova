import type { SocialLink, SocialPlatformId } from "@/types";

export interface SocialPlatform {
  id: SocialPlatformId;
  label: string;
  /** Contoh URL, dipakai sebagai placeholder di form admin. */
  example: string;
}

/** Urutan ikon di footer mengikuti urutan daftar ini dan tidak bisa diubah admin. */
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "facebook", label: "Facebook", example: "https://facebook.com/juegova" },
  { id: "instagram", label: "Instagram", example: "https://instagram.com/juegova" },
  { id: "tiktok", label: "TikTok", example: "https://tiktok.com/@juegova" },
  { id: "youtube", label: "YouTube", example: "https://youtube.com/@juegova" },
  { id: "x", label: "X (Twitter)", example: "https://x.com/juegova" },
];

/** Semua platform mulai tanpa URL, jadi ikonnya belum tampil di footer. */
export const DEFAULT_SOCIALS: SocialLink[] = SOCIAL_PLATFORMS.map((platform) => ({
  id: platform.id,
  url: "",
}));

export const socialPlatformLabel = (id: SocialPlatformId) =>
  SOCIAL_PLATFORMS.find((platform) => platform.id === id)?.label ?? id;

/**
 * Rapikan daftar dari penyimpanan: buang platform asing, isi platform yang belum
 * ada, dan kembalikan urutannya sesuai SOCIAL_PLATFORMS.
 */
export function normalizeSocials(input: SocialLink[] | undefined): SocialLink[] {
  const known = new Set<string>(SOCIAL_PLATFORMS.map((platform) => platform.id));

  return SOCIAL_PLATFORMS.map((platform) => {
    const found = input?.find((entry) => entry?.id === platform.id);
    const url = typeof found?.url === "string" ? found.url : "";
    return { id: platform.id, url };
  }).filter((entry) => known.has(entry.id));
}

/** Hanya yang URL-nya terisi — itulah yang tampil di footer. */
export const activeSocials = (socials: SocialLink[]) =>
  normalizeSocials(socials).filter((social) => social.url.trim().length > 0);
