import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

//get all mentors => publicly on /mentors
export const getAllMentors = async (req: Request, res: Response) => {
  try {
    const mentors = await prisma.mentor.findMany({
      include: {
        club: {
          select: { name: true, imageUrl: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return res.json({ mentors });
  } catch (error) {
    res.status(500).json({ message: "Error fetching mentors" });
  }
};

//create/add mentor => admin only
export const createMentor = async (req: any, res: Response) => {
  try {
    const { name, expertise, imageUrl, clubId, linkedInUrl } = req.body;
    if (!name || !expertise || !imageUrl || !clubId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const mentor = await prisma.mentor.create({
      data: {
        name,
        expertise,
        imageUrl,
        linkedInUrl: linkedInUrl ?? "",
        clubId,
      },
      include: {
        club: {
          select: { name: true },
        },
      },
    });
    return res.status(201).json({ mentor });
  } catch (error) {
    res.status(500).json({ message: "Error creating mentor" });
  }
};

//update mentor => admin only
export const updateMentor = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { name, expertise, imageUrl, clubId, linkedInUrl } = req.body;

    const mentor = await prisma.mentor.update({
      where: { id },
      data: { name, expertise, imageUrl, clubId, linkedInUrl },
      include: {
        club: {
          select: { name: true },
        },
      },
    });
    return res.json({ mentor });
  } catch (error) {
    res.status(500).json({ message: "Error updating mentor" });
  }
};

//delete mentor => admin only
export const deleteMentor = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.mentor.delete({ where: { id } });
    return res.json({ message: "Mentor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting mentor" });
  }
};
