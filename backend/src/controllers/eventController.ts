import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// get all events (publically on landing page)
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        club: {
          select: { name: true, imageUrl: true },
        },
        registrations: {
          select: { id: true },
        },
      },
      orderBy: { date: "asc" },
    });
    return res.json({ events });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
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
