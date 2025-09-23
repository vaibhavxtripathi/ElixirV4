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
import { useState } from "react";
import {
  Users,
  Calendar,
  FileText,
  UserCheck,
  TrendingUp,
  Plus,
  MoreHorizontal,
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["users-list"],
    queryFn: async () => (await api.get("/users")).data,
  });

  const { data: clubsData } = useQuery({
    queryKey: ["clubs-list"],
    queryFn: async () => (await api.get("/clubs")).data,
  });

  // Additional queries for dashboard metrics
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

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={fadeInUp}>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/60">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {totalUsers}
                      </p>
                      <p className="text-xs text-green-400 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12.5% from last month
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/60">
                        Active Events
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {totalEvents}
                      </p>
                      <p className="text-xs text-green-400 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +8.2% from last month
                      </p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <Calendar className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/60">
                        Published Blogs
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {totalBlogs}
                      </p>
                      <p className="text-xs text-green-400 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +15.3% from last month
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <FileText className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/60">
                        Mentors
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {totalMentors}
                      </p>
                      <p className="text-xs text-green-400 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +5.7% from last month
                      </p>
                    </div>
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <UserCheck className="w-6 h-6 text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <motion.div variants={fadeIn}>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">User Growth</CardTitle>
                  <CardDescription className="text-white/60">
                    Monthly user registration trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                            color: "#F9FAFB",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Event Distribution Chart */}
            <motion.div variants={fadeIn}>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    Event Distribution
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Breakdown by event type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={eventData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {eventData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                            color: "#F9FAFB",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Management Tables */}
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

          {/* User Management Section */}
          <motion.div variants={fadeIn}>
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-white/60">
                  Manage user roles and club assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white/60">Name</TableHead>
                        <TableHead className="text-white/60">Email</TableHead>
                        <TableHead className="text-white/60">Role</TableHead>
                        <TableHead className="text-white/60">Club</TableHead>
                        <TableHead className="text-white/60">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(data?.users || []).map((user: User) => (
                        <TableRow key={user.id} className="border-white/10">
                          <TableCell className="text-white">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/80">
                            {user.club?.name || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  changeRole.mutate({
                                    userId: user.id,
                                    newRole: "STUDENT",
                                  })
                                }
                                className="text-xs border-white/20 text-white hover:bg-white/10"
                              >
                                Student
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  changeRole.mutate({
                                    userId: user.id,
                                    newRole: "CLUB_HEAD",
                                  })
                                }
                                className="text-xs border-white/20 text-white hover:bg-white/10"
                              >
                                Club Head
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  changeRole.mutate({
                                    userId: user.id,
                                    newRole: "ADMIN",
                                  })
                                }
                                className="text-xs border-white/20 text-white hover:bg-white/10"
                              >
                                Admin
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Creation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Blog */}
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
                        setBlogForm({ ...blogForm, content: e.target.value })
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
                        setBlogForm({ ...blogForm, imageUrl: e.target.value })
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
                        <SelectItem value="PUBLISHED" className="text-white">
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

            {/* Create Mentor */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Create Mentor</CardTitle>
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
                        setMentorForm({ ...mentorForm, name: e.target.value })
                      }
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mentor-expertise" className="text-white">
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
                    {createMentor.isPending ? "Creating..." : "Create Mentor"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </DashboardLayout>
    </RequireAuth>
  );
}
