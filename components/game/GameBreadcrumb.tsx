import Link from "next/link";

export function GameBreadcrumb({ gameName }: { gameName: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <p className="mt-5 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600">
          Beranda
        </Link>{" "}
        <span className="mx-1">/</span>{" "}
        <Link href="/#kategori" className="hover:text-blue-600">
          Kategori
        </Link>{" "}
        <span className="mx-1">/</span>{" "}
        <span className="font-bold text-slate-700">{gameName}</span>
      </p>
    </nav>
  );
}
