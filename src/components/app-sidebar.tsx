"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  CalendarIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Elixir User",
    email: "user@elixir.com",
    avatar: "/avatar.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
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
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
              <a href="/" className="flex items-center gap-2">
                <ArrowUpCircleIcon className="h-5 w-5 text-white" />
                <span className="text-base font-semibold text-white">
                  Elixir
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#0A0B1A]">
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 bg-[#0A0B1A]">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
