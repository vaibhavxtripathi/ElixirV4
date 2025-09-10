import { cn } from "@/lib/utils";
import {
  TestimonialCard,
  TestimonialAuthor,
} from "@/components/ui/testimonial-card";

interface TestimonialsSectionProps {
  headline: string;
  subtext: string;
  testimonials: Array<{
    author: TestimonialAuthor;
    text: string;
    href?: string;
  }>;
  className?: string;
}

export function TestimonialsSection({
  headline,
  subtext,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  return (
    <section
      className={cn(
        "bg-transparent text-white font-geist-sans",
        "py-12 sm:py-24 md:py-32 px-0",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-[1.5rem] text-center">
        <div className="flex flex-col items-center px-4 mb-10">
        <h1 className="mt-6 text-center text-transparent text-5xl leading-tight tracking-tight md:text-7xl bg-clip-text bg-gradient-to-b from-white to-white/60">
          {headline}
        </h1>
        <p className="mt-4 text-center text-lg text-white/70 md:text-xl">
          {subtext}
        </p>
        </div>

        {/* Row 1 */}
        <div className="relative w-full overflow-hidden">
          <div className="flex overflow-hidden py-0 px-5 [--gap:1.5rem] [gap:var(--gap)] [--duration:700s]">
            <div className="flex shrink-0 justify-start [gap:var(--gap)] animate-marquee">
              {[...Array(4)].map((_, setIndex) =>
                testimonials.map((t, i) => (
                  <TestimonialCard key={`r1-${setIndex}-${i}`} {...t} />
                ))
              )}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[20%] bg-gradient-to-r from-[#0A0B1A] to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[20%] bg-gradient-to-l from-[#0A0B1A] to-transparent sm:block" />
        </div>

        {/* Row 2 - reverse direction */}
        <div className="relative w-full overflow-hidden">
          <div className="flex overflow-hidden -py-9 px-5 [--gap:1.5rem] [gap:var(--gap)] [--duration:700s]">
            <div className="flex shrink-0 justify-start [gap:var(--gap)] animate-marquee [animation-direction:reverse]">
              {[...Array(4)].map((_, setIndex) =>
                testimonials.map((t, i) => (
                  <TestimonialCard key={`r2-${setIndex}-${i}`} {...t} />
                ))
              )}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[20%] bg-gradient-to-r from-[#0A0B1A] to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[20%] bg-gradient-to-l from-[#0A0B1A] to-transparent sm:block" />
        </div>
      </div>
    </section>
  );
}
