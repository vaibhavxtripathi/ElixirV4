import { Router } from "express";
import {
  getAllEvents,
  getMyClubEvents,
  createEvent,
  registerEvent,
  getRegisteredEvents,
  getEventRegistrations,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController";
import { authenticateToken, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createEventSchema,
  listEventsSchema,
  updateEventSchema,
} from "../validators/events";
import { idParamSchema } from "../validators/blogs";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", validate(listEventsSchema), asyncHandler(getAllEvents));
router.get(
  "/mine",
  authenticateToken,
  requireRole(["CLUB_HEAD", "ADMIN"]),
  asyncHandler(getMyClubEvents)
);
router.post(
  "/",
  authenticateToken,
  requireRole(["CLUB_HEAD"]),
  validate(createEventSchema),
  asyncHandler(createEvent)
);
router.post(
  "/:eventId/register",
  authenticateToken,
  asyncHandler(registerEvent)
);
router.get("/registered", authenticateToken, asyncHandler(getRegisteredEvents));
router.get(
  "/:id/registrations",
  authenticateToken,
  requireRole(["CLUB_HEAD", "ADMIN"]),
  asyncHandler(getEventRegistrations)
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN", "CLUB_HEAD"]),
  validate(updateEventSchema),
  asyncHandler(updateEvent)
);
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["ADMIN", "CLUB_HEAD"]),
  validate(idParamSchema),
  asyncHandler(deleteEvent)
);

export default router;
