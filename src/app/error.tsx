"use client";

import { ErrorFallback } from "@/components/GlobalLoader";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback error={error} resetError={reset} />;
}
