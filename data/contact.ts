/**
 * DATA KONTAK — masih kosong karena HTML asli tidak punya nomor/link apa pun.
 * `email` dan `phone` otomatis dipakai di JSON-LD Organization begitu diisi.
 * `whatsapp` belum tersambung ke UI mana pun (lihat catatan di ringkasan).
 */
export const CONTACT = {
  /** contoh: "6281234567890" (format internasional tanpa tanda +) */
  whatsapp: null as string | null,
  /** contoh: "cs@juegova.net" */
  email: null as string | null,
  /** contoh: "+62 812-3456-7890" */
  phone: null as string | null,
} as const;

export interface SocialLink {
  /** Huruf pendek yang tampil di bulatan footer, sama seperti HTML asli. */
  short: string;
  /** Nama platform, dipakai untuk aria-label/title. */
  label: string;
  /** URL profil. Null = daftar sosial belum tersedia. */
  url: string | null;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { short: "f", label: "Facebook", url: null },
  { short: "ig", label: "Instagram", url: null },
  { short: "tt", label: "TikTok", url: null },
  { short: "yt", label: "YouTube", url: null },
  { short: "X", label: "X", url: null },
];
