import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowRightIcon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import type { SectionCopy, Testimonial } from "@/types";

interface TestimonialsProps {
  testimonials: Testimonial[];
  href: string;
  heading: SectionCopy;
}

export function Testimonials({ testimonials, href, heading }: TestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <div>
      <div className="flex items-end gap-3">
        <div className="mr-auto">
          <h2 className="display text-2xl md:text-3xl font-extrabold">{heading.title}</h2>
          <p className="text-sm text-slate-500 mt-1">{heading.subtitle}</p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 whitespace-nowrap"
        >
          Lihat Semua
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {testimonials.map((testimonial, index) => (
          <Reveal key={`${testimonial.name}-${index}`} delay={index * 0.08}>
            <div className="rounded-2xl border border-slate-200 p-5 h-full">
              <div className="flex items-center gap-2">
                <Avatar initials={testimonial.initials} accent={testimonial.accent} />
                <div>
                  <p className="text-sm font-extrabold leading-tight">{testimonial.name}</p>
                  <Stars className="text-[11px]" />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                "{testimonial.quote}"
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
