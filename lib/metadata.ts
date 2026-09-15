import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

interface OgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

interface PageMetadataOptions {
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

const defaultImage = (): OgImage => ({
  url: siteConfig.ogImage,
  width: siteConfig.ogImageWidth,
  height: siteConfig.ogImageHeight,
  alt: siteConfig.tagline,
});

export function createMetadata({
  title,
  description,
  path,
  noIndex = false,
  image,
  type = "website",
}: PageMetadataOptions): Metadata {
  const ogImage = image ?? defaultImage();
  // Judul sosial disamakan dengan <title> dokumen (template root layout menambahkan nama situs).
  const socialTitle = title
    ? `${title} — ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;

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
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage.url],
      ...(siteConfig.twitterHandle
        ? { site: siteConfig.twitterHandle, creator: siteConfig.twitterHandle }
        : {}),
    },
  };
}
