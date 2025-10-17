"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Particles } from "@/components/ui/particles";

interface ConditionalLayoutProps {
  children: React.ReactNode;
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

  if (isDashboardRoute) {
    // For dashboard routes, only render children (no navbar/footer)
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
      {children}
      <Footer />
    </>
  );
}
