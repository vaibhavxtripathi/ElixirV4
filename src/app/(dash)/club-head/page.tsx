"use client";

import dynamic from "next/dynamic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";

// Dynamically import components to prevent prerendering issues
const DashboardLayout = dynamic(
  () =>
    import("@/components/dashboard-layout").then((mod) => ({
      default: mod.DashboardLayout,
    })),
  { ssr: false }
);
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
import { Calendar, Plus, TrendingUp, Activity, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { DateTimePicker } from "@/components/date-time-picker";
import { motion, AnimatePresence } from "framer-motion";
import { containerStagger, fadeInUp } from "@/lib/motion";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EditEventDialog } from "@/components/EditEventDialog";
import { EventRegistrationsDialog } from "@/components/EventRegistrationsDialog";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date: string; // backend returns `date`
  data?: string; // used only when sending updates/creates
  club?: { name: string; imageUrl?: string };
}

export default function ClubHeadDashboard() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["events-list-own"],
    queryFn: async () => (await api.get("/events/mine")).data,
  });
  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/auth/me")).data,
    retry: false,
  });

  const clubName: string | undefined = meData?.user?.club?.name;
  const myEvents: Event[] = data?.events || [];

  const [show, setShow] = useState(false);
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
      setShow(false);
      qc.invalidateQueries({ queryKey: ["events-list-own"] });
      toast.success("Event created");
    },
    onError: (e: unknown) => {
      const maybeAxiosError = e as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        maybeAxiosError.response?.data?.message || "Failed to create event"
      );
    },
  });

  // UI state for dialogs
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [registrationsOpen, setRegistrationsOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/events/${id}`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events-list-own"] });
      toast.success("Event deleted");
    },
    onError: (e: unknown) => {
      const maybeAxiosError = e as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        maybeAxiosError.response?.data?.message || "Failed to delete event"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string } & Partial<Event>) => {
      const { id, title, description, data, imageUrl } = payload;
      const body: Record<string, unknown> = {};
      if (typeof title === "string" && title.trim().length > 0)
        body.title = title.trim();
      if (typeof description === "string" && description.trim().length >= 10)
        body.description = description.trim();
      if (typeof data === "string" && data) body.data = data;
      if (typeof imageUrl === "string" && imageUrl.trim().length > 0)
        body.imageUrl = imageUrl.trim();
      return (await api.put(`/events/${id}`, body)).data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events-list-own"] });
      toast.success("Event updated");
    },
    onError: (e: unknown) => {
      const maybeAxiosError = e as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        maybeAxiosError.response?.data?.message || "Failed to update event"
      );
    },
  });

  return (
    <RequireAuth allow={["CLUB_HEAD"]}>
      <DashboardLayout>
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="show"
          variants={containerStagger(0.06, 0)}
        >
          {/* Header */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0"
            variants={fadeInUp}
          >
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                {clubName
                  ? `${clubName} Club Dashboard`
                  : "Club Head Dashboard"}
              </h1>
              <p className="text-white/60 text-sm sm:text-base">
                Manage your club events and activities
              </p>
            </div>
            <Button
              variant="gradient"
              onClick={() => {
                setShow(!show);
              }}
              className="text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {show ? "Hide Form" : "Create Event"}
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <motion.div variants={fadeInUp}>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white/60">
                        Total Events
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-white">
                        {myEvents.length}
                      </p>
                      <p className="text-xs text-green-400 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +2 this month
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white/60">
                        Upcoming Events
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-white">
                        {
                          myEvents.filter(
                            (e: Event) => new Date(e.date) > new Date()
                          ).length
                        }
                      </p>
                      <p className="text-xs text-green-400 mt-1">Scheduled</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-green-500/20 rounded-lg">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-white/60">
                        Event Activity
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-white">
                        High
                      </p>
                      <p className="text-xs text-green-400 mt-1">
                        Active engagement
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 bg-purple-500/20 rounded-lg">
                      <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Create Event Form */}
          <AnimatePresence initial={false} mode="wait">
            {show && (
              <motion.div
                key="create-event-form"
                variants={fadeInUp}
                initial="hidden"
                animate="show"
                exit="hidden"
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Create New Event
                    </CardTitle>
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
                          Event Date & Time
                        </Label>
                        <DateTimePicker
                          value={form.data}
                          onChange={(iso) => setForm({ ...form, data: iso })}
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
                        Image URL
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
                      {createMutation.isPending
                        ? "Creating..."
                        : "Create Event"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Events List */}
          <motion.div variants={fadeInUp}>
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
                ) : myEvents.length === 0 ? (
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
                  <div className="space-y-3 sm:space-y-4">
                    {myEvents.map((event: Event) => (
                      <div
                        key={event.id}
                        className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        {/* Mobile Layout */}
                        <div className="flex flex-col sm:hidden space-y-3">
                          {/* Event image */}
                          <div className="w-full h-32 rounded-md overflow-hidden bg-white/10 border border-white/10">
                            {event.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-full object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          {/* Details */}
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-base font-semibold text-white flex-1">
                                {event.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs shrink-0",
                                  new Date(event.date) > new Date()
                                    ? "bg-green-500/5 text-green-400 border border-green-500/20"
                                    : "bg-red-500/5 text-red-400 border border-red-500/20"
                                )}
                              >
                                {new Date(event.date) > new Date()
                                  ? "Upcoming"
                                  : "Past"}
                              </Badge>
                            </div>
                            <p className="text-xs text-white/60 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-white/60">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {(() => {
                                  const d = new Date(event.date);
                                  return isNaN(d.getTime())
                                    ? "—"
                                    : d.toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "2-digit",
                                      });
                                })()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {(() => {
                                  const d = new Date(event.date);
                                  return isNaN(d.getTime())
                                    ? "—"
                                    : d.toLocaleTimeString(undefined, {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      });
                                })()}
                              </div>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white/95 hover:bg-white/10 rounded-md text-xs px-3 py-1.5 flex-1"
                              onClick={() => {
                                setActiveEvent(event);
                                setRegistrationsOpen(true);
                              }}
                            >
                              Registrations
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white/95 hover:bg-white/10 rounded-md text-xs px-3 py-1.5 flex-1"
                              onClick={() => {
                                setActiveEvent(event);
                                setEditOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-md text-xs px-3 py-1.5"
                              onClick={() => {
                                setActiveEvent(event);
                                setConfirmOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:flex items-center gap-4">
                          {/* Event image */}
                          <div className="w-32 h-24 rounded-md overflow-hidden bg-white/10 border border-white/10 shrink-0">
                            {event.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-full object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {event.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  new Date(event.date) > new Date()
                                    ? "bg-green-500/5 text-green-400 border border-green-500/20"
                                    : "bg-red-500/5 text-red-400 border border-red-500/20"
                                )}
                              >
                                {new Date(event.date) > new Date()
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
                                {(() => {
                                  const d = new Date(event.date);
                                  return isNaN(d.getTime())
                                    ? "—"
                                    : d.toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                      });
                                })()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {(() => {
                                  const d = new Date(event.date);
                                  return isNaN(d.getTime())
                                    ? "—"
                                    : d.toLocaleTimeString(undefined, {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      });
                                })()}
                              </div>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-2 self-center">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white/95 hover:bg-white/10 rounded-md"
                              onClick={() => {
                                setActiveEvent(event);
                                setRegistrationsOpen(true);
                              }}
                            >
                              View Registrations
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white/95 hover:bg-white/10 rounded-md"
                              onClick={() => {
                                setActiveEvent(event);
                                setEditOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-md"
                              onClick={() => {
                                setActiveEvent(event);
                                setConfirmOpen(true);
                              }}
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
          </motion.div>

          {/* Dialogs */}
          <ConfirmDialog
            open={confirmOpen}
            title="Delete event?"
            description={
              <span>
                This action cannot be undone. Event: <b>{activeEvent?.title}</b>
              </span>
            }
            confirmText="Delete"
            onCancel={() => setConfirmOpen(false)}
            onConfirm={async () => {
              if (!activeEvent) return;
              await deleteMutation.mutateAsync(activeEvent.id);
              setConfirmOpen(false);
              setActiveEvent(null);
            }}
            loading={deleteMutation.isPending}
          />
          <EditEventDialog
            open={editOpen}
            event={
              activeEvent
                ? {
                    id: activeEvent.id,
                    title: activeEvent.title,
                    description: activeEvent.description,
                    data: activeEvent.date,
                    imageUrl: activeEvent.imageUrl,
                  }
                : undefined
            }
            onClose={() => setEditOpen(false)}
            onSave={async (payload) => {
              if (!activeEvent) return;
              await updateMutation.mutateAsync({
                id: activeEvent.id,
                ...payload,
              });
              setEditOpen(false);
              setActiveEvent(null);
            }}
            loading={updateMutation.isPending}
          />
          <EventRegistrationsDialog
            open={registrationsOpen}
            eventId={activeEvent?.id}
            onClose={() => setRegistrationsOpen(false)}
          />
        </motion.div>
      </DashboardLayout>
    </RequireAuth>
  );
}
