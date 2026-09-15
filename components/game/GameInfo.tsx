import type { Game } from "@/types";

interface GameInfoProps {
  game: Game;
  steps: string[];
}

export function GameInfo({ game, steps }: GameInfoProps) {
  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <h2 className="display text-lg font-extrabold">Tentang Game Ini</h2>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{game.description}</p>

      {steps.length > 0 ? (
        <>
          <h3 className="display text-base font-extrabold mt-5">Cara Top Up</h3>
          <ol className="mt-2 space-y-2 text-sm text-slate-600">
            {steps.map((step, index) => (
              <li key={`${step}-${index}`}>
                <b className="text-slate-800">{index + 1}.</b> {step}
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </section>
  );
}
