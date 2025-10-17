"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setToken, roleToDashboard } from "@/lib/auth";
import { api } from "@/lib/api";

function OAuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = params.get("token");
    const to = params.get("to") || "/";
    (async () => {
      if (token) {
        setToken(token);
        try {
          const me = await api.get("/auth/me");
          queryClient.setQueryData(["me"], me.data);
          await queryClient.invalidateQueries({ queryKey: ["me"] });
          router.replace(roleToDashboard(me.data.user?.role) || to);
        } catch {
          router.replace(to);
        }
      } else {
        router.replace("/");
      }
    })();
  }, [params, router, queryClient]);

  return null;
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
