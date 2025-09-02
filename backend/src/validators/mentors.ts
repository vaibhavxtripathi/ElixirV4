import { z } from "zod";

export const createMentorSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    expertise: z.string().min(2),
    imageUrl: z.url().optional(),
    clubId: z.string().min(1),
  }),
});

export const updateMentorSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().min(1).optional(),
    expertise: z.string().min(2).optional(),
    imageUrl: z.url().optional(),
    clubId: z.string().min(1).optional(),
  }),
});