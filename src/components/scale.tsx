import { cn } from "@/lib/utils";
import React from "react";

export const Scale = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 m-auto h-full w-full rounded-lg dark:border border-white/20 bg-neutral-900 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]",
        className
      )}
      style={{
        background: ` 
                     linear-gradient(45deg, transparent 45%, #2B2B2B 45%, #2B2B2B 55%, transparent 55%)`,
        backgroundSize: "10px 10px",
      }}
    ></div>
  );
};
