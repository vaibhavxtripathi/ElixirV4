"use client";

import React from "react";

const shimmer =
  "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]";

// Blog Skeleton - matches blog card design
export function BlogSkeleton() {
  return (
    <div className="group block overflow-hidden rounded-2xl border border-blue-500/10 bg-[#080914]">
      {/* Card image skeleton */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden">
        <div className={`h-full w-full ${shimmer}`} />
      </div>
      <div className="p-5">
        {/* Author info skeleton */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`h-6 w-6 rounded-full ${shimmer}`} />
          <div className={`h-3 w-24 ${shimmer} rounded`} />
          <div className={`h-3 w-20 ${shimmer} rounded`} />
        </div>
        {/* Title skeleton */}
        <div className={`h-6 w-full ${shimmer} rounded mb-2`} />
        <div className={`h-6 w-3/4 ${shimmer} rounded mb-3`} />
        {/* Content skeleton */}
        <div className={`h-4 w-full ${shimmer} rounded mb-2`} />
        <div className={`h-4 w-5/6 ${shimmer} rounded mb-2`} />
        <div className={`h-4 w-2/3 ${shimmer} rounded`} />
      </div>
    </div>
  );
}

// Mentor Skeleton - matches mentor card design
export function MentorSkeleton() {
  return (
    <div className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#0B0C14] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
      {/* Image skeleton */}
      <div className="relative h-[420px] w-full">
        <div className={`h-full w-full ${shimmer}`} />
        {/* Curved corners effect */}
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/10" />
        {/* Bottom gradient overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content overlay skeleton */}
        <div className="absolute inset-x-5 bottom-5">
          <div className="flex items-center gap-2 mb-1">
            <div className={`h-8 w-32 ${shimmer} rounded`} />
            <div className={`h-5 w-5 rounded-full ${shimmer}`} />
          </div>
          <div className={`h-4 w-24 ${shimmer} rounded mb-4`} />

          <div className="flex items-center gap-2">
            <div className={`h-6 w-16 ${shimmer} rounded-full`} />
            <div className={`h-6 w-12 ${shimmer} rounded-full`} />
            <div className={`h-8 w-20 ${shimmer} rounded-full ml-auto`} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Event Skeleton - matches card-flip design
export function EventSkeleton() {
  return (
    <div className="relative w-full h-96 mx-auto group [perspective:2000px]">
      <div className="relative w-full h-full overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 shadow-xs dark:shadow-lg">
        {/* Image skeleton */}
        <div className="relative h-full w-full">
          <div className={`h-full w-full ${shimmer}`} />
        </div>

        {/* Bottom shadow overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-32 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* Content skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className={`h-6 w-40 ${shimmer} rounded`} />
              <div className={`h-4 w-24 ${shimmer} rounded`} />
            </div>
            <div className={`h-6 w-16 ${shimmer} rounded-md`} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Grid skeletons for each type
export function BlogSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <BlogSkeleton key={i} />
      ))}
    </div>
  );
}

export function MentorSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <MentorSkeleton key={i} />
      ))}
    </div>
  );
}

export function EventSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <EventSkeleton key={i} />
      ))}
    </div>
  );
}

export default {
  BlogSkeleton,
  MentorSkeleton,
  EventSkeleton,
  BlogSkeletonGrid,
  MentorSkeletonGrid,
  EventSkeletonGrid,
};
