import { Router, Request, Response } from 'express';
import { prisma } from '../db.js';

export const interactionsRouter = Router();

// GET /api/interactions/user-state?email=...
interactionsRouter.get('/user-state', async (req: Request, res: Response): Promise<any> => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.json({ success: true, wishlist: [], likes: [] });
    }

    const [wishlistItems, userLikes] = await Promise.all([
      prisma.wishlistItem.findMany({
        where: { userEmail: email.toLowerCase() },
        select: { projectId: true }
      }),
      prisma.projectLike.findMany({
        where: { userEmail: email.toLowerCase() },
        select: { projectId: true }
      })
    ]);

    return res.json({
      success: true,
      wishlist: wishlistItems.map((w: any) => w.projectId),
      likes: userLikes.map((l: any) => l.projectId)
    });
  } catch (error: any) {
    console.error('Error fetching user interactions:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch user state' });
  }
});

// GET /api/interactions/wishlist?email=...
interactionsRouter.get('/wishlist', async (req: Request, res: Response): Promise<any> => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userEmail: email.toLowerCase() },
      include: {
        project: {
          include: {
            images: { orderBy: { sortOrder: 'asc' } },
            category: true,
            _count: { select: { reviews: true, likes: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      data: wishlistItems.map((item: any) => item.project)
    });
  } catch (error: any) {
    console.error('Error fetching wishlist projects:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch wishlist' });
  }
});

// POST /api/interactions/wishlist/toggle
interactionsRouter.post('/wishlist/toggle', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, projectId } = req.body;
    if (!email || !projectId) {
      return res.status(400).json({ error: 'email and projectId are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if exists
    const existing = await prisma.wishlistItem.findFirst({
      where: { userEmail: cleanEmail, projectId }
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return res.json({
        success: true,
        isWishlisted: false,
        message: 'Removed from your Wishlist'
      });
    } else {
      // Find user if exists
      const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

      const newItem = await prisma.wishlistItem.create({
        data: {
          userEmail: cleanEmail,
          projectId,
          userId: user?.id || null
        }
      });
      return res.json({
        success: true,
        isWishlisted: true,
        message: 'Added to your Wishlist',
        data: newItem
      });
    }
  } catch (error: any) {
    console.error('Error toggling wishlist:', error);
    return res.status(500).json({ error: error.message || 'Failed to toggle wishlist' });
  }
});

// POST /api/interactions/like/toggle
interactionsRouter.post('/like/toggle', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, projectId } = req.body;
    if (!email || !projectId) {
      return res.status(400).json({ error: 'email and projectId are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.projectLike.findFirst({
      where: { userEmail: cleanEmail, projectId }
    });

    if (existing) {
      await prisma.projectLike.delete({ where: { id: existing.id } });
      const count = await prisma.projectLike.count({ where: { projectId } });
      return res.json({
        success: true,
        isLiked: false,
        likeCount: count,
        message: 'Project unliked'
      });
    } else {
      await prisma.projectLike.create({
        data: {
          userEmail: cleanEmail,
          projectId
        }
      });
      const count = await prisma.projectLike.count({ where: { projectId } });
      return res.json({
        success: true,
        isLiked: true,
        likeCount: count,
        message: 'Project liked'
      });
    }
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return res.status(500).json({ error: error.message || 'Failed to toggle like' });
  }
});
