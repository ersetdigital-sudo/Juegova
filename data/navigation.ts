import type { LinkItem, NavItem } from "@/types";

export const HEADER_NAV: NavItem[] = [
  { id: "beranda", label: "Beranda", href: "/" },
  { id: "kategori", label: "Kategori", href: "/#kategori" },
  { id: "promo", label: "Promo", href: "/#promo" },
  { id: "cek-transaksi", label: "Cek Transaksi", href: "/cek-transaksi" },
  { id: "bantuan", label: "Bantuan", href: "/#bantuan" },
];

export const FOOTER_MENU: LinkItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Kategori", href: "/#kategori" },
  { label: "Promo", href: "/#promo" },
  { label: "Cek Transaksi", href: "/cek-transaksi" },
  { label: "Bantuan", href: "/#bantuan" },
];

/**
 * Halaman legal belum ada di HTML asli, jadi href-nya masih "#".
 * Ganti dengan URL aslinya begitu halamannya dibuat.
 */
export const FOOTER_ABOUT: LinkItem[] = [
  { label: "Tentang Juegova", href: "#" },
  { label: "Syarat & Ketentuan", href: "#" },
  { label: "Kebijakan Privasi", href: "#" },
  { label: "Hubungi Kami", href: "#" },
];