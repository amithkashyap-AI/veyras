import { Category, Project, Enquiry, DashboardStats, CompanySetting } from '../types';

export const mockCategories: Category[] = [
  {
    id: 'cat-courtyard',
    name: 'Modern Courtyards & Landscaping',
    slug: 'courtyards-landscaping',
    color: 'green',
    description: 'Bespoke outdoor retreats with Zen water features and lush vertical planters.',
    image: '/assets/projects/project-zen-courtyard.jpg',
    projectCount: 6
  },
  {
    id: 'cat-construction',
    name: 'Architectural Construction',
    slug: 'architectural-construction',
    color: 'blue',
    description: 'Turnkey structural civil engineering and luxury villa foundations.',
    image: '/assets/projects/project-stone-villa.jpg',
    projectCount: 4
  },
  {
    id: 'cat-interiors',
    name: 'Luxury Interior Design',
    slug: 'luxury-interiors',
    color: 'pink',
    description: 'Modular living rooms, bespoke ceilings, and imported marble finishes.',
    image: '/assets/projects/project-patio.jpg',
    projectCount: 8
  },
  {
    id: 'cat-decks',
    name: 'Modern Timber Decks & Patios',
    slug: 'timber-decks-patios',
    color: 'orange',
    description: 'Treated teakwood decks, floating pavers, and illuminated pergolas.',
    image: '/assets/projects/project-deck.jpg',
    projectCount: 5
  },
  {
    id: 'cat-renovation',
    name: 'Villa Renovation & Remodeling',
    slug: 'villa-renovation',
    color: 'red',
    description: 'Complete structural modernization, space re-planning, and finish upgrades.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
    projectCount: 3
  }
];

export const mockCompany: CompanySetting = {
  id: 'default',
  companyName: "Veyra's Construction and Interiors",
  tagline: 'Building Spaces • Creating Lifestyles',
  phone: '089213 36363',
  whatsapp: '089213 36363',
  email: 'contact@veyrasinteriors.com',
  address: '#98, 1Main , 4th Cross , Manjunatha Nagar, Rajainagar-560010, Bengaluru, Karnataka',
  city: 'Bengaluru',
  workingHours: 'Mon - Sat: 9:00 AM - 7:30 PM',
  logoUrl: '/assets/branding/veyras-logo.jpg'
};
