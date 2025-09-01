import { Router } from "express";
import {
  getAllEvents,
  createEvent,
  registerEvent,
  getRegisteredEvents,
} from "../controllers/eventController";
import { authenticateToken, requireRole } from "../middleware/auth";
const router = Router();

router.get("/", getAllEvents);
router.post("/", authenticateToken, requireRole(["CLUB_HEAD"]), createEvent);
router.post("/:eventId/register", authenticateToken, registerEvent);
router.get("/registered", authenticateToken, getRegisteredEvents);

export default router;
