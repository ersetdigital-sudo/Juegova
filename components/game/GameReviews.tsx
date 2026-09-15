import { Avatar } from "@/components/ui/Avatar";
import { Stars } from "@/components/ui/Stars";
import { GAME_REVIEWS, SITE_RATING } from "@/data/testimonials";

export function GameReviews() {
  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-end gap-3">
        <h2 className="display text-lg font-extrabold mr-auto">Ulasan Pembeli</h2>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <Stars label={`Rating ${SITE_RATING.value} dari 5`} />
          <span className="text-slate-500">
            {SITE_RATING.value} / 5 ({SITE_RATING.count.toLocaleString("id-ID")} ulasan)
          </span>
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {GAME_REVIEWS.map((review) => (
          <div key={review.name} className="rounded-xl bg-slate-50 p-4">
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
