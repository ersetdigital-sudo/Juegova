import type { ContactSettings, SocialLink } from "@/types";

/**
 * Nilai awal data kontak. HTML asli tidak punya nomor/link apa pun,
 * jadi semuanya kosong sampai diisi dari dashboard admin.
 */
export const CONTACT: ContactSettings = {
  /** contoh: "6281234567890" (format internasional tanpa tanda +) */
  whatsapp: null,
  /** contoh: "cs@juegova.net" */
  email: null,
  /** contoh: "+62 812-3456-7890" */
  phone: null,
};

export const SOCIAL_LINKS: SocialLink[] = [
  { short: "f", label: "Facebook", url: null },
  { short: "ig", label: "Instagram", url: null },
  { short: "tt", label: "TikTok", url: null },
  { short: "yt", label: "YouTube", url: null },
  { short: "X", label: "X", url: null },
];
