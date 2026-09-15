import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CheckoutPanel } from "@/components/payment/CheckoutPanel";
import { CheckoutStepper } from "@/components/payment/CheckoutStepper";
import { getSiteContent } from "@/lib/content/store";
import { createMetadata } from "@/lib/metadata";
import { buildPaymentInstruction } from "@/lib/payment-instructions";
import { findOrderByInvoice } from "@/lib/orders/store";

interface PageProps {
  params: Promise<{ invoice: string }>;
}

/** Halaman pesanan harus selalu segar — status dan waktunya berubah. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { invoice } = await params;
  const { settings } = await getSiteContent();

  return createMetadata({
    settings,
    title: `Pembayaran ${decodeURIComponent(invoice)}`,
    description: `Selesaikan pembayaran pesanan ${decodeURIComponent(invoice)} di ${settings.name}.`,
    path: "/pembayaran",
    noIndex: true,
  });
}

export default async function PaymentPage({ params }: PageProps) {
  const { invoice } = await params;
  const [content, order] = await Promise.all([
    getSiteContent(),
    findOrderByInvoice(decodeURIComponent(invoice)),
  ]);

  if (!order) notFound();

  const instruction = buildPaymentInstruction(order.paymentMethod, order.total);

  return (
    <>
      <SiteHeader
        settings={content.settings}
        nav={content.navigation.header}
        games={content.games}
      />

      <main className="max-w-[1000px] mx-auto px-4 lg:px-6 pb-16">
        <h1 className="sr-only">Pembayaran Pesanan Top Up</h1>
        <CheckoutStepper />
        <CheckoutPanel
          invoice={order.invoice}
          game={order.gameName}
          item={order.itemLabel}
          uid={order.accountId}
          paymentName={order.paymentMethod}
          orderedAt={order.createdAt}
          pricing={{
            subtotal: order.subtotal,
            fee: order.fee,
            discount: order.discount,
            total: order.total,
          }}
          instruction={instruction}
          trustItems={content.paymentTrustItems}
        />
      </main>

      <SiteFooter settings={content.settings} navigation={content.navigation} variant="compact" />
    </>
  );
}
