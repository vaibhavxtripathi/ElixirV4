"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Particles } from "@/components/ui/particles";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Simple loader component for empty states
function SimpleLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        <div className="space-y-3">
          <div className="h-6 w-48 bg-white/10 rounded mx-auto animate-pulse" />
          <div className="h-4 w-32 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
        <p className="text-white/70 text-sm">{text}</p>
      </div>
    </div>
  );
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if current path is a dashboard route
  const isDashboardRoute = useMemo(
    () =>
      pathname.startsWith("/admin") ||
      pathname.startsWith("/student") ||
      pathname.startsWith("/club-head") ||
      pathname.startsWith("/dash"),
    [pathname]
  );

  // Check if children is empty or null
  const hasContent = children && React.Children.count(children) > 0;

  if (isDashboardRoute) {
    // For dashboard routes, show loader if no content
    if (!hasContent) {
      return <SimpleLoader text="Loading dashboard..." />;
    }
    return <>{children}</>;
  }

  // For all other routes, render with navbar and footer
  return (
    <>
      <Particles
        className="fixed inset-0 -z-10 size-full pointer-events-none"
        color="#ffffff"
        quantity={50}
        staticity={50}
        ease={50}
        size={0.4}
      />
      <Navbar />
      {hasContent ? children : <SimpleLoader text="Loading Elixir..." />}
      <Footer />
    </>
  );
}
