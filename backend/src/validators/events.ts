import { z } from "zod";

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    data: z.iso.datetime().or(z.string().min(1)), // ISO or let controller convert
    imageUrl: z.url().optional(),
  }),
});

export const listEventsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.enum(["asc", "desc"]).optional(),
  }),
});

export const updateEventSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    data: z.string().min(1).optional(),
    imageUrl: z.string().url().optional(),
    clubId: z.string().optional(),
  }),
});
