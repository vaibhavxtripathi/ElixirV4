import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// get all blogs (publicly on blogs page)
export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

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
        imageUrl,
        status,
        authorId: userId,
      },
      include: {
        author: {
          select: { firstName: true, lastName: true },
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
          select: { firstName: true, lastName: true },
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

// get blog by id (public)
export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: { select: { firstName: true, lastName: true } },
      },
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    return res.json({ blog });
  } catch (error) {
    console.error("Get blog by id error:", error);
    return res.status(500).json({ message: "Failed to fetch blog" });
  }
};
