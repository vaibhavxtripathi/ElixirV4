"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <nav className="border-b px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">Elixir</Link>
        
        <div className="flex items-center gap-4">
          <Link href="/events">Events</Link>
          <Link href="/blogs">Blogs</Link>
          <Link href="/mentors">Mentors</Link>
          
          {isLoading ? (
            <span>Loading...</span>
          ) : me?.user ? (
            <div className="flex items-center gap-3">
              <span>Hi, {me.user.firstName}</span>
              <button onClick={logout} className="text-sm text-gray-600">Logout</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="px-3 py-1 border rounded">Login</Link>
              <Link href="/register" className="px-3 py-1 bg-indigo-600 text-white rounded">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}