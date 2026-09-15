import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "../actions";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/AdminSidebar";
import { Logo } from "@/components/layout/Logo";
import { AlertIcon, ExternalLinkIcon, LogoutIcon } from "@/components/ui/Icon";
import { isAuthEnabled, isAuthorized } from "@/lib/admin/auth";
import { getContentSnapshot } from "@/lib/content/store";

/** Dashboard harus selalu membaca data terbaru, bukan hasil prerender saat build. */
export const dynamic = "force-dynamic";

const ACTION_BUTTON =
  "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all duration-200";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthorized())) redirect("/admin/login");

  const [{ content, error }, authEnabled] = [await getContentSnapshot(), isAuthEnabled()];
  const brandName = content.settings.name;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:flex">
        <AdminSidebar brandName={brandName} authEnabled={authEnabled} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="flex h-16 items-center gap-2 px-4 lg:px-8">
              <div className="mr-auto lg:hidden">
                <Logo name={brandName} gradientId="admin-topbar" />
              </div>
              <div className="mr-auto hidden lg:block">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Panel Admin
                </p>
                <p className="text-sm font-bold text-slate-800">{brandName}</p>
              </div>

              <Link
                href="/"
                target="_blank"
                className={`${ACTION_BUTTON} text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700`}
              >
                <ExternalLinkIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Lihat situs</span>
              </Link>

              {authEnabled ? (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className={`${ACTION_BUTTON} text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600`}
                  >
                    <LogoutIcon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Keluar</span>
                  </button>
                </form>
              ) : null}

              <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3 sm:flex">
                <span className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold text-white grad">
                  A
                </span>
                <span className="text-[11px] font-bold text-slate-600">Admin</span>
              </span>
            </div>
          </header>

          <AdminMobileNav />

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-[1120px] space-y-6">
              {!authEnabled ? (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-xs text-amber-800">
                  <AlertIcon className="mt-px h-4 w-4 shrink-0" />
                  <p>
                    <b>Siapa pun bisa membuka halaman ini.</b> Atur password admin dulu supaya
                    tidak ada yang bisa mengubah harga dari luar.
                  </p>
                </div>
              ) : null}

              {error ? (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-xs text-rose-700">
                  <AlertIcon className="mt-px h-4 w-4 shrink-0" />
                  <p>Data terbaru gagal dimuat, jadi yang tampil mungkin sudah tidak sesuai.</p>
                </div>
              ) : null}

              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
