import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isAuthEnabled, isAuthorized } from "@/lib/admin/auth";
import { getContentSnapshot } from "@/lib/content/store";
import { logoutAction } from "../actions";

const DRIVER_LABEL: Record<string, string> = {
  supabase: "Supabase",
  file: "File lokal (content/site.json)",
  default: "Isi awal (belum ada perubahan tersimpan)",
};

/** Dashboard harus selalu membaca data terbaru, bukan hasil prerender saat build. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthorized())) redirect("/admin/login");

  const { driver, error } = await getContentSnapshot();
  const authEnabled = isAuthEnabled();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-3 lg:px-6">
          <Link href="/admin" className="text-sm font-extrabold text-slate-900">
            Dashboard <span className="text-blue-600">Admin</span>
          </Link>
          <span className="ml-auto text-[11px] text-slate-400">
            Penyimpanan: {DRIVER_LABEL[driver] ?? driver}
          </span>
          <Link
            href="/"
            target="_blank"
            className="rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
          >
            Lihat situs
          </Link>
          {authEnabled ? (
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
              >
                Keluar
              </button>
            </form>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 py-6 lg:px-6">
        {!authEnabled ? (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            <b>Mode tanpa login.</b> Dashboard ini masih terbuka. Set env{" "}
            <code className="rounded bg-white px-1">ADMIN_PASSWORD</code> sebelum menyambungkan
            penyimpanan sungguhan (Supabase), supaya tidak ada yang bisa mengubah harga dari luar.
          </div>
        ) : null}

        {error ? (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-6 lg:flex-row">
          <AdminSidebar />
          <main className="min-w-0 flex-1 space-y-5">{children}</main>
        </div>
      </div>
    </div>
  );
}
