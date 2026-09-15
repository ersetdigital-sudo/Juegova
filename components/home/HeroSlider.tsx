"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cx } from "@/lib/cx";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import type { HeroSlide } from "@/types";

const AUTOPLAY_DELAY = 4000;

interface HeroSliderProps {
  slides: HeroSlide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const reduceMotion = usePrefersReducedMotion();

  /** Salinan slide pertama & terakhir di ujung track supaya perpindahan saat loop tetap mulus. */
  const track = useMemo(
    () => (slides.length > 0 ? [slides[slides.length - 1], ...slides, slides[0]] : []),
    [slides],
  );

  const startIndex = slides.length > 0 ? 1 : 0;
  const [index, setIndex] = useState(startIndex);
  const [withTransition, setWithTransition] = useState(true);

  const slideCount = slides.length;
  const activeIndex = slideCount > 0 ? (index - 1 + slideCount) % slideCount : 0;

  useEffect(() => {
    if (reduceMotion || track.length === 0) return;
    const timer = window.setInterval(() => {
      setWithTransition(true);
      // Dijaga agar tidak melewati salinan ujung kalau transitionend tidak sempat jalan.
      setIndex((value) => (value >= track.length - 1 ? value : value + 1));
    }, AUTOPLAY_DELAY);
    return () => window.clearInterval(timer);
  }, [reduceMotion, track.length]);

  // Setelah sampai di salinan ujung, lompat tanpa animasi ke slide aslinya.
  useEffect(() => {
    if (withTransition || slides.length === 0) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setWithTransition(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [withTransition, slides.length]);

  if (slideCount === 0) return null;

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    // Abaikan transition yang menggelembung dari elemen anak.
    if (event.target !== event.currentTarget) return;
    if (index === track.length - 1) {
      setWithTransition(false);
      setIndex(startIndex);
    } else if (index === 0) {
      setWithTransition(false);
      setIndex(slideCount);
    }
  };

  // Geseran dihitung saat render karena jumlah slide bisa diubah dari admin.
  // Dasarnya adalah lebar track: track selebar container (= lebar satu slide),
  // jadi 100% selalu berarti tepat satu slide berapa pun jumlah slide-nya.
  const shiftPercent = index * 100;

  return (
    <section className="mt-5 rounded-3xl overflow-hidden relative glow">
      <div
        className={cx(
          "flex",
          withTransition && "transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
        )}
        style={{ transform: `translateX(-${shiftPercent}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {track.map((slide, slideIndex) => {
          const isVisible = slideIndex === index;
          const isLcp = slideIndex === startIndex;

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
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === activeIndex;
          return (
            <button
              key={`${slide.id}-${slideIndex}`}
              type="button"
              onClick={() => {
                setWithTransition(true);
                setIndex(slideIndex + startIndex);
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
