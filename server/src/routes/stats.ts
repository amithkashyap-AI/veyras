import { Router } from 'express';
import { prisma } from '../db.js';

export const statsRouter = Router();

statsRouter.get('/', async (req, res) => {
  try {
    const [projectCount, enquiryCount, categoryCount, projects] = await Promise.all([
      prisma.project.count(),
      prisma.enquiry.count(),
      prisma.category.count(),
      prisma.project.findMany({ select: { approxPrice: true } })
    ]);

    const totalPortfolioValue = projects.reduce((acc, p) => acc + (p.approxPrice || 0), 0);

    res.json({
      success: true,
      data: {
        totalProjects: projectCount,
        totalEnquiries: enquiryCount,
        totalCategories: categoryCount,
        portfolioValue: Math.round(totalPortfolioValue),
        activeSites: 4
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch dashboard statistics' });
  }
});
