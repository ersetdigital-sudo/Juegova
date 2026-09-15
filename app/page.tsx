import type { Metadata } from "next";
import { GameShowcase } from "@/components/home/GameShowcase";
import { HeroSlider } from "@/components/home/HeroSlider";
import { PopularMarquee } from "@/components/home/PopularMarquee";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { getSiteContent } from "@/lib/content/store";
import { getCategoriesInUse } from "@/lib/games";
import { gameListJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return createMetadata({ settings, path: "/", description: settings.description });
}

export default async function HomePage() {
  const content = await getSiteContent();
  const categories = getCategoriesInUse(content.games, content.categories);
  const { settings, navigation } = content;

  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(content),
          websiteJsonLd(content),
          gameListJsonLd(content.games, settings.name),
        ]}
      />

      <SiteHeader
        settings={settings}
        nav={navigation.header}
        games={content.games}
        active="beranda"
        showSearch
      />

      <main className="max-w-[1280px] mx-auto px-4 lg:px-6">
        {/* HTML asli tidak punya H1 di beranda; ditambahkan tersembunyi agar hierarki judul rapi. */}
        <h1 className="sr-only">
          {settings.name} — {settings.tagline}
        </h1>

        <HeroSlider slides={content.heroSlides} />
        <PopularMarquee games={content.games} />

        <div className="mt-10">
          <GameShowcase
            games={content.games}
            categories={categories}
            heading={content.sections.catalog}
          />

          <section id="promo" className="mt-16 space-y-16">
            <WhyChooseUs features={content.features} heading={content.sections.features} />
            <Testimonials
              testimonials={content.testimonials}
              href={content.sections.testimonials.href}
              heading={content.sections.testimonials}
            />
          </section>
        </div>
      </main>

      <SiteFooter settings={settings} navigation={navigation} />
    </>
  );
}
