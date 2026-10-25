import { Router } from 'express';
import { prisma } from '../db.js';

export const enquiriesRouter = Router();

// GET /api/enquiries (All enquiries for dashboard)
enquiriesRouter.get('/', async (req, res) => {
  try {
    const enquiries = await prisma.enquiry.findMany({
      include: {
        project: {
          select: { id: true, title: true, approxPrice: true, images: { take: 1 } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch enquiries' });
  }
});

// POST /api/enquiries (Client submits enquiry / order estimate)
enquiriesRouter.post('/', async (req, res) => {
  try {
    const {
      projectId,
      clientName,
      clientEmail,
      clientPhone,
      siteAddress,
      city,
      propertyType,
      areaSqFt,
      approxBudget,
      preferredStyle,
      message
    } = req.body;

    if (!clientName || !clientPhone || !message) {
      return res.status(400).json({ success: false, error: 'Name, phone, and requirements message are required.' });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        projectId: projectId || undefined,
        clientName,
        clientEmail: clientEmail || 'client@example.com',
        clientPhone,
        siteAddress: siteAddress || 'Site Address Pending',
        city: city || 'Bengaluru',
        propertyType: propertyType || 'Residential Villa',
        areaSqFt: areaSqFt ? parseInt(areaSqFt, 10) : undefined,
        approxBudget: approxBudget || 'Consultation Required',
        preferredStyle: preferredStyle || 'Contemporary Modern',
        message,
        status: 'NEW'
      },
      include: {
        project: true
      }
    });

    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ success: false, error: 'Failed to submit design enquiry' });
  }
});

// PATCH /api/enquiries/:id (Update status and notes from dashboard)
enquiriesRouter.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, internalNotes } = req.body;

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        status: status || undefined,
        internalNotes: internalNotes !== undefined ? internalNotes : undefined
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ success: false, error: 'Failed to update enquiry' });
  }
});

// DELETE /api/enquiries/:id
enquiriesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.enquiry.delete({ where: { id } });
    res.json({ success: true, message: 'Enquiry removed' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ success: false, error: 'Failed to delete enquiry' });
  }
});
