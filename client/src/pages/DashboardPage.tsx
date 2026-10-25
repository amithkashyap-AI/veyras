import React, { useState, useEffect } from "react";
import {
  Building,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit3,
  MessageCircle,
  DollarSign,
  Save,
  Layers,
  Eye,
  Star,
  Palette,
  X,
  Sparkles,
  ArrowRight,
  LogOut,
  Bot,
  BarChart3,
  Users,
  Megaphone,
  UserCheck,
  Key,
  MapPin,
  Phone
} from "lucide-react";
import {
  Project,
  Enquiry,
  Category,
  CompanySetting,
  DashboardStats,
  SystemConfig,
  Review
} from "../types";
import { ServicesTab } from "../components/dashboard/ServicesTab";
import { OllamaSocialTab } from "../components/dashboard/OllamaSocialTab";
import { ReportsAnalyticsTab } from "../components/dashboard/ReportsAnalyticsTab";
import { UsersRolesTab } from "../components/dashboard/UsersRolesTab";
import { AdsPromotionTab } from "../components/dashboard/AdsPromotionTab";
import { AdminProfileTab } from "../components/dashboard/AdminProfileTab";
import { IntegrationsConfigTab } from "../components/dashboard/IntegrationsConfigTab";
import { api } from "../services/api";

