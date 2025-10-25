"use client";
import { ReactNode, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RequireAuth({
  children,
  allow,
}: {
  children: ReactNode;
  allow?: string[];
}) {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get("/auth/me");
        if (allow && !allow.includes(me.data.user?.role))
          return router.replace("/login");
        setOk(true);
      } catch (err: unknown) {
        // If rate limited, don't log the user out; retry once after a short delay
        const error = err as { response?: { status?: number } };
        const status = error?.response?.status;
        if (status === 429) {
          setTimeout(async () => {
            try {
              const me = await api.get("/auth/me");
              if (allow && !allow.includes(me.data.user?.role))
                return router.replace("/login");
              setOk(true);
            } catch (err2: unknown) {
              const error2 = err2 as { response?: { status?: number } };
              const status2 = error2?.response?.status;
              if (status2 === 401) {
                router.replace("/login");
              }
              // else keep user on page; maybe transient
            }
          }, 1000);
          return;
        }
        if (status === 401) {
          router.replace("/login");
        }
        // For other errors, do not force logout; keep current page to avoid flakiness
      }
    })();
  }, [allow, router]);

  if (!ok) return null;
  return <>{children}</>;
}
