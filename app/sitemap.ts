import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/content/store";
import { getGamePath } from "@/lib/games";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { games } = await getSiteContent();
  const lastModified = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    // /pembayaran sengaja tidak didaftarkan karena halamannya noindex.
    ...games.map((game) => ({
      url: absoluteUrl(getGamePath(game.id)),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
