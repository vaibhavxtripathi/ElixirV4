import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const CONFIRMED = "CONFIRMED" as const;
const WAITLISTED = "WAITLISTED" as const;

// get all events (publically on landing page)
export const getAllEvents = async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const sort = (req.query.sort as string) || "desc";
    const skip = (page - 1) * limit;
    const userId = req.user?.userId as string | undefined;

    const total = await prisma.event.count();

    const events = await prisma.event.findMany({
      take: limit,
      skip: skip,
      include: {
        club: {
          select: { name: true, imageUrl: true },
        },
        _count: {
          select: {
            registrations: { where: { status: CONFIRMED } },
          },
        },
        ...(userId
          ? {
              registrations: {
                where: { userId },
                select: { status: true },
                take: 1,
              },
            }
          : {}),
      },
      orderBy: { date: sort === "asc" ? "asc" : "desc" },
    });

    const eventsWithCounts = events.map((event: any) => {
      const { _count, registrations, ...eventData } = event;
      const myRegistration = registrations?.[0];
      return {
        ...eventData,
        confirmedCount: _count.registrations,
        // Keep legacy field as confirmed seats for capacity UI
        registrationCount: _count.registrations,
        myRegistrationStatus: myRegistration?.status ?? null,
      };
    });

    // Per-user myRegistrationStatus must not be cached across viewers
    res.setHeader("Cache-Control", "private, no-store");

    return res.json({
      events: eventsWithCounts,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
};

// get a single event by id (capacity + optional viewer registration status)
export const getEventById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId as string | undefined;

    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        club: { select: { name: true, imageUrl: true } },
        _count: {
          select: {
            registrations: { where: { status: CONFIRMED } },
          },
        },
        ...(userId
          ? {
              registrations: {
                where: { userId },
                select: { status: true },
                take: 1,
              },
            }
          : {}),
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const { _count, registrations, ...eventData } = event as any;
    res.setHeader("Cache-Control", "private, no-store");
    return res.json({
      event: {
        ...eventData,
        confirmedCount: _count.registrations,
        registrationCount: _count.registrations,
        myRegistrationStatus: registrations?.[0]?.status ?? null,
      },
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
};

// get events for the logged-in club head's club
export const getMyClubEvents = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { club: true },
    });

    if (!user?.club) {
      return res
        .status(400)
        .json({ message: "You are not associated with any club" });
    }

    const events = await prisma.event.findMany({
      where: { clubId: user.club.id },
      include: {
        club: { select: { name: true, imageUrl: true } },
        _count: {
          select: {
            registrations: { where: { status: CONFIRMED } },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return res.json({
      events: events.map((event) => {
        const { _count, ...eventData } = event;
        return {
          ...eventData,
          confirmedCount: _count.registrations,
          registrationCount: _count.registrations,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching club events" });
  }
};

// create event (only for club heads)
export const createEvent = async (req: any, res: Response) => {
  try {
    const { title, description, data, imageUrl, maxCapacity } = req.body;
    const userId = req.user?.userId;

    if (!title || !description || !data || !imageUrl)
      return res.status(400).json({ message: "All fields are required" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { club: true },
    });

    if (!user?.club) {
      return res
        .status(400)
        .json({ message: "You must be a club head to create an event" });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(data),
        imageUrl,
        clubId: user.club.id,
        ...(maxCapacity !== undefined ? { maxCapacity } : {}),
      },
      include: {
        club: { select: { name: true, imageUrl: true } },
      },
    });
    return res.status(201).json({ event });
  } catch (error) {
    res.status(500).json({ message: "Error creating event" });
  }
};

// register for an event (publically => student)
export const registerEvent = async (req: any, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.userId;

    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "You have already registered for this event" });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Sequential queries (not $transaction): Neon serverless/HTTP does not
    // reliably commit interactive transactions.
    const confirmedCount = await prisma.eventRegistration.count({
      where: {
        eventId,
        status: CONFIRMED,
      },
    });

    const status: typeof CONFIRMED | typeof WAITLISTED =
      event.maxCapacity == null || confirmedCount < event.maxCapacity
        ? CONFIRMED
        : WAITLISTED;

    const registration = await prisma.eventRegistration.create({
      data: { userId, eventId, status },
      include: {
        event: {
          select: { title: true, maxCapacity: true },
        },
        user: { select: { firstName: true, lastName: true } },
      },
    });

    const message =
      registration.status === WAITLISTED
        ? "Event is full — you've been added to the waitlist"
        : "Registered successfully";

    return res.status(201).json({
      registration,
      status: registration.status,
      message,
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Error registering for event" });
  }
};

// cancel registration; promote earliest waitlisted user when a confirmed seat opens
export const cancelRegistration = async (req: any, res: Response) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.userId;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (new Date(event.date) < new Date()) {
      return res
        .status(400)
        .json({ message: "Cannot cancel registration for a past event" });
    }

    const registration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!registration) {
      return res
        .status(404)
        .json({ message: "You are not registered for this event" });
    }

    await prisma.eventRegistration.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    // If a confirmed seat is free, promote the oldest waitlisted signup.
    // Sequential queries: Neon serverless/HTTP does not reliably commit
    // interactive $transaction callbacks, so promotion was being skipped.
    const confirmedCount = await prisma.eventRegistration.count({
      where: { eventId, status: CONFIRMED },
    });
    const hasFreeSeat =
      event.maxCapacity == null || confirmedCount < event.maxCapacity;

    if (hasFreeSeat) {
      const nextWaitlisted = await prisma.eventRegistration.findFirst({
        where: {
          eventId,
          status: WAITLISTED,
        },
        orderBy: { registeredAt: "asc" },
      });

      if (nextWaitlisted) {
        await prisma.eventRegistration.update({
          where: { id: nextWaitlisted.id },
          data: { status: CONFIRMED },
        });
        // TODO: notify the promoted user (email/push) when notification support exists
      }
    }

    return res
      .status(200)
      .json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling registration:", error);
    res.status(500).json({ message: "Error cancelling registration" });
  }
};

// get student's registered events
export const getRegisteredEvents = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    const registrations = await prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            club: { select: { name: true, imageUrl: true } },
            _count: {
              select: {
                registrations: {
                  where: { status: CONFIRMED },
                },
              },
            },
          },
        },
      },
      orderBy: { event: { date: "desc" } },
    });

    return res.json({
      registrations: registrations.map((r) => {
        const { _count, ...eventWithoutCount } = r.event;
        return {
          id: r.id,
          status: r.status,
          registeredAt: r.registeredAt,
          event: {
            ...eventWithoutCount,
            confirmedCount: _count.registrations,
            registrationCount: _count.registrations,
          },
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching registered events" });
  }
};

// Get registrations for an event (admin or owning club head)
export const getEventRegistrations = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!id) return res.status(400).json({ message: "Event ID is required" });

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (user?.role === "CLUB_HEAD") {
      const owner = await prisma.user.findUnique({
        where: { id: user.userId },
        include: { club: true },
      });
      if (!owner?.club || event.clubId !== owner.club.id) {
        return res.status(403).json({
          message: "Not allowed to view registrations for this event",
        });
      }
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: id },
      orderBy: { registeredAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.json({
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        maxCapacity: event.maxCapacity,
      },
      registrations: registrations.map((r) => ({
        id: r.id,
        userId: r.userId,
        status: r.status,
        name: `${r.user.firstName} ${r.user.lastName}`.trim(),
        email: r.user.email,
        registeredAt: r.registeredAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({ message: "Error fetching event registrations" });
  }
};

// Update event => admin only
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, data, imageUrl, clubId, maxCapacity } =
      req.body;
    const user: any = (req as any).user;

    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (user?.role === "CLUB_HEAD") {
      const owner = await prisma.user.findUnique({
        where: { id: user.userId },
        include: { club: true },
      });
      if (!owner?.club || event.clubId !== owner.club.id) {
        return res
          .status(403)
          .json({ message: "Not allowed to modify this event" });
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(data && { date: new Date(data) }),
        ...(imageUrl && { imageUrl }),
        ...(clubId && { clubId }),
        ...(maxCapacity !== undefined ? { maxCapacity } : {}),
      },
      include: {
        club: {
          select: { name: true, imageUrl: true },
        },
      },
    });

    res.json({ event: updatedEvent, message: "Event updated successfully" });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Error updating event" });
  }
};

// Delete event => admin or club head
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: any = (req as any).user;

    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (user?.role === "CLUB_HEAD") {
      const owner = await prisma.user.findUnique({
        where: { id: user.userId },
        include: { club: true },
      });
      if (!owner?.club || event.clubId !== owner.club.id) {
        return res
          .status(403)
          .json({ message: "Not allowed to delete this event" });
      }
    }

    await prisma.eventRegistration.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
};
