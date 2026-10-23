import { Router } from "express";
import { prisma } from "../db.js";

export const reviewsRouter = Router();

// GET /api/reviews
reviewsRouter.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;
    const where: any = {};
    if (projectId && typeof projectId === "string") {
      where.projectId = projectId;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        project: { select: { id: true, title: true } }
      }
    });

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
});

// POST /api/reviews
reviewsRouter.post("/", async (req, res) => {
  try {
    const { projectId, userName, userEmail, rating, comment } = req.body;
    if (!projectId || !userName || !comment) {
      return res.status(400).json({ success: false, error: "Project ID, name, and comment are required" });
    }

    const newReview = await prisma.review.create({
      data: {
        projectId,
        userName,
        userEmail: userEmail || "verified@customer.com",
        rating: Math.min(5, Math.max(1, parseInt(rating || 5, 10))),
        comment
      }
    });

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, error: "Failed to create review in database" });
  }
});

// DELETE /api/reviews/:id
reviewsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, error: "Failed to delete review" });
  }
});
