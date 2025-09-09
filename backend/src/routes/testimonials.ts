import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  listTestimonialsSchema,
  createTestimonialSchema,
  updateTestimonialSchema,
  deleteTestimonialSchema,
} from "../validators/testimonials";
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController";

const router = Router();

router.get(
  "/",
  validate(listTestimonialsSchema),
  asyncHandler(listTestimonials)
);

router.post(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  validate(createTestimonialSchema),
  asyncHandler(createTestimonial)
);

router.put(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  validate(updateTestimonialSchema),
  asyncHandler(updateTestimonial)
);

router.delete(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  validate(deleteTestimonialSchema),
  asyncHandler(deleteTestimonial)
);

export default router;
