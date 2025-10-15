"use client";

import { LogOutIcon, MoreVerticalIcon } from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";
import { clearToken } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    clearToken();
    // Instant UI update without full refresh
    queryClient.setQueryData(["me"], null);
    await queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-white/10 data-[state=open]:text-white text-white hover:bg-white/10"
            >
              <Avatar className="h-9 w-9 rounded-md">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-md">
                  {(() => {
                    const parts = (user.name || "")
                      .split(/\s+/)
                      .filter(Boolean);
                    const f = (parts[0]?.[0] || "").toUpperCase();
                    const l = (
                      parts.length > 1 ? parts[parts.length - 1][0] : ""
                    ).toUpperCase();
                    return l ? `${f}${l}` : f;
                  })()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-white">
                  {user.name}
                </span>
                <span className="truncate text-xs text-white/60">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4 text-white" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-[#0A0B1A] border-white/10"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-md">
                    {(() => {
                      const parts = (user.name || "")
                        .split(/\s+/)
                        .filter(Boolean);
                      const f = (parts[0]?.[0] || "").toUpperCase();
                      const l = (
                        parts.length > 1 ? parts[parts.length - 1][0] : ""
                      ).toUpperCase();
                      return l ? `${f}${l}` : f;
                    })()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-white">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-white/60">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-white hover:bg-white/10"
            >
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
