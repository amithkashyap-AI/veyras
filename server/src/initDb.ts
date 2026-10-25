import { prisma } from "./db.js";

export async function ensureDatabaseSchemaAndSeed() {
  try {
    // 1. Ensure User table columns for RBAC, Admin Profile & Security
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "phone" TEXT,
      ADD COLUMN IF NOT EXISTS "title" TEXT DEFAULT 'Client',
      ADD COLUMN IF NOT EXISTS "department" TEXT DEFAULT 'General',
      ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT,
      ADD COLUMN IF NOT EXISTS "bio" TEXT,
      ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'ACTIVE',
      ADD COLUMN IF NOT EXISTS "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[],
      ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT true;
    `);

    // 2. Ensure SystemConfig table columns for WhatsApp, API Keys, Ollama, Meta Ads & Frontend CMS
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "SystemConfig"
      ADD COLUMN IF NOT EXISTS "otpExpirySeconds" INTEGER DEFAULT 600,
      ADD COLUMN IF NOT EXISTS "whatsappProvider" TEXT DEFAULT 'Meta WhatsApp Cloud API',
      ADD COLUMN IF NOT EXISTS "whatsappBusinessNumber" TEXT DEFAULT '918921336363',
      ADD COLUMN IF NOT EXISTS "whatsappPhoneNumberId" TEXT DEFAULT '109283746510293',
      ADD COLUMN IF NOT EXISTS "whatsappBusinessAccountId" TEXT DEFAULT '987654321098765',
      ADD COLUMN IF NOT EXISTS "whatsappAccessToken" TEXT DEFAULT 'EAAGm0PX4ZCpsBAKZ_veyras_wa_cloud_token_2026',
      ADD COLUMN IF NOT EXISTS "whatsappWebhookToken" TEXT DEFAULT 'veyras_wa_verify_2026',
      ADD COLUMN IF NOT EXISTS "whatsappWelcomeTemplate" TEXT DEFAULT 'Namaste from Veyra''s Construction & Interiors! Thank you for reaching out. Our Principal Architect will review your requirements and connect with you shortly.',
      ADD COLUMN IF NOT EXISTS "whatsappAutoReply" BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS "enableFloatingWhatsApp" BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS "ollamaEndpoint" TEXT DEFAULT 'http://localhost:11434',
      ADD COLUMN IF NOT EXISTS "ollamaDefaultModel" TEXT DEFAULT 'llama3.2:3b',
      ADD COLUMN IF NOT EXISTS "ollamaTemperature" DOUBLE PRECISION DEFAULT 0.7,
      ADD COLUMN IF NOT EXISTS "metaAppId" TEXT DEFAULT '148293049582104',
      ADD COLUMN IF NOT EXISTS "metaAppSecret" TEXT DEFAULT 'meta_sec_veyras_99201',
      ADD COLUMN IF NOT EXISTS "metaAccessToken" TEXT DEFAULT 'EAABsbCS1iHgBO89VeyrasAdsToken2026',
      ADD COLUMN IF NOT EXISTS "metaAdAccountId" TEXT DEFAULT 'act_8839201948',
      ADD COLUMN IF NOT EXISTS "metaPixelId" TEXT DEFAULT '948372615049382',
      ADD COLUMN IF NOT EXISTS "instagramAccountId" TEXT DEFAULT '17841405829301928',
      ADD COLUMN IF NOT EXISTS "googleMapsApiKey" TEXT DEFAULT 'AIzaSyVeyrasBengaluruMapsKey2026',
      ADD COLUMN IF NOT EXISTS "cloudinaryApiKey" TEXT DEFAULT 'cld_veyras_media_88392',
      ADD COLUMN IF NOT EXISTS "announcementText" TEXT DEFAULT '✨ Complimentary 3D Architectural Concept & On-Site Consultation in Bengaluru — Call/WhatsApp 089213 36363',
      ADD COLUMN IF NOT EXISTS "showAnnouncementBar" BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS "heroBadgeText" TEXT DEFAULT 'Veyra''s Construction & Interiors',
      ADD COLUMN IF NOT EXISTS "heroTitle" TEXT DEFAULT 'Building Spaces •',
      ADD COLUMN IF NOT EXISTS "heroHighlightText" TEXT DEFAULT 'Creating Lifestyles',
      ADD COLUMN IF NOT EXISTS "heroSubtitle" TEXT DEFAULT 'From turnkey civil structural construction to bespoke modern courtyards, reflection pools, and high-end residential interiors.',
      ADD COLUMN IF NOT EXISTS "heroBgImage" TEXT DEFAULT '/assets/projects/project-zen-courtyard.jpg',
      ADD COLUMN IF NOT EXISTS "showHeroEstimator" BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS "showCategoryShowcase" BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS "showQualitySection" BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS "showTestimonials" BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS "rateCourtyard" DOUBLE PRECISION DEFAULT 650,
      ADD COLUMN IF NOT EXISTS "rateConstruction" DOUBLE PRECISION DEFAULT 2400,
      ADD COLUMN IF NOT EXISTS "rateInteriors" DOUBLE PRECISION DEFAULT 1850,
      ADD COLUMN IF NOT EXISTS "rateDecks" DOUBLE PRECISION DEFAULT 750,
      ADD COLUMN IF NOT EXISTS "rateRenovation" DOUBLE PRECISION DEFAULT 1100,
      ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT DEFAULT 'https://instagram.com/veyrasinteriors',
      ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT DEFAULT 'https://facebook.com/veyrasinteriors',
      ADD COLUMN IF NOT EXISTS "youtubeUrl" TEXT DEFAULT 'https://youtube.com/@veyrasinteriors';
    `);

    // 3. Ensure AdCampaign table exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AdCampaign" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "platform" TEXT NOT NULL DEFAULT 'Instagram & Facebook',
        "placement" TEXT NOT NULL DEFAULT 'Instagram Reels & Feed',
        "objective" TEXT NOT NULL DEFAULT 'LEAD_GENERATION',
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "dailyBudget" DOUBLE PRECISION NOT NULL DEFAULT 1500,
        "totalBudget" DOUBLE PRECISION NOT NULL DEFAULT 45000,
        "spentAmount" DOUBLE PRECISION NOT NULL DEFAULT 12400,
        "targetAudience" TEXT NOT NULL DEFAULT 'Bengaluru Villa & Luxury Apartment Owners (28-58 yrs) — Rajajinagar, Sadashivanagar, Indiranagar, Whitefield',
        "targetLocations" TEXT NOT NULL DEFAULT 'Bengaluru, Karnataka (+25 km radius)',
        "headline" TEXT NOT NULL,
        "primaryText" TEXT NOT NULL,
        "ctaText" TEXT NOT NULL DEFAULT 'Send WhatsApp Message',
        "destinationUrl" TEXT NOT NULL DEFAULT 'https://wa.me/918921336363',
        "mediaUrl" TEXT NOT NULL DEFAULT '/assets/projects/project-zen-courtyard.jpg',
        "targetService" TEXT DEFAULT 'Luxury Interior Design (₹1,850/sq.ft)',
        "impressions" INTEGER NOT NULL DEFAULT 18450,
        "clicks" INTEGER NOT NULL DEFAULT 642,
        "leadsCount" INTEGER NOT NULL DEFAULT 28,
        "conversionsCount" INTEGER NOT NULL DEFAULT 6,
        "roas" DOUBLE PRECISION NOT NULL DEFAULT 4.8,
        "aiOptimized" BOOLEAN NOT NULL DEFAULT true,
        "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "endDate" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "AdCampaign_pkey" PRIMARY KEY ("id")
      );
    `);

    // 4. Ensure default Admin & sample staff/client users exist
    const adminExists = await prisma.user.findUnique({
      where: { email: "admin@veyrasinteriors.com" }
    });
    if (!adminExists) {
      await prisma.user.create({
        data: {
          email: "admin@veyrasinteriors.com",
          name: "Amith Kashyap",
          phone: "089213 36363",
          password: process.env.ADMIN_PASSWORD || "admin123",
          role: "ADMIN",
          title: "Principal Architect & Managing Director",
          department: "Executive Leadership",
          bio: "Principal Architect overseeing turnkey residential villas, Zen courtyards, and luxury interiors across Bengaluru.",
          status: "ACTIVE",
          permissions: ["ALL_ACCESS", "MANAGE_CMS", "MANAGE_MENUS", "MANAGE_USERS", "MANAGE_ADS", "MANAGE_CONFIG", "RUN_AI_REPORTS"],
          mustChangePassword: false,
          hasChangedPassword: true,
          twoFactorEnabled: true,
          lastLoginAt: new Date()
        }
      });
    }

    const userCount = await prisma.user.count();
    if (userCount <= 2) {
      const sampleUsers = [
        {
          email: "ananya.rao@veyrasinteriors.com",
          name: "Ar. Ananya Rao",
          phone: "+91 98450 11223",
          password: "veyras2026",
          role: "ARCHITECT",
          title: "Senior Lead Interior Architect",
          department: "Design & 3D Visualization",
          bio: "Specializes in Italian marble living spaces, German modular kitchens, and biophilic courtyard architecture.",
          status: "ACTIVE",
          permissions: ["MANAGE_CMS", "VIEW_REPORTS", "MANAGE_PROJECTS"],
          mustChangePassword: false,
          hasChangedPassword: true
        },
        {
          email: "vikram.hegde@veyrasinteriors.com",
          name: "Vikram Hegde",
          phone: "+91 99001 44556",
          password: "veyras2026",
          role: "MANAGER",
          title: "Head of Operations & Client Growth",
          department: "Operations & Marketing",
          bio: "Manages site schedules, client consultations, and Meta/Instagram ad campaigns.",
          status: "ACTIVE",
          permissions: ["MANAGE_CMS", "MANAGE_ADS", "VIEW_REPORTS", "MANAGE_ENQUIRIES"],
          mustChangePassword: false,
          hasChangedPassword: true
        },
        {
          email: "rajesh.varma@example.com",
          name: "Rajesh K. Varma",
          phone: "+91 98802 77889",
          password: "client123",
          role: "USER",
          title: "Villa Owner — Sadashivanagar",
          department: "Client Portal",
          bio: "Exploring Zen Courtyard & Turnkey Villa Renovation packages.",
          status: "ACTIVE",
          permissions: ["PORTAL_ACCESS"],
          mustChangePassword: false,
          hasChangedPassword: true
        },
        {
          email: "priya.nair@example.com",
          name: "Dr. Priya Nair",
          phone: "+91 97411 33445",
          password: "client123",
          role: "USER",
          title: "Homeowner — Whitefield",
          department: "Client Portal",
          bio: "Interested in ₹1,850/sq.ft Luxury Residential Interiors for 3,200 sq.ft duplex.",
          status: "ACTIVE",
          permissions: ["PORTAL_ACCESS"],
          mustChangePassword: false,
          hasChangedPassword: true
        }
      ];

      for (const u of sampleUsers) {
        await prisma.user.upsert({
          where: { email: u.email },
          update: {},
          create: u
        });
      }
    }

    // 5. Seed initial Facebook & Instagram Ad Campaigns if empty
    const campaignCount = await prisma.adCampaign.count();
    if (campaignCount === 0) {
      await prisma.adCampaign.createMany({
        data: [
          {
            name: "Bengaluru Luxury Villa Interiors — ₹1,850/sq.ft Reel Campaign",
            platform: "Instagram & Facebook",
            placement: "Instagram Reels & Feed",
            objective: "WHATSAPP_MESSAGES",
            status: "ACTIVE",
            dailyBudget: 2500,
            totalBudget: 75000,
            spentAmount: 34200,
            targetAudience: "Homeowners & Villa Buyers (30-55 yrs) in Rajajinagar, Sadashivanagar, Indiranagar, Koramangala & Whitefield",
            targetLocations: "Bengaluru, Karnataka (+25 km)",
            headline: "Turnkey Luxury Home Interiors @ ₹1,850/sq.ft | 45-Day Handover",
            primaryText: "Transform your Bengaluru residence with imported Italian marble finishes, German Häfele modular kitchens & 3D VR walkthroughs. Book a free site visit with Veyra's Principal Architect today!",
            ctaText: "Send WhatsApp Message",
            destinationUrl: "https://wa.me/918921336363",
            mediaUrl: "/assets/projects/project-patio.jpg",
            targetService: "Luxury Interior Design (₹1,850/sq.ft)",
            impressions: 64280,
            clicks: 2190,
            leadsCount: 74,
            conversionsCount: 11,
            roas: 6.4,
            aiOptimized: true
          },
          {
            name: "Zen Courtyards & Basalt Waterfalls — Architectural Lead Gen",
            platform: "Instagram",
            placement: "Stories & Reels",
            objective: "LEAD_GENERATION",
            status: "ACTIVE",
            dailyBudget: 1800,
            totalBudget: 54000,
            spentAmount: 21600,
            targetAudience: "Architects, HNI Villa Owners & Farmhouse Buyers in North & South Bengaluru",
            targetLocations: "Devanahalli, Yelahanka, Sarjapur, Jubilee Hills, Bengaluru",
            headline: "Bespoke Japanese Zen Courtyards & Timber Pergolas",
            primaryText: "Bring tranquility into your villa with custom recirculating stone reflection pools, Burma teak decks & warm architectural LED lighting. Starting at ₹1,150/sq.ft.",
            ctaText: "Get Free 3D Courtyard Plan",
            destinationUrl: "https://veyrasinteriors.com/#services",
            mediaUrl: "/assets/projects/project-zen-courtyard.jpg",
            targetService: "Modern Courtyards & Landscaping (₹1,150/sq.ft)",
            impressions: 42900,
            clicks: 1580,
            leadsCount: 49,
            conversionsCount: 8,
            roas: 5.2,
            aiOptimized: true
          },
          {
            name: "Turnkey Structural Villa Construction — ₹2,250/sq.ft Carousel",
            platform: "Facebook",
            placement: "Facebook Carousel & Lead Form",
            objective: "LEAD_GENERATION",
            status: "ACTIVE",
            dailyBudget: 3000,
            totalBudget: 90000,
            spentAmount: 41500,
            targetAudience: "Plot Owners & BDA/BBMP Site Owners looking for Turnkey Civil Construction",
            targetLocations: "Rajajinagar, Vijayanagar, JP Nagar, Electronic City, HSR Layout",
            headline: "Build Your Dream Villa from Foundation to Key Handover @ ₹2,250/sq.ft",
            primaryText: "10-Year Structural Warranty • FEA Soil-Tested RCC Foundation • Tata Tiscon 550D Steel & UltraTech Concrete. Zero contractor delays with escrow-milestone tracking.",
            ctaText: "Book Site Inspection",
            destinationUrl: "https://veyrasinteriors.com/#estimator",
            mediaUrl: "/assets/projects/project-stone-villa.jpg",
            targetService: "Turnkey Architectural Construction (₹2,250/sq.ft)",
            impressions: 51400,
            clicks: 1420,
            leadsCount: 42,
            conversionsCount: 5,
            roas: 7.8,
            aiOptimized: true
          }
        ]
      });
    }

    console.log("✅ Database schema verified and enhanced tables ready.");
  } catch (error) {
    console.error("Schema initialization warning:", error);
  }
}