interface DashboardPageProps {
  onRefreshAll?: () => void;
  onViewProject?: (project: Project) => void;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

type DashboardTabId =
  | "enquiries"
  | "services"
  | "projects"
  | "reports"
  | "ollama"
  | "ads"
  | "users"
  | "admin_profile"
  | "integrations"
  | "reviews"
  | "categories"
  | "company";

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onRefreshAll,
  onViewProject,
  onNavigate,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTabId>("enquiries");

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [company, setCompany] = useState<CompanySetting | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // New Project Form State
  const [showAddProject, setShowAddProject] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newApproxPrice, setNewApproxPrice] = useState(450000);
  const [newAreaSqFt, setNewAreaSqFt] = useState(600);
  const [newTimeline, setNewTimeline] = useState("25 - 35 Days");
  const [newMaterials, setNewMaterials] = useState("Teakwood Composite, Granite, Warm LED");
  const [newAddress, setNewAddress] = useState("Rajajinagar");
  const [newCity, setNewCity] = useState("Bengaluru");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("/assets/projects/project-zen-courtyard.jpg");
  const [newIsFeatured, setNewIsFeatured] = useState(true);

  // Edit Project Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // New Category Form State
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState("blue");
  const [catDescription, setCatDescription] = useState("");

  const reloadData = async () => {
    try {
      const [e, p, c, comp, s, cfg, r] = await Promise.all([
        api.getEnquiries(),
        api.getProjects(),
        api.getCategories(),
        api.getCompanySettings(),
        api.getStats(),
        api.getConfig(),
        api.getReviews()
      ]);
      setEnquiries(e);
      setProjects(p);
      setCategories(c);
      setCompany(comp);
      setStats(s);
      setConfig(cfg);
      setReviews(r);
      if (c.length > 0 && !newCategoryId) setNewCategoryId(c[0].id);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateEnquiryStatus(id, status);
      setEnquiries(prev => prev.map(enq => (enq.id === id ? { ...enq, status: status as any } : enq)));
    } catch {
      alert("Failed to update enquiry status.");
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await api.deleteEnquiry(id);
      setEnquiries(prev => prev.filter(e => e.id !== id));
    } catch {
      alert("Failed to delete enquiry.");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newApproxPrice) return;

    try {
      const created = await api.createProject({
        title: newTitle,
        categoryId: newCategoryId || categories[0]?.id,
        approxPrice: Number(newApproxPrice),
        priceUnit: "Total Project Estimate",
        areaSqFt: Number(newAreaSqFt),
        timeline: newTimeline,
        materials: newMaterials,
        address: newAddress,
        city: newCity,
        description: newDescription,
        images: [newImageUrl],
        isFeatured: newIsFeatured
      });

      setProjects([created, ...projects]);
      setShowAddProject(false);
      setNewTitle("");
      setNewDescription("");
      alert("✅ New design project added to PostgreSQL and live on website!");
      if (onRefreshAll) onRefreshAll();
    } catch {
      alert("Failed to create project in database.");
    }
  };

  const handleSaveEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const updated = await api.updateProject(editingProject.id, {
        title: editingProject.title,
        categoryId: editingProject.categoryId,
        approxPrice: Number(editingProject.approxPrice),
        areaSqFt: Number(editingProject.areaSqFt),
        timeline: editingProject.timeline,
        materials: editingProject.materials,
        address: editingProject.address,
        city: editingProject.city,
        description: editingProject.description,
        isFeatured: editingProject.isFeatured,
        images: editingProject.images
      });

      setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      setEditingProject(null);
      alert("✅ Project updated in PostgreSQL! Changes are live on the frontend.");
      if (onRefreshAll) onRefreshAll();
    } catch {
      alert("Failed to update project.");
    }
  };

  const handleToggleFeatured = async (p: Project) => {
    try {
      const newStatus = !p.isFeatured;
      await api.updateProject(p.id, { isFeatured: newStatus });
      setProjects(prev => prev.map(item => (item.id === p.id ? { ...item, isFeatured: newStatus } : item)));
      if (onRefreshAll) onRefreshAll();
    } catch {
      alert("Failed to toggle featured status.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to remove this project?")) return;
    try {
      await api.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      if (onRefreshAll) onRefreshAll();
    } catch {
      alert("Failed to delete project.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to remove this review?")) return;
    try {
      await api.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch {
      alert("Failed to delete review.");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    try {
      const created = await api.createCategory({
        name: catName,
        color: catColor,
        description: catDescription,
        image: "/assets/projects/project-zen-courtyard.jpg"
      });
      setCategories([...categories, created]);
      setShowAddCategory(false);
      setCatName("");
      setCatDescription("");
      alert("✅ New category added to PostgreSQL!");
      if (onRefreshAll) onRefreshAll();
    } catch {
      alert("Failed to create category.");
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    try {
      const updated = await api.updateCompanySettings(company);
      setCompany(updated);
      alert("✅ Company profile & contact details saved to PostgreSQL! Live across website.");
      if (onRefreshAll) onRefreshAll();
    } catch {
      alert("Failed to save company settings.");
    }
  };

  const tabsList: Array<{
    id: DashboardTabId;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    activeClass: string;
  }> = [
    {
      id: "enquiries",
      label: `Orders (${enquiries.length})`,
      shortLabel: `Orders (${enquiries.length})`,
      icon: <MessageSquare className="w-4 h-4 shrink-0" />,
      activeClass: "bg-[#1e3a8a] text-white border-[#1e3a8a]"
    },
    {
      id: "services",
      label: "Menus, Services & CMS",
      shortLabel: "Menus & CMS",
      icon: <Layers className="w-4 h-4 shrink-0" />,
      activeClass: "bg-[#ea580c] text-white border-[#ea580c]"
    },
    {
      id: "projects",
      label: `Projects (${projects.length})`,
      shortLabel: `Projects (${projects.length})`,
      icon: <Building className="w-4 h-4 shrink-0" />,
      activeClass: "bg-[#1e3a8a] text-white border-[#1e3a8a]"
    },
    {
      id: "reports",
      label: "Reports & AI Audit",
      shortLabel: "Reports & AI",
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
      activeClass: "bg-[#059669] text-white border-[#059669]"
    },
    {
      id: "ollama",
      label: "Ollama AI Social",
      shortLabel: "Ollama Social",
      icon: <Bot className="w-4 h-4 shrink-0" />,
      activeClass: "bg-[#059669] text-white border-[#059669]"
    },
    {
      id: "ads",
      label: "FB & IG Ads",
      shortLabel: "FB & IG Ads",
      icon: <Megaphone className="w-4 h-4 shrink-0" />,
      activeClass: "bg-[#db2777] text-white border-[#db2777]"
    },
    {
      id: "users",
      label: "Users & Roles",
      shortLabel: "Users & Roles",
      icon: <Users className="w-4 h-4 shrink-0" />,
      activeClass: "bg-[#1e3a8a] text-white border-[#1e3a8a]"
    },
    {
      id: "admin_profile",
      label: "Admin Profile & Password",
      shortLabel: "Admin Profile",
      icon: <UserCheck className="w-4 h-4 shrink-0" />,
      activeClass: "bg-[#ea580c] text-white border-[#ea580c]"
    },
    {
      id: "integrations",
      label: "WhatsApp, API Keys & SMTP",
      shortLabel: "API Keys & WA",
      icon: <Key className="w-4 h-4 shrink-0" />,
      activeClass: "bg-[#0284c7] text-white border-[#0284c7]"
    },
    {
      id: "reviews",
      label: `Reviews (${reviews.length})`,
      shortLabel: `Reviews (${reviews.length})`,
      icon: <Star className="w-4 h-4 shrink-0" />,
      activeClass: "bg-amber-600 text-white border-amber-600"
    },
    {
      id: "categories",
      label: "Disciplines",
      shortLabel: "Disciplines",
      icon: <Palette className="w-4 h-4 shrink-0" />,
      activeClass: "bg-[#059669] text-white border-[#059669]"
    },
    {
      id: "company",
      label: "Studio Info",
      shortLabel: "Studio Info",
      icon: <Settings className="w-4 h-4 shrink-0" />,
      activeClass: "bg-[#db2777] text-white border-[#db2777]"
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c] mb-4" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Connecting to PostgreSQL Database...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
      {/* Top Banner & Control Center Header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1e3a8a] to-[#0f172a] text-white p-5 sm:p-7 rounded-xl shadow-lg flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ea580c] text-white text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 shrink-0" /> Live Operations & AI Controller
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight font-sans leading-tight">
            Veyra's Enterprise CMS, AI & Growth Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Control front-end menus, services, and Hero banners; generate Ollama AI executive & social intelligence reports; promote ads on Facebook & Instagram; manage users & RBAC roles; and configure WhatsApp Cloud API, SMTP, and API keys.
          </p>
        </div>

        {/* Mobile 2x2 Grid / Desktop Row Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full xl:w-auto shrink-0">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate("home")}
                className="px-3.5 py-2.5 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Eye className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" /> View Website
              </button>
              <button
                onClick={() => onNavigate("projects")}
                className="px-3.5 py-2.5 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Portfolio Grid</span> <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab("admin_profile")}
            className="px-3.5 py-2.5 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#10b981] shrink-0" /> Admin Profile
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3.5 py-2.5 rounded-sm bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Lock Dashboard & Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" /> Sign Out
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Row — 2x2 on Mobile, 4-col on Desktop */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">Portfolio Designs</span>
              <Building className="w-4 h-4 text-[#1e3a8a] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalProjects}</div>
            <p className="text-xs text-slate-400 mt-0.5">Live listings on frontend</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">Client Orders</span>
              <MessageSquare className="w-4 h-4 text-[#059669] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalEnquiries}</div>
            <p className="text-xs text-[#059669] font-semibold mt-0.5">Active leads in pipeline</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">Customer Reviews</span>
              <Star className="w-4 h-4 text-[#ea580c] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{reviews.length}</div>
            <p className="text-xs text-slate-400 mt-0.5">Comments & ratings</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider">Portfolio Value</span>
              <DollarSign className="w-4 h-4 text-[#1e3a8a] shrink-0" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#1e3a8a]">
              ₹{(stats.portfolioValue / 100000).toFixed(1)} Lakhs
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Total active scope</p>
          </div>
        </div>
      )}

      {/* Responsive Module Navigation — Mobile Quick Select + Wrapping Pill Grid (Zero Clipping) */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Mobile Dropdown Selector for 1-Tap Navigation on Phones */}
        <div className="sm:hidden">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
            Switch Dashboard Module:
          </label>
          <select
            value={activeTab}
            onChange={e => setActiveTab(e.target.value as DashboardTabId)}
            className="w-full px-3.5 py-2.5 rounded-md border-2 border-[#1e3a8a] bg-slate-50 text-slate-900 font-bold text-sm"
          >
            {tabsList.map(t => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Wrapping Pill Grid — Shows all 12 modules cleanly without horizontal cutoff */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">
          {tabsList.map(t => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`py-2 px-3 rounded-md border text-xs font-extrabold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? `${t.activeClass} shadow-xs`
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {t.icon}
                <span className="truncate sm:hidden">{t.shortLabel}</span>
                <span className="hidden sm:inline whitespace-nowrap">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB: Services, Menus & Front-End CMS */}
      {activeTab === "services" && <ServicesTab onRefreshAll={reloadData} />}

      {/* TAB: Executive Reports & Ollama AI Audit */}
      {activeTab === "reports" && <ReportsAnalyticsTab enquiries={enquiries} />}

      {/* TAB: Ollama AI Social Intelligence */}
      {activeTab === "ollama" && <OllamaSocialTab />}

      {/* TAB: Facebook & Instagram Ads Promotion */}
      {activeTab === "ads" && <AdsPromotionTab />}

      {/* TAB: Users, Roles & RBAC */}
      {activeTab === "users" && <UsersRolesTab />}

      {/* TAB: Admin Profile & Change Password */}
      {activeTab === "admin_profile" && <AdminProfileTab />}

      {/* TAB: WhatsApp, API Keys, SMTP, Payment & SEO */}
      {activeTab === "integrations" && config && (
        <IntegrationsConfigTab config={config} setConfig={setConfig} onRefreshAll={reloadData} />
      )}

      {/* TAB 1: Enquiries & Orders (Mobile Cards + Desktop Table) */}
      {activeTab === "enquiries" && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Customer Orders & Site Consultation Requests
              </h3>
              <p className="text-xs text-slate-500">
                Live incoming client requests submitted via web forms & interactive cost estimator.
              </p>
            </div>
            <span className="text-xs font-bold text-[#1e3a8a] bg-blue-50 px-3 py-1 rounded-sm border border-blue-200 self-start sm:self-auto">
              {enquiries.length} Inquiries Logged
            </span>
          </div>

          {enquiries.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              No enquiries yet. Submit a test consultation from the homepage!
            </div>
          ) : (
            <>
              {/* Mobile Phone Cards (< md) */}
              <div className="md:hidden divide-y divide-slate-200">
                {enquiries.map(enq => (
                  <div key={enq.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-black text-slate-900 text-base">{enq.clientName}</div>
                        <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#1e3a8a]" /> {enq.clientPhone}
                        </div>
                        <div className="text-xs text-slate-400">{enq.clientEmail}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xs bg-blue-50 text-[#1e3a8a] font-black text-xs border border-blue-200 shrink-0">
                        {enq.approxBudget || "Custom Estimate"}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-sm bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                        <span>{enq.siteAddress}, {enq.city}</span>
                      </div>
                      <div className="text-slate-600">
                        Property: <strong>{enq.propertyType}</strong>
                        {enq.areaSqFt ? ` • ${enq.areaSqFt} Sq Ft` : ""}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <select
                        value={enq.status}
                        onChange={e => handleUpdateStatus(enq.id, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-sm text-xs font-bold border border-slate-300 bg-white"
                      >
                        <option value="NEW">NEW LEAD</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CONSULTATION_SCHEDULED">SITE VISIT SCHEDULED</option>
                        <option value="QUOTATION_SENT">ESTIMATE SHARED</option>
                        <option value="IN_PROGRESS">CONFIRMED / IN PROGRESS</option>
                        <option value="COMPLETED">HANDOVER DONE</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>

                      <a
                        href={`https://wa.me/${enq.clientPhone.replace(
                          /[^0-9]/g,
                          ""
                        )}?text=Hello%20${encodeURIComponent(
                          enq.clientName
                        )},%20regarding%20your%20interior/construction%20enquiry%20with%20Veyra's%20Construction%20and%20Interiors...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-sm bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold flex items-center gap-1 shrink-0"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>

                      <button
                        onClick={() => handleDeleteEnquiry(enq.id)}
                        className="p-2 rounded-sm border border-red-200 bg-red-50 text-red-600 shrink-0"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table (>= md) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Client Details</th>
                      <th className="py-3 px-4">Site Address & City</th>
                      <th className="py-3 px-4">Property & Area</th>
                      <th className="py-3 px-4">Approx Budget</th>
                      <th className="py-3 px-4">Order Status</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enquiries.map(enq => (
                      <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{enq.clientName}</div>
                          <div className="text-slate-500 text-xs">{enq.clientPhone}</div>
                          <div className="text-slate-400 text-xs">{enq.clientEmail}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{enq.siteAddress}</div>
                          <div className="text-xs text-slate-500">{enq.city}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-700">{enq.propertyType}</span>
                          {enq.areaSqFt && (
                            <div className="text-xs text-slate-400 font-semibold">
                              {enq.areaSqFt} Sq Ft
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 font-bold text-[#1e3a8a]">
                          {enq.approxBudget || "Custom Estimate"}
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={enq.status}
                            onChange={e => handleUpdateStatus(enq.id, e.target.value)}
                            className="px-2.5 py-1.5 rounded-sm text-xs font-bold border border-slate-300 bg-white cursor-pointer focus:outline-hidden"
                          >
                            <option value="NEW">NEW LEAD</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="CONSULTATION_SCHEDULED">SITE VISIT SCHEDULED</option>
                            <option value="QUOTATION_SENT">ESTIMATE SHARED</option>
                            <option value="IN_PROGRESS">CONFIRMED / IN PROGRESS</option>
                            <option value="COMPLETED">HANDOVER DONE</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`https://wa.me/${enq.clientPhone.replace(
                                /[^0-9]/g,
                                ""
                              )}?text=Hello%20${encodeURIComponent(
                                enq.clientName
                              )},%20regarding%20your%20interior/construction%20enquiry%20with%20Veyra's%20Construction%20and%20Interiors...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xs bg-[#10b981] hover:bg-[#059669] text-white transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="p-2 rounded-xs hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                              title="Delete Enquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: Projects & Designs Management */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Manage Construction & Interior Listings
              </h3>
              <p className="text-xs text-slate-500">
                Every design listing here displays on the public website with its description and approximate price.
              </p>
            </div>
            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="px-4 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> {showAddProject ? "Close Form" : "Add New Design"}
            </button>
          </div>

          {showAddProject && (
            <form
              onSubmit={handleCreateProject}
              className="bg-white p-4 sm:p-6 rounded-md border-2 border-[#ea580c]/30 shadow-md space-y-4"
            >
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#ea580c]" /> Add New Architectural / Interior Design
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Zen Water Courtyard with Teak Deck"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategoryId}
                    onChange={e => setNewCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.color})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Approx. Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={newApproxPrice}
                    onChange={e => setNewApproxPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold text-[#1e3a8a]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Area (Sq Ft)
                  </label>
                  <input
                    type="number"
                    value={newAreaSqFt}
                    onChange={e => setNewAreaSqFt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Execution Timeline
                  </label>
                  <input
                    type="text"
                    value={newTimeline}
                    onChange={e => setNewTimeline(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Address / Landmark
                  </label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={e => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Image URL / Path
                  </label>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Materials Specification
                  </label>
                  <input
                    type="text"
                    value={newMaterials}
                    onChange={e => setNewMaterials(e.target.value)}
                    placeholder="e.g. Teak Wood, Granite Pavers, Textured Fluted Wall"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Detailed Description *
                  </label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsFeatured}
                    onChange={e => setNewIsFeatured(e.target.checked)}
                    className="accent-[#ea580c] w-4 h-4"
                  />
                  Feature on Homepage Showcase
                </label>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Publish Design to Website
                </button>
              </div>
            </form>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => {
              const firstImg = p.images?.[0];
              const imgUrl =
                typeof firstImg === "string"
                  ? firstImg
                  : firstImg?.url || "/assets/projects/project-zen-courtyard.jpg";

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-md border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <img
                      src={imgUrl}
                      alt={p.title}
                      className="w-20 h-20 rounded-sm object-cover shrink-0 bg-slate-100 border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-xs bg-blue-50 text-[#1e3a8a]">
                          {p.category?.name || "Design"}
                        </span>
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`text-xs font-bold uppercase px-2 py-0.5 rounded-xs flex items-center gap-1 cursor-pointer transition-colors ${
                            p.isFeatured
                              ? "bg-amber-50 text-amber-700 border border-amber-300"
                              : "bg-slate-100 text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          <Star className="w-3 h-3 fill-current" />{" "}
                          {p.isFeatured ? "Featured" : "Standard"}
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1 line-clamp-1">
                        {p.title}
                      </h4>
                      <div className="text-xs font-extrabold text-[#ea580c] mt-0.5">
                        ₹{p.approxPrice.toLocaleString("en-IN")}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          • {p.areaSqFt || 500} sq ft • {p.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {onViewProject && (
                      <button
                        onClick={() => onViewProject(p)}
                        className="flex-1 sm:w-full px-3 py-1.5 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer justify-center"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    )}
                    <button
                      onClick={() => setEditingProject(p)}
                      className="flex-1 sm:w-full px-3 py-1.5 rounded-xs bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer justify-center"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="flex-1 sm:w-full px-3 py-1.5 rounded-xs hover:bg-red-50 text-red-500 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-lg max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#1e3a8a]" /> Edit Project Listing
              </h3>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Approx. Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editingProject.approxPrice}
                    onChange={e =>
                      setEditingProject({ ...editingProject, approxPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold text-[#ea580c]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Area (Sq Ft)
                  </label>
                  <input
                    type="number"
                    value={editingProject.areaSqFt || 500}
                    onChange={e =>
                      setEditingProject({ ...editingProject, areaSqFt: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Timeline
                  </label>
                  <input
                    type="text"
                    value={editingProject.timeline || ""}
                    onChange={e =>
                      setEditingProject({ ...editingProject, timeline: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={editingProject.city}
                    onChange={e => setEditingProject({ ...editingProject, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Materials Specification
                  </label>
                  <input
                    type="text"
                    value={editingProject.materials || ""}
                    onChange={e =>
                      setEditingProject({ ...editingProject, materials: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingProject.description}
                    onChange={e =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-sm border border-slate-300 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB: Customer Reviews & Ratings Management */}
      {activeTab === "reviews" && (
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Customer Comments & Star Ratings
              </h3>
              <p className="text-xs text-slate-500">
                Verified reviews submitted by customers after Email OTP verification.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-sm border border-amber-200">
              {reviews.length} Reviews
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {reviews.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No customer reviews posted yet.
              </div>
            ) : (
              reviews.map(rev => (
                <div
                  key={rev.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{rev.userName}</span>
                      <span className="text-xs text-slate-400">({rev.userEmail})</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700">{rev.comment}</p>
                    {rev.project && (
                      <div className="text-xs font-bold text-[#1e3a8a]">
                        Project: {rev.project.title}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="px-2.5 py-1.5 rounded-xs hover:bg-red-50 text-red-500 text-xs font-bold flex items-center gap-1 self-start sm:self-center cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB: Categories & Disciplines */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Service Disciplines & Color Themes
              </h3>
              <p className="text-xs text-slate-500">
                Each discipline uses one of the signature color themes (Blue, Green, Red, Pink, Orange).
              </p>
            </div>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Discipline
            </button>
          </div>

          {showAddCategory && (
            <form
              onSubmit={handleCreateCategory}
              className="bg-white p-5 rounded-md border border-slate-200 space-y-4 max-w-xl"
            >
              <h4 className="font-bold text-slate-900 text-sm">Create New Discipline</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Discipline Name *
                  </label>
                  <input
                    type="text"
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    placeholder="e.g. Smart Home Automation"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Color Accent
                  </label>
                  <select
                    value={catColor}
                    onChange={e => setCatColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                  >
                    <option value="blue">Architectural Blue</option>
                    <option value="green">Courtyard Emerald Green</option>
                    <option value="orange">Terracotta Orange</option>
                    <option value="pink">Luxury Rose Pink</option>
                    <option value="red">Structural Crimson Red</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={catDescription}
                    onChange={e => setCatDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1e3a8a] text-white text-xs font-bold uppercase rounded-sm cursor-pointer"
              >
                Save Discipline
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(c => (
              <div
                key={c.id}
                className="bg-white p-5 rounded-md border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-xs bg-slate-100 text-slate-700">
                    Theme: {c.color.toUpperCase()}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base mt-2">{c.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1e3a8a]">
                  <span>{c.projectCount || 0} Active Designs</span>
                  <span>/{c.slug}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Company / Studio Profile Settings */}
      {activeTab === "company" && company && (
        <form
          onSubmit={handleSaveCompany}
          className="bg-white p-5 sm:p-8 rounded-md border border-slate-200 shadow-xs max-w-3xl space-y-5"
        >
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-lg">
              Veyra's Studio Profile & Contact Configuration
            </h3>
            <p className="text-xs text-slate-500">
              Updates here reflect live across the Navbar, Footer, Contact Us page, and WhatsApp links.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={company.companyName}
                onChange={e => setCompany({ ...company, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={company.tagline}
                onChange={e => setCompany({ ...company, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Direct Phone Number
              </label>
              <input
                type="text"
                value={company.phone}
                onChange={e => setCompany({ ...company, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold text-[#1e3a8a]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                WhatsApp Business Number
              </label>
              <input
                type="text"
                value={company.whatsapp}
                onChange={e => setCompany({ ...company, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold text-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={company.email}
                onChange={e => setCompany({ ...company, email: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Working Hours
              </label>
              <input
                type="text"
                value={company.workingHours}
                onChange={e => setCompany({ ...company, workingHours: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Registered Studio Address
              </label>
              <input
                type="text"
                value={company.address}
                onChange={e => setCompany({ ...company, address: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-sm bg-[#db2777] hover:bg-[#be185d] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" /> Save Studio Profile
          </button>
        </form>
      )}
    </div>
  );
};
