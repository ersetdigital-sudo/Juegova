"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/**
 * Versi sendiri dari `useReducedMotion` milik framer-motion.
 *
 * Alasannya: saat reduced motion aktif, framer-motion melewati animasi `whileInView`
 * tapi meninggalkan state awalnya (`opacity: 0`) — akibatnya konten tidak pernah muncul.
 * matchMedia langsung selalu memberi jawaban yang benar.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
