"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";
import { useState } from "react";

export default function ClubHeadDashboard() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["events-list-own"],
    queryFn: async () => (await api.get("/events?page=1&limit=50")).data,
  });

  const [form, setForm] = useState({ title: "", description: "", data: "", imageUrl: "" });
  const createMutation = useMutation({
    mutationFn: async () => (await api.post("/events", form)).data,
    onSuccess: () => {
      setForm({ title: "", description: "", data: "", imageUrl: "" });
      qc.invalidateQueries({ queryKey: ["events-list-own"] });
      alert("Event created");
    },
    onError: (e: any) => alert(e?.response?.data?.message || "Failed to create event"),
  });

  return (
    <RequireAuth allow={["CLUB_HEAD"]}>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Club Head Dashboard</h1>

        <section className="mb-10">
          <h2 className="font-semibold mb-3">Create Event</h2>
          <div className="grid gap-3">
            <input
              className="border rounded px-3 py-2"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="border rounded px-3 py-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Image URL (optional)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Date (ISO) e.g. 2025-12-01T10:00:00Z"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
            />
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {createMutation.isPending ? "Creating..." : "Create Event"}
            </button>
          </div>
        </section>

        <section>
          <h2 className="font-semibold mb-3">Upcoming Events</h2>
          {isLoading && <p>Loading...</p>}
          <div className="space-y-3">
            {(data?.events || []).map((e: any) => (
              <div key={e.id} className="rounded border p-4">
                <div className="text-sm text-gray-500">{new Date(e.date).toLocaleString()}</div>
                <div className="font-semibold">{e.title}</div>
                <div className="text-sm text-gray-600">{e.description}</div>
              </div>
            ))}
            {!isLoading && (data?.events || []).length === 0 && <p className="text-gray-600">No events yet.</p>}
          </div>
        </section>
      </main>
    </RequireAuth>
  );
}