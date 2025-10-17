import { z } from "zod";

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    content: z.string().min(20),
    imageUrl: z.url().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  }),
});

export const updateBlogSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(3).optional(),
    content: z.string().min(20).optional(),
    imageUrl: z.string().url().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const submitBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    content: z.string().min(20),
    imageUrl: z.string().url().optional(),
  }),
});
