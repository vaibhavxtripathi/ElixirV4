"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";

export default function StudentDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-registrations"],
    queryFn: async () => (await api.get("/events/registered")).data,
  });

  return (
    <RequireAuth allow={["STUDENT"]}>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Registered Events</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-600">Failed to load</p>}
        <div className="space-y-3">
          {(data?.registrations || []).map((r: any) => (
            <div key={r.id} className="rounded border p-4">
              <div className="text-sm text-gray-500">{new Date(r.event.date).toLocaleString()}</div>
              <div className="font-semibold">{r.event.title}</div>
              <div className="text-sm text-gray-600">Club: {r.event.club?.name}</div>
              <div className="text-xs text-gray-500">Registered: {new Date(r.registeredAt).toLocaleString()}</div>
            </div>
          ))}
          {!isLoading && (data?.registrations || []).length === 0 && (
            <p className="text-gray-600">No registrations yet.</p>
          )}
        </div>
      </main>
    </RequireAuth>
  );
}