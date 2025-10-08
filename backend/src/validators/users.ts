import { z } from "zod";

export const changeRoleSchema = z.object({
  params: z.object({ userId: z.string().min(1) }),
  body: z.object({ newRole: z.enum(["STUDENT", "CLUB_HEAD", "ADMIN"]) }),
});

export const assignClubSchema = z.object({
  params: z.object({ userId: z.string().min(1) }),
  body: z.object({ clubId: z.string().min(1) }),
});

export const userListSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({ userId: z.string().min(1) }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    clubId: z.string().optional().nullable(),
  }),
});
