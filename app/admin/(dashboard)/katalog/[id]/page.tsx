import { notFound } from "next/navigation";
import { saveContentPatch } from "@/app/admin/actions";
import { GameEditor } from "@/components/admin/GameEditor";
import { getContentSnapshot } from "@/lib/content/store";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Kelola game", robots: { index: false, follow: false } };

export default async function AdminGameDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { content } = await getContentSnapshot();

  const gameIndex = content.games.findIndex((game) => game.id === id);
  if (gameIndex === -1) notFound();

  return (
    <>
      <header>
        <h1 className="text-lg font-extrabold text-slate-900">Kelola game</h1>
        <p className="mt-1 text-xs text-slate-500">
          Ubah informasi game, nominal, dan harga. Perubahan langsung dipakai halaman publik
          setelah disimpan.
        </p>
      </header>

      <GameEditor
        games={content.games}
        gameIndex={gameIndex}
        categories={content.categories}
        action={saveContentPatch}
      />
    </>
  );
}
