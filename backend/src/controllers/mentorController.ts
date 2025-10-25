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
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Transform the data to include like count
    const mentorsWithLikes = mentors.map((mentor) => ({
      ...mentor,
      likeCount: mentor._count.likes,
      _count: undefined, // Remove the _count field
    }));

    return res.json({ mentors: mentorsWithLikes });
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

//like/unlike mentor => authenticated users only
export const toggleMentorLike = async (req: any, res: Response) => {
  try {
    const { mentorId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
    });

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check if user already liked this mentor
    const existingLike = await prisma.mentorLike.findUnique({
      where: {
        userId_mentorId: {
          userId,
          mentorId,
        },
      },
    });

    if (existingLike) {
      // Unlike: remove the like
      await prisma.mentorLike.delete({
        where: {
          userId_mentorId: {
            userId,
            mentorId,
          },
        },
      });

      // Get updated like count
      const likeCount = await prisma.mentorLike.count({
        where: { mentorId },
      });

      return res.json({
        message: "Mentor unliked successfully",
        liked: false,
        likeCount,
      });
    } else {
      // Like: create new like
      await prisma.mentorLike.create({
        data: {
          userId,
          mentorId,
        },
      });

      // Get updated like count
      const likeCount = await prisma.mentorLike.count({
        where: { mentorId },
      });

      return res.json({
        message: "Mentor liked successfully",
        liked: true,
        likeCount,
      });
    }
  } catch (error) {
    console.error("Error toggling mentor like:", error);
    res.status(500).json({ message: "Error toggling mentor like" });
  }
};

//get user's liked mentors => authenticated users only
export const getUserLikedMentors = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const likedMentors = await prisma.mentorLike.findMany({
      where: { userId },
      include: {
        mentor: {
          include: {
            club: {
              select: { name: true, imageUrl: true },
            },
            _count: {
              select: { likes: true },
            },
          },
        },
      },
    });

    const mentorsWithLikes = likedMentors.map((like) => ({
      ...like.mentor,
      likeCount: like.mentor._count.likes,
      _count: undefined,
    }));

    return res.json({ likedMentors: mentorsWithLikes });
  } catch (error) {
    console.error("Error fetching liked mentors:", error);
    res.status(500).json({ message: "Error fetching liked mentors" });
  }
};
