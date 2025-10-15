"use client";

// import { useQuery } from "@tanstack/react-query";
// import { api } from "@/lib/api";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  // User data query - currently unused but available for future use
  // const { data: me } = useQuery({
  //   queryKey: ["me"],
  //   queryFn: async () => (await api.get("/auth/me")).data,
  //   retry: false,
  // });

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const href = "/" + segments.slice(0, i + 1).join("/");
      const isLast = i === segments.length - 1;

      let label = segment;
      if (segment === "dash") continue;
      if (segment === "admin") label = "Admin Dashboard";
      if (segment === "student") label = "Student Dashboard";
      if (segment === "club-head") label = "Club Head Dashboard";

      breadcrumbs.push({
        label,
        href: isLast ? undefined : href,
        isLast,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-[#0A0B1A] text-white">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[#0A0B1A]">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-white/10">
            <div className="flex items-center gap-2 px-4">
              <Separator
                orientation="vertical"
                className="mr-2 h-4 bg-white/20"
              />
              <div className="-ml-4">
                <SidebarTrigger className="text-white hover:bg-white/10" />
              </div>
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && (
                        <BreadcrumbSeparator className="text-white/60" />
                      )}
                      <BreadcrumbItem>
                        {crumb.isLast ? (
                          <BreadcrumbPage className="text-white">
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href={crumb.href}
                            className="text-white/80 hover:text-white"
                          >
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-[#0A0B1A]">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
