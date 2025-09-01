import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

//create a club => admin only
export const createClub = async (req: any, res: Response) => {
  try {
    const { name, description, imageUrl, clubHeadEmail } = req.body;
    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    //find the student to assign as club head
    let clubhead = null;
    if (clubHeadEmail) {
      clubhead = await prisma.user.findUnique({
        where: { email: clubHeadEmail },
      });
    }

    if (!clubhead) {
      return res.status(404).json({ message: "Club head not found" });
    }

    const club = await prisma.club.create({
      data: {
        name,
        description,
        imageUrl,
        clubHeadId: clubhead?.id || null,
      },
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    //if club head is assigned, update their role to CLUB_HEAD
    if (clubhead) {
      await prisma.user.update({
        where: { id: clubhead.id },
        data: { role: Role.CLUB_HEAD },
      });
    }
    return res.status(201).json({ club });
  } catch (error) {
    res.status(500).json({ message: "Error creating club" });
  }
};

// get all clubs
export const getAllClubs = async (req: Request, res: Response) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        events: {
          select: { id: true, title: true, date: true },
        },
      },
    });

    res.json({ clubs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching clubs" });
  }
};
