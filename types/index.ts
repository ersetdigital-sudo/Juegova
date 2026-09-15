export interface GameCategory {
  id: string;
  label: string;
}

export interface TopUpItem {
  /** Nama nominal yang tampil di kartu pilihan, contoh: "86 Diamond". */
  label: string;
  /** Harga dalam Rupiah penuh (tanpa desimal). */
  price: number;
}

export interface Game {
  id: string;
  /** Nama lengkap, dipakai untuk judul halaman & breadcrumb. */
  name: string;
  /** Nama pendek untuk kartu di beranda. */
  cardTitle: string;
  publisher: string;
  currency: string;
  category: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  /** Sebagian game butuh Server/Zone ID di samping User ID. */
  needsZone: boolean;
  /** Petunjuk letak User ID di dalam game. */
  idHint: string;
  description: string;
  items: TopUpItem[];
}

export interface HeroSlide {
  id: string;
  href: string;
  image: string;
  imageAlt: string;
  width: number;
  height: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  group: string;
}

export type AccentVariant = "grad" | "blue" | "amber";

/** Nama ikon SVG di components/ui/Icon.tsx — dipakai di file data supaya tetap plain data. */
export type IconName =
  | "bolt"
  | "shield"
  | "crown"
  | "clock"
  | "chat"
  | "lock"
  | "info"
  | "check"
  | "arrow-right";

export interface Testimonial {
  name: string;
  initials: string;
  quote: string;
  accent: AccentVariant;
}

export interface GameReview {
  name: string;
  initials: string;
  quote: string;
  accent: AccentVariant;
}

export interface Feature {
  icon: IconName;
  title: string;
  description: string;
  variant: "slate" | "blue" | "amber";
}

export interface Badge {
  icon: IconName;
  label: string;
}

export interface NavItem {
  /** Slug unik untuk menandai menu yang sedang aktif, contoh: "beranda". */
  id: string;
  label: string;
  href: string;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface TrustItem {
  icon: IconName;
  title: string;
  description: string;
}

export interface SiteRating {
  value: number;
  count: number;
}

export interface SocialLink {
  /** Huruf pendek yang tampil di bulatan footer, contoh: "ig". */
  short: string;
  label: string;
  /** Null = platform ini belum punya URL, jadi ditampilkan sebagai ikon mati. */
  url: string | null;
}

export interface ContactSettings {
  whatsapp: string | null;
  email: string | null;
  phone: string | null;
}

/** Semua yang bisa diubah dari dashboard admin. */
export interface SiteSettings {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  slogan: string;
  footerNote: string;
  themeColor: string;
  ogImage: string;
  twitterHandle: string | null;
  contact: ContactSettings;
  socials: SocialLink[];
}

export interface NavigationContent {
  header: NavItem[];
  footerMenu: LinkItem[];
  footerAbout: LinkItem[];
}

export interface SectionCopy {
  title: string;
  subtitle: string;
}

/** Judul & subjudul section di beranda. */
export interface SectionHeadings {
  catalog: SectionCopy;
  features: SectionCopy;
  /** href = tujuan link "Lihat Semua" di bagian ulasan. */
  testimonials: SectionCopy & { href: string };
}

/**
 * Seluruh isi situs sebagai satu dokumen. Disimpan utuh (bukan per tabel) supaya
 * backend penyimpanan bisa diganti tanpa menyentuh kode halaman.
 */
export interface SiteContent {
  settings: SiteSettings;
  navigation: NavigationContent;
  sections: SectionHeadings;
  categories: GameCategory[];
  games: Game[];
  heroSlides: HeroSlide[];
  badges: Badge[];
  topUpSteps: string[];
  features: Feature[];
  trustItems: TrustItem[];
  paymentTrustItems: TrustItem[];
  testimonials: Testimonial[];
  gameReviews: GameReview[];
  rating: SiteRating;
}

/** Dari mana konten terakhir dibaca — ditampilkan di dashboard admin. */
export type StorageDriver = "supabase" | "file" | "default";

/** Hasil operasi simpan/ubah dari dashboard admin. */
export interface ActionResult {
  ok: boolean;
  message: string;
}
