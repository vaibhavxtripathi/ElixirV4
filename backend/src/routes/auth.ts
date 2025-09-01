import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public
router.post("/register", register); // POST /api/auth/register
router.post("/login", login); // POST /api/auth/login

// Protected
router.get("/me", authenticateToken, getMe); // GET /api/auth/me

export default router;
