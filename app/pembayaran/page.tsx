import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CheckoutPanel } from "@/components/payment/CheckoutPanel";
import { CheckoutStepper } from "@/components/payment/CheckoutStepper";
import { DEFAULT_PAYMENT_NAME, PAYMENT_METHODS } from "@/data/payments";
import { formatDateTime } from "@/lib/format";
import { createMetadata } from "@/lib/metadata";
import { buildPaymentInstruction } from "@/lib/payment-instructions";
import { calculatePricing } from "@/lib/pricing";

export const metadata = createMetadata({
  title: "Pembayaran",
  description: "Selesaikan pembayaran top up game kamu di Juegova.",
  path: "/pembayaran",
  noIndex: true,
});

interface PaymentPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const params = await searchParams;

  const game = first(params.game) ?? "Mobile Legends: Bang Bang";
  const item = first(params.item) ?? "86 Diamond";
  const uid = first(params.uid) ?? "—";

  const requestedPayment = first(params.pay) ?? DEFAULT_PAYMENT_NAME;
  const paymentName = PAYMENT_METHODS.some((method) => method.name === requestedPayment)
    ? requestedPayment
    : DEFAULT_PAYMENT_NAME;

  const requestedPrice = Number(first(params.price));
  const subtotal = Number.isFinite(requestedPrice) && requestedPrice > 0 ? requestedPrice : 22000;

  // Nilai acak dibuat di server lalu dikirim sebagai prop supaya tidak ada hydration mismatch.
  const now = new Date();
  const invoice = `JGV-${now.toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(
    1000 + Math.random() * 9000,
  )}`;

  const pricing = calculatePricing(subtotal);
  const instruction = buildPaymentInstruction(paymentName, pricing.total);

  return (
    <>
      <SiteHeader />

      <main className="max-w-[1000px] mx-auto px-4 lg:px-6 pb-16">
        <h1 className="sr-only">Pembayaran Pesanan Top Up</h1>
        <CheckoutStepper />
        <CheckoutPanel
          game={game}
          item={item}
          uid={uid}
          paymentName={paymentName}
          invoice={invoice}
          orderedAt={formatDateTime(now)}
          pricing={pricing}
          instruction={instruction}
        />
      </main>

      <SiteFooter variant="compact" />
    </>
  );
}
