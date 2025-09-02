import { Router } from "express";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createBlogSchema,
  updateBlogSchema,
  idParamSchema,
} from "../validators/blogs";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", getAllBlogs);

router.post(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  validate(createBlogSchema),
  asyncHandler(createBlog)
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  validate(updateBlogSchema),
  asyncHandler(updateBlog)
);
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN"]),
  validate(idParamSchema),
  asyncHandler(deleteBlog)
);

export default router;
