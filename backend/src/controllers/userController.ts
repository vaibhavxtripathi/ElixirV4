import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { resolveSoa } from "dns";

const prisma = new PrismaClient();

//get all users => admin only
export const getAllUsers = async (req: any, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        clubId: true,
        club: {
          select: { name: true },
        },
        createdAt: true,
        _count: {
          select: {
            eventRegistrations: true,
            blogs: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

//change role of user => admin only
export const changeRole = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;

    if (!newRole || !Object.values(Role).includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    //prevent admin from changing their own role
    if (req.user.userId === userId) {
      return res
        .status(400)
        .json({ message: "You cannot change your own role" });
    }

    //change role
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        club: {
          select: { name: true },
        },
      },
    });
    return res.json({ user, message: "Role changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing role" });
  }
};

//assign user to club => admin only
export const assignUserToClub = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const { clubId } = req.body;
    if (!clubId) {
      return res.status(400).json({ message: "Club ID is required" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { clubId },
      include: {
        club: {
          select: { name: true },
        },
      },
    });
    return res.json({ user, message: "User assigned to club successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error assigning user to club" });
  }
};

//remove user from club => admin only
export const removeUserFromClub = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { clubId: null },
      include: {
        club: {
          select: { name: true },
        },
      },
    });

    return res.json({ user, message: "User removed from club successfully" });
  } catch (error) {
    console.error("Remove from club error:", error);
    return res.status(500).json({ message: "Failed to remove user from club" });
  }
};

//get platform analystics => admin only
export const getPlatformAnalytics = async (req: any, res: Response) => {
  try {
    const [
      totalUsers,
      totalClubs,
      totalEvents,
      totalBlogs,
      totalMentors,
      roleCounts,
      recentRegistrations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.club.count(),
      prisma.event.count(),
      prisma.blog.count(),
      prisma.mentor.count(),
      prisma.user.groupBy({
        by: ["role"],
        _count: { role: true },
      }),
      prisma.eventRegistration.findMany({
        take: 10,
        orderBy: { registeredAt: "desc" },
        include: {
          event: {
            select: { title: true },
          },
          user: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);
    return res.json({
      analytics: {
        totalUsers,
        totalClubs,
        totalEvents,
        totalBlogs,
        totalMentors,
        roleCounts,
        recentRegistrations,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching platform analytics" });
  }
};
