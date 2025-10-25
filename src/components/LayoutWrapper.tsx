"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import {
  GlobalLoader,
  ContentSkeleton,
  ErrorFallback,
  EmptyState,
} from "./GlobalLoader";
import { cn } from "@/lib/utils";

interface LayoutWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoader?: boolean;
  loadingText?: string;
}

export function LayoutWrapper({
  children,
  fallback,
  showLoader = true,
  loadingText = "Loading content...",
}: LayoutWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loader immediately when route changes
    setIsRouteChanging(true);
    setIsLoading(true);

    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsRouteChanging(false);
    }, 800); // Reduced from 1000ms to 800ms for faster response

    return () => clearTimeout(timer);
  }, [pathname]);

  // Error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(new Error(event.message));
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const resetError = () => {
    setHasError(false);
    setError(null);
    setIsLoading(true);
  };

  // Check if children is empty or null
  const hasContent = children && React.Children.count(children) > 0;

  if (hasError) {
    return <ErrorFallback error={error} resetError={resetError} />;
  }

  // Show loader if:
  // 1. We're loading and showLoader is true
  // 2. Route is changing (for smooth transitions)
  // 3. No content is available (prevents blank screen)
  if ((isLoading && showLoader) || isRouteChanging || !hasContent) {
    const loaderText = isRouteChanging ? "Loading..." : loadingText;
    return (
      <Suspense fallback={<ContentSkeleton />}>
        <GlobalLoader text={loaderText} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={fallback || <ContentSkeleton />}>{children}</Suspense>
  );
}

// Route-specific loading components
export function HomePageLoader() {
  return (
    <div className="space-y-8 min-h-screen flex flex-col justify-center p-6">
      {/* Hero Section Skeleton */}
      <div className="text-center space-y-6 py-16">
        <div className="h-6 w-48 bg-white/10 rounded mx-auto animate-pulse" />
        <div className="h-12 w-96 bg-white/10 rounded mx-auto animate-pulse" />
        <div className="h-6 w-80 bg-white/10 rounded mx-auto animate-pulse" />
      </div>

      {/* Demo Section Skeleton */}
      <div className="h-96 bg-white/5 rounded-2xl border border-white/10 animate-pulse" />

      {/* Features Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-80 bg-white/5 rounded-xl border border-white/10 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export function EventsPageLoader() {
  return (
    <div className="space-y-6 min-h-screen flex flex-col justify-center p-6">
      <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-48 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogsPageLoader() {
  return (
    <div className="space-y-6 min-h-screen flex flex-col justify-center p-6">
      <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-48 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MentorsPageLoader() {
  return (
    <div className="space-y-6 min-h-screen flex flex-col justify-center p-6">
      <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-32 w-32 bg-white/10 rounded-full mx-auto animate-pulse" />
            <div className="h-4 w-3/4 bg-white/10 rounded mx-auto animate-pulse" />
            <div className="h-3 w-1/2 bg-white/10 rounded mx-auto animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Dashboard-specific loader for authentication transitions
export function DashboardLoader() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <div className="text-center space-y-6">
        {/* Dashboard Icon Skeleton */}
        <div className="w-16 h-16 bg-white/10 rounded-xl mx-auto animate-pulse" />
        
        {/* Loading Text */}
        <div className="space-y-3">
          <div className="h-6 w-48 bg-white/10 rounded mx-auto animate-pulse" />
          <div className="h-4 w-32 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
