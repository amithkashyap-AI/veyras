import React, { useState, useEffect } from "react";
import { 
  Building, 
  MessageSquare, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
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
  Mail,
  CreditCard,
  Search,
  Check,
  Send,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  Globe
} from "lucide-react";
import { Project, Enquiry, Category, CompanySetting, DashboardStats, SystemConfig, Review } from "../types";
import { ServicesTab } from "../components/dashboard/ServicesTab";
import { OllamaSocialTab } from "../components/dashboard/OllamaSocialTab";
import { Bot } from "lucide-react";
import { api } from "../services/api";

interface DashboardPageProps {
  onRefreshAll?: () => void;
  onViewProject?: (project: Project) => void;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onRefreshAll, 
  onViewProject,
  onNavigate,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<
    "enquiries" | "projects" | "services" | "ollama" | "reviews" | "categories" | "company" | "email" | "payment" | "seo"
  >("enquiries");

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

  // Load live data from PostgreSQL
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

  // Update enquiry status in database
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateEnquiryStatus(id, status);
      setEnquiries(prev => prev.map(enq => enq.id === id ? { ...enq, status: status as any } : enq));
    } catch (err) {
      alert("Failed to update enquiry status.");
    }
  };

  // Delete enquiry
  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await api.deleteEnquiry(id);
      setEnquiries(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert("Failed to delete enquiry.");
    }
  };

  // Add new project
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
    } catch (err) {
      alert("Failed to create project in database.");
    }
  };

  // Save edited project
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

      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditingProject(null);
      alert("✅ Project updated in PostgreSQL! Changes are live on the frontend.");
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      alert("Failed to update project.");
    }
  };

  // Toggle Featured Project
  const handleToggleFeatured = async (p: Project) => {
    try {
      const newStatus = !p.isFeatured;
      await api.updateProject(p.id, { isFeatured: newStatus });
      setProjects(prev => prev.map(item => item.id === p.id ? { ...item, isFeatured: newStatus } : item));
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      alert("Failed to toggle featured status.");
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to remove this project?")) return;
    try {
      await api.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      alert("Failed to delete project.");
    }
  };

  // Delete review
  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to remove this review?")) return;
    try {
      await api.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to delete review.");
    }
  };

  // Add category
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
    } catch (err) {
      alert("Failed to create category.");
    }
  };

  // Save company settings
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    try {
      const updated = await api.updateCompanySettings(company);
      setCompany(updated);
      alert("✅ Company profile & contact details saved to PostgreSQL! Live across website.");
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      alert("Failed to save company settings.");
    }
  };

  // Save system configuration (Email SMTP, Payment Gateway, SEO)
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      const updated = await api.updateConfig(config);
      setConfig(updated);
      alert("✅ System configuration saved to PostgreSQL!");
    } catch (err) {
      alert("Failed to save configuration.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c] mb-4"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Connecting to PostgreSQL Database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Control Center Header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1e3a8a] to-[#0f172a] text-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ea580c] text-white text-[10px] font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3" /> Live Front-End Controller
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">
            Veyra's CMS & Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manage live project listings, approximate pricing, incoming customer orders, customer comments & ratings, Email SMTP, Payment Gateways, and SEO meta tags.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate("home")}
                className="px-4 py-2 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#38bdf8]" /> View Website
              </button>
              <button
                onClick={() => onNavigate("projects")}
                className="px-4 py-2 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Portfolio Grid <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-sm bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Lock Dashboard & Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Portfolio Designs</span>
              <Building className="w-4 h-4 text-[#1e3a8a]" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.totalProjects}</div>
            <p className="text-[10px] text-slate-400 mt-1">Live listings on frontend</p>
          </div>

          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Client Enquiries / Orders</span>
              <MessageSquare className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.totalEnquiries}</div>
            <p className="text-[10px] text-[#059669] font-semibold mt-1">Active leads in pipeline</p>
          </div>

          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Customer Reviews</span>
              <Star className="w-4 h-4 text-[#ea580c]" />
            </div>
            <div className="text-2xl font-black text-slate-900">{reviews.length}</div>
            <p className="text-[10px] text-slate-400 mt-1">Comments & ratings</p>
          </div>

          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Portfolio Valuation</span>
              <DollarSign className="w-4 h-4 text-[#1e3a8a]" />
            </div>
            <div className="text-2xl font-black text-[#1e3a8a]">
              ₹{(stats.portfolioValue / 100000).toFixed(1)} Lakhs
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Total active scope</p>
          </div>
        </div>
      )}

      {/* Redesigned Navigation Tabs with requested color combinations */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto text-xs font-black uppercase tracking-wider scrollbar-none">
        
        {/* Tab 1: Enquiries */}
        <button
          onClick={() => setActiveTab("enquiries")}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "enquiries"
              ? "border-[#1e3a8a] text-[#1e3a8a] bg-blue-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#1e3a8a]" />
          <span>Orders ({enquiries.length})</span>
        </button>

        {/* Tab 2: Projects */}
        <button
          onClick={() => setActiveTab("projects")}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "projects"
              ? "border-[#ea580c] text-[#ea580c] bg-orange-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building className="w-4 h-4 text-[#ea580c]" />
          <span>Projects ({projects.length})</span>
        </button>

        {/* Tab: Services & Menus */}
        <button
          onClick={() => setActiveTab("services")}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "services"
              ? "border-[#1e3a8a] text-[#1e3a8a] bg-blue-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4 text-[#38bdf8]" />
          <span>Services & Menus</span>
        </button>

        {/* Tab: Ollama AI Social Intelligence */}
        <button
          onClick={() => setActiveTab("ollama")}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "ollama"
              ? "border-[#059669] text-[#059669] bg-emerald-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Bot className="w-4 h-4 text-[#059669]" />
          <span>Ollama AI Social</span>
        </button>

        {/* Tab 3: Reviews & Ratings */}
        <button
          onClick={() => setActiveTab("reviews")}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "reviews"
              ? "border-amber-500 text-amber-700 bg-amber-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Star className="w-4 h-4 text-amber-500" />
          <span>Comments & Ratings ({reviews.length})</span>
        </button>

        {/* Tab 4: Disciplines & Colors */}
        <button
          onClick={() => setActiveTab("categories")}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "categories"
              ? "border-[#059669] text-[#059669] bg-emerald-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Palette className="w-4 h-4 text-[#059669]" />
          <span>Disciplines & Colors</span>
        </button>

        {/* Tab 5: Studio Profile & Address */}
        <button
          onClick={() => setActiveTab("company")}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "company"
              ? "border-[#db2777] text-[#db2777] bg-pink-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Settings className="w-4 h-4 text-[#db2777]" />
          <span>Studio Profile</span>
        </button>

        {/* Tab 6: Email SMTP Config */}
        <button
          onClick={() => setActiveTab("email")}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "email"
              ? "border-[#38bdf8] text-[#0284c7] bg-sky-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Mail className="w-4 h-4 text-[#0284c7]" />
          <span>Email Config</span>
        </button>

        {/* Tab 7: Payment Gateway Config */}
        <button
          onClick={() => setActiveTab("payment")}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "payment"
              ? "border-[#10b981] text-[#059669] bg-emerald-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <CreditCard className="w-4 h-4 text-[#059669]" />
          <span>Payment Gateway</span>
        </button>

        {/* Tab 8: SEO Config */}
        <button
          onClick={() => setActiveTab("seo")}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            activeTab === "seo"
              ? "border-[#8b5cf6] text-[#7c3aed] bg-purple-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Globe className="w-4 h-4 text-[#7c3aed]" />
          <span>SEO & Analytics</span>
        </button>

      </div>

      {/* TAB: Services & Menus */}
      {activeTab === "services" && <ServicesTab onRefreshAll={reloadData} />}

      {/* TAB: Ollama AI Social Intelligence */}
      {activeTab === "ollama" && <OllamaSocialTab />}

      {/* TAB 1: Enquiries & Orders Table */}
      {activeTab === "enquiries" && (
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Customer Orders & Site Consultation Requests</h3>
              <p className="text-xs text-slate-500">Live incoming client requests submitted via web forms & interactive cost estimator.</p>
            </div>
            <span className="text-xs font-bold text-[#1e3a8a] bg-blue-50 px-2.5 py-1 rounded-sm border border-blue-200 self-start sm:self-auto">
              {enquiries.length} Inquiries Logged
            </span>
          </div>

          <div className="overflow-x-auto">
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
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No enquiries yet. Submit a test consultation from the homepage!
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{enq.clientName}</div>
                        <div className="text-slate-500 text-[11px]">{enq.clientPhone}</div>
                        <div className="text-slate-400 text-[10px]">{enq.clientEmail}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{enq.siteAddress}</div>
                        <div className="text-[10px] text-slate-500">{enq.city}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700">{enq.propertyType}</span>
                        {enq.areaSqFt && (
                          <div className="text-[10px] text-slate-400 font-semibold">{enq.areaSqFt} Sq Ft</div>
                        )}
                      </td>

                      <td className="py-3 px-4 font-bold text-[#1e3a8a]">
                        {enq.approxBudget || "Custom Estimate"}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                          className="px-2 py-1 rounded-sm text-[11px] font-bold border border-slate-300 bg-white cursor-pointer focus:outline-hidden"
                        >
                          <option value="NEW">NEW LEAD</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="SITE_VISIT_SCHEDULED">SITE VISIT SCHEDULED</option>
                          <option value="ESTIMATE_SHARED">ESTIMATE SHARED</option>
                          <option value="CONFIRMED">CONFIRMED ORDER</option>
                          <option value="COMPLETED">HANDOVER DONE</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`https://wa.me/${enq.clientPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(enq.clientName)},%20regarding%20your%20interior/construction%20enquiry%20with%20Veyra's%20Construction%20and%20Interiors...`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xs bg-[#10b981] hover:bg-[#059669] text-white transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteEnquiry(enq.id)}
                            className="p-1.5 rounded-xs hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Projects & Designs Management */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Manage Construction & Interior Listings</h3>
              <p className="text-xs text-slate-500">Every design listing here displays on the public website with its description and approximate price.</p>
            </div>
            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> {showAddProject ? "Close Form" : "Add New Design"}
            </button>
          </div>

          {/* Add New Project Form */}
          {showAddProject && (
            <form onSubmit={handleCreateProject} className="bg-white p-6 rounded-md border-2 border-[#ea580c]/30 shadow-md space-y-4">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <Building className="w-4 h-4 text-[#ea580c]" /> Add New Architectural / Interior Design
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Title *</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Zen Water Courtyard with Teak Deck"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.color})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Approx. Price (₹) *</label>
                  <input 
                    type="number" 
                    value={newApproxPrice}
                    onChange={(e) => setNewApproxPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold text-[#1e3a8a]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Area (Sq Ft)</label>
                  <input 
                    type="number" 
                    value={newAreaSqFt}
                    onChange={(e) => setNewAreaSqFt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Execution Timeline</label>
                  <input 
                    type="text" 
                    value={newTimeline}
                    onChange={(e) => setNewTimeline(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Address / Landmark</label>
                  <input 
                    type="text" 
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">City</label>
                  <input 
                    type="text" 
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Image URL / Path</label>
                  <input 
                    type="text" 
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Materials Specification</label>
                  <input 
                    type="text" 
                    value={newMaterials}
                    onChange={(e) => setNewMaterials(e.target.value)}
                    placeholder="e.g. Teak Wood, Granite Pavers, Textured Fluted Wall"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Detailed Description *</label>
                  <textarea 
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  Save Project to PostgreSQL
                </button>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newIsFeatured} 
                    onChange={(e) => setNewIsFeatured(e.target.checked)} 
                    className="accent-[#ea580c]"
                  />
                  Feature on Homepage Showcase
                </label>
              </div>
            </form>
          )}

          {/* Existing Projects Table */}
          <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Preview & Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Approx Price</th>
                    <th className="py-3 px-4">Area & Time</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((p) => {
                    const imgUrl = (p.images && p.images.length > 0) 
                      ? (typeof p.images[0] === "string" ? p.images[0] : p.images[0].url)
                      : "/assets/projects/project-zen-courtyard.jpg";

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={imgUrl} 
                              alt={p.title} 
                              className="w-12 h-10 object-cover rounded-xs border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">{p.materials || "Premium finishes"}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase bg-slate-100">
                            {p.category?.name || "Architecture"}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-black text-[#1e3a8a]">
                          ₹{p.approxPrice.toLocaleString("en-IN")}
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          {p.areaSqFt ? `${p.areaSqFt} sq ft` : "Custom"} • {p.timeline}
                        </td>

                        <td className="py-3 px-4 text-slate-600">{p.city}</td>

                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(p)}
                            title={p.isFeatured ? "Featured on Homepage" : "Not featured"}
                            className={`p-1.5 rounded-sm transition-colors cursor-pointer ${
                              p.isFeatured ? "bg-amber-100 text-amber-600" : "text-slate-300 hover:text-slate-500"
                            }`}
                          >
                            <Star className={`w-4 h-4 ${p.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {onViewProject && (
                              <button
                                onClick={() => onViewProject(p)}
                                className="p-1.5 rounded-xs hover:bg-blue-50 text-blue-600 cursor-pointer"
                                title="View on Customer Frontend"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => setEditingProject(p)}
                              className="p-1.5 rounded-xs hover:bg-orange-50 text-[#ea580c] cursor-pointer"
                              title="Edit Project Details & Price"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-1.5 rounded-xs hover:bg-red-50 text-red-500 cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* EDIT PROJECT MODAL */}
          {editingProject && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-lg max-w-3xl w-full p-6 shadow-2xl space-y-4 my-8">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-[#ea580c]" />
                    <h3 className="font-bold text-slate-900 text-base">
                      Edit Design: {editingProject.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setEditingProject(null)}
                    className="p-1 rounded-sm text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditProject} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Title</label>
                      <input 
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Category</label>
                      <select
                        value={editingProject.categoryId}
                        onChange={(e) => setEditingProject({ ...editingProject, categoryId: e.target.value })}
                        className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name} ({c.color})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Approx. Price (₹)</label>
                      <input 
                        type="number"
                        value={editingProject.approxPrice}
                        onChange={(e) => setEditingProject({ ...editingProject, approxPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold text-[#1e3a8a]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Area (Sq Ft)</label>
                      <input 
                        type="number"
                        value={editingProject.areaSqFt || 0}
                        onChange={(e) => setEditingProject({ ...editingProject, areaSqFt: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Execution Timeline</label>
                      <input 
                        type="text"
                        value={editingProject.timeline}
                        onChange={(e) => setEditingProject({ ...editingProject, timeline: e.target.value })}
                        className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Site Address / Area</label>
                      <input 
                        type="text"
                        value={editingProject.address}
                        onChange={(e) => setEditingProject({ ...editingProject, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">City</label>
                      <input 
                        type="text"
                        value={editingProject.city}
                        onChange={(e) => setEditingProject({ ...editingProject, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={editingProject.isFeatured || false}
                          onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                          className="accent-[#ea580c] w-4 h-4"
                        />
                        Featured on Home
                      </label>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Materials Specification</label>
                      <input 
                        type="text"
                        value={editingProject.materials}
                        onChange={(e) => setEditingProject({ ...editingProject, materials: e.target.value })}
                        className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Detailed Description</label>
                      <textarea 
                        rows={4}
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs leading-relaxed"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 border border-slate-300 rounded-sm text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" /> Save Changes to PostgreSQL
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Comments & Ratings Management */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Customer Comments & Ratings</h3>
              <p className="text-xs text-slate-500">Verified feedback submitted by clients on project detail pages.</p>
            </div>
            <span className="text-xs font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-sm border border-amber-200">
              {reviews.length} Client Reviews
            </span>
          </div>

          <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Client Name & Email</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Comment</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No comments or reviews yet. Verified users can write reviews from any project detail page!
                    </td>
                  </tr>
                ) : (
                  reviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {rev.userName}
                        <div className="text-[10px] text-slate-400 font-normal">{rev.userEmail}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {rev.project?.title || "Project Specification"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs leading-relaxed">
                        "{rev.comment}"
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[10px]">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 rounded-xs hover:bg-red-50 text-red-500 cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Categories & Colors Management */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Design Disciplines & Assigned Colors</h3>
              <p className="text-xs text-slate-500">
                Mapped to the requested color combinations: <strong>Blue, Green, Red, Pink, Orange, White</strong>.
              </p>
            </div>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> {showAddCategory ? "Close" : "Add Discipline"}
            </button>
          </div>

          {showAddCategory && (
            <form onSubmit={handleCreateCategory} className="bg-white p-6 rounded-md border-2 border-[#059669]/30 shadow-md space-y-3">
              <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                New Design Discipline
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Discipline Name *</label>
                  <input 
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Terrace Swimming Pools"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Assigned Color Badge *</label>
                  <select
                    value={catColor}
                    onChange={(e) => setCatColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white font-bold"
                  >
                    <option value="blue">Blue (Architectural Construction)</option>
                    <option value="green">Green (Courtyards & Landscaping)</option>
                    <option value="red">Red (Villa Renovation)</option>
                    <option value="pink">Pink (Luxury Interior Design)</option>
                    <option value="orange">Orange (Modern Timber Decks)</option>
                    <option value="white">White / Slate (Custom Services)</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Description</label>
                  <input 
                    type="text"
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    placeholder="Brief summary of this architectural discipline..."
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider rounded-sm cursor-pointer"
              >
                Save Category
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((c) => {
              const colorBadges: Record<string, string> = {
                blue: "bg-[#1e3a8a] text-white border-blue-800",
                green: "bg-[#059669] text-white border-emerald-800",
                red: "bg-[#dc2626] text-white border-rose-800",
                pink: "bg-[#db2777] text-white border-pink-800",
                orange: "bg-[#ea580c] text-white border-amber-800",
                white: "bg-slate-900 text-white border-slate-700"
              };
              const count = projects.filter(p => p.categoryId === c.id || p.category?.slug === c.slug).length;

              return (
                <div key={c.id} className="bg-white rounded-md border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 rounded-xs text-[10px] font-extrabold uppercase tracking-wider border ${colorBadges[c.color] || colorBadges.blue}`}>
                        {c.color}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{count} Designs</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{c.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{c.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">slug: {c.slug}</span>
                    <span className="font-bold text-[#1e3a8a]">Active in CMS</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: Company Profile Settings */}
      {activeTab === "company" && company && (
        <form onSubmit={handleSaveCompany} className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Company Brand, Address & Contact Details
              </h3>
              <p className="text-xs text-slate-500">
                Any changes made here instantly reflect across the public navbar, footer, contact page, and WhatsApp links.
              </p>
            </div>
            <span className="text-xs font-bold text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200">
              Live in PostgreSQL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Company Name</label>
              <input 
                type="text"
                value={company.companyName}
                onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Tagline</label>
              <input 
                type="text"
                value={company.tagline}
                onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold text-[#ea580c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Phone Number</label>
              <input 
                type="text"
                value={company.phone}
                onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">WhatsApp Hotline Number *</label>
              <input 
                type="text"
                value={company.whatsapp}
                onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold text-[#059669]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Email Address</label>
              <input 
                type="email"
                value={company.email}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Working Hours</label>
              <input 
                type="text"
                value={company.workingHours}
                onChange={(e) => setCompany({ ...company, workingHours: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Studio / Office Address *</label>
              <input 
                type="text"
                value={company.address}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">City</label>
              <input 
                type="text"
                value={company.city}
                onChange={(e) => setCompany({ ...company, city: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Logo URL / Path</label>
              <input 
                type="text"
                value={company.logoUrl}
                onChange={(e) => setCompany({ ...company, logoUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes to PostgreSQL
            </button>
            <span className="text-[11px] text-slate-400">Updates sync in real-time</span>
          </div>
        </form>
      )}

      {/* TAB 6: Email SMTP Configuration */}
      {activeTab === "email" && config && (
        <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#0284c7]" /> Email & SMTP Delivery Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Configure outgoing SMTP mail server to deliver order notifications, OTP codes, and inquiry estimates.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0284c7] bg-sky-50 px-2.5 py-1 rounded-sm border border-sky-200">
              Active SMTP
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">SMTP Host / Server</label>
              <input 
                type="text"
                value={config.smtpHost}
                onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                placeholder="e.g. smtp.gmail.com or smtp.mailtrap.io"
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">SMTP Port</label>
              <input 
                type="number"
                value={config.smtpPort}
                onChange={(e) => setConfig({ ...config, smtpPort: Number(e.target.value) })}
                placeholder="587 or 465"
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">SMTP Username / Account</label>
              <input 
                type="text"
                value={config.smtpUser}
                onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">SMTP Password / App Secret</label>
              <input 
                type="password"
                value={config.smtpPass}
                onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Sender Email Address</label>
              <input 
                type="email"
                value={config.senderEmail}
                onChange={(e) => setConfig({ ...config, senderEmail: e.target.value })}
                placeholder="orders@veyrasinteriors.com"
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Sender Display Name</label>
              <input 
                type="text"
                value={config.senderName}
                onChange={(e) => setConfig({ ...config, senderName: e.target.value })}
                placeholder="Veyra's Construction & Interiors"
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={config.smtpSecure}
                  onChange={(e) => setConfig({ ...config, smtpSecure: e.target.checked })}
                  className="accent-[#0284c7] w-4 h-4"
                />
                Use TLS / SSL Encryption for Secure Mail Delivery
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-sm bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> Save SMTP Configuration
            </button>
            <button
              type="button"
              onClick={() => alert(`Email test connection simulated for ${config.senderEmail} via ${config.smtpHost}:${config.smtpPort}`)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-sm cursor-pointer flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" /> Send Test Email
            </button>
          </div>
        </form>
      )}

      {/* TAB 7: Payment Gateway Configuration */}
      {activeTab === "payment" && config && (
        <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#059669]" /> Payment Gateway & Online Advance Booking
              </h3>
              <p className="text-xs text-slate-500">
                Collect design tokens, booking advances, and architectural retainer payments online.
              </p>
            </div>
            <span className="text-xs font-bold text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200">
              {config.paymentMode} Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Select Payment Provider</label>
              <select 
                value={config.paymentGateway}
                onChange={(e) => setConfig({ ...config, paymentGateway: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="Razorpay">Razorpay (Cards, UPI, NetBanking, EMI)</option>
                <option value="Stripe">Stripe (Global Credit/Debit Cards)</option>
                <option value="Cashfree">Cashfree Payments</option>
                <option value="Instamojo">Instamojo</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Environment Mode</label>
              <select 
                value={config.paymentMode}
                onChange={(e) => setConfig({ ...config, paymentMode: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="TEST">TEST / SANDBOX (Safe Simulation)</option>
                <option value="LIVE">LIVE / PRODUCTION (Real Money)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">API Key ID / Public Key *</label>
              <input 
                type="text"
                value={config.paymentApiKey}
                onChange={(e) => setConfig({ ...config, paymentApiKey: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">API Secret Key *</label>
              <input 
                type="password"
                value={config.paymentApiSecret}
                onChange={(e) => setConfig({ ...config, paymentApiSecret: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Default Billing Currency</label>
              <select 
                value={config.paymentCurrency}
                onChange={(e) => setConfig({ ...config, paymentCurrency: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="INR">INR (Indian Rupee - ₹)</option>
                <option value="USD">USD (US Dollar - $)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={config.enableOnlineAdvance}
                  onChange={(e) => setConfig({ ...config, enableOnlineAdvance: e.target.checked })}
                  className="accent-[#059669] w-4 h-4"
                />
                Enable Online Advance Booking Deposits on Frontend
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-sm bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> Save Gateway Credentials
            </button>
            <span className="text-[11px] text-slate-400">Encrypted in PostgreSQL</span>
          </div>
        </form>
      )}

      {/* TAB 8: SEO & Analytics Configuration */}
      {activeTab === "seo" && config && (
        <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-md border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#7c3aed]" /> Search Engine Optimization (SEO) & Analytics
              </h3>
              <p className="text-xs text-slate-500">
                Configure meta titles, descriptions, OpenGraph social sharing previews, and Google Analytics tracking.
              </p>
            </div>
            <span className="text-xs font-bold text-[#7c3aed] bg-purple-50 px-2.5 py-1 rounded-sm border border-purple-200">
              Live Indexing
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Primary Meta Title (Appears in Google search & browser tab)
              </label>
              <input 
                type="text"
                value={config.seoTitle}
                onChange={(e) => setConfig({ ...config, seoTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">{config.seoTitle.length} / 70 characters recommended</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                Meta Description (Google Snippet)
              </label>
              <textarea 
                rows={3}
                value={config.seoDescription}
                onChange={(e) => setConfig({ ...config, seoDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs leading-relaxed"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">{config.seoDescription.length} / 160 characters recommended</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">SEO Target Keywords (Comma Separated)</label>
                <input 
                  type="text"
                  value={config.seoKeywords}
                  onChange={(e) => setConfig({ ...config, seoKeywords: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Google Analytics Measurement ID</label>
                <input 
                  type="text"
                  value={config.googleAnalyticsId}
                  onChange={(e) => setConfig({ ...config, googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Canonical Web URL</label>
                <input 
                  type="url"
                  value={config.canonicalUrl}
                  onChange={(e) => setConfig({ ...config, canonicalUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Social Share OG Image URL</label>
                <input 
                  type="text"
                  value={config.ogImage}
                  onChange={(e) => setConfig({ ...config, ogImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Google Search Live Preview Card */}
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Google Search Engine Result Snippet Preview:
              </span>
              <div className="font-sans">
                <span className="text-xs text-[#1a0dab] font-medium block truncate">{config.canonicalUrl}</span>
                <h4 className="text-base text-[#1a0dab] font-semibold hover:underline cursor-pointer leading-snug">
                  {config.seoTitle}
                </h4>
                <p className="text-xs text-[#4d5156] mt-1 leading-relaxed line-clamp-2">
                  {config.seoDescription}
                </p>
              </div>
            </div>

          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-sm bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" /> Save SEO & Analytics
            </button>
            <span className="text-[11px] text-slate-400">Syncs meta headers automatically</span>
          </div>
        </form>
      )}

    </div>
  );
};
