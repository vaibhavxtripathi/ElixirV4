"use client";

import Link from "next/link";
import { ArrowLeft, Compass, Calendar, BookOpen, Users, Home } from "lucide-react";
import Container from "@/components/container";

export default function NotFound() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center pt-32 pb-16 px-4">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          {/* Glowing 404 badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} />
            <span>404 — Page Not Found</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Lost in the Cosmos?
          </h1>

          <p className="text-white/60 text-base sm:text-lg mb-8 leading-relaxed">
            The page or resource you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <Link
              href="/"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 text-white/80 hover:text-white transition-all group"
            >
              <Home className="w-5 h-5 mb-1.5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Home</span>
            </Link>

            <Link
              href="/events"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 text-white/80 hover:text-white transition-all group"
            >
              <Calendar className="w-5 h-5 mb-1.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Events</span>
            </Link>

            <Link
              href="/blogs"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 text-white/80 hover:text-white transition-all group"
            >
              <BookOpen className="w-5 h-5 mb-1.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Blogs</span>
            </Link>

            <Link
              href="/mentors"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 text-white/80 hover:text-white transition-all group"
            >
              <Users className="w-5 h-5 mb-1.5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Mentors</span>
            </Link>
          </div>

          {/* Primary Action Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Safe Ground
          </Link>
        </div>
      </Container>
    </main>
  );
}
