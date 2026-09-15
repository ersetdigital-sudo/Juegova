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
