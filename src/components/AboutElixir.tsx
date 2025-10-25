"use client";

import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { features } from "@/data/features";
import { cn } from "@/lib/utils";

export function AboutElixir() {
  // Helper function to get the correct image path
  const getImagePath = (index: number) => {
    const imageMap = [
      "1st.png",
      "2nd.png",
      "3rd.png",
      "4th.png",
      "5th.png",
      "6th.png",
    ];
    return `/${imageMap[index]}`;
  };

  return (
    <section className="relative pb-2 sm:pb-4 md:pb-6">
      <Header
        badge="About Elixir"
        title="Everything you need to grow in tech"
        subtitle="Connect, learn, and build with 5000+ passionate developers."
        variant="secondary"
      />

      <div className="mx-auto mt-4 sm:mt-6 md:mt-8 grid w-[min(1200px,95%)] grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(
          (
            f: { title: string; description: string; accent: string },
            idx: number
          ) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 0, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
              className={cn(
                "group relative overflow-hidden rounded-xl sm:rounded-2xl border border-blue-500/20 p-4 sm:p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] mt-6",
                "hover:border-blue-500/20 transition-all duration-300 h-64 sm:h-72 md:h-80"
              )}
            >
              {/* Background layers */}
              <div
                className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r ${f.accent}`}
              />
              {/* Feature Image - Full card background with vignette */}
              <div className="absolute inset-0 -z-5 overflow-hidden rounded-xl sm:rounded-2xl">
                <img
                  src={getImagePath(idx)}
                  alt={`${f.title} illustration`}
                  className="w-full h-full object-cover scale-110 opacity-60 transition-all duration-500 group-hover:scale-115 group-hover:opacity-70"
                />
                {/* Multi-layer vignette system */}
                {/* Bottom text area - stronger vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

                {/* Top corners - circular vignette */}
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_top_left,black/40_0%,transparent_70%)]" />
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_top_right,black/40_0%,transparent_70%)]" />

                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
              </div>

              {/* Content above backgrounds */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Spacer to push text to bottom */}
                <div className="flex-1" />

                {/* Text content at bottom */}
                <div className="mt-auto">
                  <h3 className="text-base sm:text-lg font-semibold text-white leading-tight mb-2 sm:mb-3 drop-shadow-lg">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-white/80 drop-shadow-md">
                    {f.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        )}
      </div>
    </section>
  );
}

export default AboutElixir;
