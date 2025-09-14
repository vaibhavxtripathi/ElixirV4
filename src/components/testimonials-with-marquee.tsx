"use client";

import { cn } from "@/lib/utils";
import {
  TestimonialCard,
  TestimonialAuthor,
} from "@/components/ui/testimonial-card";
import { Header } from "./Header";
import { motion } from "framer-motion";
import { containerStagger, fadeIn } from "@/lib/motion";

interface TestimonialsSectionProps {
  badge: string;
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
  badge,
  headline,
  subtext,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  // Create infinite varied testimonials
  const createInfiniteTestimonials = (
    baseTestimonials: typeof testimonials,
    count: number = 20
  ) => {
    if (baseTestimonials.length === 0) return [];

    const result = [];
    for (let i = 0; i < count; i++) {
      const testimonial = baseTestimonials[i % baseTestimonials.length];
      result.push({
        ...testimonial,
        // Add unique key to prevent React warnings
        uniqueId: `infinite-${i}-${Math.random().toString(36).substr(2, 9)}`,
      });
    }
    return result;
  };

  const infiniteTestimonials1 = createInfiniteTestimonials(testimonials, 20);
  const infiniteTestimonials2 = createInfiniteTestimonials(testimonials, 20);

  return (
    <motion.section
      className={cn(
        "bg-transparent text-white font-geist-sans",
        "py-12 sm:py-24 md:py-32 px-0",
        className
      )}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerStagger(0.1, 0)}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-[1.5rem] text-center">
        <Header badge={badge} title={headline} subtitle={subtext} />

        {/* Row 1 - Infinite scroll */}
        <motion.div
          className="relative w-full overflow-hidden mt-10"
          variants={fadeIn}
        >
          <div className="flex overflow-hidden py-0 px-5 [--gap:1.5rem] [gap:var(--gap)]">
            <div className="flex shrink-0 justify-start [gap:var(--gap)] animate-marquee-infinite">
              {infiniteTestimonials1.map((testimonial, i) => (
                <TestimonialCard
                  key={`r1-${i}-${testimonial.uniqueId}`}
                  {...testimonial}
                />
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex shrink-0 justify-start [gap:var(--gap)] animate-marquee-infinite">
              {infiniteTestimonials1.map((testimonial, i) => (
                <TestimonialCard
                  key={`r1-dup-${i}-${testimonial.uniqueId}`}
                  {...testimonial}
                />
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[20%] bg-gradient-to-r from-[#0A0B1A] to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[20%] bg-gradient-to-l from-[#0A0B1A] to-transparent sm:block" />
        </motion.div>

        {/* Row 2 - Infinite scroll reverse direction */}
        <motion.div
          className="relative w-full overflow-hidden"
          variants={fadeIn}
        >
          <div className="flex overflow-hidden -py-9 px-5 [--gap:1.5rem] [gap:var(--gap)]">
            <div className="flex shrink-0 justify-start [gap:var(--gap)] animate-marquee-infinite-reverse">
              {infiniteTestimonials2.map((testimonial, i) => (
                <TestimonialCard
                  key={`r2-${i}-${testimonial.uniqueId}`}
                  {...testimonial}
                />
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex shrink-0 justify-start [gap:var(--gap)] animate-marquee-infinite-reverse">
              {infiniteTestimonials2.map((testimonial, i) => (
                <TestimonialCard
                  key={`r2-dup-${i}-${testimonial.uniqueId}`}
                  {...testimonial}
                />
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[20%] bg-gradient-to-r from-[#0A0B1A] to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[20%] bg-gradient-to-l from-[#0A0B1A] to-transparent sm:block" />
        </motion.div>
      </div>
    </motion.section>
  );
}
