import type { SiteSettings } from "@/types";
import { CONTACT, SOCIAL_LINKS } from "./contact";

/** Nilai awal identitas situs. Semuanya bisa diubah dari /admin/pengaturan. */
export const DEFAULT_SETTINGS: SiteSettings = {
  name: "Juegova",
  legalName: "Juegova.net",
  tagline: "Top Up Game, Lebih Seru Setiap Hari",
  description:
    "Top up game favoritmu di Juegova — proses instan, aman, dan harga terbaik untuk Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Honkai: Star Rail, dan Valorant.",
  slogan: "#LevelUpBersamaJuegova",
  footerNote: "Dibuat untuk Gamers, oleh Gamers",
  themeColor: "#1d4ed8",
  ogImage: "/images/og-cover.jpg",
  twitterHandle: null,
  contact: CONTACT,
  socials: SOCIAL_LINKS,
};
