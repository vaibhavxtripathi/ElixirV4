import { z } from "zod";

export const createTestimonialSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    imageUrl: z.string().url().optional().or(z.literal("")),
    batchYear: z.number().int().min(1900).max(3000),
    content: z.string().min(1),
  }),
});

export const updateTestimonialSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).optional(),
    imageUrl: z.string().url().optional().or(z.literal("")),
    batchYear: z.number().int().min(1900).max(3000).optional(),
    content: z.string().min(1).optional(),
  }),
});

export const listTestimonialsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const deleteTestimonialSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
