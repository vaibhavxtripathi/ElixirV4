"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { clearToken, roleToDashboard } from "@/lib/auth";
import Link from "next/link";
import { Button } from "./ui/button";
import AuthDialog from "@/components/auth-dialog";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav
      className="fixed top-0 z-50 w-full mx-auto"
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="backdrop-blur-md border border-blue-300/20 rounded-md px-4 sm:px-6 py-4 sm:py-4">
        <div className="flex items-center justify-between w-full backdrop-saturate-200">
          {/* Logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              {/* <div className="flex flex-col gap-1">
                <div className="w-4 h-1 sm:w-6 sm:h-1 bg-white rounded-sm" />
                <div className="w-4 h-1 sm:w-6 sm:h-1 bg-white rounded-sm ml-1" />
                <div className="w-4 h-1 sm:w-6 sm:h-1 bg-white rounded-sm ml-2" />
                <div className="w-4 h-1 sm:w-6 sm:h-1 bg-white rounded-sm ml-3" />
              </div> */}
              <Image src="/elixir-white.png" alt="Elixir" width={30} height={30} />
              <span className="text-white font-semibold text-base sm:text-lg">
                Elixir
              </span>
            </Link>
          </div>

          {/* Desktop Nav links */}
          <div className="hidden xl:flex items-center justify-center gap-8 border bord3r-blue-300/50 rounded-full py-3 px-8 w-fit absolute left-1/2 -translate-x-1/2 text-sm">
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

          {/* Desktop Auth actions */}
          <div className="hidden lg:flex items-center justify-end gap-3 sm:gap-4">
            {me?.user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href={roleToDashboard(me.user.role)}
                  className="inline-flex items-center"
                >
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 rounded-md">
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
                <Button
                  onClick={handleLogout}
                  variant="gradient"
                  size="sm"
                  className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <AuthDialog
                  defaultMode="login"
                  trigger={
                    <div className="text-white hover:text-white/80 transition-colors mr-2 sm:mr-4 cursor-pointer text-sm">
                      Login
                    </div>
                  }
                />
                <AuthDialog
                  defaultMode="signup"
                  trigger={
                    <Button
                      variant="gradient"
                      size="sm"
                      className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                    >
                      Get Started
                    </Button>
                  }
                />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {me?.user ? (
              <Link
                href={roleToDashboard(me.user.role)}
                className="inline-flex items-center"
              >
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 rounded-md">
                  <AvatarImage
                    src={me.user.avatar || ""}
                    alt={me.user.firstName}
                  />
                  <AvatarFallback className="rounded-lg text-xs">
                    {(me.user.firstName?.[0] || "").toUpperCase()}
                    {(me.user.lastName?.[0] || "").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <AuthDialog
                defaultMode="login"
                trigger={
                  <Button
                    variant="gradient"
                    size="sm"
                    className="text-xs px-3 py-1.5 h-7"
                  >
                    Login
                  </Button>
                }
              />
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-white/80 transition-colors p-1"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="lg:hidden overflow-hidden"
        >
          <div className="mt-4 pt-4 border-t border-white/10">
            <motion.div
              initial={false}
              animate={{
                y: isMobileMenuOpen ? 0 : -20,
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
              transition={{
                duration: 0.2,
                delay: isMobileMenuOpen ? 0.1 : 0,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="flex flex-col gap-6"
            >
              {/* Mobile nav links */}
              <div className="flex flex-col gap-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "/events", label: "Events" },
                  { href: "/blogs", label: "Blogs" },
                  { href: "/mentors", label: "Mentors" },
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={false}
                    animate={{
                      x: isMobileMenuOpen ? 0 : -20,
                      opacity: isMobileMenuOpen ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.2,
                      delay: isMobileMenuOpen ? 0.15 + index * 0.05 : 0,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      className="block text-white/90 hover:text-white transition-colors text-base py-3 px-2 rounded-lg hover:bg-white/5 backdrop-blur-sm border border-transparent hover:border-white/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile auth actions */}
              <motion.div
                initial={false}
                animate={{
                  y: isMobileMenuOpen ? 0 : 20,
                  opacity: isMobileMenuOpen ? 1 : 0,
                }}
                transition={{
                  duration: 0.2,
                  delay: isMobileMenuOpen ? 0.35 : 0,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="pt-4 border-t border-white/10"
              >
                {me?.user ? (
                  <Button
                    onClick={handleLogout}
                    variant="gradient"
                    size="sm"
                    className="w-full py-2 text-sm font-medium"
                  >
                    Logout
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <AuthDialog
                      defaultMode="signup"
                      trigger={
                        <Button
                          variant="gradient"
                          size="sm"
                          className="w-full py-2 text-sm font-medium"
                        >
                          Get Started
                        </Button>
                      }
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
