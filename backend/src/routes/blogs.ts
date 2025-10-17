import { Router } from "express";
import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  submitBlog,
  getMyBlogs,
  adminListBlogs,
  approveBlog,
  archiveBlog,
} from "../controllers/blogController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createBlogSchema,
  updateBlogSchema,
  idParamSchema,
  submitBlogSchema,
} from "../validators/blogs";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", getAllBlogs);

// student submissions
router.post(
  "/submit",
  authenticateToken,
  requireRole(["STUDENT", "CLUB_HEAD", "ADMIN"]),
  validate(submitBlogSchema),
  asyncHandler(submitBlog)
);
router.get(
  "/me",
  authenticateToken,
  requireRole(["STUDENT", "CLUB_HEAD", "ADMIN"]),
  asyncHandler(getMyBlogs)
);

// admin list all blogs
router.get(
  "/admin",
  authenticateToken,
  requireRole(["ADMIN"]),
  asyncHandler(adminListBlogs)
);

router.post(
  "/:id/approve",
  authenticateToken,
  requireRole(["ADMIN"]),
  validate(idParamSchema),
  asyncHandler(approveBlog)
);
router.post(
  "/:id/archive",
  authenticateToken,
  requireRole(["ADMIN"]),
  validate(idParamSchema),
  asyncHandler(archiveBlog)
);

// keep dynamic :id at the end to avoid matching /admin as :id
router.get("/:id", asyncHandler(getBlogById));

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
