"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";
import { useState } from "react";

export default function AdminDashboard() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["users-list"],
    queryFn: async () => (await api.get("/users")).data,
  });

  const { data: clubsData } = useQuery({
    queryKey: ["clubs-list"],
    queryFn: async () => (await api.get("/clubs")).data,
  });

  const changeRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) =>
      (await api.put(`/users/${userId}/role`, { newRole })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users-list"] });
      alert("Role updated");
    },
    onError: (e: any) => alert(e?.response?.data?.message || "Failed to change role"),
  });

  const assignClub = useMutation({
    mutationFn: async ({ userId, clubId }: { userId: string; clubId: string }) =>
      (await api.put(`/users/${userId}/club`, { clubId })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users-list"] });
      alert("Assigned to club");
    },
    onError: (e: any) => alert(e?.response?.data?.message || "Failed to assign"),
  });

  const [clubSel, setClubSel] = useState<Record<string, string>>({});

  return (
    <RequireAuth allow={["ADMIN"]}>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-600">Failed to load users</p>}

        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Club</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data?.users || []).map((u: any) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.firstName} {u.lastName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.club?.name || "-"}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => changeRole.mutate({ userId: u.id, newRole: "STUDENT" })}
                      className="px-2 py-1 border rounded"
                    >
                      Student
                    </button>
                    <button
                      onClick={() => changeRole.mutate({ userId: u.id, newRole: "CLUB_HEAD" })}
                      className="px-2 py-1 border rounded"
                    >
                      Club Head
                    </button>
                    <button
                      onClick={() => changeRole.mutate({ userId: u.id, newRole: "ADMIN" })}
                      className="px-2 py-1 border rounded"
                    >
                      Admin
                    </button>

                    <div className="inline-flex items-center gap-2 ml-3">
                      <select
                        className="border rounded px-2 py-1"
                        value={clubSel[u.id] || ""}
                        onChange={(e) => setClubSel({ ...clubSel, [u.id]: e.target.value })}
                      >
                        <option value="">Select club</option>
                        {(clubsData?.clubs || []).map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const clubId = clubSel[u.id];
                          if (clubId) assignClub.mutate({ userId: u.id, clubId });
                        }}
                        className="px-2 py-1 border rounded"
                      >
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && (data?.users || []).length === 0 && (
                <tr><td className="p-3" colSpan={5}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </RequireAuth>
  );
}