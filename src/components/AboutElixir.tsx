"use client";

import { Header } from "@/components/Header";
import { motion } from "framer-motion";

const features = [
  {
    title: "Multi-Provider Marketplace",
    description:
      "No vendor lock‑in, choose the best tools and mentors anytime.",
    accent: "from-indigo-400/30 to-transparent",
  },
  {
    title: "Fine‑Tuning & Training",
    description:
      "Grow through projects, workshops, and custom learning tracks.",
    accent: "from-fuchsia-400/30 to-transparent",
  },
  {
    title: "High Reliability",
    description:
      "Consistent events and support powered by a thriving community.",
    accent: "from-violet-400/30 to-transparent",
  },
  {
    title: "Cloud‑Native Mindset",
    description:
      "Ship fast with modern tooling, automation, and best practices.",
    accent: "from-amber-300/25 to-transparent",
  },
  {
    title: "Pre‑Configured Templates",
    description: "Starter kits for hackathons, research, and product sprints.",
    accent: "from-purple-400/30 to-transparent",
  },
  {
    title: "Ready to Use",
    description: "Jump in with curated resources, OSS workflows, and guidance.",
    accent: "from-cyan-300/25 to-transparent",
  },
];

export function AboutElixir() {
  return (
    <section className="relative py-24 md:py-28">
      <Header
        badge="About Elixir"
        title="All the community features you expect"
        subtitle="On your own path, with the strength of many"
      />

      <div className="mx-auto mt-12 grid w-[min(1200px,95%)] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, idx) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${f.accent}`}
            />
            <div className="relative">
              <h3 className="text-lg font-semibold text-white/90">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {f.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default AboutElixir;
