"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterButton({ eventId }: { eventId: string }) {
  const qc = useQueryClient();
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      (await api.post(`/events/${eventId}/register`)).data,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["my-registrations"] });
      router.push("/student");
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message || "Failed to register";
      setErr(msg);
      if (e?.response?.status === 401) router.push("/login");
      if (e?.response?.status === 403) alert("Only students can register.");
    },
  });

  return (
    <div className="mt-3">
      <button
        onClick={() => mutate()}
        disabled={isPending}
        className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
      >
        {isPending ? "Registering..." : "Register"}
      </button>
      {err && <p className="text-xs text-red-600 mt-1">{err}</p>}
    </div>
  );
}
