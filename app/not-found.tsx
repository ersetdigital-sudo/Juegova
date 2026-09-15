import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getSiteContent } from "@/lib/content/store";

export default async function NotFound() {
  const content = await getSiteContent();

  return (
    <>
      <SiteHeader
        settings={content.settings}
        nav={content.navigation.header}
        games={content.games}
      />

      <main className="max-w-[1280px] mx-auto px-4 lg:px-6 py-20 text-center">
        <p className="scribble text-4xl text-blue-600">404</p>
        <h1 className="display text-3xl md:text-4xl font-black mt-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Game atau halaman yang kamu cari belum tersedia di {content.settings.name}.
        </p>
        <Link
          href="/#kategori"
          className="mt-6 inline-flex px-6 py-3 rounded-full grad text-white font-extrabold text-sm glow"
        >
          Lihat Daftar Game
        </Link>
      </main>

      <SiteFooter
        settings={content.settings}
        navigation={content.navigation}
        variant="compact"
      />
    </>
  );
}
