import { Router } from "express";
import { createClub, getAllClubs } from "../controllers/clubController";
import { authenticateToken, requireRole } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getAllClubs); // GET /api/clubs

// Admin only routes
router.post("/", authenticateToken, requireRole(["ADMIN"]), createClub); // POST /api/clubs

export default router;
