import type { ComponentType, ReactNode } from "react";
import { cx } from "@/lib/cx";
import type { IconName } from "@/types";

interface IconProps {
  /**
   * Ukuran diatur lewat class (mis. "w-4 h-4"). Tanpa class, ikon mengikuti
   * ukuran huruf induknya karena default-nya 1em.
   */
  className?: string;
}

function Svg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cx("shrink-0", className)}
    >
      {children}
    </svg>
  );
}

/** Varian untuk ikon yang harus penuh (mis. bintang rating). */
function SvgFilled({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cx("shrink-0", className)}
    >
      {children}
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M13 2 5 13h5.5L11 22l7-11h-5.5z" />
    </Svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3 4.8 5.9v5.4c0 4.1 2.9 7.9 7.2 9.3 4.3-1.4 7.2-5.2 7.2-9.3V5.9z" />
    </Svg>
  );
}

export function CrownIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 19V8l4.2 3.4L12 5l3.8 6.4L20 8v11z" />
    </Svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </Svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M20 4H4a1 1 0 0 0-1 1v9.5a1 1 0 0 0 1 1h3v4.6l5-4.6h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" />
    </Svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" />
      <path d="M8 10.5V7.75a4 4 0 0 1 8 0v2.75" />
    </Svg>
  );
}

export function InfoIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11.2v4.6" />
      <path d="M12 8.2h.01" />
    </Svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M20 6.5 9.5 17 4 11.5" />
    </Svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 12h14" />
      <path d="m13 6.5 5.5 5.5-5.5 5.5" />
    </Svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <SvgFilled className={className}>
      <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z" />
    </SvgFilled>
  );
}

/*
 * Ikon khusus UI admin. Sengaja tidak masuk ke union IconName karena union itu
 * dipakai untuk ikon yang dipilih dari dashboard (fitur, badge, trust item).
 */

export function DashboardIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2.2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2" />
    </Svg>
  );
}

export function ReceiptIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5.5 3.2A1.2 1.2 0 0 1 6.7 2h10.6a1.2 1.2 0 0 1 1.2 1.2V21l-3-1.9-2 1.5-2-1.5-2 1.5-3-1.9z" />
      <path d="M9 7.5h6" />
      <path d="M9 11.5h6" />
    </Svg>
  );
}

export function GamepadIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="2" y="7" width="20" height="10" rx="5" />
      <path d="M7.5 10v4" />
      <path d="M5.5 12h4" />
      <circle cx="16" cy="11" r="1.1" />
      <circle cx="18.2" cy="13.4" r="1.1" />
    </Svg>
  );
}

export function ImageIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2.6" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="m4 17.8 4.2-4.2a1.6 1.6 0 0 1 2.3 0l4.5 4.5" />
      <path d="m14.6 15.6 1.7-1.7a1.6 1.6 0 0 1 2.3 0l2 2" />
    </Svg>
  );
}

export function SparklesIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M11 3.6l1.6 4.2 4.2 1.6-4.2 1.6L11 15.2 9.4 11 5.2 9.4 9.4 7.8z" />
      <path d="M18.4 14.6l.85 2.05 2.05.85-2.05.85-.85 2.05-.85-2.05-2.05-.85 2.05-.85z" />
    </Svg>
  );
}

export function SlidersIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.5 7.5h7" />
      <path d="M16.5 7.5h4" />
      <path d="M3.5 16.5h3.5" />
      <path d="M13 16.5h7.5" />
      <circle cx="13.5" cy="7.5" r="2.4" />
      <circle cx="9.8" cy="16.5" r="2.4" />
    </Svg>
  );
}

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M14 4h6v6" />
      <path d="M20 4l-8.5 8.5" />
      <path d="M18.5 14.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7A1.5 1.5 0 0 1 5 5.5h4.5" />
    </Svg>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M14.5 3.5h3.5A2 2 0 0 1 20 5.5v13a2 2 0 0 1-2 2h-3.5" />
      <path d="M10 8.5 6 12l4 3.5" />
      <path d="M6 12h9.5" />
    </Svg>
  );
}

export function InboxIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.5 13.5h4.2l1 2.6h6.6l1-2.6h4.2" />
      <path d="M5.4 4.6h13.2l2.2 8.9v4.8a1.7 1.7 0 0 1-1.7 1.7H4.9a1.7 1.7 0 0 1-1.7-1.7v-4.8z" />
    </Svg>
  );
}

export function WalletIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h10.5a2.5 2.5 0 0 1 2.5 2.5v9A2.5 2.5 0 0 1 16.5 20H6a2.5 2.5 0 0 1-2.5-2.5z" />
      <path d="M3.5 10.5V7A1.5 1.5 0 0 1 5 5.5h10" />
      <circle cx="16" cy="13.5" r="1.2" />
    </Svg>
  );
}

export function ClockBadgeIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </Svg>
  );
}

export function BadgeCheckIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 2.8l2.3 1.7 2.8-.2 1 2.7 2.3 1.7-1 2.7 1 2.7-2.3 1.7-1 2.7-2.8-.2L12 21.2l-2.3-1.7-2.8.2-1-2.7-2.3-1.7 1-2.7-1-2.7 2.3-1.7 1-2.7 2.8.2z" />
      <path d="m9 12.2 2.2 2.2 4-4" />
    </Svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </Svg>
  );
}

export function AlertIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M10.3 3.6 2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 16.5h.01" />
    </Svg>
  );
}

const ICONS: Record<IconName, ComponentType<IconProps>> = {
  bolt: BoltIcon,
  shield: ShieldIcon,
  crown: CrownIcon,
  clock: ClockIcon,
  chat: ChatIcon,
  lock: LockIcon,
  info: InfoIcon,
  check: CheckIcon,
  "arrow-right": ArrowRightIcon,
};

interface IconComponentProps extends IconProps {
  name: IconName;
}

/** Dipakai untuk ikon yang namanya datang dari data/ (fitur, badge, trust item). */
export function Icon({ name, className }: IconComponentProps) {
  const Glyph = ICONS[name];
  return <Glyph className={className} />;
}
