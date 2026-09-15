import type { Metadata } from "next";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, SITE_LOCALE } from "@/lib/site";
import type { SiteSettings } from "@/types";

interface OgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

interface PageMetadataOptions {
  settings: SiteSettings;
  /** Tanpa judul, template dari root layout yang dipakai. */
  title?: string;
  description: string;
  /** Path relatif terhadap root situs, dipakai untuk canonical & og:url. */
  path: string;
  /** Halaman transaksi sebaiknya tidak diindeks. */
  noIndex?: boolean;
  image?: OgImage;
  type?: "website" | "article";
}

export function createMetadata({
  settings,
  title,
  description,
  path,
  noIndex = false,
  image,
  type = "website",
}: PageMetadataOptions): Metadata {
  const ogImage = image ?? {
    url: settings.ogImage,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: settings.tagline,
  };
  // Judul sosial disamakan dengan <title> dokumen (template root layout menambahkan nama situs).
  const socialTitle = title ? `${title} — ${settings.name}` : `${settings.name} — ${settings.tagline}`;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      url: path,
      title: socialTitle,
      description,
      siteName: settings.name,
      locale: SITE_LOCALE,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage.url],
      ...(settings.twitterHandle
        ? { site: settings.twitterHandle, creator: settings.twitterHandle }
        : {}),
    },
  };
}
