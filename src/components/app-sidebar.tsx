"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  CalendarIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { roleToDashboard } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Events",
      url: "/events",
      icon: CalendarIcon,
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: FileTextIcon,
    },
    {
      title: "Mentors",
      url: "/mentors",
      icon: UsersIcon,
    },
    {
      title: "Testimonials",
      url: "/testimonials",
      icon: MessageSquareIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard",
      icon: SettingsIcon,
    },
    {
      title: "Help",
      url: "/",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "/",
      icon: SearchIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/auth/me")).data,
    retry: false,
  });

  const user = me?.user
    ? {
        name: `${me.user.firstName} ${me.user.lastName ?? ""}`.trim(),
        email: me.user.email,
        avatar:
          me.user.avatar ??
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            me.user.firstName
          )}&background=random&color=fff`,
      }
    : {
        name: "Guest",
        email: "",
        avatar:
          "https://ui-avatars.com/api/?name=Guest&background=random&color=fff",
      };

  const isAdmin = me?.user?.role === "ADMIN";
  const isAdminRoute = pathname === "/admin";

  const navMain =
    isAdmin && isAdminRoute
      ? [
          { title: "Overview", url: "/admin", icon: LayoutDashboardIcon },
          {
            title: "Create Event",
            url: "/admin?view=create-event",
            icon: CalendarIcon,
          },
          {
            title: "Create Blog",
            url: "/admin?view=create-blog",
            icon: FileTextIcon,
          },
          {
            title: "Create Mentor",
            url: "/admin?view=create-mentor",
            icon: UsersIcon,
          },
          {
            title: "Manage Users",
            url: "/admin?view=manage-users",
            icon: UsersIcon,
          },
        ]
      : me?.user
      ? [
          {
            title: "Dashboard",
            url: roleToDashboard(me.user.role),
            icon: LayoutDashboardIcon,
          },
          ...data.navMain.slice(1),
        ]
      : data.navMain;

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-[#0A0B1A] border-r border-white/10"
      {...props}
    >
      <SidebarHeader className="border-b bg-[#0A0B1A] border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 text-white hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-2">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowUpCircleIcon className="h-5 w-5 text-white" />
                  <span className="text-base font-semibold text-white">
                    Elixir
                  </span>
                </Link>
                <SidebarTrigger className="ml-auto text-white hover:bg-white/10" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#0A0B1A]">
        <NavMain items={navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 bg-[#0A0B1A]">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
