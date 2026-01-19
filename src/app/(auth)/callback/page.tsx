"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken, roleToDashboard } from "@/lib/auth";
import { api } from "@/lib/api";

function OAuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    const to = params.get("to") || "/";
    (async () => {
      if (token) {
        setToken(token);
        // Small delay to ensure token is stored before making request
        await new Promise((resolve) => setTimeout(resolve, 100));
        try {
          const me = await api.get("/auth/me");
          router.replace(roleToDashboard(me.data.user?.role) || to);
        } catch (error) {
          console.error("Failed to fetch user after login:", error);
          // Still redirect even if /auth/me fails - token is set
          router.replace(to);
        }
      } else {
        router.replace("/");
      }
    })();
  }, [params, router]);

  return null;
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
