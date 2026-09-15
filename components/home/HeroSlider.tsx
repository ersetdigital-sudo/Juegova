"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HERO_SLIDES } from "@/data/hero-slides";
import { cx } from "@/lib/cx";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const AUTOPLAY_DELAY = 4000;

/** Salinan slide pertama & terakhir di ujung track supaya perpindahan saat loop tetap mulus. */
const TRACK = [
  HERO_SLIDES[HERO_SLIDES.length - 1],
  ...HERO_SLIDES,
  HERO_SLIDES[0],
];
const START_INDEX = 1;

/** Semua posisi ditulis sebagai class statis supaya tidak perlu inline style. */
const TRACK_POSITION = [
  "translate-x-0",
  "-translate-x-full",
  "-translate-x-[200%]",
  "-translate-x-[300%]",
  "-translate-x-[400%]",
];

export function HeroSlider() {
  const reduceMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(START_INDEX);
  const [withTransition, setWithTransition] = useState(true);

  const activeIndex = (index - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setWithTransition(true);
      // Dijaga agar tidak melewati salinan ujung kalau transitionend tidak sempat jalan.
      setIndex((value) => (value >= TRACK.length - 1 ? value : value + 1));
    }, AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  // Setelah sampai di salinan ujung, lompat tanpa animasi ke slide aslinya.
  useEffect(() => {
    if (withTransition) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setWithTransition(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [withTransition]);

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    // Abaikan transition yang menggelembung dari elemen anak.
    if (event.target !== event.currentTarget) return;
    if (index === TRACK.length - 1) {
      setWithTransition(false);
      setIndex(START_INDEX);
    } else if (index === 0) {
      setWithTransition(false);
      setIndex(HERO_SLIDES.length);
    }
  };

  return (
    <section className="mt-5 rounded-3xl overflow-hidden relative glow">
      <div
        className={cx(
          "flex",
          withTransition && "transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          TRACK_POSITION[index],
        )}
        onTransitionEnd={handleTransitionEnd}
      >
        {TRACK.map((slide, slideIndex) => {
          const isVisible = slideIndex === index;
          const isLcp = slideIndex === START_INDEX;

          return (
            <Link
              key={`${slide.id}-${slideIndex}`}
              href={slide.href}
              aria-hidden={!isVisible}
              tabIndex={isVisible ? undefined : -1}
              className="w-full shrink-0"
            >
              {isLcp ? (
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={slide.width}
                  height={slide.height}
                  sizes="(max-width: 1280px) 100vw, 1232px"
                  priority
                  className="w-full h-auto block"
                />
              ) : (
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={slide.width}
                  height={slide.height}
                  sizes="(max-width: 1280px) 100vw, 1232px"
                  loading="eager"
                  className="w-full h-auto block"
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-[10px] left-0 right-0 z-10 flex justify-center">
        {HERO_SLIDES.map((slide, slideIndex) => {
          const isActive = slideIndex === activeIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => {
                setWithTransition(true);
                setIndex(slideIndex + START_INDEX);
              }}
              aria-label={`Tampilkan banner: ${slide.imageAlt}`}
              aria-current={isActive}
              className={cx(
                "mx-1 h-2 rounded-full transition-opacity duration-300",
                isActive ? "w-[22px] bg-[#60a5fa] opacity-100" : "w-2 bg-white opacity-45",
              )}
            />
          );
        })}
      </div>
    </section>
  );
}
