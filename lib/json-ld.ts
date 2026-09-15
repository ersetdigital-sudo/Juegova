import { getGamePath, getPriceRange } from "@/lib/games";
import { absoluteUrl } from "@/lib/site";
import type { Game, GameReview, SiteContent, SiteRating } from "@/types";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(content: SiteContent): JsonLd {
  const { settings } = content;
  const profiles = settings.socials
    .map((social) => social.url)
    .filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.name,
    legalName: settings.legalName,
    url: absoluteUrl("/"),
    description: settings.description,
    slogan: settings.slogan,
    ...(profiles.length > 0 ? { sameAs: profiles } : {}),
    ...(settings.contact.email ? { email: settings.contact.email } : {}),
    ...(settings.contact.phone ? { telephone: settings.contact.phone } : {}),
  };
}

export function websiteJsonLd(content: SiteContent): JsonLd {
  const { settings } = content;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.name,
    url: absoluteUrl("/"),
    description: settings.description,
    inLanguage: "id",
    publisher: { "@type": "Organization", name: settings.name, url: absoluteUrl("/") },
  };
}

export function gameListJsonLd(games: Game[], siteName: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Daftar game yang bisa di-top-up di ${siteName}`,
    itemListElement: games.map((game, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: game.name,
      url: absoluteUrl(getGamePath(game.id)),
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

interface ProductJsonLdOptions {
  game: Game;
  rating: SiteRating;
  reviews: GameReview[];
  /** Label kategori untuk properti `category`, opsional. */
  categoryLabel?: string;
}

export function productJsonLd({ game, rating, reviews, categoryLabel }: ProductJsonLdOptions): JsonLd {
  const { low, high } = getPriceRange(game);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: game.name,
    description: game.description,
    image: [absoluteUrl(game.image)],
    url: absoluteUrl(getGamePath(game.id)),
    sku: game.id,
    brand: { "@type": "Brand", name: game.publisher },
    ...(categoryLabel ? { category: categoryLabel } : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating.value,
      reviewCount: rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5, worstRating: 1 },
      reviewBody: review.quote,
    })),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "IDR",
      lowPrice: low,
      highPrice: high,
      offerCount: game.items.length,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(getGamePath(game.id)),
    },
  };
}
