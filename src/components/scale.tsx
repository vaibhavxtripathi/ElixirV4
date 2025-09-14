import { cn } from "@/lib/utils";
import React from "react";

export const Scale = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "bg-none absolute inset-0 z-10 m-auto h-full w-full rounded-lg border border-gray-300 dark:border-gray-700",
        className
      )}
      style={{
        background: ` 
                     linear-gradient(45deg, transparent 45%, #9ca3af 45%, #9ca3af 55%, transparent 55%)`,
        backgroundSize: "6px 6px",
      }}
    ></div>
  );
};
