import { Router } from "express";
import {
  getAllUsers,
  changeRole,
  assignUserToClub,
  removeUserFromClub,
  getPlatformAnalytics,
} from "../controllers/userController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  changeRoleSchema,
  assignClubSchema,
} from "../validators/users";
import { idParamSchema } from "../validators/blogs";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authenticateToken, requireRole(["ADMIN"]));

router.get("/", getAllUsers);
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

router.get("/analytics", getPlatformAnalytics);

export default router;
