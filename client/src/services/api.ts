import {
  Category,
  Project,
  Enquiry,
  CompanySetting,
  DashboardStats,
  AuthUser,
  Review,
  SystemConfig,
  Service,
  NavMenu,
  NavSubmenu,
  SocialMediaPost,
  OllamaStatus,
  AiAnalysisResponse,
  AiAnalysisLog,
  AdCampaign,
  AdCampaignSummary,
  ExecutiveReportSummary
} from '../types';

const API_BASE = '/api';

export const api = {
  // Projects
  async getProjects(params?: Record<string, string | number | boolean | undefined>): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, String(v));
      });
    }
    const res = await fetch(`${API_BASE}/projects?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    return data.data;
  },

  async getProjectById(idOrSlug: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${idOrSlug}`);
    if (!res.ok) throw new Error('Failed to fetch project detail');
    const data = await res.json();
    return data.data;
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    if (!res.ok) throw new Error('Failed to create project');
    const data = await res.json();
    return data.data;
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    if (!res.ok) throw new Error('Failed to update project');
    const data = await res.json();
    return data.data;
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete project');
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.data;
  },

  async createCategory(cat: { name: string; color: string; description?: string; image?: string }): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    if (!res.ok) throw new Error('Failed to create category');
    const data = await res.json();
    return data.data;
  },

  // Enquiries & Orders
  async getEnquiries(): Promise<Enquiry[]> {
    const res = await fetch(`${API_BASE}/enquiries`);
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    const data = await res.json();
    return data.data;
  },

  async createEnquiry(enquiry: Partial<Enquiry>): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry)
    });
    if (!res.ok) throw new Error('Failed to submit enquiry');
    const data = await res.json();
    return data.data;
  },

  async updateEnquiryStatus(id: string, status: string, internalNotes?: string): Promise<Enquiry> {
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, internalNotes })
    });
    if (!res.ok) throw new Error('Failed to update enquiry');
    const data = await res.json();
    return data.data;
  },

  async deleteEnquiry(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete enquiry');
  },

  // Company Settings
  async getCompanySettings(): Promise<CompanySetting> {
    const res = await fetch(`${API_BASE}/company`);
    if (!res.ok) throw new Error('Failed to fetch company settings');
    const data = await res.json();
    return data.data;
  },

  async updateCompanySettings(settings: Partial<CompanySetting>): Promise<CompanySetting> {
    const res = await fetch(`${API_BASE}/company`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to update company settings');
    const data = await res.json();
    return data.data;
  },

  // Stats
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    const data = await res.json();
    return data.data;
  },

  // Authentication & Admin Profile / Password
  async sendOtp(email: string): Promise<{ success: boolean; message: string; otp?: string; email: string }> {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to send OTP");
    }
    return res.json();
  },

  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; user: AuthUser; message: string }> {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to verify OTP");
    }
    return res.json();
  },

  async changePassword(email: string, password: string): Promise<{ success: boolean; message: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update password");
    }
    return res.json();
  },

  async loginWithPassword(email: string, password: string): Promise<{ success: boolean; user: AuthUser; message: string }> {
    const res = await fetch(`${API_BASE}/auth/login-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to sign in with password");
    }
    return res.json();
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string; otp?: string; expiresInSeconds?: number }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to send password recovery code");
    }
    return res.json();
  },

  async resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to reset password");
    }
    return res.json();
  },

  async getAdminProfile(email = "admin@veyrasinteriors.com"): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/auth/admin-profile?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Failed to fetch admin profile");
    const json = await res.json();
    return json.data;
  },

  async updateAdminProfile(data: Partial<AuthUser> & { currentEmail?: string }): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/auth/admin-profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update admin profile");
    }
    const json = await res.json();
    return json.data;
  },

  async changeAdminPassword(data: { email?: string; currentPassword?: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/admin-change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to change admin password");
    }
    return res.json();
  },

  // System Configuration (Email SMTP, Payment Gateway, SEO, WhatsApp, API Keys, Frontend CMS)
  async getConfig(): Promise<SystemConfig> {
    const res = await fetch(`${API_BASE}/config`);
    if (!res.ok) throw new Error("Failed to fetch system config");
    const data = await res.json();
    return data.data;
  },

  async updateConfig(config: Partial<SystemConfig>): Promise<SystemConfig> {
    const res = await fetch(`${API_BASE}/config`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error("Failed to update system config");
    const data = await res.json();
    return data.data;
  },

  async testSmtpConfig(recipient?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/config/test-smtp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient })
    });
    if (!res.ok) throw new Error("Failed to test SMTP");
    return res.json();
  },

  async testWhatsAppConfig(phone?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/config/test-whatsapp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    if (!res.ok) throw new Error("Failed to test WhatsApp API");
    return res.json();
  },

  // Reviews / Comments / Ratings
  async getReviews(projectId?: string): Promise<Review[]> {
    const url = projectId ? `${API_BASE}/reviews?projectId=${projectId}` : `${API_BASE}/reviews`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    const data = await res.json();
    return data.data;
  },

  async createReview(review: { projectId: string; userName: string; userEmail: string; rating: number; comment: string }): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review)
    });
    if (!res.ok) throw new Error("Failed to submit review");
    const data = await res.json();
    return data.data;
  },

  async deleteReview(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete review");
  },

  // User Interactions (Wishlist & Likes)
  async getUserInteractions(email: string): Promise<{ success: boolean; wishlist: string[]; likes: string[] }> {
    const res = await fetch(`${API_BASE}/interactions/user-state?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Failed to fetch user interactions");
    return res.json();
  },

  async getWishlist(email: string): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/interactions/wishlist?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Failed to fetch wishlist projects");
    const data = await res.json();
    return data.data;
  },

  async toggleWishlist(email: string, projectId: string): Promise<{ success: boolean; isWishlisted: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/interactions/wishlist/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, projectId })
    });
    if (!res.ok) throw new Error("Failed to toggle wishlist");
    return res.json();
  },

  async toggleLike(email: string, projectId: string): Promise<{ success: boolean; isLiked: boolean; likeCount: number; message: string }> {
    const res = await fetch(`${API_BASE}/interactions/like/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, projectId })
    });
    if (!res.ok) throw new Error("Failed to toggle like");
    return res.json();
  },

  // ==========================================
  // Services & Menus Management
  // ==========================================
  async getServices(params?: { category?: string; submenuSlug?: string; search?: string; featuredOnly?: boolean }): Promise<Service[]> {
    const query = new URLSearchParams();
    if (params) {
      if (params.category && params.category !== "all") query.append("category", params.category);
      if (params.submenuSlug) query.append("submenuSlug", params.submenuSlug);
      if (params.search) query.append("search", params.search);
      if (params.featuredOnly) query.append("featuredOnly", "true");
    }
    const res = await fetch(`${API_BASE}/services?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch services");
    const data = await res.json();
    return data.data;
  },

  async getServiceById(idOrSlug: string): Promise<Service> {
    const res = await fetch(`${API_BASE}/services/${idOrSlug}`);
    if (!res.ok) throw new Error("Failed to fetch service detail");
    const data = await res.json();
    return data.data;
  },

  async createService(service: Partial<Service>): Promise<Service> {
    const res = await fetch(`${API_BASE}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create service");
    }
    const data = await res.json();
    return data.data;
  },

  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service)
    });
    if (!res.ok) throw new Error("Failed to update service");
    const data = await res.json();
    return data.data;
  },

  async deleteService(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete service");
  },

  // Menus & Submenus
  async getMenus(): Promise<NavMenu[]> {
    const res = await fetch(`${API_BASE}/menus`);
    if (!res.ok) throw new Error("Failed to fetch navigation menus");
    const data = await res.json();
    return data.data;
  },

  async createMenu(data: { title: string; icon?: string; order?: number; isActive?: boolean }): Promise<NavMenu> {
    const res = await fetch(`${API_BASE}/menus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create menu");
    const json = await res.json();
    return json.data;
  },

  async updateMenu(id: string, data: Partial<NavMenu>): Promise<NavMenu> {
    const res = await fetch(`${API_BASE}/menus/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update menu");
    const json = await res.json();
    return json.data;
  },

  async deleteMenu(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/menus/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete menu");
  },

  async createSubmenu(menuId: string, data: { title: string; description?: string; order?: number; isActive?: boolean }): Promise<NavSubmenu> {
    const res = await fetch(`${API_BASE}/menus/${menuId}/submenus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create submenu");
    const json = await res.json();
    return json.data;
  },

  async updateSubmenu(id: string, data: Partial<NavSubmenu>): Promise<NavSubmenu> {
    const res = await fetch(`${API_BASE}/menus/submenus/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update submenu");
    const json = await res.json();
    return json.data;
  },

  async deleteSubmenu(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/menus/submenus/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete submenu");
  },

  // ==========================================
  // Ollama AI & Social Media Intelligence
  // ==========================================
  async getOllamaStatus(): Promise<OllamaStatus> {
    const res = await fetch(`${API_BASE}/ollama/status`);
    if (!res.ok) throw new Error("Failed to check Ollama status");
    return res.json();
  },

  async getOllamaLogs(): Promise<AiAnalysisLog[]> {
    const res = await fetch(`${API_BASE}/ollama/logs`);
    if (!res.ok) throw new Error("Failed to fetch AI logs");
    const json = await res.json();
    return json.data;
  },

  async getSocialPosts(): Promise<SocialMediaPost[]> {
    const res = await fetch(`${API_BASE}/social/posts`);
    if (!res.ok) throw new Error("Failed to fetch social posts");
    const data = await res.json();
    return data.data;
  },

  async createSocialPost(post: Partial<SocialMediaPost>): Promise<SocialMediaPost> {
    const res = await fetch(`${API_BASE}/social/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error("Failed to create social post");
    const data = await res.json();
    return data.data;
  },

  async deleteSocialPost(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/social/posts/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete social post");
  },

  async syncSocialPosts(): Promise<{ success: boolean; message: string; post: SocialMediaPost }> {
    const res = await fetch(`${API_BASE}/social/sync`, {
      method: "POST"
    });
    if (!res.ok) throw new Error("Failed to sync social media feed");
    return res.json();
  },

  async analyzeSocialWithOllama(model = "llama3.2:3b"): Promise<AiAnalysisResponse> {
    const res = await fetch(`${API_BASE}/ollama/analyze-social`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model })
    });
    if (!res.ok) throw new Error("Failed to execute Ollama social analysis");
    return res.json();
  },

  async analyzeExecutiveReportWithOllama(model = "llama3.2:3b"): Promise<AiAnalysisResponse> {
    const res = await fetch(`${API_BASE}/ollama/analyze-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model })
    });
    if (!res.ok) throw new Error("Failed to execute Ollama executive report analysis");
    return res.json();
  },

  async analyzeUsersWithOllama(model = "llama3.2:3b"): Promise<AiAnalysisResponse> {
    const res = await fetch(`${API_BASE}/ollama/analyze-users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model })
    });
    if (!res.ok) throw new Error("Failed to execute Ollama user analysis");
    return res.json();
  },

  async generateAdWithOllama(params: {
    platform: string;
    targetService: string;
    targetAudience: string;
    objective: string;
    dailyBudget: number;
    model?: string;
  }): Promise<{
    success: boolean;
    modelUsed: string;
    adCopy: {
      campaignName: string;
      headline: string;
      primaryText: string;
      ctaText: string;
      targetAudience: string;
      targetLocations: string;
      hashtags: string;
      creativeTip: string;
    };
  }> {
    const res = await fetch(`${API_BASE}/ollama/generate-ad`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Failed to generate ad copy with Ollama");
    return res.json();
  },

  async chatWithOllama(message: string, model = "llama3.2:3b"): Promise<{ success: boolean; reply: string; modelUsed: string }> {
    const res = await fetch(`${API_BASE}/ollama/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, model })
    });
    if (!res.ok) throw new Error("Failed to send message to Ollama");
    return res.json();
  },

  // ==========================================
  // Users, Roles & RBAC Management
  // ==========================================
  async getUsers(): Promise<AuthUser[]> {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error("Failed to fetch users");
    const json = await res.json();
    return json.data;
  },

  async createUser(data: Partial<AuthUser> & { password?: string }): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create user");
    }
    const json = await res.json();
    return json.data;
  },

  async updateUser(id: string, data: Partial<AuthUser> & { newPassword?: string }): Promise<AuthUser> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to update user");
    }
    const json = await res.json();
    return json.data;
  },

  async deleteUser(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete user");
  },

  // ==========================================
  // Facebook & Instagram Ad Campaigns
  // ==========================================
  async getAdCampaigns(): Promise<{ summary: AdCampaignSummary; data: AdCampaign[] }> {
    const res = await fetch(`${API_BASE}/ads`);
    if (!res.ok) throw new Error("Failed to fetch ad campaigns");
    return res.json();
  },

  async createAdCampaign(data: Partial<AdCampaign>): Promise<AdCampaign> {
    const res = await fetch(`${API_BASE}/ads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create ad campaign");
    }
    const json = await res.json();
    return json.data;
  },

  async updateAdCampaign(id: string, data: Partial<AdCampaign>): Promise<AdCampaign> {
    const res = await fetch(`${API_BASE}/ads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update ad campaign");
    const json = await res.json();
    return json.data;
  },

  async simulateBoostAdCampaign(id: string): Promise<{ success: boolean; message: string; data: AdCampaign }> {
    const res = await fetch(`${API_BASE}/ads/${id}/simulate-boost`, {
      method: "POST"
    });
    if (!res.ok) throw new Error("Failed to sync ad delivery");
    return res.json();
  },

  async deleteAdCampaign(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/ads/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete ad campaign");
  },

  // ==========================================
  // Executive Reports Summary
  // ==========================================
  async getReportsSummary(): Promise<ExecutiveReportSummary> {
    const res = await fetch(`${API_BASE}/reports/summary`);
    if (!res.ok) throw new Error("Failed to fetch executive reports summary");
    const json = await res.json();
    return json.data;
  }
};
