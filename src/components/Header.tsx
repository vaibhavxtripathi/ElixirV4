"use client";

import { motion } from "framer-motion";
import { containerStagger, fadeInUp } from "@/lib/motion";

export const Header = ({
  badge,
  title,
  subtitle,
  variant,
}: {
  badge: string;
  title: string;
  subtitle: string;
  variant: "default" | "secondary";
}) => {
  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 pt-36 md:pt-40"
      initial={"hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerStagger(0.12, 0)}
    >
      <motion.div className="flex justify-center" variants={fadeInUp}>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/90 backdrop-blur">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
          {badge}
        </div>
      </motion.div>

      <motion.h1
        className="mt-6 text-center text-transparent text-5xl leading-tight tracking-tight md:text-7xl bg-clip-text bg-gradient-to-b from-white to-white/60"
        variants={fadeInUp}
      >
        {title}
      </motion.h1>

      <motion.p
        className="mt-4 text-center text-lg text-white/70 md:text-xl"
        variants={fadeInUp}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
};
