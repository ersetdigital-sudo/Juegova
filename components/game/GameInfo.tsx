import { TOP_UP_STEPS } from "@/data/games";
import type { Game } from "@/types";

export function GameInfo({ game }: { game: Game }) {
  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <h2 className="display text-lg font-extrabold">Tentang Game Ini</h2>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{game.description}</p>

      <h3 className="display text-base font-extrabold mt-5">Cara Top Up</h3>
      <ol className="mt-2 space-y-2 text-sm text-slate-600">
        {TOP_UP_STEPS.map((step, index) => (
          <li key={step}>
            <b className="text-slate-800">{index + 1}.</b> {step}
          </li>
        ))}
      </ol>
    </section>
  );
}
