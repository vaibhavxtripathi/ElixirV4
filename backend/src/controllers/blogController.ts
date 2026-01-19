import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth";

// get all blogs (publicly on blogs page)
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: {
          select: { firstName: true, lastName: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Set caching headers
    res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=300");

    return res.json({ blogs });
  } catch (error) {
    console.error("Get blogs error:", error);
    return res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// create blog (ADMIN only)
export const createBlog = async (req: any, res: Response) => {
  try {
    const { title, content, imageUrl, status = "DRAFT" } = req.body;
    const userId = req.user?.userId;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        imageUrl: imageUrl ?? null,
        status,
        authorId: userId,
      },
      include: {
        author: {
          select: { firstName: true, lastName: true, avatar: true },
        },
      },
    });

    return res.status(201).json({ blog });
  } catch (error) {
    console.error("Create blog error:", error);
    return res.status(500).json({ message: "Failed to create blog" });
  }
};

// update blog (ADMIN only)
export const updateBlog = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl, status } = req.body;

    const blog = await prisma.blog.update({
      where: { id },
      data: { title, content, imageUrl, status },
      include: {
        author: {
          select: { firstName: true, lastName: true, avatar: true },
        },
      },
    });

    return res.json({ blog });
  } catch (error) {
    console.error("Update blog error:", error);
    return res.status(500).json({ message: "Failed to update blog" });
  }
};

// delete blog (ADMIN only)
export const deleteBlog = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.blog.delete({
      where: { id },
    });

    return res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({ message: "Failed to delete blog" });
  }
};

// get blog by id (public, but restrict unpublished to admin/author)
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    // If blog is published, always allow
    if (blog.status === "PUBLISHED") return res.json({ blog });

    // For drafts/archived: allow only if requester is admin or the author
    try {
      const authHeader = req.headers["authorization"] as string | undefined;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;
      if (token) {
        const payload = verifyToken(token) as {
          userId: string;
          role: string;
        };
        if (payload.role === "ADMIN" || payload.userId === blog.authorId) {
          return res.json({ blog });
        }
      }
    } catch {}

    return res
      .status(403)
      .json({ message: "You are not allowed to view this blog" });
  } catch (error) {
    console.error("Get blog by id error:", error);
    return res.status(500).json({ message: "Failed to fetch blog" });
  }
};

// submit blog (STUDENT) - always creates DRAFT under current user
export const submitBlog = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { title, content, imageUrl } = req.body as {
      title?: string;
      content?: string;
      imageUrl?: string;
    };

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        imageUrl: imageUrl ?? null,
        status: "DRAFT",
        authorId: userId,
      },
      include: {
        author: { select: { firstName: true, lastName: true } },
      },
    });

    return res.status(201).json({ blog });
  } catch (error) {
    console.error("Submit blog error:", error);
    return res.status(500).json({ message: "Failed to submit blog" });
  }
};

// list my blogs (STUDENT)
export const getMyBlogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const blogs = await prisma.blog.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ blogs });
  } catch (error) {
    console.error("Get my blogs error:", error);
    return res.status(500).json({ message: "Failed to fetch your blogs" });
  }
};

// admin: list all blogs (all statuses)
export const adminListBlogs = async (_req: AuthRequest, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ blogs });
  } catch (error) {
    console.error("Admin list blogs error:", error);
    return res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

// admin: approve (publish) a blog
export const approveBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const blog = await prisma.blog.update({
      where: { id },
      data: { status: "PUBLISHED" },
    });
    return res.json({ blog });
  } catch (error) {
    console.error("Approve blog error:", error);
    return res.status(500).json({ message: "Failed to approve blog" });
  }
};

// admin: archive a blog
export const archiveBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const blog = await prisma.blog.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
    return res.json({ blog });
  } catch (error) {
    console.error("Archive blog error:", error);
    return res.status(500).json({ message: "Failed to archive blog" });
  }
};
