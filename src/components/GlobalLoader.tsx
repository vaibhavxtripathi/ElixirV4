"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlobalLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function GlobalLoader({ 
  className, 
  size = "md", 
  text = "Loading..." 
}: GlobalLoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[50vh] gap-4",
      className
    )}>
      {/* Animated Spinner */}
      <motion.div
        className={cn(
          "border-2 border-white/20 border-t-white rounded-full",
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Loading Text */}
      <motion.p
        className="text-white/70 text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {text}
      </motion.p>
    </div>
  );
}

// Skeleton Loader for content blocks
export function ContentSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <div className="h-4 w-32 bg-white/10 rounded mx-auto animate-pulse" />
        <div className="h-8 w-96 bg-white/10 rounded mx-auto animate-pulse" />
        <div className="h-4 w-80 bg-white/10 rounded mx-auto animate-pulse" />
      </div>
      
      {/* Content Grid Skeleton */}
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

// Page Loader with Elixir branding
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Elixir Logo Animation */}
        <motion.div
          className="w-16 h-16 mx-auto"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
        </motion.div>
        
        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h2 className="text-white text-xl font-semibold">Elixir</h2>
          <p className="text-white/70 text-sm">Loading your experience...</p>
        </motion.div>
        
        {/* Progress Bar */}
        <motion.div
          className="w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// Error Fallback Component
export function ErrorFallback({ 
  error, 
  resetError 
}: { 
  error?: Error; 
  resetError?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 p-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
          <span className="text-red-400 text-2xl">⚠️</span>
        </div>
        <h2 className="text-white text-xl font-semibold">Something went wrong</h2>
        <p className="text-white/70 text-sm max-w-md">
          {error?.message || "We encountered an unexpected error. Please try again."}
        </p>
      </div>
      
      {resetError && (
        <button
          onClick={resetError}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// Empty State Component
export function EmptyState({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description: string; 
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 p-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-white/50 text-2xl">📭</span>
        </div>
        <h2 className="text-white text-xl font-semibold">{title}</h2>
        <p className="text-white/70 text-sm max-w-md">{description}</p>
      </div>
      
      {action && <div>{action}</div>}
    </div>
  );
}
