"use client";

import React from "react";

type Variant = "mentor" | "blog" | "event";

export default function ContentSkeleton({
  variant = "mentor",
  count = 6,
}: {
  variant?: Variant;
  count?: number;
}) {
  const items = Array.from({ length: count });
  const shimmer =
    "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]";

  // Use consistent grid layout for all variants
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((_, i) => (
        <div
          key={i}
          className="w-full h-96 rounded-2xl border border-white/10 bg-[#0A0B1A]/60 shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur overflow-hidden"
        >
          <div className="relative h-56 w-full">
            <div className={`h-full w-full ${shimmer}`} />
          </div>
          <div className="p-4">
            <div className={`h-6 w-3/4 ${shimmer} rounded mb-2`} />
            <div className={`h-4 w-full ${shimmer} rounded mb-3`} />
            <div className={`h-4 w-2/3 ${shimmer} rounded mb-4`} />
            <div className={`h-8 w-full ${shimmer} rounded`} />
          </div>
        </div>
      ))}
    </div>
  );
}
