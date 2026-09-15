import { notFound } from "next/navigation";
import { saveCatalog } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
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
      <AdminPageHeader
        title="Kelola game"
        description="Ubah informasi game, nominal, dan harga. Perubahan langsung dipakai halaman publik setelah disimpan."
      />

      {catalog.error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-xs text-rose-700">
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
