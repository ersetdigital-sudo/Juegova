import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameBanner } from "@/components/game/GameBanner";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { GameTopUp } from "@/components/game/GameTopUp";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSiteContent } from "@/lib/content/store";
import { findGame, getGamePath } from "@/lib/games";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/json-ld";
import { createMetadata } from "@/lib/metadata";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { games } = await getSiteContent();
  return games.map((game) => ({ slug: game.id }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const game = findGame(content.games, slug);
  if (!game) return {};

  return createMetadata({
    settings: content.settings,
    title: `Top Up ${game.name}`,
    description: game.description,
    path: getGamePath(game.id),
    image: {
      url: game.image,
      width: game.imageWidth,
      height: game.imageHeight,
      alt: game.imageAlt,
    },
  });
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const content = await getSiteContent();
  const game = findGame(content.games, slug);
  if (!game) notFound();

  const { settings, navigation } = content;
  const categoryLabel = content.categories.find((entry) => entry.id === game.category)?.label;

  return (
    <>
      <JsonLd
        data={[
          productJsonLd({
            game,
            rating: content.rating,
            reviews: content.gameReviews,
            categoryLabel,
          }),
          breadcrumbJsonLd([
            { name: "Beranda", path: "/" },
            { name: "Kategori", path: "/#kategori" },
            { name: game.name, path: getGamePath(game.id) },
          ]),
        ]}
      />

      <SiteHeader
        settings={settings}
        nav={navigation.header}
        games={content.games}
        active="kategori"
      />

      <main className="max-w-[1280px] mx-auto px-4 lg:px-6 pb-16">
        <GameBreadcrumb gameName={game.name} />
        <GameBanner game={game} badges={content.badges} />
        <GameTopUp
          game={game}
          steps={content.topUpSteps}
          reviews={content.gameReviews}
          rating={content.rating}
          trustItems={content.trustItems}
        />
      </main>

      <SiteFooter settings={settings} navigation={navigation} variant="compact" />
    </>
  );
}
