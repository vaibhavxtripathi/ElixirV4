"use client";

import { motion } from "framer-motion";
import { AdminDashboardSection } from "./AdminDashboardSection";

export function AnimatedDemoSection() {
  return (
    <div className="relative">
      <AdminDashboardSection />
      <motion.div
        className="absolute bottom-0 w-full left-0 right-0 h-96 bg-gradient-to-b from-transparent to-card pointer-events-none z-99"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
