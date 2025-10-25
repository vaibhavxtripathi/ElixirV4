"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import RequireAuth from "@/components/RequireAuth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Users, Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { containerStagger, fadeInUp, fadeIn } from "@/lib/motion";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DateTimePicker } from "@/components/date-time-picker";
import { StatCard } from "@/components/StatCard";
import {
  DataTable,
  schema as settingsTableSchema,
} from "@/components/data-table";
import { z } from "zod";
import { MoreHorizontal } from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  club?: { name: string };
}

interface Club {
  id: string;
  name: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
  club?: { name: string };
}

interface Blog {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface Mentor {
  id: string;
  name: string;
  expertise: string;
  linkedInUrl: string;
  imageUrl: string;
  club?: { name: string };
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "overview";
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    imageUrl: "",
    status: "DRAFT",
  });

  const createBlog = useMutation({
    mutationFn: async () => (await api.post("/blogs", blogForm)).data,
    onSuccess: () => {
      setBlogForm({ title: "", content: "", imageUrl: "", status: "DRAFT" });
      toast.success("Blog created");
      // Invalidate all relevant queries to refresh data
      qc.invalidateQueries({ queryKey: ["blogs"] });
      qc.invalidateQueries({ queryKey: ["users-list"] }); // For admin dashboard
    },
    onError: (e: unknown) => {
      const maybeAxiosError = e as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        maybeAxiosError.response?.data?.message || "Failed to create blog"
      );
    },
  });
  const qc = useQueryClient();
  // Simple queries without complex staggering
  const { data, isLoading, error } = useQuery({
    queryKey: ["users-list"],
    queryFn: async () => (await api.get("/users")).data,
  });

  const { data: clubsData } = useQuery({
    queryKey: ["clubs-list"],
    queryFn: async () => (await api.get("/clubs")).data,
  });

  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: async () => (await api.get("/events")).data,
  });

  const { data: blogsData } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await api.get("/blogs/admin")).data,
  });
  const approveBlog = useMutation({
    mutationFn: async (id: string) =>
      (await api.post(`/blogs/${id}/approve`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog approved (published)");
    },
    onError: () => toast.error("Failed to approve blog"),
  });
  const archiveBlog = useMutation({
    mutationFn: async (id: string) =>
      (await api.post(`/blogs/${id}/archive`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Blog archived");
    },
    onError: () => toast.error("Failed to archive blog"),
  });

  const { data: mentorsData } = useQuery({
    queryKey: ["mentors"],
    queryFn: async () => (await api.get("/mentors")).data,
  });

  const { data: testimonialsData } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => (await api.get("/testimonials")).data,
  });

  // Admin create-event form state and mutation (aligned with club-head)
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    data: "",
    imageUrl: "",
  });

  const createEvent = useMutation({
    mutationFn: async () => (await api.post("/events", eventForm)).data,
    onSuccess: () => {
      setEventForm({ title: "", description: "", data: "", imageUrl: "" });
      qc.invalidateQueries({ queryKey: ["events"] });
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

  const createTestimonial = useMutation({
    mutationFn: async () => {
      const data = {
        name: testimonialForm.name.trim(),
        content: testimonialForm.content.trim(),
        batchYear: parseInt(testimonialForm.batchYear),
        imageUrl: testimonialForm.imageUrl.trim() || undefined,
      };
      return (await api.post("/testimonials", data)).data;
    },
    onSuccess: () => {
      setTestimonialForm({
        name: "",
        content: "",
        batchYear: "",
        imageUrl: "",
      });
      toast.success("Testimonial created");
      qc.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (e: unknown) => {
      const maybeAxiosError = e as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        maybeAxiosError.response?.data?.message ||
          "Failed to create testimonial"
      );
    },
  });

  // Add these after existing state and mutations
  const [mentorForm, setMentorForm] = useState({
    name: "",
    expertise: "",
    linkedInUrl: "",
    imageUrl: "",
    clubId: "",
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    content: "",
    batchYear: "",
    imageUrl: "",
  });

  const createMentor = useMutation({
    mutationFn: async () => (await api.post("/mentors", mentorForm)).data,
    onSuccess: () => {
      setMentorForm({
        name: "",
        expertise: "",
        linkedInUrl: "",
        imageUrl: "",
        clubId: "",
      });
      toast.success("Mentor created");
      // Invalidate all relevant queries to refresh data
      qc.invalidateQueries({ queryKey: ["mentors"] });
      qc.invalidateQueries({ queryKey: ["users-list"] }); // For admin dashboard
    },
    onError: (e: unknown) => {
      const maybeAxiosError = e as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        maybeAxiosError.response?.data?.message || "Failed to create mentor"
      );
    },
  });

  // const changeRole = useMutation({
  //   mutationFn: async ({
  //     userId,
  //     newRole,
  //   }: {
  //     userId: string;
  //     newRole: string;
  //   }) => (await api.put(`/users/${userId}/role`, { newRole })).data,
  //   onSuccess: () => {
  //     qc.invalidateQueries({ queryKey: ["users-list"] });
  //     toast.success("Role updated");
  //   },
  //   onError: (e: unknown) => {
  //     const maybeAxiosError = e as {
  //       response?: { data?: { message?: string } };
  //     };
  //     toast.error(
  //       maybeAxiosError.response?.data?.message || "Failed to change role"
  //     );
  //   },
  // });

  // const assignClub = useMutation({
  //   mutationFn: async ({
  //     userId,
  //     clubId,
  //   }: {
  //     userId: string;
  //     clubId: string;
  //   }) => (await api.put(`/users/${userId}/club`, { clubId })).data,
  //   onSuccess: () => {
  //     qc.invalidateQueries({ queryKey: ["users-list"] });
  //     toast.success("Assigned to club");
  //   },
  //   onError: (e: unknown) => {
  //     const maybeAxiosError = e as {
  //       response?: { data?: { message?: string } };
  //     };
  //     toast.error(
  //       maybeAxiosError.response?.data?.message || "Failed to assign"
  //     );
  //   },
  // });

  // const [clubSel, setClubSel] = useState<Record<string, string>>({});

  // Calculate metrics
  const totalUsers = data?.users?.length ?? 0;
  const totalEvents = eventsData?.events?.length ?? 0;
  const totalBlogs = blogsData?.blogs?.length ?? 0;
  const totalMentors = mentorsData?.mentors?.length ?? 0;
  const totalClubs = clubsData?.clubs?.length ?? 0;

  // Sample data for charts (you can replace with real data)
  // const userGrowthData = [
  //   { month: "Jan", users: 65 },
  //   { month: "Feb", users: 78 },
  //   { month: "Mar", users: 90 },
  //   { month: "Apr", users: 105 },
  //   { month: "May", users: 120 },
  //   { month: "Jun", users: 135 },
  // ];

  // const eventData = [
  //   { name: "Tech Talks", value: 35 },
  //   { name: "Workshops", value: 25 },
  //   { name: "Hackathons", value: 20 },
  //   { name: "Other", value: 20 },
  // ];

  // const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const showOverview = view === "overview";
  const showCreateBlog = view === "create-blog";
  const showCreateMentor = view === "create-mentor";
  const showCreateTestimonial = view === "create-testimonial";
  const showCreateEvent = view === "create-event";
  const showManageUsers = view === "manage-users";
  const showReviewBlogs = view === "review-blogs";

  return (
    <RequireAuth allow={["ADMIN"]}>
      <DashboardLayout>
        <motion.div
          key={view} // Force re-render when view changes
          className="space-y-6"
          initial="hidden"
          animate="show"
          variants={containerStagger(0.08, 0.1)}
        >
          {/* Header */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0"
            variants={fadeInUp}
          >
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-white/60 text-sm sm:text-base">
                Welcome back! Here&apos;s what&apos;s happening with your
                platform.
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs sm:text-sm px-3 sm:px-4 py-2">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Quick Create
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 p-2 sm:p-3"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {showOverview && (
            <>
              {/* KPI Grid */}
              <motion.div
                variants={fadeIn}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
              >
                <StatCard
                  label="Total Users"
                  value={totalUsers}
                  icon={<Users className="w-6 h-6" />}
                />
                <StatCard
                  label="Events"
                  value={totalEvents}
                  icon={<Calendar className="w-6 h-6" />}
                />
                <StatCard
                  label="Blogs"
                  value={totalBlogs}
                  icon={
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h7l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                />
                <StatCard
                  label="Mentors"
                  value={totalMentors}
                  icon={
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 10-8 0v4M5 21h14a2 2 0 002-2v-1a7 7 0 00-7-7H10a7 7 0 00-7 7v1a2 2 0 002 2z"
                      />
                    </svg>
                  }
                />
                <StatCard
                  label="Clubs"
                  value={totalClubs}
                  icon={
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4"
                      />
                    </svg>
                  }
                />
              </motion.div>

              {/* Activity Chart - recent users vs events */}
              <div className="px-0 lg:px-0">
                {(() => {
                  // Build daily counts for last 30 days from events and users
                  const map = new Map<
                    string,
                    { desktop: number; mobile: number }
                  >();

                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                  const add = (iso: string, type: "desktop" | "mobile") => {
                    if (!iso) return;
                    const d = new Date(iso);
                    if (isNaN(d.getTime()) || d < thirtyDaysAgo) return;

                    const day = d.toISOString().slice(0, 10);
                    const prev = map.get(day) || { desktop: 0, mobile: 0 };
                    prev[type] += 1;
                    map.set(day, prev);
                  };

                  // Add recent events as desktop
                  (eventsData?.events || [])
                    .sort(
                      (a: Event, b: Event) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .slice(0, 10)
                    .forEach((e: Event) => add(e.date, "desktop"));

                  // Add recent users as mobile
                  (data?.users || [])
                    .sort(
                      (a: { createdAt?: string }, b: { createdAt?: string }) =>
                        new Date(b?.createdAt || 0).getTime() -
                        new Date(a?.createdAt || 0).getTime()
                    )
                    .slice(0, 10)
                    .forEach((u: { createdAt?: string }) =>
                      add(u?.createdAt || "", "mobile")
                    );

                  const dataPoints = Array.from(map.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([date, v]) => ({
                      date,
                      desktop: v.desktop,
                      mobile: v.mobile,
                    }));

                  return (
                    <ChartAreaInteractive
                      data={dataPoints}
                      isLoading={isLoading}
                      labels={{
                        title: "Recent Activity",
                        description: "New users vs new events in last 30 days",
                        desktop: "Recent Events",
                        mobile: "Recent Users",
                      }}
                    />
                  );
                })()}
              </div>
            </>
          )}

          {showReviewBlogs && (
            <motion.div variants={fadeIn} className="space-y-6">
              <motion.div
                className="flex items-center justify-between"
                variants={fadeInUp}
              >
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Review Blogs
                  </h2>
                  <p className="text-white/60 text-sm">
                    Review submissions and approve or reject
                  </p>
                </div>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card className="bg-white/5 border-white/10 rounded-xl">
                  <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    {(() => {
                      const pendingBlogs = (blogsData?.blogs || []).filter(
                        (b: Blog) => b.status !== "PUBLISHED"
                      );
                      if (pendingBlogs.length === 0) {
                        return (
                          <div className="text-center text-white/60">
                            No blogs to review
                          </div>
                        );
                      }
                      return pendingBlogs.map((b: Blog) => (
                        <div
                          key={b.id}
                          className="p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold truncate mb-1">
                                {b.title}
                              </h3>
                              <div
                                className="text-white/80 text-sm mb-3 line-clamp-3 prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    (b as { content?: string }).content || "",
                                }}
                              />
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={async () => {
                                    const full = await api.get(
                                      `/blogs/${b.id}`
                                    );
                                    const blog = full.data.blog as {
                                      title?: string;
                                      content?: string;
                                      imageUrl?: string;
                                    };
                                    const html = `
                                      <div style='max-width:720px;padding:16px;color:#fff;background:#0A0B1A'>
                                        <h2 style='font-size:20px;margin:0 0 8px'>${
                                          blog.title
                                        }</h2>
                                        ${
                                          blog.imageUrl
                                            ? `<img src='${blog.imageUrl}' alt='' style='max-width:100%;border-radius:8px;margin:8px 0'/>`
                                            : ""
                                        }
                                        <div style='line-height:1.6'>${
                                          blog.content || ""
                                        }</div>
                                      </div>`;
                                    const w = window.open(
                                      "",
                                      "_blank",
                                      "width=820,height=600"
                                    );
                                    if (w) {
                                      w.document.write(
                                        `<html><head><title>Preview</title></head><body style='margin:0;background:#0A0B1A'>${html}</body></html>`
                                      );
                                      w.document.close();
                                    }
                                  }}
                                >
                                  Review
                                </Button>
                                <Button
                                  size="sm"
                                  variant="gradientOutline"
                                  className="bg-blue-500 text-white"
                                  onClick={() => approveBlog.mutate(b.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={async () => {
                                    await api.put(`/blogs/${b.id}`, {
                                      status: "ARCHIVED",
                                    });
                                    qc.invalidateQueries({
                                      queryKey: ["blogs"],
                                    });
                                    toast.success("Blog rejected");
                                  }}
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs border-white/20 text-white/80"
                            >
                              {b.status}
                            </Badge>
                          </div>
                        </div>
                      ));
                    })()}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
          {showOverview && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Users */}
              <motion.div variants={fadeIn}>
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm sm:text-base">
                      Recent Users
                    </CardTitle>
                    <CardDescription className="text-white/60 text-xs sm:text-sm">
                      Latest user registrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2">
                      {isLoading ? (
                        <div className="text-center py-4 text-white/60">
                          Loading...
                        </div>
                      ) : error ? (
                        <div className="text-center py-4 text-red-400">
                          Failed to load users
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(data?.users || []).slice(0, 5).map((user: User) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10"
                            >
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs sm:text-sm font-medium text-white truncate">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-xs text-white/60 truncate">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-xs border-white/20 text-white/80"
                              >
                                {user.role}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Events */}
              <motion.div variants={fadeIn}>
                <Card className="bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm sm:text-base">
                      Recent Events
                    </CardTitle>
                    <CardDescription className="text-white/60 text-xs sm:text-sm">
                      Latest events created
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2">
                      {eventsData?.events?.slice(0, 5).map((event: Event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm font-medium text-white truncate">
                                {event.title}
                              </p>
                              <p className="text-xs text-white/60 truncate">
                                {event.club?.name || "No club"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/60">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {showManageUsers && (
            <motion.div variants={fadeIn} className="max-w-6xl mx-auto w-full">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Manage Data</CardTitle>
                  <CardDescription className="text-white/60">
                    Browse and manage Users, Club Heads, Events, Blogs, Mentors,
                    Testimonials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const users = (data?.users || []).map(
                      (u: User, idx: number) => ({
                        id: `user-${u.id}-${idx}`, // Stable ID based on backend ID
                        header: `${u.firstName} ${u.lastName}`,
                        target: u.role,
                        limit: (u.club as { id: string } | undefined)?.id || "", // Store club ID for dropdown
                        reviewer: u.email,
                        backendId: u.id,
                        entity: "user",
                        clubName: u.club?.name || "-", // Store club name for display
                      })
                    );
                    const events = (eventsData?.events || []).map(
                      (e: Event, idx: number) => ({
                        id: `event-${e.id}-${idx}`, // Stable ID based on backend ID
                        header: e.title,
                        target: new Date(e.date).toLocaleDateString(),
                        limit: e.club?.name || "-",
                        reviewer: e.imageUrl || "",
                        backendId: e.id,
                        entity: "event",
                      })
                    );
                    const blogs = (blogsData?.blogs || []).map(
                      (b: Blog, idx: number) => ({
                        id: `blog-${b.id}-${idx}`, // Stable ID based on backend ID
                        header: b.title,
                        target: b.status,
                        limit: "",
                        reviewer: "",
                        backendId: b.id,
                        entity: "blog",
                      })
                    );
                    const mentors = (mentorsData?.mentors || []).map(
                      (m: Mentor, idx: number) => ({
                        id: `mentor-${m.id}-${idx}`, // Stable ID based on backend ID
                        header: m.name,
                        target: m.expertise,
                        limit: m.club?.name || "-",
                        reviewer: m.linkedInUrl || "",
                        imageUrl: m.imageUrl || "",
                        backendId: m.id,
                        entity: "mentor",
                      })
                    );

                    const testimonials = (testimonialsData?.items || []).map(
                      (
                        t: {
                          id: string;
                          name?: string;
                          batchYear?: number;
                          imageUrl?: string;
                          content?: string;
                        },
                        idx: number
                      ) => ({
                        id: `testimonial-${t.id}-${idx}`,
                        header: t.name || "",
                        target: t.batchYear?.toString() || "",
                        limit: t.imageUrl || "",
                        reviewer: t.content || "",
                        backendId: t.id,
                        entity: "testimonial",
                      })
                    );

                    const views = [
                      { label: "Users", rows: users },
                      { label: "Events", rows: events },
                      { label: "Blogs", rows: blogs },
                      { label: "Mentors", rows: mentors },
                      { label: "Testimonials", rows: testimonials },
                    ];

                    return (
                      <DataTable
                        key={`${data?.users?.length || 0}-${
                          eventsData?.events?.length || 0
                        }-${blogsData?.blogs?.length || 0}-${
                          mentorsData?.mentors?.length || 0
                        }`}
                        views={
                          views as unknown as {
                            label: string;
                            rows: z.infer<typeof settingsTableSchema>[];
                          }[]
                        }
                        clubsData={clubsData}
                        onUpdate={async (row, field, value) => {
                          try {
                            if (row.entity === "user") {
                              if (field === "target") {
                                await api.put(`/users/${row.backendId}/role`, {
                                  newRole: value,
                                });
                                toast.success("User role updated successfully");
                              } else if (field === "header") {
                                await api.put(`/users/${row.backendId}`, {
                                  firstName: value,
                                });
                                toast.success("User name updated successfully");
                              } else if (field === "reviewer") {
                                await api.put(`/users/${row.backendId}`, {
                                  email: value,
                                });
                                toast.success(
                                  "User email updated successfully"
                                );
                              } else if (field === "limit") {
                                await api.put(`/users/${row.backendId}`, {
                                  clubId: value,
                                });
                                toast.success("User club updated successfully");
                              }
                              qc.invalidateQueries({
                                queryKey: ["users-list"],
                              });
                            } else if (row.entity === "event") {
                              if (field === "header") {
                                await api.put(`/events/${row.backendId}`, {
                                  title: value,
                                });
                                toast.success(
                                  "Event title updated successfully"
                                );
                              } else if (field === "target") {
                                await api.put(`/events/${row.backendId}`, {
                                  data: value,
                                });
                                toast.success(
                                  "Event date updated successfully"
                                );
                              } else if (field === "limit") {
                                await api.put(`/events/${row.backendId}`, {
                                  clubId: value,
                                });
                                toast.success(
                                  "Event club updated successfully"
                                );
                              } else if (field === "reviewer") {
                                await api.put(`/events/${row.backendId}`, {
                                  imageUrl: value,
                                });
                                toast.success(
                                  "Event image URL updated successfully"
                                );
                              }
                              qc.invalidateQueries({ queryKey: ["events"] });
                            } else if (row.entity === "blog") {
                              if (field === "header") {
                                await api.put(`/blogs/${row.backendId}`, {
                                  title: value,
                                });
                                toast.success(
                                  "Blog title updated successfully"
                                );
                              } else if (field === "target") {
                                // Quick status update via inline edit
                                await api.put(`/blogs/${row.backendId}`, {
                                  status: value,
                                });
                                toast.success(
                                  "Blog status updated successfully"
                                );
                              }
                              qc.invalidateQueries({ queryKey: ["blogs"] });
                            } else if (row.entity === "mentor") {
                              if (field === "header") {
                                await api.put(`/mentors/${row.backendId}`, {
                                  name: value,
                                });
                                toast.success(
                                  "Mentor name updated successfully"
                                );
                              } else if (field === "target") {
                                await api.put(`/mentors/${row.backendId}`, {
                                  expertise: value,
                                });
                                toast.success(
                                  "Mentor expertise updated successfully"
                                );
                              } else if (field === "reviewer") {
                                await api.put(`/mentors/${row.backendId}`, {
                                  linkedInUrl: value,
                                });
                                toast.success(
                                  "Mentor LinkedIn updated successfully"
                                );
                              } else if (field === "imageUrl") {
                                await api.put(`/mentors/${row.backendId}`, {
                                  imageUrl: value,
                                });
                                toast.success(
                                  "Mentor Image URL updated successfully"
                                );
                              } else if (field === "limit") {
                                await api.put(`/mentors/${row.backendId}`, {
                                  clubId: value,
                                });
                                toast.success(
                                  "Mentor club updated successfully"
                                );
                              }
                              qc.invalidateQueries({ queryKey: ["mentors"] });
                            } else if (row.entity === "testimonial") {
                              if (field === "header") {
                                await api.put(
                                  `/testimonials/${row.backendId}`,
                                  {
                                    name: value,
                                  }
                                );
                                toast.success(
                                  "Testimonial name updated successfully"
                                );
                              } else if (field === "target") {
                                const year = parseInt(value as string);
                                if (isNaN(year)) {
                                  throw new Error(
                                    "Batch year must be a number"
                                  );
                                }
                                await api.put(
                                  `/testimonials/${row.backendId}`,
                                  {
                                    batchYear: year,
                                  }
                                );
                                toast.success(
                                  "Testimonial batch year updated successfully"
                                );
                              } else if (field === "limit") {
                                await api.put(
                                  `/testimonials/${row.backendId}`,
                                  {
                                    imageUrl: value,
                                  }
                                );
                                toast.success(
                                  "Testimonial image URL updated successfully"
                                );
                              } else if (field === "reviewer") {
                                await api.put(
                                  `/testimonials/${row.backendId}`,
                                  {
                                    content: value,
                                  }
                                );
                                toast.success(
                                  "Testimonial content updated successfully"
                                );
                              }
                              qc.invalidateQueries({
                                queryKey: ["testimonials"],
                              });
                            }
                          } catch (e: unknown) {
                            console.error("Update error:", e);
                            const errorMessage =
                              (
                                e as {
                                  response?: { data?: { message?: string } };
                                  message?: string;
                                }
                              )?.response?.data?.message ||
                              (
                                e as {
                                  response?: { data?: { message?: string } };
                                  message?: string;
                                }
                              )?.message ||
                              "Failed to update item. Please try again.";
                            toast.error(errorMessage);
                          }
                        }}
                        onDelete={async (row) => {
                          try {
                            console.log(
                              "Attempting to delete:",
                              row.entity,
                              row.backendId
                            );

                            // Use DELETE endpoints for all entities
                            if (row.entity === "blog") {
                              await api.delete(`/blogs/${row.backendId}`);
                              toast.success("Blog deleted successfully");
                              qc.invalidateQueries({ queryKey: ["blogs"] });
                            } else if (row.entity === "mentor") {
                              await api.delete(`/mentors/${row.backendId}`);
                              toast.success("Mentor deleted successfully");
                              qc.invalidateQueries({ queryKey: ["mentors"] });
                            } else if (row.entity === "testimonial") {
                              await api.delete(
                                `/testimonials/${row.backendId}`
                              );
                              toast.success("Testimonial deleted successfully");
                              qc.invalidateQueries({
                                queryKey: ["testimonials"],
                              });
                            } else if (row.entity === "user") {
                              await api.delete(`/users/${row.backendId}`);
                              toast.success("User deleted successfully");
                              qc.invalidateQueries({
                                queryKey: ["users-list"],
                              });
                            } else if (row.entity === "event") {
                              await api.delete(`/events/${row.backendId}`);
                              toast.success("Event deleted successfully");
                              qc.invalidateQueries({ queryKey: ["events"] });
                            }
                          } catch (e: unknown) {
                            console.error("Delete error:", e);
                            const errorMessage =
                              (
                                e as {
                                  response?: { data?: { message?: string } };
                                  message?: string;
                                }
                              )?.response?.data?.message ||
                              (
                                e as {
                                  response?: { data?: { message?: string } };
                                  message?: string;
                                }
                              )?.message ||
                              "Failed to delete item. Please try again.";
                            toast.error(errorMessage);
                          }
                        }}
                      />
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {(showCreateBlog ||
            showCreateEvent ||
            showCreateMentor ||
            showCreateTestimonial) && (
            <motion.div variants={fadeIn} className="space-y-6">
              {/* Section Header */}
              <motion.div
                className="flex items-center justify-between"
                variants={fadeInUp}
              >
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {showCreateBlog && "Create New Blog"}
                    {showCreateMentor && "Create New Mentor"}
                    {showCreateTestimonial && "Create New Testimonial"}
                    {showCreateEvent && "Create New Event"}
                  </h2>
                  <p className="text-white/60 text-sm">
                    {showCreateBlog &&
                      "Add a new blog post to share with the community"}
                    {showCreateMentor &&
                      "Add a new mentor to help guide students"}
                    {showCreateTestimonial &&
                      "Add a new testimonial to showcase student experiences"}
                    {showCreateEvent &&
                      "Add a new event to engage the community"}
                  </p>
                </div>
              </motion.div>
              {showCreateBlog && (
                <motion.div variants={fadeInUp}>
                  <Card className="bg-white/5 border-white/10 rounded-xl">
                    <CardContent className="p-6 space-y-6">
                      {/* Review queue quick actions */}
                      <div className="mb-2 text-white/80 text-xs sm:text-sm">
                        Review Queue:{" "}
                        {
                          (blogsData?.blogs || []).filter(
                            (b: Blog) => b.status !== "PUBLISHED"
                          ).length
                        }{" "}
                        pending
                      </div>
                      <div className="space-y-2">
                        {(blogsData?.blogs || [])
                          .filter((b: Blog) => b.status !== "PUBLISHED")
                          .slice(0, 5)
                          .map((b: Blog) => (
                            <div
                              key={b.id}
                              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                            >
                              <div className="text-white text-sm font-medium truncate mr-3">
                                {b.title}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8"
                                  onClick={() => approveBlog.mutate(b.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8"
                                  onClick={() => archiveBlog.mutate(b.id)}
                                >
                                  Archive
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="blog-title"
                            className="text-white font-medium"
                          >
                            Title
                          </Label>
                          <Input
                            id="blog-title"
                            placeholder="Enter blog title"
                            value={blogForm.title}
                            onChange={(e) =>
                              setBlogForm({
                                ...blogForm,
                                title: e.target.value,
                              })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-11 rounded-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="blog-status"
                            className="text-white font-medium"
                          >
                            Status
                          </Label>
                          <Select
                            value={blogForm.status}
                            onValueChange={(value) =>
                              setBlogForm({ ...blogForm, status: value })
                            }
                          >
                            <SelectTrigger className="bg-white/5 border-white/20 text-white h-11 rounded-lg">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-white/20">
                              <SelectItem value="DRAFT" className="text-white">
                                Draft
                              </SelectItem>
                              <SelectItem
                                value="PUBLISHED"
                                className="text-white"
                              >
                                Published
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="blog-content"
                          className="text-white font-medium"
                        >
                          Content
                        </Label>
                        <RichTextEditor
                          value={blogForm.content}
                          onChange={(html) =>
                            setBlogForm({ ...blogForm, content: html })
                          }
                          placeholder="Write your blog..."
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="blog-image"
                          className="text-white font-medium"
                        >
                          Image URL
                        </Label>
                        <Input
                          id="blog-image"
                          placeholder="https://example.com/image.jpg"
                          value={blogForm.imageUrl}
                          onChange={(e) =>
                            setBlogForm({
                              ...blogForm,
                              imageUrl: e.target.value,
                            })
                          }
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-11 rounded-lg"
                        />
                      </div>
                      <div className="pt-2">
                        <Button
                          onClick={() => createBlog.mutate()}
                          disabled={createBlog.isPending}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-11 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 border border-blue-500/20"
                        >
                          {createBlog.isPending ? "Creating..." : "Create Blog"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {showCreateMentor && (
                <motion.div variants={fadeInUp}>
                  <Card className="bg-white/5 border-white/10 rounded-xl">
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="mentor-name"
                            className="text-white font-medium"
                          >
                            Name
                          </Label>
                          <Input
                            id="mentor-name"
                            placeholder="Enter mentor name"
                            value={mentorForm.name}
                            onChange={(e) =>
                              setMentorForm({
                                ...mentorForm,
                                name: e.target.value,
                              })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-11 rounded-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="mentor-expertise"
                            className="text-white font-medium"
                          >
                            Expertise
                          </Label>
                          <Input
                            id="mentor-expertise"
                            placeholder="Enter expertise area"
                            value={mentorForm.expertise}
                            onChange={(e) =>
                              setMentorForm({
                                ...mentorForm,
                                expertise: e.target.value,
                              })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-11 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="mentor-image"
                            className="text-white font-medium"
                          >
                            Image URL
                          </Label>
                          <Input
                            id="mentor-image"
                            placeholder="https://example.com/image.jpg"
                            value={mentorForm.imageUrl || ""}
                            onChange={(e) =>
                              setMentorForm({
                                ...mentorForm,
                                imageUrl: e.target.value || "",
                              })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-11 rounded-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="mentor-linkedin"
                            className="text-white font-medium"
                          >
                            LinkedIn URL
                          </Label>
                          <Input
                            id="mentor-linkedin"
                            placeholder="https://linkedin.com/in/username"
                            value={mentorForm.linkedInUrl || ""}
                            onChange={(e) =>
                              setMentorForm({
                                ...mentorForm,
                                linkedInUrl: e.target.value || "",
                              })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-11 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="mentor-club"
                          className="text-white font-medium"
                        >
                          Club
                        </Label>
                        <Select
                          value={mentorForm.clubId}
                          onValueChange={(value) =>
                            setMentorForm({ ...mentorForm, clubId: value })
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/20 text-white h-11 rounded-lg">
                            <SelectValue placeholder="Select club" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-white/20">
                            {(clubsData?.clubs || []).map((c: Club) => (
                              <SelectItem
                                key={c.id}
                                value={c.id}
                                className="text-white"
                              >
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-2">
                        <Button
                          onClick={() => createMentor.mutate()}
                          disabled={createMentor.isPending}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-11 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 border border-blue-500/20"
                        >
                          {createMentor.isPending
                            ? "Creating..."
                            : "Create Mentor"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {showCreateTestimonial && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="show"
                  transition={{ staggerChildren: 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="testimonial-name"
                            className="text-white font-medium"
                          >
                            Name
                          </Label>
                          <Input
                            id="testimonial-name"
                            placeholder="Enter name"
                            value={testimonialForm.name}
                            onChange={(e) =>
                              setTestimonialForm({
                                ...testimonialForm,
                                name: e.target.value,
                              })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-11 rounded-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="testimonial-batch"
                            className="text-white font-medium"
                          >
                            Batch Year
                          </Label>
                          <Input
                            id="testimonial-batch"
                            type="number"
                            placeholder="e.g., 2024"
                            value={testimonialForm.batchYear}
                            onChange={(e) =>
                              setTestimonialForm({
                                ...testimonialForm,
                                batchYear: e.target.value,
                              })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-11 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="testimonial-image"
                          className="text-white font-medium"
                        >
                          Image URL
                        </Label>
                        <Input
                          id="testimonial-image"
                          placeholder="https://example.com/photo.jpg"
                          value={testimonialForm.imageUrl}
                          onChange={(e) =>
                            setTestimonialForm({
                              ...testimonialForm,
                              imageUrl: e.target.value,
                            })
                          }
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-11 rounded-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="testimonial-content"
                          className="text-white font-medium"
                        >
                          Testimonial Content
                        </Label>
                        <Textarea
                          id="testimonial-content"
                          placeholder="Enter the testimonial content..."
                          value={testimonialForm.content}
                          onChange={(e) =>
                            setTestimonialForm({
                              ...testimonialForm,
                              content: e.target.value,
                            })
                          }
                          rows={6}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 resize-none rounded-lg"
                        />
                      </div>
                      <div className="flex justify-end">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={() => {
                              if (
                                !testimonialForm.name.trim() ||
                                !testimonialForm.content.trim() ||
                                !testimonialForm.batchYear.trim()
                              ) {
                                toast.error(
                                  "Please fill in all required fields"
                                );
                                return;
                              }
                              const batchYear = parseInt(
                                testimonialForm.batchYear
                              );
                              if (
                                isNaN(batchYear) ||
                                batchYear < 1900 ||
                                batchYear > 2100
                              ) {
                                toast.error("Please enter a valid batch year");
                                return;
                              }
                              createTestimonial.mutate();
                            }}
                            disabled={createTestimonial.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                          >
                            {createTestimonial.isPending
                              ? "Creating..."
                              : "Create Testimonial"}
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {showCreateEvent && (
                <motion.div variants={fadeInUp}>
                  <Card className="bg-white/5 border-white/10 rounded-xl">
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label
                            htmlFor="admin-event-title"
                            className="text-white font-medium"
                          >
                            Event Title
                          </Label>
                          <Input
                            id="admin-event-title"
                            placeholder="Enter event title"
                            value={eventForm.title}
                            onChange={(e) =>
                              setEventForm({
                                ...eventForm,
                                title: e.target.value,
                              })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-11 rounded-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label
                            htmlFor="admin-event-date"
                            className="text-white font-medium"
                          >
                            Event Date & Time
                          </Label>
                          <DateTimePicker
                            value={eventForm.data}
                            onChange={(iso) =>
                              setEventForm({ ...eventForm, data: iso })
                            }
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="admin-event-description"
                          className="text-white font-medium"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="admin-event-description"
                          placeholder="Enter event description"
                          value={eventForm.description}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              description: e.target.value,
                            })
                          }
                          rows={5}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 rounded-lg resize-none"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="admin-event-image"
                          className="text-white font-medium"
                        >
                          Image URL
                        </Label>
                        <Input
                          id="admin-event-image"
                          placeholder="https://example.com/image.jpg"
                          value={eventForm.imageUrl}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              imageUrl: e.target.value,
                            })
                          }
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-11 rounded-lg"
                        />
                      </div>
                      <div className="pt-2">
                        <Button
                          onClick={() => createEvent.mutate()}
                          disabled={createEvent.isPending}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-11 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 border border-blue-500/20"
                        >
                          {createEvent.isPending
                            ? "Creating..."
                            : "Create Event"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </DashboardLayout>
    </RequireAuth>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
