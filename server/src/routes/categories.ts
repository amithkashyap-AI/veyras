import { Router } from 'express';
import { prisma } from '../db.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { projects: true } }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: categories.map(c => ({
        ...c,
        projectCount: c._count.projects
      }))
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

categoriesRouter.post('/', async (req, res) => {
  try {
    const { name, color = 'blue', description, image } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const cat = await prisma.category.create({
      data: { name, slug, color, description, image }
    });

    res.status(201).json({ success: true, data: cat });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, error: 'Failed to create category' });
  }
});
