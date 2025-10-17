"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/RichTextEditor";
import { Calendar, Users, Clock, ExternalLink, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { containerStagger, fadeInUp, fadeIn } from "@/lib/motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { EventDetailsDialog } from "@/components/EventDetailsDialog";
import * as Logos from "@/icons/general";
import { toast } from "sonner";

interface Registration {
  id: string;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    imageUrl?: string;
    club?: { name: string };
  };
}

function StudentDashboardContent() {
  const router = useRouter();
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "overview";
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-registrations"],
    queryFn: async () => (await api.get("/events/registered")).data,
  });

  // Blog: my submissions
  const { data: myBlogs } = useQuery({
    queryKey: ["my-blogs"],
    queryFn: async () => (await api.get("/blogs/me")).data,
    enabled: view === "my-blogs",
  });

  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });

  const submitBlog = useMutation({
    mutationFn: async () => (await api.post("/blogs/submit", blogForm)).data,
    onSuccess: () => {
      setBlogForm({ title: "", content: "", imageUrl: "" });
      toast.success("Blog submitted for review");
      qc.invalidateQueries({ queryKey: ["my-blogs"] });
    },
  });

  // UI state for dialogs
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Registration["event"] | null>(
    null
  );

  return (
    <RequireAuth allow={["STUDENT"]}>
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
                {view === "my-blogs" ? "My Blogs" : "My Dashboard"}
              </h1>
              <p className="text-white/60 text-sm sm:text-base">
                {view === "my-blogs"
                  ? "Create and track your blog submissions"
                  : "Track your event registrations and activities"}
              </p>
            </div>
            {view !== "my-blogs" && (
              <Button
                variant="gradient"
                onClick={() => {
                  router.push("/events");
                }}
                className="text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Browse Events
              </Button>
            )}
          </motion.div>

          {view !== "my-blogs" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <motion.div variants={fadeInUp}>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-white/60">
                          Registered Events
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-white">
                          {data?.registrations?.length || 0}
                        </p>
                        <p className="text-xs text-green-400 mt-1">
                          Active registrations
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
                            (data?.registrations || []).filter(
                              (r: Registration) =>
                                new Date(r.event.date) > new Date()
                            ).length
                          }
                        </p>
                        <p className="text-xs text-green-400 mt-1">
                          This month
                        </p>
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
                          Clubs Joined
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-white">
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
                      <div className="p-2 sm:p-3 bg-purple-500/20 rounded-lg">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {view === "my-blogs" && (
            <motion.div variants={fadeIn}>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Submit a Blog</CardTitle>
                  <CardDescription className="text-white/60">
                    Create a draft blog for admin review
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="stu-blog-title"
                        className="text-white text-sm"
                      >
                        Title
                      </Label>
                      <Input
                        id="stu-blog-title"
                        value={blogForm.title}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, title: e.target.value })
                        }
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50 text-sm"
                        placeholder="Enter blog title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="stu-blog-image"
                        className="text-white text-sm"
                      >
                        Image URL
                      </Label>
                      <Input
                        id="stu-blog-image"
                        value={blogForm.imageUrl}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, imageUrl: e.target.value })
                        }
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50 text-sm"
                        placeholder="https://example.com/cover.jpg"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="stu-blog-content"
                      className="text-white text-sm"
                    >
                      Content
                    </Label>
                    <RichTextEditor
                      value={blogForm.content}
                      onChange={(html) =>
                        setBlogForm({ ...blogForm, content: html })
                      }
                      placeholder="Write your blog content here..."
                    />
                  </div>
                  <div>
                    <Button
                      onClick={() => submitBlog.mutate()}
                      disabled={submitBlog.isPending}
                      variant="gradientOutline"
                      className="w-full mt-2 bg-blue-500 text-white text-sm sm:text-base"
                    >
                      {submitBlog.isPending
                        ? "Submitting..."
                        : "Submit for Review"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {view === "my-blogs" && (
            <motion.div variants={fadeIn}>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">My Blogs</CardTitle>
                  <CardDescription className="text-white/60">
                    Your submissions and statuses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(myBlogs?.blogs || []).length === 0 ? (
                      <div className="text-white/60 text-center py-8">
                        No blogs yet. Submit one above.
                      </div>
                    ) : (
                      (myBlogs?.blogs || []).map(
                        (b: {
                          id: string;
                          title: string;
                          status: string;
                          createdAt: string;
                        }) => (
                          <div
                            key={b.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 gap-3 sm:gap-0"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm sm:text-base truncate">
                                {b.title}
                              </p>
                              <p className="text-white/60 text-xs sm:text-sm">
                                {new Date(b.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs border-white/20 text-white/80 shrink-0 self-start sm:self-center"
                            >
                              {b.status}
                            </Badge>
                          </div>
                        )
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {view !== "my-blogs" && (
            <motion.div variants={fadeIn}>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-base sm:text-lg">
                    My Registered Events
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm">
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
                    <div className="text-center py-8 sm:py-12">
                      <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-white/20 mx-auto mb-4" />
                      <h3 className="text-base sm:text-lg font-medium text-white mb-2">
                        No events registered yet
                      </h3>
                      <p className="text-white/60 mb-4 text-sm sm:text-base px-4">
                        Start exploring and register for events to see them
                        here.
                      </p>
                      <Button
                        variant="gradient"
                        onClick={() => {
                          router.push("/events");
                        }}
                        className="text-xs sm:text-sm px-3 sm:px-4 py-2"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Browse Events
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {(data?.registrations || []).map(
                        (registration: Registration) => (
                          <div
                            key={registration.id}
                            className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10"
                          >
                            {/* Mobile Layout */}
                            <div className="flex flex-col sm:hidden space-y-3">
                              {/* Event image */}
                              <div className="w-full h-32 rounded-md overflow-hidden bg-white/10 border border-white/10">
                                {registration.event.imageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={registration.event.imageUrl}
                                    alt={registration.event.title}
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
                                    {registration.event.title}
                                  </h3>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs shrink-0",
                                      new Date(registration.event.date) >
                                        new Date()
                                        ? "bg-green-500/5 text-green-400 border border-green-500/20"
                                        : "bg-red-500/5 text-red-400 border border-red-500/20"
                                    )}
                                  >
                                    {new Date(registration.event.date) >
                                    new Date()
                                      ? "Upcoming"
                                      : "Past"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-white/60 line-clamp-2">
                                  {registration.event.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {(() => {
                                      const d = new Date(
                                        registration.event.date
                                      );
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
                                      const d = new Date(
                                        registration.event.date
                                      );
                                      return isNaN(d.getTime())
                                        ? "—"
                                        : d.toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          });
                                    })()}
                                  </div>
                                  {registration.event.club?.name && (
                                    <div className="flex items-center gap-1">
                                      {(() => {
                                        const logo =
                                          registration.event.club?.name.toUpperCase() +
                                          "Logo";
                                        const Comp = logo
                                          ? (
                                              Logos as Record<
                                                string,
                                                React.ComponentType<{
                                                  className?: string;
                                                }>
                                              >
                                            )[logo]
                                          : undefined;
                                        return Comp ? (
                                          <Comp className="w-3 h-3" />
                                        ) : (
                                          <Building2 className="w-3 h-3 text-white/60" />
                                        );
                                      })()}
                                      <span className="truncate">
                                        {registration.event.club?.name}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/20 text-white hover:bg-white/10 rounded-md text-xs px-3 py-1.5 w-full"
                                  onClick={() => {
                                    setActiveEvent(registration.event);
                                    setDetailsOpen(true);
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden sm:flex items-center gap-4">
                              {/* Event image */}
                              <div className="w-32 h-24 rounded-md overflow-hidden bg-white/10 border border-white/10 shrink-0">
                                {registration.event.imageUrl ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={registration.event.imageUrl}
                                    alt={registration.event.title}
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
                                    {registration.event.title}
                                  </h3>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs",
                                      new Date(registration.event.date) >
                                        new Date()
                                        ? "bg-green-500/5 text-green-400 border border-green-500/20"
                                        : "bg-red-500/5 text-red-400 border border-red-500/20"
                                    )}
                                  >
                                    {new Date(registration.event.date) >
                                    new Date()
                                      ? "Upcoming"
                                      : "Past"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-white/60 mb-3">
                                  {registration.event.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-white/60">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {(() => {
                                      const d = new Date(
                                        registration.event.date
                                      );
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
                                      const d = new Date(
                                        registration.event.date
                                      );
                                      return isNaN(d.getTime())
                                        ? "—"
                                        : d.toLocaleTimeString(undefined, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          });
                                    })()}
                                  </div>
                                  {registration.event.club?.name && (
                                    <div className="flex items-center gap-1">
                                      {(() => {
                                        const logo =
                                          registration.event.club?.name.toUpperCase() +
                                          "Logo";
                                        const Comp = logo
                                          ? (
                                              Logos as Record<
                                                string,
                                                React.ComponentType<{
                                                  className?: string;
                                                }>
                                              >
                                            )[logo]
                                          : undefined;
                                        return Comp ? (
                                          <Comp className="w-5 h-5" />
                                        ) : (
                                          <Building2 className="w-5 h-5 text-white/60" />
                                        );
                                      })()}
                                      {registration.event.club?.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Actions */}
                              <div className="flex items-center gap-2 self-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/20 text-white hover:bg-white/10 rounded-md"
                                  onClick={() => {
                                    setActiveEvent(registration.event);
                                    setDetailsOpen(true);
                                  }}
                                >
                                  View Details
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
            </motion.div>
          )}

          {view !== "my-blogs" && (
            <EventDetailsDialog
              open={detailsOpen}
              event={activeEvent ?? undefined}
              onClose={() => setDetailsOpen(false)}
              logo={activeEvent?.club?.name.toUpperCase() + "Logo"}
            />
          )}
        </motion.div>
      </DashboardLayout>
    </RequireAuth>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={null}>
      <StudentDashboardContent />
    </Suspense>
  );
}
