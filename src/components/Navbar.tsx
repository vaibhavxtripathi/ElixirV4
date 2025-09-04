"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  const router = useRouter();
  const { data: me, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/auth/me")).data,
    retry: false,
  });

  const logout = () => {
    clearToken();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 z-50 w-full mx-auto">
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
            {isLoading ? (
              <span className="text-white">Loading...</span>
            ) : me?.user ? (
              <div className="flex items-center gap-3">
                <span className="text-white">Hi, {me.user.firstName}</span>
                <button
                  onClick={logout}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  Login
                </Link>
                <Button asChild variant="gradient">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
