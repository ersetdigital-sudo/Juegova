import type { ReactNode } from "react";

interface StepCardProps {
  step: number;
  title: string;
  /** Konten di kanan judul, mis. "Mata uang: Diamond". */
  aside?: ReactNode;
  children: ReactNode;
}

export function StepCard({ step, title, aside, children }: StepCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full grad text-white text-xs font-black flex items-center justify-center">
          {step}
        </span>
        <h2 className="display text-lg font-extrabold">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
