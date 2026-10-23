export type ColorTheme = 'blue' | 'green' | 'red' | 'pink' | 'orange' | 'white';

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: ColorTheme;
  description?: string;
  image?: string;
  projectCount?: number;
}

export interface ProjectImage {
  id: string;
  url: string;
  caption?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  approxPrice: number;
  priceUnit: string;
  areaSqFt?: number;
  timeline?: string;
  materials?: string;
  address: string;
  city: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
  isFeatured?: boolean;
  categoryId: string;
  category?: Category;
  images: (ProjectImage | string)[];
  createdAt?: string;
}

export type EnquiryStatus = 
  | 'NEW' 
  | 'CONTACTED' 
  | 'CONSULTATION_SCHEDULED' 
  | 'QUOTATION_SENT' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface Enquiry {
  id: string;
  projectId?: string;
  project?: {
    id: string;
    title: string;
    approxPrice: number;
    images?: { url: string }[];
  };
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  siteAddress: string;
  city: string;
  propertyType: string;
  areaSqFt?: number;
  approxBudget?: string;
  preferredStyle?: string;
  message: string;
  status: EnquiryStatus;
  internalNotes?: string;
  createdAt: string;
}

export interface CompanySetting {
  id: string;
  companyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  workingHours: string;
  logoUrl: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalEnquiries: number;
  totalCategories: number;
  portfolioValue: number;
  activeSites: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  hasPassword?: boolean;
  mustChangePassword?: boolean;
  isFirstLogin?: boolean;
}

export interface Review {
  id: string;
  projectId: string;
  project?: { id: string; title: string };
  userId?: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SystemConfig {
  id: string;
  // Email SMTP
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  senderEmail: string;
  senderName: string;
  smtpSecure: boolean;
  // Payment Gateway
  paymentGateway: string;
  paymentMode: string;
  paymentApiKey: string;
  paymentApiSecret: string;
  paymentCurrency: string;
  enableOnlineAdvance: boolean;
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  googleAnalyticsId: string;
  canonicalUrl: string;
  ogImage: string;
  updatedAt?: string;
}


export interface Service {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  pricePerSqFt: number;
  priceUnit: string;
  minAreaSqFt?: number;
  durationWeeks?: number;
  category: string;
  imageUrl: string;
  galleryImages: string[];
  features: string[];
  enableEnquiry: boolean;
  enableWhatsApp: boolean;
  isFeatured: boolean;
  order: number;
  submenuId?: string;
  submenu?: NavSubmenu;
  createdAt?: string;
  updatedAt?: string;
}

export interface NavSubmenu {
  id: string;
  menuId: string;
  title: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
  services?: Service[];
  _count?: { services: number };
  menu?: NavMenu;
}

export interface NavMenu {
  id: string;
  title: string;
  slug: string;
  icon?: string;
  order: number;
  isActive: boolean;
  submenus: NavSubmenu[];
}

export interface SocialMediaPost {
  id: string;
  platform: "Instagram" | "Facebook" | "Pinterest" | "YouTube" | string;
  postUrl?: string;
  caption: string;
  mediaUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  sentiment?: "POSITIVE" | "NEUTRAL" | "INQUIRY" | "NEGATIVE" | string;
  topComment?: string;
  postedAt: string;
}

export interface OllamaModel {
  name: string;
  size?: number;
  details?: any;
}

export interface OllamaStatus {
  success: boolean;
  connected: boolean;
  endpoint: string;
  models: OllamaModel[];
  defaultModel: string;
  note?: string;
  error?: string;
}

export interface AiAnalysisResponse {
  success: boolean;
  analysis: string;
  modelUsed: string;
  logId?: string;
  timestamp: string;
}
