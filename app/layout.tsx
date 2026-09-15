import type { Metadata, Viewport } from "next";
import { getSiteContent } from "@/lib/content/store";
import { fontVariables } from "@/lib/fonts";
import { SITE_LOCALE, siteUrl } from "@/lib/site";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.name} — ${settings.tagline}`,
      template: `%s — ${settings.name}`,
    },
    description: settings.description,
    applicationName: settings.name,
    publisher: settings.legalName,
    category: "shopping",
    openGraph: {
      type: "website",
      siteName: settings.name,
      locale: SITE_LOCALE,
      images: [{ url: settings.ogImage, width: 1200, height: 630, alt: settings.tagline }],
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const { settings } = await getSiteContent();

  return {
    themeColor: settings.themeColor,
    colorScheme: "light",
    width: "device-width",
    initialScale: 1,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={fontVariables}>
      <body className="bg-white">{children}</body>
    </html>
  );
}
