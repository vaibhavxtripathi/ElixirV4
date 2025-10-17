"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

type StatCardProps = {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  iconBgClassName?: string; // e.g., "bg-blue-500/20 text-blue-400"
  className?: string;
};

export function StatCard({
  label,
  value,
  icon,
  iconBgClassName,
  className,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`${
          className ?? "bg-white/5 border-white/10"
        } transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/10`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/60">{label}</p>
              <motion.p
                className="text-3xl font-bold text-white mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {value}
              </motion.p>
            </div>
            {icon && (
              <motion.div
                className={`p-3 rounded-lg border border-white/10 ${
                  iconBgClassName ?? "bg-white/10 text-white/80"
                } transition-all duration-300`}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.2 },
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {icon}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
