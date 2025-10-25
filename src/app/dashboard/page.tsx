"use client";

import dynamic from "next/dynamic";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Dynamically import components to prevent prerendering issues
const AppSidebar = dynamic(
  () =>
    import("@/components/app-sidebar").then((mod) => ({
      default: mod.AppSidebar,
    })),
  { ssr: false }
);
const ChartAreaInteractive = dynamic(
  () =>
    import("@/components/chart-area-interactive").then((mod) => ({
      default: mod.ChartAreaInteractive,
    })),
  { ssr: false }
);
const DataTable = dynamic(
  () =>
    import("@/components/data-table").then((mod) => ({
      default: mod.DataTable,
    })),
  { ssr: false }
);
const SectionCards = dynamic(
  () =>
    import("@/components/section-cards").then((mod) => ({
      default: mod.SectionCards,
    })),
  { ssr: false }
);
const SiteHeader = dynamic(
  () =>
    import("@/components/site-header").then((mod) => ({
      default: mod.SiteHeader,
    })),
  { ssr: false }
);

import data from "./data.json";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
