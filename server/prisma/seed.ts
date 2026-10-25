import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Veyra\'s Construction and Interiors database...');

  // Clean existing tables in order
  await prisma.enquiry.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.category.deleteMany();
  await prisma.companySetting.deleteMany();

  // 1. Company Information
  await prisma.companySetting.create({
    data: {
      id: 'default',
      companyName: "Veyra's Construction and Interiors",
      tagline: 'Building Spaces • Creating Lifestyles',
      phone: '089213 36363',
      whatsapp: '089213 36363',
      email: 'contact@veyrasinteriors.com',
      address: '#98, 1st Main, 4th Cross, Manjunatha Nagar, Rajajinagar, Bengaluru - 560010',
      city: 'Bengaluru',
      workingHours: 'Mon - Sat: 9:00 AM - 7:30 PM',
      logoUrl: '/assets/branding/veyras-logo.jpg'
    }
  });

  // 2. Categories with requested color combinations (Blue, Green, Red, Pink, Orange)
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Modern Courtyards & Landscaping',
        slug: 'courtyards-landscaping',
        color: 'green',
        description: 'Bespoke outdoor living retreats, Zen gravel pathways, water fountains, and custom vertical gardens.',
        image: '/assets/projects/project-zen-courtyard.jpg'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Architectural Construction',
        slug: 'architectural-construction',
        color: 'blue',
        description: 'Turnkey structural civil construction, foundation to handover with structural safety compliance.',
        image: '/assets/projects/project-stone-villa.jpg'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Luxury Interior Design',
        slug: 'luxury-interiors',
        color: 'pink',
        description: 'High-end modular cabinetry, bespoke false ceilings, ambient lighting, and imported marble finishes.',
        image: '/assets/projects/project-patio.jpg'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Modern Timber Decks & Patios',
        slug: 'timber-decks-patios',
        color: 'orange',
        description: 'Composite and treated teakwood deck architecture with integrated strip illumination and seating.',
        image: '/assets/projects/project-deck.jpg'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Villa Renovation & Remodeling',
        slug: 'villa-renovation',
        color: 'red',
        description: 'Complete structural modernization, space re-planning, electrical overhaul, and luxury upgrades.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'
      }
    })
  ]);

  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));

  // 3. Featured Construction & Interior Projects with User Photos & Realistic Approximate Pricing
  const projectsData = [
    {
      title: 'Zen Modern Courtyard with Reflection Pool & Ambient Lighting',
      slug: 'zen-modern-courtyard-pool',
      tagline: 'Japanese-inspired inner garden with natural stone waterfall and teak seating deck',
      description: 'An oasis of peace designed with an integrated recirculating stone pond, bespoke arched feature wall with warm LED backlighting, manicured bonsai shrubs, and weather-treated hardwood deck flooring. Ideal for modern luxury villas seeking outdoor tranquility.',
      approxPrice: 485000,
      priceUnit: 'Complete Landscape Package',
      areaSqFt: 650,
      timeline: '25 - 35 Days',
      materials: 'Natural Granite, Teakwood Composite, Warm LED Strip Diffusers, Water Cascade Pump',
      address: 'Road No. 45, Jubilee Hills',
      city: 'Bengaluru',
      state: 'Telangana',
      lat: 17.4319,
      lng: 78.4073,
      isFeatured: true,
      categoryId: catMap['courtyards-landscaping'],
      images: [
        '/assets/projects/project-zen-courtyard.jpg',
        '/assets/projects/project-deck.jpg'
      ]
    },
    {
      title: 'Contemporary Teakwood Patio Deck with Vertical Green Wall',
      slug: 'contemporary-teakwood-patio-deck',
      tagline: 'Seamless indoor-outdoor entertaining lounge with custom slatted pergola',
      description: 'Engineered for evening gatherings, this design features an elevated timber deck with floating stone slab steps illuminated by inset low-voltage floor luminaires, weather-resistant fabric deep seating, and custom vertical cedar battens with live creeping foliage.',
      approxPrice: 375000,
      priceUnit: 'Turnkey Patio Execution',
      areaSqFt: 520,
      timeline: '20 - 28 Days',
      materials: 'Burma Teak Battens, Concrete Footers, IP67 Landscape Lighting, Sunbrella Upholstery',
      address: 'Prestige Golfshire, Devanahalli',
      city: 'Bangalore',
      state: 'Karnataka',
      lat: 13.2500,
      lng: 77.7100,
      isFeatured: true,
      categoryId: catMap['timber-decks-patios'],
      images: [
        '/assets/projects/project-deck.jpg',
        '/assets/projects/project-patio.jpg'
      ]
    },
    {
      title: 'Minimalist Travertine Stone Villa Courtyard with Ancient Olive Tree',
      slug: 'minimalist-travertine-stone-villa',
      tagline: 'Mediterranean sculptural courtyard featuring stepped travertine terraces and lantern accents',
      description: 'Crafted from honed beige travertine and micro-cement white perimeter walls. Features a grand architectural olive tree centerpiece, illuminated sunken bench lounge, custom iron lantern sconces, and fragrant lavender planter beds.',
      approxPrice: 720000,
      priceUnit: 'Architectural Stone Hardscape',
      areaSqFt: 850,
      timeline: '35 - 45 Days',
      materials: 'Honed Travertine Tiles, Lime Plaster Stucco, Wrought Iron Fixtures, Specimen Tree Planting',
      address: 'East Coast Road, Palavakkam',
      city: 'Chennai',
      state: 'Tamil Nadu',
      lat: 12.9600,
      lng: 80.2500,
      isFeatured: true,
      categoryId: catMap['architectural-construction'],
      images: [
        '/assets/projects/project-stone-villa.jpg',
        '/assets/projects/project-zen-courtyard.jpg'
      ]
    },
    {
      title: 'Urban Courtyard Garden Lounge with Synthetic Turf & Corner Sectional',
      slug: 'urban-courtyard-garden-lounge',
      tagline: 'Compact high-efficiency villa courtyard maximized for family leisure and morning coffee',
      description: 'Engineered for residences with limited footprint. Combines zero-maintenance 40mm lush artificial lawn, concrete grid pavers, custom L-shaped acacia wood sofa with terracotta accents, hanging flowering pots, and clean privacy perimeter fencing.',
      approxPrice: 245000,
      priceUnit: 'Compact Yard Package',
      areaSqFt: 380,
      timeline: '14 - 18 Days',
      materials: 'Anti-UV Synthetic Turf, Cast Stone Pavers, Outdoor Acacia Framing, Glazed Planter Pots',
      address: 'Koregaon Park, Lane 7',
      city: 'Pune',
      state: 'Maharashtra',
      lat: 18.5362,
      lng: 73.8940,
      isFeatured: true,
      categoryId: catMap['luxury-interiors'],
      images: [
        '/assets/projects/project-patio.jpg',
        '/assets/projects/project-deck.jpg'
      ]
    },
    {
      title: 'Turnkey Luxury Villa Construction & Civil Engineering',
      slug: 'turnkey-luxury-villa-construction',
      tagline: 'Complete structural construction from foundation to final paint handover',
      description: 'End-to-end building contract covering RCC foundation, high-grade steel framing, AAC block masonry, concealed plumbing, three-phase electrical conduit wiring, premium waterproofing, and Italian marble flooring across 4,500 sq ft.',
      approxPrice: 12500000,
      priceUnit: 'Full Construction Package',
      areaSqFt: 4500,
      timeline: '10 - 12 Months',
      materials: 'Tata Tiscon 550D Steel, UltraTech Concrete, Saint-Gobain Glass, Imported Statuario Marble',
      address: 'Banjara Hills, Road No. 3',
      city: 'Bengaluru',
      state: 'Telangana',
      lat: 17.4156,
      lng: 78.4350,
      isFeatured: true,
      categoryId: catMap['architectural-construction'],
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        '/assets/projects/project-stone-villa.jpg'
      ]
    },
    {
      title: 'Bespoke Penthouse Interior Design & Acoustic Paneling',
      slug: 'bespoke-penthouse-interior-design',
      tagline: 'Custom acrylic cabinetry, fluted wall louvers, and smart home automation',
      description: 'Exquisite modern living space featuring German Häfele hardware, integrated magnetic architectural track lights, curved fluted MDF wall paneling in champagne bronze, and customized quartz island kitchen with bar seating.',
      approxPrice: 3200000,
      priceUnit: 'Complete Interior Package',
      areaSqFt: 2800,
      timeline: '60 - 75 Days',
      materials: 'BWP Marine Ply, Natural Oak Veneer, Silestone Quartz, Lutron Lighting Control',
      address: 'Worli Sea Face',
      city: 'Mumbai',
      state: 'Maharashtra',
      lat: 19.0178,
      lng: 72.8178,
      isFeatured: true,
      categoryId: catMap['luxury-interiors'],
      images: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format&fit=crop&q=80',
        '/assets/projects/project-patio.jpg'
      ]
    }
  ];

  for (const p of projectsData) {
    const project = await prisma.project.create({
      data: {
        title: p.title,
        slug: p.slug,
        tagline: p.tagline,
        description: p.description,
        approxPrice: p.approxPrice,
        priceUnit: p.priceUnit,
        areaSqFt: p.areaSqFt,
        timeline: p.timeline,
        materials: p.materials,
        address: p.address,
        city: p.city,
        state: p.state,
        lat: p.lat,
        lng: p.lng,
        isFeatured: p.isFeatured,
        categoryId: p.categoryId,
        images: {
          create: p.images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            sortOrder: idx
          }))
        }
      }
    });

    // Sample Client Enquiry & Order for each project
    await prisma.enquiry.create({
      data: {
        projectId: project.id,
        clientName: 'Rajesh K. Varma',
        clientEmail: 'rajesh.varma@example.com',
        clientPhone: '089213 36363',
        siteAddress: p.address,
        city: p.city,
        propertyType: 'Residential Villa',
        areaSqFt: p.areaSqFt,
        approxBudget: '₹' + p.approxPrice.toLocaleString('en-IN'),
        preferredStyle: 'Modern Architectural',
        message: 'Interested in implementing this exact courtyard design for my newly constructed villa. Need site visit this weekend.',
        status: 'CONSULTATION_SCHEDULED',
        internalNotes: 'Contacted via WhatsApp (089213 36363). Site inspection confirmed for Saturday 11:00 AM.'
      }
    });
  }

  console.log('✅ Veyra\'s Construction and Interiors database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
