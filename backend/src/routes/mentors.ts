import { Router } from "express";
import {
  getAllMentors,
  createMentor,
  updateMentor,
  deleteMentor,
} from "../controllers/mentorController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createMentorSchema, updateMentorSchema } from "../validators/mentors";
import { idParamSchema } from "../validators/blogs";
import { asyncHandler } from "../utils/asyncHandler";
const router = Router();

// Public routes
router.get("/", getAllMentors);

// Admin only routes
router.post(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  validate(createMentorSchema),
  asyncHandler(createMentor)
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  validate(updateMentorSchema),
  asyncHandler(updateMentor)
);
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  validate(idParamSchema),
  asyncHandler(deleteMentor)
);

export default router;
