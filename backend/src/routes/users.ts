import { Router } from "express";
import {
  getAllUsers,
  changeRole,
  assignUserToClub,
  removeUserFromClub,
  getPlatformAnalytics,
} from "../controllers/userController";
import { authenticateToken, requireRole } from "../middleware/auth";

const router = Router();

router.use(authenticateToken, requireRole(["ADMIN"]));

router.get("/", getAllUsers);
router.put("/:userId/role", changeRole);
router.put("/:userId/club", assignUserToClub);
router.delete("/:userId/club", removeUserFromClub);

router.get("/analytics", getPlatformAnalytics);

export default router;
