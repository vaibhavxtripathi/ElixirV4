"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import Container from "@/components/container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled runtime application error:", error);
  }, [error]);

  return (
    <main className="min-h-[85vh] flex items-center justify-center pt-32 pb-16 px-4">
      <Container>
        <div className="max-w-md mx-auto text-center p-8 rounded-3xl border border-red-500/20 bg-[#080914]/80 backdrop-blur-md">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-white/60 text-sm mb-6 leading-relaxed">
            An unexpected error occurred while rendering this page. You can try refreshing or returning to the home page.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
