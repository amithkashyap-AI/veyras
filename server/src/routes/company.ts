import { Router } from 'express';
import { prisma } from '../db.js';

export const companyRouter = Router();

// GET /api/company
companyRouter.get('/', async (req, res) => {
  try {
    let setting = await prisma.companySetting.findUnique({
      where: { id: 'default' }
    });

    if (!setting) {
      setting = await prisma.companySetting.create({
        data: { id: 'default' }
      });
    }

    res.json({ success: true, data: setting });
  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch company information' });
  }
});

// PUT /api/company (Save from dashboard)
companyRouter.put('/', async (req, res) => {
  try {
    const body = req.body;

    const updated = await prisma.companySetting.upsert({
      where: { id: 'default' },
      update: {
        companyName: body.companyName,
        tagline: body.tagline,
        phone: body.phone,
        whatsapp: body.whatsapp,
        email: body.email,
        address: body.address,
        city: body.city,
        workingHours: body.workingHours,
        logoUrl: body.logoUrl
      },
      create: {
        id: 'default',
        companyName: body.companyName || "Veyra's Construction and Interiors",
        tagline: body.tagline || 'Building Spaces • Creating Lifestyles',
        phone: body.phone || '089213 36363',
        whatsapp: body.whatsapp || '089213 36363',
        email: body.email || 'contact@veyrasinteriors.com',
        address: body.address || '#98, 1Main , 4th Cross , Manjunatha Nagar, Rajainagar-560010, Bengaluru, Karnataka',
        city: body.city || 'Hyderabad'
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating company setting:', error);
    res.status(500).json({ success: false, error: 'Failed to update company settings' });
  }
});
