"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TestimonialAuthor {
  name: string;
  handle: string;
  avatar: string;
}

export interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  href?: string;
  className?: string;
  truncate?: boolean; // New prop to control truncation
}

export function TestimonialCard({
  author,
  text,
  href,
  className,
  truncate = false,
}: TestimonialCardProps) {
  const Card = href ? "a" : "div";
  const [imageError, setImageError] = useState(false);
  
  // Determine if we should use fixed width (for marquee) or full width (for grid)
  const useFixedWidth = truncate && className && !className.includes("w-full");
  const useFullWidth = !truncate || (className && className.includes("w-full"));

  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-xl sm:rounded-2xl border border-blue-500/10",
        "bg-blue-900/5 hover:bg-blue-900/10 backdrop-blur-sm",
        "p-4 sm:p-6 md:p-8 lg:p-10 text-start",
        // Fixed widths only for marquee (when truncate is true and no w-full class)
        useFixedWidth
          ? "w-[280px] sm:w-[320px] md:w-[380px] flex-shrink-0"
          : "w-full",
        truncate ? "h-[180px] sm:h-[200px]" : "min-h-[180px] sm:min-h-[200px]",
        "text-white transition-colors duration-300",
        className
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-full overflow-hidden bg-blue-500/20 flex items-center justify-center">
          {!imageError ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full bg-blue-500/20 text-white text-xs sm:text-sm font-medium flex items-center justify-center">
              {author.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col items-start min-w-0 flex-1">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold leading-tight">
            {author.name}
          </h3>
          <p className="text-xs sm:text-sm lg:text-base text-white/60 mt-1">
            {author.handle}
          </p>
        </div>
      </div>
      <p
        className={cn(
          "text-xs sm:text-sm lg:text-base text-white/70 mt-3 sm:mt-4 lg:mt-5 leading-relaxed",
          truncate ? "line-clamp-3 overflow-hidden" : ""
        )}
      >
        {text}
      </p>
    </Card>
  );
}
