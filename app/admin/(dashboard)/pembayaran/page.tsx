import { savePaymentMethods } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PaymentEditor } from "@/components/admin/PaymentEditor";
import { getPaymentSnapshot } from "@/lib/payments/store";

export const metadata = { title: "Metode Pembayaran", robots: { index: false, follow: false } };

export default async function AdminPaymentsPage() {
  const { methods, error } = await getPaymentSnapshot();

  return (
    <>
      <AdminPageHeader
        title="Metode Pembayaran"
        description="Atur pilihan pembayaran yang muncul di halaman checkout pembeli. Metode nonaktif otomatis disembunyikan."
      />

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-xs text-rose-700">
          {error}
        </p>
      ) : null}

      <PaymentEditor methods={methods} action={savePaymentMethods} />
    </>
  );
}
