"use client";

import { motion } from "framer-motion";
export const DemoSection = () => {
  return (
    <motion.section
      className="relative mt-12 sm:mt-16"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* top glow */}
      <div className="pointer-events-none absolute -top-16 sm:-top-24 left-1/2 h-32 sm:h-48 w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.45),rgba(59,130,246,0.15)_40%,transparent_65%)] blur-2xl" />

      <div className="mx-auto w-[min(1200px,95%)] rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur">
        {/* window top bar */}
        <div className="flex h-10 sm:h-12 items-center gap-2 sm:gap-3 rounded-t-xl sm:rounded-t-2xl border-b border-white/10 px-3 sm:px-4">
          <span className="inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white/20" />
          <span className="inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white/20" />
          <span className="inline-block h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-white/20" />
          <div className="ml-2 sm:ml-3 h-5 sm:h-7 grow rounded-md border border-white/10 bg-black/20" />
        </div>

        {/* 3-column app frame */}
        <div className="relative grid grid-cols-12 gap-0 min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
          {/* left sidebar */}
          <div className="col-span-3 hidden border-r border-white/10 p-4 sm:p-6 md:block">
            <div className="h-5 sm:h-6 w-20 sm:w-28 rounded-md bg-white/10 " />
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
              {[32, 24, 28, 20, 36, 16].map((width, i) => (
                <div
                  key={i}
                  className={`h-3 sm:h-4 w-${width} rounded bg-white/5 `}
                />
              ))}
            </div>
            <div className="mt-4 sm:mt-6">
              <div className="h-16 sm:h-24 w-full rounded-lg border border-white/10 bg-black/20 " />
            </div>
          </div>

          {/* main content placeholder */}
          <div className="col-span-12 md:col-span-6 border-r border-white/10 p-4 sm:p-6">
            <div className="h-5 sm:h-6 w-40 sm:w-56 rounded-md bg-white/10 " />
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
              {[100, 83, 67].map((width, i) => (
                <div
                  key={i}
                  className={`h-2 sm:h-3 w-${width} rounded bg-white/5 `}
                />
              ))}
            </div>
            <div className="mt-4 sm:mt-6 h-24 sm:h-40 w-full rounded-lg border border-white/10 bg-black/20 " />
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
              {[80, 75, 83].map((width, i) => (
                <div
                  key={i}
                  className={`h-2 sm:h-3 w-${width} rounded bg-white/5   `}
                />
              ))}
            </div>
            <div className="mt-4 sm:mt-6 h-20 sm:h-28 w-full rounded-lg border border-white/10 bg-black/20 " />
          </div>

          {/* right panel */}
          <div className="col-span-12 md:col-span-3 p-4 sm:p-6">
            <div className="h-5 sm:h-6 w-32 sm:w-40 rounded-md bg-white/10 " />
            <div className="mt-4 sm:mt-6 h-32 sm:h-48 w-full rounded-lg border border-white/10 bg-black/20 " />
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
              {[40, 24, 32].map((width, i) => (
                <div
                  key={i}
                  className={`h-2 sm:h-3 w-${width} rounded bg-white/5`}
                />
              ))}
            </div>
            <div className="mt-4 sm:mt-6 h-16 sm:h-20 w-full rounded-lg border border-white/10 bg-black/20 " />
          </div>
        </div>
      </div>
    </motion.section>
  );
};
