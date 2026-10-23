import { Router } from "express";
import { prisma } from "../db.js";

export const configRouter = Router();

// GET /api/config
configRouter.get("/", async (req, res) => {
  try {
    let config = await prisma.systemConfig.findUnique({
      where: { id: "default" }
    });

    if (!config) {
      config = await prisma.systemConfig.create({
        data: { id: "default" }
      });
    }

    res.json({ success: true, data: config });
  } catch (error) {
    console.error("Error fetching system config:", error);
    res.status(500).json({ success: false, error: "Failed to fetch system config" });
  }
});

// PUT /api/config
configRouter.put("/", async (req, res) => {
  try {
    const body = req.body;
    const updated = await prisma.systemConfig.upsert({
      where: { id: "default" },
      update: {
        // Email SMTP
        smtpHost: body.smtpHost,
        smtpPort: body.smtpPort ? parseInt(body.smtpPort, 10) : undefined,
        smtpUser: body.smtpUser,
        smtpPass: body.smtpPass,
        senderEmail: body.senderEmail,
        senderName: body.senderName,
        smtpSecure: body.smtpSecure !== undefined ? Boolean(body.smtpSecure) : undefined,

        // Payment Gateway
        paymentGateway: body.paymentGateway,
        paymentMode: body.paymentMode,
        paymentApiKey: body.paymentApiKey,
        paymentApiSecret: body.paymentApiSecret,
        paymentCurrency: body.paymentCurrency,
        enableOnlineAdvance: body.enableOnlineAdvance !== undefined ? Boolean(body.enableOnlineAdvance) : undefined,

        // SEO
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords,
        googleAnalyticsId: body.googleAnalyticsId,
        canonicalUrl: body.canonicalUrl,
        ogImage: body.ogImage
      },
      create: {
        id: "default",
        smtpHost: body.smtpHost || "smtp.mailtrap.io",
        smtpPort: body.smtpPort ? parseInt(body.smtpPort, 10) : 587,
        smtpUser: body.smtpUser || "veyras_smtp_user",
        smtpPass: body.smtpPass || "veyras_smtp_pass_2026",
        senderEmail: body.senderEmail || "orders@veyrasinteriors.com",
        senderName: body.senderName || "Veyra's Construction & Interiors",
        paymentGateway: body.paymentGateway || "Razorpay",
        paymentApiKey: body.paymentApiKey || "rzp_test_99veyrasconstruction",
        paymentApiSecret: body.paymentApiSecret || "sec_veyras_pass_key_8892",
        seoTitle: body.seoTitle || "Veyra's Construction and Interiors | Turnkey Civil & Bespoke Design Bengaluru",
        seoDescription: body.seoDescription || "Turnkey architectural construction, luxury residential interiors in Bengaluru.",
        seoKeywords: body.seoKeywords || "construction Bengaluru, interior design Rajajinagar"
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating system config:", error);
    res.status(500).json({ success: false, error: "Failed to update system config" });
  }
});
