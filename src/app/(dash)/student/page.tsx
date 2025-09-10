"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, ExternalLink } from "lucide-react";

interface Registration {
  id: string;
  event: {
    title: string;
    date: string;
    club?: { name: string };
  };
}

export default function StudentDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-registrations"],
    queryFn: async () => (await api.get("/events/registered")).data,
  });

  return (
    <RequireAuth allow={["STUDENT"]}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
              <p className="text-white/60">
                Track your event registrations and activities
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Browse Events
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/60">
                      Registered Events
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {data?.registrations?.length || 0}
                    </p>
                    <p className="text-xs text-green-400 mt-1">
                      Active registrations
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
                        (data?.registrations || []).filter(
                          (r: Registration) =>
                            new Date(r.event.date) > new Date()
                        ).length
                      }
                    </p>
                    <p className="text-xs text-green-400 mt-1">This month</p>
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
                      Clubs Joined
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {
                        new Set(
                          (data?.registrations || [])
                            .map((r: Registration) => r.event.club?.name)
                            .filter(Boolean)
                        ).size
                      }
                    </p>
                    <p className="text-xs text-green-400 mt-1">
                      Different clubs
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">My Registered Events</CardTitle>
              <CardDescription className="text-white/60">
                All your event registrations in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-white/60">
                  Loading your events...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-400">
                  Failed to load events
                </div>
              ) : (data?.registrations || []).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    No events registered yet
                  </h3>
                  <p className="text-white/60 mb-4">
                    Start exploring and register for events to see them here.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Browse Events
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(data?.registrations || []).map(
                    (registration: Registration) => (
                      <div
                        key={registration.id}
                        className="p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {registration.event.title}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                Registered
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-white/60">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(
                                  registration.event.date
                                ).toLocaleString()}
                              </div>
                              {registration.event.club && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {registration.event.club.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
