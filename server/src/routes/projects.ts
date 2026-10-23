import { Router } from 'express';
import { prisma } from '../db.js';

export const projectsRouter = Router();

// GET /api/projects
projectsRouter.get('/', async (req, res) => {
  try {
    const { search, category, city, minPrice, maxPrice, sortBy = 'newest' } = req.query;

    const where: any = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { materials: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category && typeof category === 'string' && category !== 'all') {
      where.category = { slug: category };
    }

    if (city && typeof city === 'string' && city !== 'all') {
      where.city = { equals: city, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.approxPrice = {};
      if (minPrice) where.approxPrice.gte = parseFloat(minPrice as string);
      if (maxPrice) where.approxPrice.lte = parseFloat(maxPrice as string);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { approxPrice: 'asc' };
    else if (sortBy === 'price_desc') orderBy = { approxPrice: 'desc' };
    else if (sortBy === 'area_desc') orderBy = { areaSqFt: 'desc' };

    const projects = await prisma.project.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { enquiries: true } }
      }
    });

    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id
projectsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        enquiries: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Error fetching project detail:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch project detail' });
  }
});

// POST /api/projects (Create project from dashboard)
projectsRouter.post('/', async (req, res) => {
  try {
    const body = req.body;
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const newProject = await prisma.project.create({
      data: {
        title: body.title,
        slug,
        tagline: body.tagline || '',
        description: body.description || '',
        approxPrice: parseFloat(body.approxPrice || 250000),
        priceUnit: body.priceUnit || 'Total Project Estimate',
        areaSqFt: body.areaSqFt ? parseInt(body.areaSqFt, 10) : undefined,
        timeline: body.timeline || '30 - 45 Days',
        materials: body.materials || 'Premium Hardwood, Stone Pavers, Architectural Lighting',
        address: body.address || 'Road No. 12, Jubilee Hills',
        city: body.city || 'Hyderabad',
        state: body.state || 'Telangana',
        lat: parseFloat(body.lat || 17.4319),
        lng: parseFloat(body.lng || 78.4073),
        isFeatured: Boolean(body.isFeatured),
        categoryId: body.categoryId,
        images: {
          create: (body.images || []).map((img: any, idx: number) => ({
            url: typeof img === 'string' ? img : img.url,
            isPrimary: idx === 0,
            sortOrder: idx
          }))
        }
      },
      include: {
        category: true,
        images: true
      }
    });

    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, error: 'Failed to create project in database' });
  }
});

// PUT /api/projects/:id (Update project from dashboard)
projectsRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        tagline: body.tagline,
        description: body.description,
        approxPrice: body.approxPrice ? parseFloat(body.approxPrice) : undefined,
        priceUnit: body.priceUnit,
        areaSqFt: body.areaSqFt ? parseInt(body.areaSqFt, 10) : undefined,
        timeline: body.timeline,
        materials: body.materials,
        address: body.address,
        city: body.city,
        state: body.state,
        categoryId: body.categoryId,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined
      },
      include: {
        category: true,
        images: true
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id
projectsRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ success: true, message: 'Project removed successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
});
