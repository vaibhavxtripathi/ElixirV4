"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setOpenMobile } = useSidebar();
  const currentUrl =
    pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

  const handleLinkClick = () => {
    // Close sidebar on mobile after clicking a link
    setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className="text-white hover:bg-white/10 hover:text-white data-[active=true]:bg-white/10 data-[active=true]:text-white"
                isActive={currentUrl === item.url}
                asChild
              >
                <Link href={item.url} onClick={handleLinkClick}>
                  {item.icon && <item.icon className="text-white" />}
                  <span className="text-white">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
