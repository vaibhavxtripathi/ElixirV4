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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  FileText,
  UserCheck,
  TrendingUp,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { containerStagger, fadeInUp, fadeIn } from "@/lib/motion";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import {
  DataTable,
  schema as settingsTableSchema,
} from "@/components/data-table";
import { z } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
    queryFn: async () => (await api.get("/blogs")).data,
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

  // Add these after existing state and mutations
  const [mentorForm, setMentorForm] = useState({
    name: "",
    expertise: "",
    linkedInUrl: "",
    imageUrl: "",
    clubId: "",
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

  const changeRole = useMutation({
    mutationFn: async ({
      userId,
      newRole,
    }: {
      userId: string;
      newRole: string;
    }) => (await api.put(`/users/${userId}/role`, { newRole })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users-list"] });
      toast.success("Role updated");
    },
    onError: (e: unknown) => {
      const maybeAxiosError = e as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        maybeAxiosError.response?.data?.message || "Failed to change role"
      );
    },
  });

  const assignClub = useMutation({
    mutationFn: async ({
      userId,
      clubId,
    }: {
      userId: string;
      clubId: string;
    }) => (await api.put(`/users/${userId}/club`, { clubId })).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users-list"] });
      toast.success("Assigned to club");
    },
    onError: (e: unknown) => {
      const maybeAxiosError = e as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        maybeAxiosError.response?.data?.message || "Failed to assign"
      );
    },
  });

  const [clubSel, setClubSel] = useState<Record<string, string>>({});

  // Calculate metrics
  const totalUsers = data?.users?.length || 0;
  const totalEvents = eventsData?.events?.length || 0;
  const totalBlogs = blogsData?.blogs?.length || 0;
  const totalMentors = mentorsData?.mentors?.length || 0;
  const totalClubs = clubsData?.clubs?.length || 0;

  // Sample data for charts (you can replace with real data)
  const userGrowthData = [
    { month: "Jan", users: 65 },
    { month: "Feb", users: 78 },
    { month: "Mar", users: 90 },
    { month: "Apr", users: 105 },
    { month: "May", users: 120 },
    { month: "Jun", users: 135 },
  ];

  const eventData = [
    { name: "Tech Talks", value: 35 },
    { name: "Workshops", value: 25 },
    { name: "Hackathons", value: 20 },
    { name: "Other", value: 20 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const showOverview = view === "overview";
  const showCreateBlog = view === "create-blog";
  const showCreateMentor = view === "create-mentor";
  const showCreateEvent = view === "create-event";
  const showManageUsers = view === "manage-users";

  return (
    <RequireAuth allow={["ADMIN"]}>
      <DashboardLayout>
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="show"
          variants={containerStagger(0.06, 0)}
        >
          {/* Header */}
          <motion.div
            className="flex items-center justify-between"
            variants={fadeInUp}
          >
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/60">
                Welcome back! Here&apos;s what&apos;s happening with your
                platform.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Plus className="w-4 h-4 mr-2" />
                Quick Create
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {showOverview && (
            <>
              <SectionCards />
              <div className="px-0 lg:px-0">
                <ChartAreaInteractive />
              </div>
            </>
          )}

          {showOverview && null}

          {showOverview && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users Table */}
              <motion.div variants={fadeIn}>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Users</CardTitle>
                    <CardDescription className="text-white/60">
                      Latest user registrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="text-center py-4 text-white/60">
                          Loading...
                        </div>
                      ) : error ? (
                        <div className="text-center py-4 text-red-400">
                          Failed to load users
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(data?.users || []).slice(0, 5).map((user: User) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                  <Users className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-xs text-white/60">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
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

              {/* Recent Events Table */}
              <motion.div variants={fadeIn}>
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Events</CardTitle>
                    <CardDescription className="text-white/60">
                      Latest events created
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {eventsData?.events?.slice(0, 5).map((event: Event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {event.title}
                              </p>
                              <p className="text-xs text-white/60">
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
                        limit: (u.club as any)?.id || "", // Store club ID for dropdown
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
                        backendId: m.id,
                        entity: "mentor",
                      })
                    );

                    const testimonials = (testimonialsData?.items || []).map(
                      (t: any, idx: number) => ({
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
                              } else if (field === "limit") {
                                await api.put(`/mentors/${row.backendId}`, {
                                  clubId: value,
                                });
                                toast.success(
                                  "Mentor club updated successfully"
                                );
                              }
                              qc.invalidateQueries({ queryKey: ["mentors"] });
                            }
                          } catch (e: any) {
                            console.error("Update error:", e);
                            const errorMessage =
                              e?.response?.data?.message ||
                              e?.message ||
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
                          } catch (e: any) {
                            console.error("Delete error:", e);
                            const errorMessage =
                              e?.response?.data?.message ||
                              e?.message ||
                              "Failed to delete item. Please try again.";
                            toast.error(errorMessage);
                          }
                        }}
                        actions={(row) => (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="flex size-8 text-white data-[state=open]:bg-white/10"
                                size="icon"
                              >
                                <MoreHorizontal />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-40 bg-[#0A0B1A] border-white/10 text-white"
                            >
                              <DropdownMenuItem className="text-white hover:bg-white/10">
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10">
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      />
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {(showCreateBlog || showCreateEvent || showCreateMentor) && (
            <div className="max-w-3xl mx-auto w-full">
              {showCreateBlog && (
                <motion.div variants={fadeInUp}>
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Create Blog</CardTitle>
                      <CardDescription className="text-white/60">
                        Add a new blog post to the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="blog-title" className="text-white">
                          Title
                        </Label>
                        <Input
                          id="blog-title"
                          placeholder="Enter blog title"
                          value={blogForm.title}
                          onChange={(e) =>
                            setBlogForm({ ...blogForm, title: e.target.value })
                          }
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blog-content" className="text-white">
                          Content
                        </Label>
                        <Textarea
                          id="blog-content"
                          placeholder="Enter blog content"
                          value={blogForm.content}
                          onChange={(e) =>
                            setBlogForm({
                              ...blogForm,
                              content: e.target.value,
                            })
                          }
                          rows={4}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blog-image" className="text-white">
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
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="blog-status" className="text-white">
                          Status
                        </Label>
                        <Select
                          value={blogForm.status}
                          onValueChange={(value) =>
                            setBlogForm({ ...blogForm, status: value })
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
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
                      <Button
                        onClick={() => createBlog.mutate()}
                        disabled={createBlog.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {createBlog.isPending ? "Creating..." : "Create Blog"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {showCreateMentor && (
                <motion.div variants={fadeInUp}>
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Create Mentor
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        Add a new mentor to the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mentor-name" className="text-white">
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
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="mentor-expertise"
                          className="text-white"
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
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mentor-image" className="text-white">
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
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mentor-linkedin" className="text-white">
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
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mentor-club" className="text-white">
                          Club
                        </Label>
                        <Select
                          value={mentorForm.clubId}
                          onValueChange={(value) =>
                            setMentorForm({ ...mentorForm, clubId: value })
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/20 text-white">
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
                      <Button
                        onClick={() => createMentor.mutate()}
                        disabled={createMentor.isPending}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {createMentor.isPending
                          ? "Creating..."
                          : "Create Mentor"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {showCreateEvent && (
                <motion.div variants={fadeInUp}>
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Create New Event
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        Add a new event to the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="admin-event-title"
                            className="text-white"
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
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="admin-event-date"
                            className="text-white"
                          >
                            Event Date & Time
                          </Label>
                          {/* Simple ISO datetime input for now */}
                          <Input
                            id="admin-event-date"
                            type="datetime-local"
                            value={
                              eventForm.data
                                ? new Date(eventForm.data)
                                    .toISOString()
                                    .slice(0, 16)
                                : ""
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              // Convert local datetime to ISO
                              const iso = value
                                ? new Date(value).toISOString()
                                : "";
                              setEventForm({ ...eventForm, data: iso });
                            }}
                            className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="admin-event-description"
                          className="text-white"
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
                          rows={4}
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="admin-event-image"
                          className="text-white"
                        >
                          Image URL (optional)
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
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>
                      <Button
                        onClick={() => createEvent.mutate()}
                        disabled={createEvent.isPending}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {createEvent.isPending ? "Creating..." : "Create Event"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </DashboardLayout>
    </RequireAuth>
  );
}
