"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { InfoIcon } from "@/components/ui/Icon";
import { TrustList } from "@/components/ui/TrustList";
import { PAYMENT_METHODS } from "@/data/payments";
import { formatRupiah } from "@/lib/format";
import { createCheckoutOrder } from "@/lib/orders/actions";
import type { Game, GameReview, SiteRating, TrustItem } from "@/types";
import { GameInfo } from "./GameInfo";
import { GameReviews } from "./GameReviews";
import { NominalPicker } from "./NominalPicker";
import { OrderSummary } from "./OrderSummary";
import { PaymentPicker } from "./PaymentPicker";
import { StepCard } from "./StepCard";

const INPUT_CLASS =
  "mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300";

interface GameTopUpProps {
  game: Game;
  steps: string[];
  reviews: GameReview[];
  rating: SiteRating;
  trustItems: TrustItem[];
}

export function GameTopUp({ game, steps, reviews, rating, trustItems }: GameTopUpProps) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [zone, setZone] = useState("");
  const [itemIndex, setItemIndex] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selectedItem = itemIndex === null ? null : game.items[itemIndex];
  const selectedPayment = PAYMENT_METHODS.find((method) => method.id === paymentId) ?? null;
  const zoneSuffix = game.needsZone && zone.trim() ? ` (${zone.trim()})` : "";

  const handleBuy = () => {
    // Validasi inline, bukan alert() seperti di HTML asli.
    if (!userId.trim()) {
      setError("Masukkan User ID kamu dulu ya!");
      return;
    }
    if (!selectedItem) {
      setError("Pilih nominal top up dulu ya!");
      return;
    }
    if (!selectedPayment) {
      setError("Pilih metode pembayaran dulu ya!");
      return;
    }

    setError(null);

    startTransition(async () => {
      // Harga diambil server dari database, bukan dikirim dari browser.
      const result = await createCheckoutOrder({
        gameId: game.id,
        itemLabel: selectedItem.label,
        accountId: `${userId.trim()}${zoneSuffix}`,
        paymentMethod: selectedPayment.name,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.push(`/pembayaran/${result.invoice}`);
    });
  };

  return (
    <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
      <div className="space-y-6">
        <StepCard step={1} title="Masukkan Data Akun">
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-bold text-slate-600">User ID</span>
              <input
                value={userId}
                onChange={(event) => {
                  setUserId(event.target.value);
                  setError(null);
                }}
                placeholder="Contoh: 123456789"
                className={INPUT_CLASS}
              />
            </label>
            {game.needsZone ? (
              <label className="block">
                <span className="text-xs font-bold text-slate-600">Server / Zone ID</span>
                <input
                  value={zone}
                  onChange={(event) => {
                    setZone(event.target.value);
                    setError(null);
                  }}
                  placeholder="Contoh: 2001"
                  className={INPUT_CLASS}
                />
              </label>
            ) : null}
          </div>
          <p className="mt-3 flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <InfoIcon className="mt-[2px] w-3.5 h-3.5 text-blue-600" />
            <span>{game.idHint}</span>
          </p>
        </StepCard>

        <StepCard
          step={2}
          title="Pilih Nominal"
          aside={
            <span className="ml-auto text-[11px] font-bold text-blue-600">
              Mata uang: {game.currency}
            </span>
          }
        >
          <NominalPicker
            items={game.items}
            selectedIndex={itemIndex}
            onSelect={(index) => {
              setItemIndex(index);
              setError(null);
            }}
          />
        </StepCard>

        <StepCard step={3} title="Metode Pembayaran">
          <PaymentPicker
            methods={PAYMENT_METHODS}
            selectedId={paymentId}
            onSelect={(id) => {
              setPaymentId(id);
              setError(null);
            }}
          />
        </StepCard>

        <GameInfo game={game} steps={steps} />
        <GameReviews reviews={reviews} rating={rating} />
      </div>

      <aside className="lg:sticky lg:top-24">
        <OrderSummary
          gameName={game.name}
          userId={userId.trim() ? `${userId.trim()}${zoneSuffix}` : "-"}
          itemLabel={selectedItem ? selectedItem.label : "-"}
          paymentName={selectedPayment ? selectedPayment.name : "-"}
          total={selectedItem ? formatRupiah(selectedItem.price) : "Rp 0"}
          error={error}
          pending={pending}
          onBuy={handleBuy}
        />

        <div className="mt-4 rounded-2xl border border-slate-200 p-4 text-[11px] text-slate-600 space-y-2">
          <TrustList items={trustItems} />
        </div>
      </aside>
    </div>
  );
}
