import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { FEATURES } from "@/data/features";
import { cx } from "@/lib/cx";
import type { Feature } from "@/types";

const CARD_VARIANT: Record<Feature["variant"], { card: string; icon: string }> = {
  slate: { card: "bg-slate-50 border-slate-200", icon: "grad" },
  blue: {
    card: "bg-blue-50 border-blue-100",
    icon: "bg-gradient-to-br from-blue-500 to-sky-400",
  },
  amber: {
    card: "bg-amber-50 border-amber-100",
    icon: "bg-gradient-to-br from-amber-400 to-orange-400",
  },
};

export function WhyChooseUs() {
  return (
    <div>
      <h2 className="display text-2xl md:text-3xl font-extrabold">Kenapa Pilih Juegova?</h2>
      <p className="text-sm text-slate-500 mt-1">
        Lebih dari sekadar top up, ini adalah pengalaman terbaik buat gamers.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {FEATURES.map((feature, index) => {
          const variant = CARD_VARIANT[feature.variant];
          return (
            <Reveal key={feature.title} delay={index * 0.08}>
              <div className={cx("rounded-2xl border p-6 h-full", variant.card)}>
                <div
                  className={cx(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white",
                    variant.icon,
                  )}
                >
                  <Icon name={feature.icon} className="w-6 h-6" />
                </div>
                <p className="mt-4 text-base font-extrabold">{feature.title}</p>
                <p className="text-sm text-slate-500 mt-1">{feature.description}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
