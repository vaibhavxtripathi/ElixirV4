import { cn } from "@/lib/utils";
import React from "react";

export const DivideX = ({ className }: { className?: string }) => {
  return <div className={cn("bg-white/10 h-[1px] w-full", className)} />;
};
