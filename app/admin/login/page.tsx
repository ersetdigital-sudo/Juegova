import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAuthEnabled } from "@/lib/admin/auth";

export const metadata = { title: "Masuk Admin", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  // Kalau login belum diaktifkan, tidak ada gunanya menampilkan form.
  if (!isAuthEnabled()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-base font-extrabold text-slate-900">
          Dashboard <span className="text-blue-600">Admin</span>
        </h1>
        <p className="mt-1 mb-5 text-xs text-slate-500">
          Masukkan password admin untuk melanjutkan.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
