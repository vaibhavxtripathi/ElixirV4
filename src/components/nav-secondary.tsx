"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url?: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    // Close sidebar on mobile after clicking a link
    setOpenMobile(false);
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.url ? (
                <SidebarMenuButton
                  asChild
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={item.url} onClick={handleLinkClick}>
                    <item.icon className="text-white" />
                    <span className="text-white">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  type="button"
                  disabled
                  aria-label={`${item.title} — Coming soon`}
                  className="text-white"
                >
                  <item.icon aria-hidden="true" />
                  <span>{item.title}</span>
                  <span className="ml-auto text-xs group-data-[collapsible=icon]:hidden">
                    Coming soon
                  </span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
