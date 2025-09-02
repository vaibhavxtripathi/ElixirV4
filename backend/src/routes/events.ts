import { Router } from "express";
import { getAllEvents, createEvent, registerEvent, getRegisteredEvents } from "../controllers/eventController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createEventSchema, listEventsSchema } from "../validators/events";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", validate(listEventsSchema), asyncHandler(getAllEvents));
router.post("/", authenticateToken, requireRole(["CLUB_HEAD"]), validate(createEventSchema), asyncHandler(createEvent));
router.post("/:eventId/register", authenticateToken, asyncHandler(registerEvent));
router.get("/registered", authenticateToken, asyncHandler(getRegisteredEvents));

export default router;