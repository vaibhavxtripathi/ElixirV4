"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { clearToken, roleToDashboard } from "@/lib/auth";
import Link from "next/link";
import { Button } from "./ui/button";
import AuthDialog from "@/components/auth-dialog";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const queryClient = useQueryClient();
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/auth/me")).data,
    retry: false,
  });

  const handleLogout = async () => {
    clearToken();
    // Instant UI update without full refresh
    queryClient.setQueryData(["me"], null);
    await queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  return (
    <motion.nav
      className="fixed top-0 z-50 w-full mx-auto"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="backdrop-blur-md border border-white/10 rounded-md px-6 py-4">
        <div className="grid grid-cols-3 items-center w-full backdrop-saturate-200">
          {/* Logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <div className="w-6 h-1 bg-white rounded-sm" />
                <div className="w-6 h-1 bg-white rounded-sm ml-1" />
                <div className="w-6 h-1 bg-white rounded-sm ml-2" />
                <div className="w-6 h-1 bg-white rounded-sm ml-3" />
              </div>
              <span className="text-white font-semibold text-lg">Elixir</span>
            </Link>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center justify-center gap-8 border border-white/10 rounded-full py-3 px-8 w-fit mx-auto text-sm">
            <Link
              href="/"
              className="text-white/90 hover:text-white/80 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="text-white/90 hover:text-white/80 transition-colors"
            >
              Events
            </Link>
            <Link
              href="/blogs"
              className="text-white/90 hover:text-white/80 transition-colors"
            >
              Blogs
            </Link>
            <Link
              href="/mentors"
              className="text-white/90 hover:text-white/80 transition-colors"
            >
              Mentors
            </Link>
          </div>

          {/* Auth actions */}
          <div className="flex items-center justify-end gap-4">
            {me?.user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={roleToDashboard(me.user.role)}
                  className="inline-flex items-center"
                >
                  <Avatar className="h-10 w-10 rounded-md">
                    {/* Update when backend provides avatar URL */}
                    <AvatarImage
                      src={me.user.avatar || ""}
                      alt={me.user.firstName}
                    />
                    <AvatarFallback className="rounded-lg">
                      {(me.user.firstName?.[0] || "").toUpperCase()}
                      {(me.user.lastName?.[0] || "").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <Button onClick={handleLogout} variant="gradient">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <AuthDialog
                  defaultMode="login"
                  trigger={
                    <div className="text-white hover:text-white/80 transition-colors mr-4 cursor-pointer">
                      Login
                    </div>
                  }
                />
                <AuthDialog
                  defaultMode="signup"
                  trigger={<Button variant="gradient">Get Started</Button>}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
