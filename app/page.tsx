import { GameShowcase } from "@/components/home/GameShowcase";
import { HeroSlider } from "@/components/home/HeroSlider";
import { PopularMarquee } from "@/components/home/PopularMarquee";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { getAllGames, getCategoriesInUse } from "@/lib/games";
import { gameListJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = createMetadata({
  path: "/",
  description: siteConfig.description,
});

export default function HomePage() {
  const games = getAllGames();
  const categories = getCategoriesInUse(games);

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(), gameListJsonLd(games)]} />

      <SiteHeader active="beranda" showSearch />

      <main className="max-w-[1280px] mx-auto px-4 lg:px-6">
        {/* HTML asli tidak punya H1 di beranda; ditambahkan tersembunyi agar hierarki judul rapi. */}
        <h1 className="sr-only">{siteConfig.name} — {siteConfig.tagline}</h1>

        <HeroSlider />
        <PopularMarquee />

        <div className="mt-10">
          <GameShowcase games={games} categories={categories} />

          <section id="promo" className="mt-16 space-y-16">
            <WhyChooseUs />
            <Testimonials />
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
