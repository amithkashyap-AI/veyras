import { Router } from "express";
import { prisma } from "../db.js";

export const servicesRouter = Router();
export const menusRouter = Router();

// ==========================================
// 1. SERVICES ENDPOINTS
// ==========================================

// GET /api/services (List all services with optional filtering)
servicesRouter.get("/", async (req, res): Promise<any> => {
  try {
    const { category, submenuSlug, search, featuredOnly } = req.query;

    const where: any = {};
    if (category && category !== "all") {
      where.category = { equals: String(category), mode: "insensitive" };
    }
    if (submenuSlug) {
      where.submenu = { slug: String(submenuSlug) };
    }
    if (featuredOnly === "true") {
      where.isFeatured = true;
    }
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: "insensitive" } },
        { subtitle: { contains: String(search), mode: "insensitive" } },
        { description: { contains: String(search), mode: "insensitive" } },
        { category: { contains: String(search), mode: "insensitive" } }
      ];
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" }
      ],
      include: {
        submenu: {
          include: {
            menu: true
          }
        }
      }
    });

    return res.json({ success: true, count: services.length, data: services });
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch services" });
  }
});

// GET /api/services/:idOrSlug
servicesRouter.get("/:idOrSlug", async (req, res): Promise<any> => {
  try {
    const { idOrSlug } = req.params;
    const service = await prisma.service.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug }
        ]
      },
      include: {
        submenu: {
          include: {
            menu: true
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    return res.json({ success: true, data: service });
  } catch (error: any) {
    console.error("Error fetching service:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch service detail" });
  }
});

// POST /api/services (Admin create new service)
servicesRouter.post("/", async (req, res): Promise<any> => {
  try {
    const {
      title,
      subtitle,
      description,
      pricePerSqFt,
      priceUnit = "per sq.ft",
      minAreaSqFt,
      durationWeeks,
      category = "Interior Design",
      imageUrl,
      galleryImages = [],
      features = [],
      enableEnquiry = true,
      enableWhatsApp = true,
      isFeatured = true,
      order = 0,
      submenuId
    } = req.body;

    if (!title || pricePerSqFt === undefined) {
      return res.status(400).json({ success: false, error: "Title and pricePerSqFt are required" });
    }

    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const service = await prisma.service.create({
      data: {
        title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        subtitle: subtitle || null,
        description: description || "",
        pricePerSqFt: parseFloat(String(pricePerSqFt)),
        priceUnit,
        minAreaSqFt: minAreaSqFt ? parseInt(String(minAreaSqFt)) : 500,
        durationWeeks: durationWeeks ? parseInt(String(durationWeeks)) : 6,
        category,
        imageUrl: imageUrl || "/assets/projects/project-patio.jpg",
        galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
        features: Array.isArray(features) ? features : [],
        enableEnquiry: Boolean(enableEnquiry),
        enableWhatsApp: Boolean(enableWhatsApp),
        isFeatured: Boolean(isFeatured),
        order: parseInt(String(order)) || 0,
        submenuId: submenuId || null
      },
      include: {
        submenu: true
      }
    });

    return res.status(201).json({ success: true, message: "Service created successfully", data: service });
  } catch (error: any) {
    console.error("Error creating service:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to create service" });
  }
});

// PUT /api/services/:id (Admin update service)
servicesRouter.put("/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      description,
      pricePerSqFt,
      priceUnit,
      minAreaSqFt,
      durationWeeks,
      category,
      imageUrl,
      galleryImages,
      features,
      enableEnquiry,
      enableWhatsApp,
      isFeatured,
      order,
      submenuId
    } = req.body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (subtitle !== undefined) data.subtitle = subtitle;
    if (description !== undefined) data.description = description;
    if (pricePerSqFt !== undefined) data.pricePerSqFt = parseFloat(String(pricePerSqFt));
    if (priceUnit !== undefined) data.priceUnit = priceUnit;
    if (minAreaSqFt !== undefined) data.minAreaSqFt = parseInt(String(minAreaSqFt));
    if (durationWeeks !== undefined) data.durationWeeks = parseInt(String(durationWeeks));
    if (category !== undefined) data.category = category;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (galleryImages !== undefined) data.galleryImages = galleryImages;
    if (features !== undefined) data.features = features;
    if (enableEnquiry !== undefined) data.enableEnquiry = Boolean(enableEnquiry);
    if (enableWhatsApp !== undefined) data.enableWhatsApp = Boolean(enableWhatsApp);
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (order !== undefined) data.order = parseInt(String(order));
    if (submenuId !== undefined) data.submenuId = submenuId || null;

    const updated = await prisma.service.update({
      where: { id },
      data,
      include: {
        submenu: true
      }
    });

    return res.json({ success: true, message: "Service updated successfully", data: updated });
  } catch (error: any) {
    console.error("Error updating service:", error);
    return res.status(500).json({ success: false, error: "Failed to update service" });
  }
});

