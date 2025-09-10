"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Plus,
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  data: string;
}

export default function ClubHeadDashboard() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["events-list-own"],
    queryFn: async () => (await api.get("/events?page=1&limit=50")).data,
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    data: "",
    imageUrl: "",
  });
  const createMutation = useMutation({
    mutationFn: async () => (await api.post("/events", form)).data,
    onSuccess: () => {
      setForm({ title: "", description: "", data: "", imageUrl: "" });
      qc.invalidateQueries({ queryKey: ["events-list-own"] });
      alert("Event created");
    },
    onError: (e: any) =>
      alert(e?.response?.data?.message || "Failed to create event"),
  });

  return (
    <RequireAuth allow={["CLUB_HEAD"]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Club Head Dashboard
              </h1>
              <p className="text-white/60">
                Manage your club events and activities
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/60">
                      Total Events
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {data?.events?.length || 0}
                    </p>
                    <p className="text-xs text-green-400 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +2 this month
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/60">
                      Upcoming Events
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {
                        (data?.events || []).filter(
                          (e: Event) => new Date(e.data) > new Date()
                        ).length
                      }
                    </p>
                    <p className="text-xs text-green-400 mt-1">Scheduled</p>
                  </div>
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Clock className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/60">
                      Event Activity
                    </p>
                    <p className="text-2xl font-bold text-white">High</p>
                    <p className="text-xs text-green-400 mt-1">
                      Active engagement
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Activity className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create Event Form */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Create New Event</CardTitle>
              <CardDescription className="text-white/60">
                Add a new event to your club
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title" className="text-white">
                    Event Title
                  </Label>
                  <Input
                    id="event-title"
                    placeholder="Enter event title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-date" className="text-white">
                    Event Date
                  </Label>
                  <Input
                    id="event-date"
                    placeholder="2025-12-01T10:00:00Z"
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="event-description"
                  placeholder="Enter event description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={4}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-image" className="text-white">
                  Image URL (optional)
                </Label>
                <Input
                  id="event-image"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <Button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {createMutation.isPending ? "Creating..." : "Create Event"}
              </Button>
            </CardContent>
          </Card>

          {/* Events List */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Your Events</CardTitle>
              <CardDescription className="text-white/60">
                Manage and track your club events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-white/60">
                  Loading events...
                </div>
              ) : (data?.events || []).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    No events created yet
                  </h3>
                  <p className="text-white/60 mb-4">
                    Start by creating your first event for your club.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(data?.events || []).map((event: Event) => (
                    <div
                      key={event.id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">
                              {event.title}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {new Date(event.data) > new Date()
                                ? "Upcoming"
                                : "Past"}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/60 mb-3">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.data).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(event.data).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
