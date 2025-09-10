"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if current path is a dashboard route
  const isDashboardRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/club-head") ||
    pathname.startsWith("/dash");

  if (isDashboardRoute) {
    // For dashboard routes, only render children (no navbar/footer)
    return <>{children}</>;
  }

  // For all other routes, render with navbar and footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
