import { Avatar } from "@/components/ui/Avatar";
import { Stars } from "@/components/ui/Stars";
import type { GameReview, SiteRating } from "@/types";

interface GameReviewsProps {
  reviews: GameReview[];
  rating: SiteRating;
}

export function GameReviews({ reviews, rating }: GameReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-end gap-3">
        <h2 className="display text-lg font-extrabold mr-auto">Ulasan Pembeli</h2>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <Stars label={`Rating ${rating.value} dari 5`} />
          <span className="text-slate-500">
            {rating.value} / 5 ({rating.count.toLocaleString("id-ID")} ulasan)
          </span>
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {reviews.map((review, index) => (
          <div key={`${review.name}-${index}`} className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <Avatar initials={review.initials} accent={review.accent} size="sm" />
              <div>
                <p className="text-[12px] font-extrabold">{review.name}</p>
                <Stars className="text-[10px]" />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-600">"{review.quote}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}
