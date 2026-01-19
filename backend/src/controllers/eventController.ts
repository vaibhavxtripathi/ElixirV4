import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// get all events (publically on landing page)
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const sort = (req.query.sort as string) || "desc";
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await prisma.event.count();

    // Optimize query: use _count instead of loading all registrations
    const events = await prisma.event.findMany({
      take: limit,
      skip: skip,
      include: {
        club: {
          select: { name: true, imageUrl: true },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { date: sort === "asc" ? "asc" : "desc" },
    });

    // Transform to include registration count
    const eventsWithCounts = events.map((event) => {
      const { _count, ...eventData } = event;
      return {
        ...eventData,
        registrationCount: _count.registrations,
      };
    });

    // Set caching headers
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");

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
        registrations: { select: { id: true } },
      },
      orderBy: { date: "desc" },
    });

    return res.json({ events });
  } catch (error) {
    res.status(500).json({ message: "Error fetching club events" });
  }
};

// create event (only for club heads)
export const createEvent = async (req: any, res: Response) => {
  try {
    const { title, description, data, imageUrl } = req.body;
    const userId = req.user?.userId;

    if (!title || !description || !data || !imageUrl)
      return res.status(400).json({ message: "All fields are required" });

    //find user's club
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
    const existingRegisration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingRegisration) {
      return res
        .status(400)
        .json({ message: "You have already registered for this event" });
    }

    const registration = await prisma.eventRegistration.create({
      data: { userId, eventId },
      include: {
        event: {
          select: { title: true },
        },
        user: { select: { firstName: true, lastName: true } },
      },
    });

    return res.status(201).json({ registration });
  } catch (error) {
    res.status(500).json({ message: "Error registering for event" });
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
          },
        },
      },
      orderBy: { event: { date: "desc" } },
    });
    return res.json({ registrations });
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
        return res
          .status(403)
          .json({
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
      event: { id: event.id, title: event.title, date: event.date },
      registrations: registrations.map((r) => ({
        id: r.id,
        userId: r.userId,
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
    const { title, description, data, imageUrl, clubId } = req.body;
    const user: any = (req as any).user;

    if (!id) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Authorization: Club heads can only update their own club's events
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

    // Update event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(data && { date: new Date(data) }),
        ...(imageUrl && { imageUrl }),
        ...(clubId && { clubId }),
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

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Authorization: Club heads can only delete their own club's events
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

    // Delete registrations first to avoid FK constraint issues
    await prisma.eventRegistration.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
};
