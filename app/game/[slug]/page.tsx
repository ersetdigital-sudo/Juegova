import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameBanner } from "@/components/game/GameBanner";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { GameTopUp } from "@/components/game/GameTopUp";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { findGame, getGameIds, getGamePath } from "@/lib/games";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/json-ld";
import { createMetadata } from "@/lib/metadata";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getGameIds().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = findGame(slug);
  if (!game) return {};

  return createMetadata({
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
  const game = findGame(slug);
  if (!game) notFound();

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(game),
          breadcrumbJsonLd([
            { name: "Beranda", path: "/" },
            { name: "Kategori", path: "/#kategori" },
            { name: game.name, path: getGamePath(game.id) },
          ]),
        ]}
      />

      <SiteHeader active="kategori" />

      <main className="max-w-[1280px] mx-auto px-4 lg:px-6 pb-16">
        <GameBreadcrumb gameName={game.name} />
        <GameBanner game={game} />
        <GameTopUp game={game} />
      </main>

      <SiteFooter variant="compact" />
    </>
  );
}
