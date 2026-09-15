"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Jeda sebelum animasi mulai, dipakai untuk efek bertahap antar kartu. */
  delay?: number;
  /** Jarak geser vertikal awal dalam piksel. */
  y?: number;
}

export function Reveal({ children, className, delay = 0, y = 18 }: RevealProps) {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cx("reveal", className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
