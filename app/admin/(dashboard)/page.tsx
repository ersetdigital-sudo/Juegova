import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { getStartingPrice } from "@/lib/games";
import { getContentSnapshot } from "@/lib/content/store";

export const metadata = { title: "Ringkasan", robots: { index: false, follow: false } };

export default async function AdminDashboardPage() {
  const { content, driver } = await getContentSnapshot();

  const totalItems = content.games.reduce((sum, game) => sum + game.items.length, 0);
  const stats = [
    { label: "Game", value: content.games.length, href: "/admin/katalog" },
    { label: "Nominal & harga", value: totalItems, href: "/admin/katalog" },
    { label: "Banner hero", value: content.heroSlides.length, href: "/admin/banner" },
    { label: "Ulasan", value: content.testimonials.length, href: "/admin/ulasan" },
    { label: "Keunggulan", value: content.features.length, href: "/admin/keunggulan" },
  ];

  return (
    <>
      <header>
        <h1 className="text-lg font-extrabold text-slate-900">Ringkasan</h1>
        <p className="mt-1 text-xs text-slate-500">
          Semua konten di halaman publik bisa diubah dari sini. Perubahan langsung dipakai
          halaman setelah disimpan.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300"
          >
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            <p className="text-[11px] font-bold text-slate-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <header className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-extrabold text-slate-800">Harga termurah per game</h2>
        </header>
        <ul className="divide-y divide-slate-100">
          {content.games.map((game) => (
            <li key={game.id} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">{game.name}</p>
                <p className="text-[11px] text-slate-400">{game.items.length} nominal</p>
              </div>
              <span className="ml-auto text-xs font-bold text-blue-600">
                {formatRupiah(getStartingPrice(game))}
              </span>
              <Link
                href={`/admin/katalog/${game.id}`}
                className="rounded-full border border-slate-300 px-3 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
              >
                Kelola
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {driver === "default" ? (
        <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
          Belum ada perubahan tersimpan. Begitu kamu menekan simpan, isinya ditulis ke{" "}
          <code className="rounded bg-white px-1">content/site.json</code> (atau ke Supabase kalau
          env-nya sudah diisi).
        </p>
      ) : null}
    </>
  );
}
