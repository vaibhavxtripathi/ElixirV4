import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const listTestimonials = async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt((req.query.page as string) || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt((req.query.limit as string) || "12", 10), 1),
      100
    );
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.testimonial.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.testimonial.count(),
    ]);

    return res.json({ items, page, limit, total });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch testimonials" });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const { name, imageUrl, batchYear, content } = req.body;
    const created = await prisma.testimonial.create({
      data: { name, imageUrl, batchYear, content },
    });
    return res.status(201).json({ testimonial: created });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create testimonial" });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { name, imageUrl, batchYear, content } = req.body;

    const updated = await prisma.testimonial.update({
      where: { id },
      data: { name, imageUrl, batchYear, content },
    });
    return res.json({ testimonial: updated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update testimonial" });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.testimonial.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete testimonial" });
  }
};
