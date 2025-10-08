import { Router } from "express";
import {
  getAllUsers,
  changeRole,
  assignUserToClub,
  removeUserFromClub,
  getPlatformAnalytics,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  changeRoleSchema,
  assignClubSchema,
  userIdParamSchema,
  updateUserSchema,
} from "../validators/users";
import { idParamSchema } from "../validators/blogs";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticateToken, requireRole(["ADMIN"]));

router.get("/", getAllUsers);
router.get("/analytics", getPlatformAnalytics);
router.put("/:id", validate(updateUserSchema), asyncHandler(updateUser));
router.delete("/:id", validate(idParamSchema), asyncHandler(deleteUser));
router.put(
  "/:userId/role",
  validate(changeRoleSchema),
  asyncHandler(changeRole)
);
router.put(
  "/:userId/club",
  validate(assignClubSchema),
  asyncHandler(assignUserToClub)
);
router.delete(
  "/:userId/club",
  validate(idParamSchema),
  asyncHandler(removeUserFromClub)
);

export default router;
