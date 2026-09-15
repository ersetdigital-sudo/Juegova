import { CONTACT, SOCIAL_LINKS } from "@/data/contact";
import { FEATURES } from "@/data/features";
import { GAME_BADGES, GAMES, GAME_CATEGORIES, TOP_UP_STEPS } from "@/data/games";
import { HERO_SLIDES } from "@/data/hero-slides";
import { FOOTER_ABOUT, FOOTER_MENU, HEADER_NAV } from "@/data/navigation";
import { DEFAULT_SETTINGS } from "@/data/settings";
import {
  GAME_REVIEWS,
  PAYMENT_TRUST_ITEMS,
  SITE_RATING,
  TESTIMONIALS,
  TESTIMONIALS_HREF,
  TRUST_ITEMS,
} from "@/data/testimonials";
import type { SiteContent } from "@/types";

/**
 * Isi awal situs. Dipakai selama admin belum pernah menyimpan perubahan
 * (belum ada content/site.json dan Supabase belum tersambung).
 *
 * Supaya tetap type-checked, nilai default sengaja ditulis sebagai TypeScript
 * di folder data/, bukan sebagai JSON yang gampang salah ketik.
 */
export const DEFAULT_CONTENT: SiteContent = {
  settings: {
    ...DEFAULT_SETTINGS,
    contact: CONTACT,
    socials: SOCIAL_LINKS,
  },
  navigation: {
    header: HEADER_NAV,
    footerMenu: FOOTER_MENU,
    footerAbout: FOOTER_ABOUT,
  },
  sections: {
    catalog: {
      title: "Pilih Game Favoritmu",
      subtitle: "Top up cepat, aman, dan terpercaya.",
    },
    features: {
      title: "Kenapa Pilih Juegova?",
      subtitle: "Lebih dari sekadar top up, ini adalah pengalaman terbaik buat gamers.",
    },
    testimonials: {
      title: "Apa Kata Mereka?",
      subtitle: "Ribuan gamers sudah mempercayai Juegova.",
      href: TESTIMONIALS_HREF,
    },
  },
  categories: GAME_CATEGORIES,
  games: GAMES,
  heroSlides: HERO_SLIDES,
  badges: GAME_BADGES,
  topUpSteps: TOP_UP_STEPS,
  features: FEATURES,
  trustItems: TRUST_ITEMS,
  paymentTrustItems: PAYMENT_TRUST_ITEMS,
  testimonials: TESTIMONIALS,
  gameReviews: GAME_REVIEWS,
  rating: SITE_RATING,
};