// DELETE /api/services/:id (Admin delete service)
servicesRouter.delete("/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;
    await prisma.service.delete({
      where: { id }
    });
    return res.json({ success: true, message: "Service deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return res.status(500).json({ success: false, error: "Failed to delete service" });
  }
});


// ==========================================
// 2. NAV MENUS & SUBMENUS ENDPOINTS
// ==========================================

// GET /api/menus (List menus with submenus and counts)
menusRouter.get("/", async (_req, res): Promise<any> => {
  try {
    const menus = await prisma.navMenu.findMany({
      orderBy: { order: "asc" },
      include: {
        submenus: {
          orderBy: { order: "asc" },
          include: {
            _count: {
              select: { services: true }
            }
          }
        }
      }
    });
    return res.json({ success: true, data: menus });
  } catch (error: any) {
    console.error("Error fetching menus:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch menus" });
  }
});

// POST /api/menus (Admin create menu)
menusRouter.post("/", async (req, res): Promise<any> => {
  try {
    const { title, icon = "Layers", order = 0, isActive = true } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Menu title is required" });
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const menu = await prisma.navMenu.create({
      data: {
        title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        icon,
        order: parseInt(String(order)) || 0,
        isActive: Boolean(isActive)
      },
      include: {
        submenus: true
      }
    });

    return res.status(201).json({ success: true, message: "Menu created", data: menu });
  } catch (error: any) {
    console.error("Error creating menu:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to create menu" });
  }
});

// PUT /api/menus/:id
menusRouter.put("/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, icon, order, isActive } = req.body;
    const updated = await prisma.navMenu.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order: parseInt(String(order), 10) || 0 }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) })
      },
      include: {
        submenus: true
      }
    });
    return res.json({ success: true, message: "Menu updated", data: updated });
  } catch (error: any) {
    console.error("Error updating menu:", error);
    return res.status(500).json({ success: false, error: "Failed to update menu" });
  }
});

// DELETE /api/menus/:id
menusRouter.delete("/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;
    await prisma.navMenu.delete({
      where: { id }
    });
    return res.json({ success: true, message: "Menu deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting menu:", error);
    return res.status(500).json({ success: false, error: "Failed to delete menu" });
  }
});

// POST /api/menus/:menuId/submenus (Create Submenu)
menusRouter.post("/:menuId/submenus", async (req, res): Promise<any> => {
  try {
    const { menuId } = req.params;
    const { title, description, order = 0, isActive = true } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Submenu title is required" });
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const submenu = await prisma.navSubmenu.create({
      data: {
        menuId,
        title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        description: description || null,
        order: parseInt(String(order)) || 0,
        isActive: Boolean(isActive)
      }
    });

    return res.status(201).json({ success: true, message: "Submenu created", data: submenu });
  } catch (error: any) {
    console.error("Error creating submenu:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to create submenu" });
  }
});

// PUT /api/menus/submenus/:id (Update Submenu)
menusRouter.put("/submenus/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;
    const { title, description, order, isActive } = req.body;
    const updated = await prisma.navSubmenu.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order: parseInt(String(order), 10) || 0 }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) })
      }
    });
    return res.json({ success: true, message: "Submenu updated", data: updated });
  } catch (error: any) {
    console.error("Error updating submenu:", error);
    return res.status(500).json({ success: false, error: "Failed to update submenu" });
  }
});

// DELETE /api/menus/submenus/:id (Delete Submenu)
menusRouter.delete("/submenus/:id", async (req, res): Promise<any> => {
  try {
    const { id } = req.params;
    await prisma.navSubmenu.delete({
      where: { id }
    });
    return res.json({ success: true, message: "Submenu deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting submenu:", error);
    return res.status(500).json({ success: false, error: "Failed to delete submenu" });
  }
});
