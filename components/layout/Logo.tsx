import Link from "next/link";

interface LogoMarkProps {
  /** HTML asli memakai id gradient yang sama di header & footer; di sini dibuat unik per instance. */
  gradientId: string;
}

export function LogoMark({ gradientId }: LogoMarkProps) {
  return (
    <span className="relative w-9 h-9 shrink-0">
      <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="55%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="40" height="40" rx="13" fill={`url(#${gradientId})`} />
        <path
          d="M25.5 9.5v14.6c0 4.2-3.1 7.2-7.5 7.2-3.6 0-6.3-1.9-7.3-5l4.3-1.6c.4 1.5 1.5 2.4 3 2.4 1.9 0 3.1-1.3 3.1-3.4V13.9h-5.3V9.5h9.7z"
          fill="#ffffff"
        />
        <circle cx="30.5" cy="11.5" r="3" fill="#ff9f1c" />
      </svg>
    </span>
  );
}

interface LogoProps {
  gradientId: string;
  /** Tanpa link, dipakai di dalam elemen yang sudah berupa link. */
  asLink?: boolean;
}

export function Logo({ gradientId, asLink = true }: LogoProps) {
  const content = (
    <>
      <LogoMark gradientId={gradientId} />
      <span className="display text-xl font-extrabold tracking-[-.02em]">
        Juego<span className="text-blue-600">va</span>
      </span>
    </>
  );

  if (!asLink) {
    return <div className="flex items-center gap-2 shrink-0">{content}</div>;
  }

  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Juegova — beranda">
      {content}
    </Link>
  );
}
