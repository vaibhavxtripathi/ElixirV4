"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken, roleToDashboard } from "@/lib/auth";
import { api } from "@/lib/api";
import { GlobalLoader } from "@/components/GlobalLoader";

function OAuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const token = params.get("token");
    const to = params.get("to") || "/";
    (async () => {
      if (token) {
        setToken(token);
        try {
          const me = await api.get("/auth/me");
          router.replace(roleToDashboard(me.data.user?.role) || to);
        } catch {
          router.replace(to);
        }
      } else {
        router.replace("/");
      }
      setIsProcessing(false);
    })();
  }, [params, router]);

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
