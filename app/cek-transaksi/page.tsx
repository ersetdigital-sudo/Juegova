import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TransactionLookup } from "@/components/order/TransactionLookup";
import { TransactionNotFound, TransactionResult } from "@/components/order/TransactionResult";
import { ReceiptIcon, SearchIcon } from "@/components/ui/Icon";
import { getSiteContent } from "@/lib/content/store";
import { createMetadata } from "@/lib/metadata";
import { findOrderByInvoice } from "@/lib/orders/store";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { settings } = await getSiteContent();
  const params = await searchParams;
  const invoice = (first(params.invoice) ?? "").trim();

  return createMetadata({
    settings,
    title: "Cek Status Transaksi",
    description: `Cek status pesanan top up kamu di ${settings.name} cukup dengan Order ID, tanpa perlu membuat akun.`,
    path: "/cek-transaksi",
    // Halaman hasil pencarian memuat data pesanan, jadi tidak boleh diindeks.
    noIndex: invoice.length > 0,
  });
}

export default async function CheckTransactionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const content = await getSiteContent();

  // Order ID disimpan huruf besar, jadi input pembeli disamakan dulu.
  const query = (first(params.invoice) ?? "").trim().toUpperCase();
  const order = query ? await findOrderByInvoice(query) : null;

  return (
    <>
      <SiteHeader
        settings={content.settings}
        nav={content.navigation.header}
        games={content.games}
        active="cek-transaksi"
      />

      <main className="mx-auto max-w-[760px] px-4 py-10 lg:px-6 lg:py-14">
        <header className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
            <ReceiptIcon className="h-3.5 w-3.5" />
            Tanpa perlu daftar akun
          </span>
          <h1 className="display mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Cek Status Transaksi
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
            Masukkan Order ID yang kamu terima setelah memesan untuk melihat status pesananmu.
          </p>
        </header>

        <TransactionLookup defaultValue={query} />

        {query ? (
          order ? (
            <TransactionResult order={order} />
          ) : (
            <TransactionNotFound invoice={query} />
          )
        ) : (
          <p className="mt-6 flex items-start gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-xs leading-relaxed text-slate-500">
            <SearchIcon className="mt-px h-4 w-4 shrink-0 text-slate-400" />
            Order ID muncul di halaman pembayaran setelah kamu menekan “Beli Sekarang”, dan
            tercantum juga di struk pembayaranmu.
          </p>
        )}
      </main>

      <SiteFooter settings={content.settings} navigation={content.navigation} />
    </>
  );
}
