"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setToken, roleToDashboard } from "@/lib/auth";
import { api } from "@/lib/api";
import { GlobalLoader } from "@/components/GlobalLoader";

function OAuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(true);

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
      setIsProcessing(false);
    })();
  }, [params, router, queryClient]);

  if (isProcessing) {
    return <GlobalLoader text="Completing authentication..." />;
  }

  return null;
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
