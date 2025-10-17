"use client";

import { motion } from "framer-motion";
import { containerStagger, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

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
      className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 sm:pt-36 md:pt-40"
      initial={"hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerStagger(0.12, 0)}
    >
      <motion.div className="flex justify-center" variants={fadeInUp}>
        <div className="inline-flex items-center gap-1 sm:gap-2 rounded-full border border-white/15 bg-white/5 px-2 sm:px-3 py-1 text-xs sm:text-sm text-white/90 backdrop-blur">
          ✦ {badge}
        </div>
      </motion.div>

      <motion.h1
        className={cn(
          "mt-4 sm:mt-6 text-center text-transparent text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight tracking-tight bg-clip-text bg-gradient-to-b from-white to-white/50",
          variant === "secondary" &&
            "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
        )}
        variants={fadeInUp}
      >
        {title}
      </motion.h1>

      <motion.p
        className={cn(
          "mt-3 sm:mt-5 text-center text-sm sm:text-base md:text-lg text-white/70 max-w-3xl mx-auto px-4",
          variant === "secondary" && "text-xs sm:text-sm md:text-base"
        )}
        variants={fadeInUp}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
};
