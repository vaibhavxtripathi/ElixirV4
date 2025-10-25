"use client";

import { usePathname } from "next/navigation";
import { useMemo, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Particles } from "@/components/ui/particles";
import {
  LayoutWrapper,
  HomePageLoader,
  EventsPageLoader,
  BlogsPageLoader,
  MentorsPageLoader,
  DashboardLoader,
} from "@/components/LayoutWrapper";

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

  // Get appropriate loader based on route
  const getRouteLoader = () => {
    if (pathname === "/") return <HomePageLoader />;
    if (pathname.startsWith("/events")) return <EventsPageLoader />;
    if (pathname.startsWith("/blogs")) return <BlogsPageLoader />;
    if (pathname.startsWith("/mentors")) return <MentorsPageLoader />;
    if (isDashboardRoute) return <DashboardLoader />;
    return undefined;
  };

  if (isDashboardRoute) {
    // For dashboard routes, only render children with loader wrapper
    return (
      <LayoutWrapper 
        fallback={getRouteLoader()} 
        showLoader={true}
        loadingText="Loading dashboard..."
      >
        {children}
      </LayoutWrapper>
    );
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
      <LayoutWrapper
        fallback={getRouteLoader()}
        loadingText="Loading Elixir..."
      >
        {children}
      </LayoutWrapper>
      <Footer />
    </>
  );
}
