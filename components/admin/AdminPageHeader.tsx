import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: ReactNode;
  /** Tombol atau kontrol di sisi kanan judul. */
  action?: ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end gap-x-4 gap-y-3">
      <div className="mr-auto min-w-0">
        <h1 className="display text-2xl font-black tracking-tight text-slate-900">{title}</h1>
        {description ? (
          <p className="mt-2.5 max-w-2xl text-xs leading-relaxed text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </header>
  );
}
