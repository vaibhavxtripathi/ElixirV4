"use client";
import { ReactNode, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { GlobalLoader } from "./GlobalLoader";

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
    return <GlobalLoader text="Verifying authentication..." />;
  }

  // If not authenticated, return null (will redirect to login)
  if (!ok) return null;

  return <>{children}</>;
}
