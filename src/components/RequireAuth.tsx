"use client";
import { ReactNode, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RequireAuth({ children, allow }: { children: ReactNode; allow?: string[] }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get("/auth/me");
        if (allow && !allow.includes(me.data.user?.role)) return router.replace("/login");
        setOk(true);
      } catch {
        router.replace("/login");
      }
    })();
  }, [allow, router]);

  if (!ok) return null;
  return <>{children}</>;
}