import { siFacebook, siInstagram, siTiktok, siX, siYoutube } from "simple-icons";
import type { SocialPlatformId } from "@/types";

/**
 * Logo resmi platform dari simple-icons (bukan huruf singkatan), dalam bentuk
 * path 24x24 yang diwarnai `currentColor` supaya ikut hover state footer.
 *
 * Namanya sengaja tidak dikirim lewat <title> di dalam svg: tautannya sudah
 * punya aria-label, dan <title> bikin teks ikut terbaca di dalam tautan.
 */
const SOCIAL_ICONS: Record<SocialPlatformId, string> = {
  facebook: siFacebook.path,
  instagram: siInstagram.path,
  tiktok: siTiktok.path,
  youtube: siYoutube.path,
  x: siX.path,
};

interface SocialIconProps {
  platform: SocialPlatformId;
  className?: string;
}

export function SocialIcon({ platform, className }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={SOCIAL_ICONS[platform]} />
    </svg>
  );
}
