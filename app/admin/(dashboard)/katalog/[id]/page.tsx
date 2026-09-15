import { notFound } from "next/navigation";
import { saveCatalog } from "@/app/admin/actions";
import { GameEditor } from "@/components/admin/GameEditor";
import { getCatalogSnapshot } from "@/lib/content/catalog";
import { getContentSnapshot } from "@/lib/content/store";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Kelola game", robots: { index: false, follow: false } };

export default async function AdminGameDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [catalog, content] = await Promise.all([getCatalogSnapshot(), getContentSnapshot()]);

  const gameIndex = catalog.games.findIndex((game) => game.id === id);
  if (gameIndex === -1) notFound();

  return (
    <>
      <header>
        <h1 className="text-lg font-extrabold text-slate-900">Kelola game</h1>
        <p className="mt-1 text-xs text-slate-500">
          Tersimpan ke tabel <code className="rounded bg-slate-100 px-1">games</code> dan{" "}
          <code className="rounded bg-slate-100 px-1">game_items</code>. Perubahan langsung dipakai
          halaman publik setelah disimpan.
        </p>
      </header>

      {catalog.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {catalog.error}
        </p>
      ) : null}

      <GameEditor
        games={catalog.games}
        gameIndex={gameIndex}
        categories={content.content.categories}
        action={saveCatalog}
      />
    </>
  );
}
