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

export type UserRole = "ADMIN" | "MANAGER" | "ARCHITECT" | "EDITOR" | "USER";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole | string;
  title?: string;
  department?: string;
  bio?: string;
  avatarUrl?: string;
  status?: "ACTIVE" | "SUSPENDED" | string;
  permissions?: string[];
  twoFactorEnabled?: boolean;
  hasPassword?: boolean;
  mustChangePassword?: boolean;
  hasChangedPassword?: boolean;
  isFirstLogin?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  reviewsCount?: number;
  wishlistCount?: number;
  likesCount?: number;
  enquiriesCount?: number;
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
  otpExpirySeconds?: number;
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
  // WhatsApp Business Cloud API
  whatsappProvider?: string;
  whatsappBusinessNumber?: string;
  whatsappPhoneNumberId?: string;
  whatsappBusinessAccountId?: string;
  whatsappAccessToken?: string;
  whatsappWebhookToken?: string;
  whatsappWelcomeTemplate?: string;
  whatsappAutoReply?: boolean;
  enableFloatingWhatsApp?: boolean;
  // API Keys & Integrations (Ollama, Meta, Maps, Cloud)
  ollamaEndpoint?: string;
  ollamaDefaultModel?: string;
  ollamaTemperature?: number;
  metaAppId?: string;
  metaAppSecret?: string;
  metaAccessToken?: string;
  metaAdAccountId?: string;
  metaPixelId?: string;
  instagramAccountId?: string;
  googleMapsApiKey?: string;
  cloudinaryApiKey?: string;
  // Frontend CMS & UI Controls
  announcementText?: string;
  showAnnouncementBar?: boolean;
  heroBadgeText?: string;
  heroTitle?: string;
  heroHighlightText?: string;
  heroSubtitle?: string;
  heroBgImage?: string;
  showHeroEstimator?: boolean;
  showCategoryShowcase?: boolean;
  showQualitySection?: boolean;
  showTestimonials?: boolean;
  rateCourtyard?: number;
  rateConstruction?: number;
  rateInteriors?: number;
  rateDecks?: number;
  rateRenovation?: number;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
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

export interface AiAnalysisLog {
  id: string;
  modelName: string;
  ollamaEndpoint: string;
  analysisType: string;
  prompt: string;
  response: string;
  metrics?: string;
  createdAt: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  platform: string;
  placement: string;
  objective: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "DRAFT" | string;
  dailyBudget: number;
  totalBudget: number;
  spentAmount: number;
  targetAudience: string;
  targetLocations: string;
  headline: string;
  primaryText: string;
  ctaText: string;
  destinationUrl: string;
  mediaUrl: string;
  targetService?: string;
  impressions: number;
  clicks: number;
  leadsCount: number;
  conversionsCount: number;
  roas: number;
  aiOptimized: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface AdCampaignSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  totalBudget: number;
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalLeads: number;
  totalConversions: number;
  avgRoas: number;
}

export interface ExecutiveReportSummary {
  kpis: {
    totalProjects: number;
    totalServices: number;
    totalEnquiries: number;
    totalUsers: number;
    totalReviews: number;
    totalWishlists: number;
    totalLikes: number;
    avgRating: number;
    portfolioValue: number;
    activePipelineValue: number;
    completedRevenueValue: number;
    conversionRatePct: number;
  };
  pipelineByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
    estimatedValue: number;
  }>;
  categoryPerformance: Array<{
    id: string;
    name: string;
    color: string;
    projectsCount: number;
    enquiriesCount: number;
    likesCount: number;
    wishlistsCount: number;
    avgPrice: number;
  }>;
  cityBreakdown: Array<{
    city: string;
    enquiries: number;
    projects: number;
  }>;
  adPerformance: {
    totalCampaigns: number;
    totalSpent: number;
    totalLeads: number;
    totalImpressions: number;
    totalClicks: number;
    avgRoas: number;
  };
  recentAiLogs: AiAnalysisLog[];
}
