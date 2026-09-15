import { CONTACT, SOCIAL_LINKS } from "@/data/contact";
import { GAME_CATEGORIES } from "@/data/games";
import { GAME_REVIEWS, SITE_RATING } from "@/data/testimonials";
import { getGamePath, getPriceRange } from "@/lib/games";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { Game } from "@/types";

type JsonLd = Record<string, unknown>;

const socialProfiles = () =>
  SOCIAL_LINKS.map((social) => social.url).filter((url): url is string => Boolean(url));

export function organizationJsonLd(): JsonLd {
  const profiles = socialProfiles();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
    slogan: siteConfig.slogan,
    ...(profiles.length > 0 ? { sameAs: profiles } : {}),
    ...(CONTACT.email ? { email: CONTACT.email } : {}),
    ...(CONTACT.phone ? { telephone: CONTACT.phone } : {}),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.lang,
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };
}

export function gameListJsonLd(games: Game[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Daftar game yang bisa di-top-up di Juegova",
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

export function productJsonLd(game: Game): JsonLd {
  const { low, high } = getPriceRange(game);
  const category = GAME_CATEGORIES.find((entry) => entry.id === game.category)?.label;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: game.name,
    description: game.description,
    image: [absoluteUrl(game.image)],
    url: absoluteUrl(getGamePath(game.id)),
    sku: game.id,
    brand: { "@type": "Brand", name: game.publisher },
    ...(category ? { category } : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE_RATING.value,
      reviewCount: SITE_RATING.count,
      bestRating: 5,
      worstRating: 1,
    },
    review: GAME_REVIEWS.map((review) => ({
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
