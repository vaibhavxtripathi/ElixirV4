"use client";

import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { features } from "@/data/features";
import { cn } from "@/lib/utils";
import { Scale } from "@/components/scale";

export function AboutElixir() {
  return (
    <section className="relative py-24 md:py-28">
      <Header
        badge="About Elixir"
        title="Everything you need to grow in tech"
        subtitle="Connect, learn, and build with 5000+ passionate developers."
        variant="secondary"
      />

      <div className="mx-auto mt-12 grid w-[min(1200px,95%)] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(
          (
            f: { title: string; description: string; accent: string },
            idx: number
          ) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]"
              )}
            >
              {/* Background layers */}
              <Scale className="absolute inset-0 -z-10 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105" />
              <div
                className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b ${f.accent}`}
              />
              {/* Content above backgrounds */}
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white/90">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {f.description}
                </p>
              </div>
            </motion.div>
          )
        )}
      </div>
    </section>
  );
}

export default AboutElixir;
