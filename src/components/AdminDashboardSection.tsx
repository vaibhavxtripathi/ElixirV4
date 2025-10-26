"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const AdminDashboardSection = () => {
  return (
    <motion.section
      className="relative mt-12 sm:mt-16"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* top glow */}
      <div className="pointer-events-none absolute -top-16 sm:-top-24 left-1/2 h-32 sm:h-48 w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.45),rgba(59,130,246,0.15)_40%,transparent_65%)] blur-2xl" />

      <div className="mx-auto w-[min(1200px,95%)] rounded-xl sm:rounded-2xl border border-white/10 bg-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur overflow-hidden">
        {/* window top bar */}
        <div className="flex h-10 sm:h-12 items-center gap-2 sm:gap-3 rounded-t-xl sm:rounded-t-2xl border-b border-white/10 px-3 sm:px-">
          <span className="inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white/20" />
          <span className="inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white/20" />
          <span className="inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white/20" />
          <div className="ml-2 sm:ml-3 h-5 sm:h-7 grow rounded-md border border-white/10 bg-card/20" />
        </div>

        {/* Admin Dashboard Image */}
        <div className="relative">
          <Image
            src="/admin-dashboard.webp"
            alt="Elixir Admin Dashboard"
            width={1200}
            height={800}
            className="w-full h-auto object-contain "
            priority
          />
          <div className="absolute inset-0 bg-card/10 mix-blend-screen" />

          {/* Enhanced overlay gradients for better blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

          {/* Bottom fade gradient for seamless transition */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0A0B1A] via-[#0A0B1A]/80 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.section>
  );
};
