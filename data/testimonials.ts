import type { GameReview, SiteRating, Testimonial, TrustItem } from "@/types";

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rizky Maulana",
    initials: "RM",
    accent: "grad",
    quote: "Proses top up-nya super cepat! Harganya juga paling murah dibanding tempat lain. Recommended!",
  },
  {
    name: "Sarah Wijaya",
    initials: "SW",
    accent: "blue",
    quote: "Langganan top up di Juegova selalu aman dan gak pernah ada masalah. Mantap!",
  },
  {
    name: "Daffa Pratama",
    initials: "DP",
    accent: "amber",
    quote: "Promonya gila-gilaan! Bisa dapat diskon besar dan prosesnya instan. The best!",
  },
];

/**
 * Tujuan link "Lihat Semua →" di bagian ulasan.
 * HTML asli memakai "#" karena halaman "semua ulasan" belum ada — ganti dengan URL aslinya nanti.
 */
export const TESTIMONIALS_HREF = "#";

/** Ulasan yang tampil di halaman detail game. */
export const GAME_REVIEWS: GameReview[] = [
  {
    name: "Rizky Maulana",
    initials: "RM",
    accent: "grad",
    quote: "Masuk kurang dari 10 detik. Gila sih cepetnya.",
  },
  {
    name: "Sarah Wijaya",
    initials: "SW",
    accent: "blue",
    quote: "Harga paling murah dibanding toko sebelah. Aman.",
  },
  {
    name: "Daffa Pratama",
    initials: "DP",
    accent: "amber",
    quote: "CS fast respon, promo tiap minggu. Langganan terus.",
  },
];

/** Ringkasan rating yang ditampilkan di halaman game. GANTI dengan data ulasan asli. */
export const SITE_RATING: SiteRating = {
  value: 4.9,
  count: 12480,
};

export const TRUST_ITEMS: TrustItem[] = [
  { icon: "shield", title: "Garansi 100%", description: "dana kembali kalau item tidak masuk." },
  { icon: "chat", title: "CS 24 jam", description: "dibantu sampai transaksi beres." },
  { icon: "lock", title: "Pembayaran aman", description: "sistem terenkripsi." },
];

/** Sama seperti TRUST_ITEMS, hanya kalimat item terakhir yang beda di halaman pembayaran. */
export const PAYMENT_TRUST_ITEMS: TrustItem[] = [
  { icon: "shield", title: "Garansi 100%", description: "dana kembali kalau item tidak masuk." },
  { icon: "chat", title: "CS 24 jam", description: "dibantu sampai transaksi beres." },
  { icon: "lock", title: "Pembayaran aman", description: "semua data dienkripsi." },
];
