export type GameCategoryId = "moba" | "rpg" | "battle-royale" | "shooter" | "casual";

export interface GameCategory {
  id: GameCategoryId;
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
  category: GameCategoryId;
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

export type NavId = "beranda" | "kategori" | "promo" | "bantuan";

export interface NavItem {
  id: NavId;
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
