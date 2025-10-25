"use client";
import { ReactNode, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

// Simple authentication loader component
function AuthLoader({ text }: { text: string }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        <div className="space-y-3">
          <div className="h-6 w-48 bg-white/10 rounded mx-auto animate-pulse" />
          <div className="h-4 w-32 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
        <p className="text-white/70 text-sm">{text}</p>
      </div>
    </div>
  );
}

export default function RequireAuth({
  children,
  allow,
}: {
  children: ReactNode;
  allow?: string[];
}) {
  const [ok, setOk] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get("/auth/me");
        if (allow && !allow.includes(me.data.user?.role)) {
          setIsChecking(false);
          return router.replace("/login");
        }
        setOk(true);
        setIsChecking(false);
      } catch (err: unknown) {
        // If rate limited, don't log the user out; retry once after a short delay
        const error = err as { response?: { status?: number } };
        const status = error?.response?.status;
        if (status === 429) {
          setTimeout(async () => {
            try {
              const me = await api.get("/auth/me");
              if (allow && !allow.includes(me.data.user?.role)) {
                setIsChecking(false);
                return router.replace("/login");
              }
              setOk(true);
              setIsChecking(false);
            } catch (err2: unknown) {
              const error2 = err2 as { response?: { status?: number } };
              const status2 = error2?.response?.status;
              if (status2 === 401) {
                setIsChecking(false);
                router.replace("/login");
              }
              // else keep user on page; maybe transient
              setIsChecking(false);
            }
          }, 1000);
          return;
        }
        if (status === 401) {
          setIsChecking(false);
          router.replace("/login");
        }
        // For other errors, do not force logout; keep current page to avoid flakiness
        setIsChecking(false);
      }
    })();
  }, [allow, router]);

  // Show loader while checking authentication
  if (isChecking) {
    return <AuthLoader text="Verifying authentication..." />;
  }

  // If not authenticated, return null (will redirect to login)
  if (!ok) return null;

  return <>{children}</>;
}
