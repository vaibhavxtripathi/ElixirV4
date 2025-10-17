import { Router } from "express";
import {
  register,
  login,
  getMe,
  googleLogin,
  googleOAuthStart,
  googleOAuthCallback,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validators/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.get("/me", authenticateToken, asyncHandler(getMe));
router.post("/google", asyncHandler(googleLogin));
router.get("/google/start", asyncHandler(googleOAuthStart));
router.get("/google/callback", asyncHandler(googleOAuthCallback));

export default router;
