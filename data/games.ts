import type { Badge, Game, GameCategory } from "@/types";

/** Ukuran asli artwork game (1200x896) — dipakai next/image agar tidak ada layout shift. */
const ART_WIDTH = 1200;
const ART_HEIGHT = 896;

/** Urutan chip filter di beranda; kategori tanpa game otomatis disembunyikan. */
export const GAME_CATEGORIES: GameCategory[] = [
  { id: "moba", label: "Moba" },
  { id: "rpg", label: "RPG" },
  { id: "battle-royale", label: "Battle Royale" },
  { id: "casual", label: "Casual" },
  { id: "shooter", label: "Shooter" },
];

export const GAMES: Game[] = [
  {
    id: "mobile-legends",
    name: "Mobile Legends: Bang Bang",
    cardTitle: "Mobile Legends",
    publisher: "Moonton",
    currency: "Diamond",
    category: "moba",
    image: "/images/mobile-legends.webp",
    imageWidth: ART_WIDTH,
    imageHeight: ART_HEIGHT,
    imageAlt: "Sampul game Mobile Legends: Bang Bang",
    needsZone: true,
    idHint:
      "Buka game → tap avatar di kiri atas → User ID dan Server ID ada di bawah nama kamu (contoh: 123456789 (2001)).",
    description:
      "Mobile Legends: Bang Bang adalah game MOBA 5v5 paling populer di Indonesia. Top up Diamond untuk membeli skin, hero, Starlight Member, dan battle pass langsung ke akunmu.",
    items: [
      { label: "5 Diamond", price: 1500 },
      { label: "12 Diamond", price: 3500 },
      { label: "28 Diamond", price: 7900 },
      { label: "86 Diamond", price: 22000 },
      { label: "172 Diamond", price: 43000 },
      { label: "257 Diamond", price: 64000 },
      { label: "344 Diamond", price: 85000 },
      { label: "706 Diamond", price: 170000 },
      { label: "Weekly Pass", price: 28000 },
    ],
  },
  {
    id: "free-fire",
    name: "Free Fire",
    cardTitle: "Free Fire",
    publisher: "Garena",
    currency: "Diamond",
    category: "battle-royale",
    image: "/images/free-fire.webp",
    imageWidth: ART_WIDTH,
    imageHeight: ART_HEIGHT,
    imageAlt: "Sampul game Free Fire",
    needsZone: false,
    idHint: "Buka Free Fire → tap foto profil → User ID tampil di bawah nickname kamu.",
    description:
      "Free Fire adalah game battle royale 10 menit dengan 50 pemain. Top up Diamond untuk bundle, karakter, senjata, dan Membership Mingguan/Bulanan.",
    items: [
      { label: "5 Diamond", price: 1000 },
      { label: "50 Diamond", price: 7000 },
      { label: "70 Diamond", price: 9500 },
      { label: "140 Diamond", price: 19000 },
      { label: "355 Diamond", price: 47000 },
      { label: "720 Diamond", price: 94000 },
      { label: "Membership Mingguan", price: 27000 },
      { label: "Membership Bulanan", price: 85000 },
      { label: "Level Up Pass", price: 15000 },
    ],
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    cardTitle: "PUBG Mobile",
    publisher: "Tencent / Level Infinite",
    currency: "UC",
    category: "battle-royale",
    image: "/images/pubg-mobile.webp",
    imageWidth: ART_WIDTH,
    imageHeight: ART_HEIGHT,
    imageAlt: "Sampul game PUBG Mobile",
    needsZone: false,
    idHint:
      "Buka PUBG Mobile → menu profil → Character ID (angka panjang) ada di bawah nama kamu.",
    description:
      "PUBG Mobile adalah battle royale 100 pemain dengan grafis realistis. Top up UC untuk Royale Pass, crate, skin senjata, dan outfit eksklusif.",
    items: [
      { label: "60 UC", price: 15000 },
      { label: "325 UC", price: 75000 },
      { label: "660 UC", price: 149000 },
      { label: "1800 UC", price: 385000 },
      { label: "3850 UC", price: 770000 },
      { label: "8100 UC", price: 1540000 },
      { label: "Royale Pass", price: 149000 },
      { label: "RP Elite Plus", price: 380000 },
      { label: "UC Starter Pack", price: 25000 },
    ],
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact",
    cardTitle: "Genshin Impact",
    publisher: "HoYoverse",
    currency: "Genesis Crystal",
    category: "rpg",
    image: "/images/genshin-impact.webp",
    imageWidth: ART_WIDTH,
    imageHeight: ART_HEIGHT,
    imageAlt: "Sampul game Genshin Impact",
    needsZone: true,
    idHint:
      "Buka Paimon Menu → UID ada di pojok kanan bawah layar. Pilih server sesuai akunmu (Asia/America/Europe/TW-HK-MO).",
    description:
      "Genshin Impact adalah action RPG open-world dengan sistem elemen. Top up Genesis Crystal untuk wish, Blessing of the Welkin Moon, dan Battle Pass.",
    items: [
      { label: "60 Crystal", price: 16000 },
      { label: "330 Crystal", price: 79000 },
      { label: "1090 Crystal", price: 249000 },
      { label: "2240 Crystal", price: 479000 },
      { label: "3880 Crystal", price: 799000 },
      { label: "8080 Crystal", price: 1599000 },
      { label: "Welkin Moon", price: 79000 },
      { label: "Battle Pass", price: 149000 },
      { label: "BP Gnostic Chorus", price: 299000 },
    ],
  },
  {
    id: "honkai-star-rail",
    name: "Honkai: Star Rail",
    cardTitle: "Honkai: Star Rail",
    publisher: "HoYoverse",
    currency: "Oneiric Shard",
    category: "rpg",
    image: "/images/honkai-star-rail.webp",
    imageWidth: ART_WIDTH,
    imageHeight: ART_HEIGHT,
    imageAlt: "Sampul game Honkai: Star Rail",
    needsZone: true,
    idHint: "Buka Phone Menu → UID tampil di pojok kiri bawah. Pilih server sesuai akunmu.",
    description:
      "Honkai: Star Rail adalah RPG turn-based petualangan antargalaksi. Top up Oneiric Shard untuk warp, Express Supply Pass, dan Nameless Honor.",
    items: [
      { label: "60 Shard", price: 16000 },
      { label: "300 Shard", price: 79000 },
      { label: "980 Shard", price: 249000 },
      { label: "1980 Shard", price: 479000 },
      { label: "3280 Shard", price: 799000 },
      { label: "6480 Shard", price: 1599000 },
      { label: "Express Supply Pass", price: 79000 },
      { label: "Nameless Honor", price: 149000 },
      { label: "Honor Glory", price: 299000 },
    ],
  },
  {
    id: "valorant",
    name: "Valorant",
    cardTitle: "Valorant",
    publisher: "Riot Games",
    currency: "VP",
    category: "shooter",
    image: "/images/valorant.webp",
    imageWidth: ART_WIDTH,
    imageHeight: ART_HEIGHT,
    imageAlt: "Sampul game Valorant",
    needsZone: false,
    idHint: "Masukkan Riot ID lengkap beserta tagline, contoh: Juegova#ID1.",
    description:
      "Valorant adalah tactical shooter 5v5 dengan agent berkemampuan unik. Top up VP untuk skin bundle, battle pass, dan agent contract.",
    items: [
      { label: "125 VP", price: 15000 },
      { label: "420 VP", price: 50000 },
      { label: "700 VP", price: 80000 },
      { label: "1375 VP", price: 155000 },
      { label: "2400 VP", price: 270000 },
      { label: "4000 VP", price: 440000 },
      { label: "Battle Pass", price: 165000 },
      { label: "Agent Contract", price: 145000 },
      { label: "VP Starter", price: 30000 },
    ],
  },
];

/** Langkah "Cara Top Up" yang tampil di semua halaman game. */
export const TOP_UP_STEPS = [
  "Masukkan User ID (dan Server) akun kamu.",
  "Pilih nominal yang ingin dibeli.",
  "Pilih metode pembayaran dan selesaikan transaksi.",
  "Item otomatis masuk ke akun dalam hitungan detik.",
];

/** Badge kepercayaan di banner halaman game. */
export const GAME_BADGES: Badge[] = [
  { icon: "bolt", label: "Proses Instan" },
  { icon: "shield", label: "Garansi 100%" },
  { icon: "clock", label: "Layanan 24 Jam" },
];
