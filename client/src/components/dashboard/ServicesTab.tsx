import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  MessageCircle,
  FolderPlus,
  Eye,
  EyeOff,
  Save,
  Sparkles,
  LayoutTemplate
} from "lucide-react";
import { Service, NavMenu, NavSubmenu, SystemConfig } from "../../types";
import { api } from "../../services/api";

interface ServicesTabProps {
  onRefreshAll?: () => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ onRefreshAll }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [menus, setMenus] = useState<NavMenu[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [subView, setSubView] = useState<"menus_services" | "frontend_cms">("menus_services");

  // Add / Edit Service Modal State
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Luxury Interior Design");
  const [pricePerSqFt, setPricePerSqFt] = useState<number>(1850);
  const [priceUnit, setPriceUnit] = useState("per sq.ft");
  const [minAreaSqFt, setMinAreaSqFt] = useState<number>(800);
  const [durationWeeks, setDurationWeeks] = useState<number>(8);
  const [imageUrl, setImageUrl] = useState("/assets/projects/project-patio.jpg");
  const [description, setDescription] = useState("");
  const [featuresInput, setFeaturesInput] = useState(
    "3D Photorealistic Renders, German Soft-Close Hardware, Marine Grade BWP Ply, 5-Year Guarantee"
  );
  const [enableEnquiry, setEnableEnquiry] = useState(true);
  const [enableWhatsApp, setEnableWhatsApp] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [serviceOrder, setServiceOrder] = useState<number>(0);
  const [submenuId, setSubmenuId] = useState("");

  // Add / Edit Menu Modal State
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [menuTitle, setMenuTitle] = useState("");
  const [menuIcon, setMenuIcon] = useState("Layers");
  const [menuOrder, setMenuOrder] = useState<number>(0);
  const [menuActive, setMenuActive] = useState(true);

  // Add / Edit Submenu Modal State
  const [showSubmenuModal, setShowSubmenuModal] = useState(false);
  const [editingSubmenuId, setEditingSubmenuId] = useState<string | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [submenuTitle, setSubmenuTitle] = useState("");
  const [submenuDesc, setSubmenuDesc] = useState("");
  const [submenuOrder, setSubmenuOrder] = useState<number>(0);
  const [submenuActive, setSubmenuActive] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, m, cfg] = await Promise.all([
        api.getServices(),
        api.getMenus(),
        api.getConfig()
      ]);
      setServices(s);
      setMenus(m);
      setConfig(cfg);
    } catch (err) {
      console.error("Failed to load services & menus:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const allSubmenus = menus.flatMap(m =>
    (m.submenus || []).map(sub => ({ ...sub, menuTitle: m.title }))
  );

  const openAddService = () => {
    setEditingServiceId(null);
    setTitle("");
    setSubtitle("");
    setCategory("Luxury Interior Design");
    setPricePerSqFt(1850);
    setPriceUnit("per sq.ft");
    setMinAreaSqFt(800);
    setDurationWeeks(8);
    setImageUrl("/assets/projects/project-patio.jpg");
    setDescription("");
    setFeaturesInput("3D Photorealistic Renders, German Soft-Close Hardware, Marine Grade BWP Ply, 5-Year Guarantee");
    setEnableEnquiry(true);
    setEnableWhatsApp(true);
    setIsFeatured(true);
    setServiceOrder(services.length);
    setSubmenuId("");
    setShowServiceModal(true);
  };

  const openEditService = (svc: Service) => {
    setEditingServiceId(svc.id);
    setTitle(svc.title);
    setSubtitle(svc.subtitle || "");
    setCategory(svc.category);
    setPricePerSqFt(svc.pricePerSqFt);
    setPriceUnit(svc.priceUnit || "per sq.ft");
    setMinAreaSqFt(svc.minAreaSqFt || 500);
    setDurationWeeks(svc.durationWeeks || 6);
    setImageUrl(svc.imageUrl || "/assets/projects/project-patio.jpg");
    setDescription(svc.description || "");
    setFeaturesInput((svc.features || []).join(", "));
    setEnableEnquiry(svc.enableEnquiry);
    setEnableWhatsApp(svc.enableWhatsApp);
    setIsFeatured(svc.isFeatured);
    setServiceOrder(svc.order || 0);
    setSubmenuId(svc.submenuId || "");
    setShowServiceModal(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !pricePerSqFt) {
      alert("Please enter service title and price per sq.ft");
      return;
    }

    try {
      const features = featuresInput.split(",").map(f => f.trim()).filter(Boolean);
      const payload = {
        title,
        subtitle,
        category,
        pricePerSqFt: Number(pricePerSqFt),
        priceUnit,
        minAreaSqFt: Number(minAreaSqFt),
        durationWeeks: Number(durationWeeks),
        imageUrl,
        description,
        features,
        enableEnquiry,
        enableWhatsApp,
        isFeatured,
        order: Number(serviceOrder),
        submenuId: submenuId || undefined
      };

      if (editingServiceId) {
        await api.updateService(editingServiceId, payload);
        alert("✅ Service package updated and live on website!");
      } else {
        await api.createService(payload);
        alert("✅ New Service package created and live on website!");
      }

      setShowServiceModal(false);
      loadData();
      if (onRefreshAll) onRefreshAll();
    } catch (err: any) {
      alert("Failed to save service: " + err.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service package?")) return;
    try {
      await api.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      if (onRefreshAll) onRefreshAll();
    } catch {
      alert("Failed to delete service");
    }
  };

  const openAddMenu = () => {
    setEditingMenuId(null);
    setMenuTitle("");
    setMenuIcon("Layers");
    setMenuOrder(menus.length);
    setMenuActive(true);
    setShowMenuModal(true);
  };

  const openEditMenu = (menu: NavMenu) => {
    setEditingMenuId(menu.id);
    setMenuTitle(menu.title);
    setMenuIcon(menu.icon || "Layers");
    setMenuOrder(menu.order || 0);
    setMenuActive(menu.isActive);
    setShowMenuModal(true);
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuTitle) return;
    try {
      if (editingMenuId) {
        await api.updateMenu(editingMenuId, {
          title: menuTitle,
          icon: menuIcon,
          order: Number(menuOrder),
          isActive: menuActive
        });
      } else {
        await api.createMenu({
          title: menuTitle,
          icon: menuIcon,
          order: Number(menuOrder),
          isActive: menuActive
        });
      }
      setShowMenuModal(false);
      loadData();
      if (onRefreshAll) onRefreshAll();
    } catch (err: any) {
      alert("Failed to save menu: " + err.message);
    }
  };

  const handleToggleMenuActive = async (menu: NavMenu) => {
    try {
      await api.updateMenu(menu.id, { isActive: !menu.isActive });
      loadData();
    } catch {
      alert("Failed to toggle menu visibility");
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm("Delete this navigation menu and all its submenus?")) return;
    try {
      await api.deleteMenu(id);
      loadData();
    } catch {
      alert("Failed to delete menu");
    }
  };

  const openAddSubmenu = (menuId: string) => {
    setEditingSubmenuId(null);
    setSelectedMenuId(menuId);
    setSubmenuTitle("");
    setSubmenuDesc("");
    setSubmenuOrder(0);
    setSubmenuActive(true);
    setShowSubmenuModal(true);
  };

  const openEditSubmenu = (menuId: string, sub: NavSubmenu) => {
    setEditingSubmenuId(sub.id);
    setSelectedMenuId(menuId);
    setSubmenuTitle(sub.title);
    setSubmenuDesc(sub.description || "");
    setSubmenuOrder(sub.order || 0);
    setSubmenuActive(sub.isActive);
    setShowSubmenuModal(true);
  };

  const handleSaveSubmenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submenuTitle) return;
    try {
      if (editingSubmenuId) {
        await api.updateSubmenu(editingSubmenuId, {
          title: submenuTitle,
          description: submenuDesc,
          order: Number(submenuOrder),
          isActive: submenuActive
        });
      } else {
        await api.createSubmenu(selectedMenuId, {
          title: submenuTitle,
          description: submenuDesc,
          order: Number(submenuOrder),
          isActive: submenuActive
        });
      }
      setShowSubmenuModal(false);
      loadData();
    } catch {
      alert("Failed to save submenu");
    }
  };

  const handleDeleteSubmenu = async (id: string) => {
    if (!confirm("Delete this submenu?")) return;
    try {
      await api.deleteSubmenu(id);
      loadData();
    } catch {
      alert("Failed to delete submenu");
    }
  };

  const handleSaveFrontendCms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      const updated = await api.updateConfig(config);
      setConfig(updated);
      alert("✅ Front-end Hero banner, estimator rates & section visibility saved to PostgreSQL!");
      if (onRefreshAll) onRefreshAll();
    } catch {
      alert("Failed to save frontend CMS configuration");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header with Sub-View Switcher & Action Buttons */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#ea580c]" />
            Content, Navigation Menus & Front-End Controller
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, reorder, and toggle navigation menus, nested submenus, service packages, Hero banners, and live cost estimator rates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-sm border border-slate-200 bg-slate-100 p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setSubView("menus_services")}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                subView === "menus_services" ? "bg-[#1e3a8a] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Menus & Services ({services.length})
            </button>
            <button
              type="button"
              onClick={() => setSubView("frontend_cms")}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                subView === "frontend_cms" ? "bg-[#ea580c] text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" /> Front-End Hero & Section CMS
            </button>
          </div>

          {subView === "menus_services" && (
            <>
              <button
                type="button"
                onClick={openAddMenu}
                className="px-3 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" /> + New Menu
              </button>
              <button
                type="button"
                onClick={openAddService}
                className="px-4 py-2 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> + Add Service Package
              </button>
            </>
          )}
        </div>
      </div>

      {/* SUBVIEW A: FRONT-END HERO, BANNERS & ESTIMATOR CMS */}
      {subView === "frontend_cms" && config && (
        <form onSubmit={handleSaveFrontendCms} className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ea580c]" />
                Live Front-End Hero Banner, Announcement Bar & Estimator Rates
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Changes saved here immediately control the homepage Hero section, top announcement bar, section visibility, and interactive cost calculator.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Publish Front-End Changes
            </button>
          </div>

          {/* Announcement Bar */}
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#1e3a8a]">
                1. Top Promo Announcement Bar
              </span>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showAnnouncementBar ?? true}
                  onChange={e => setConfig({ ...config, showAnnouncementBar: e.target.checked })}
                  className="accent-[#1e3a8a] w-4 h-4"
                />
                Show Announcement Bar on Public Website
              </label>
            </div>
            <input
              type="text"
              value={config.announcementText || ""}
              onChange={e => setConfig({ ...config, announcementText: e.target.value })}
              placeholder="✨ Complimentary 3D Architectural Concept & On-Site Consultation in Bengaluru..."
              className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
            />
          </div>

          {/* Hero Banner Text & Image */}
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-[#1e3a8a] block">
              2. Homepage Hero Headlines & Background Media
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Hero Badge Pill</label>
                <input
                  type="text"
                  value={config.heroBadgeText || ""}
                  onChange={e => setConfig({ ...config, heroBadgeText: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Main Headline Prefix</label>
                <input
                  type="text"
                  value={config.heroTitle || ""}
                  onChange={e => setConfig({ ...config, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Gradient Highlight Text</label>
                <input
                  type="text"
                  value={config.heroHighlightText || ""}
                  onChange={e => setConfig({ ...config, heroHighlightText: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold text-[#ea580c] bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Hero Subtitle Paragraph</label>
                <input
                  type="text"
                  value={config.heroSubtitle || ""}
                  onChange={e => setConfig({ ...config, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Hero Background Image URL</label>
                <input
                  type="text"
                  value={config.heroBgImage || ""}
                  onChange={e => setConfig({ ...config, heroBgImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
            </div>
          </div>

          {/* Interactive Cost Estimator Default Base Rates */}
          <div className="p-4 bg-orange-50/50 rounded-md border border-orange-200 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#ea580c] block">
              3. Homepage Interactive Cost Estimator Base Rates (₹ / Sq.Ft)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Courtyards (₹/sqft)</label>
                <input
                  type="number"
                  value={config.rateCourtyard ?? 650}
                  onChange={e => setConfig({ ...config, rateCourtyard: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 text-xs font-black text-[#1e3a8a] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Construction (₹/sqft)</label>
                <input
                  type="number"
                  value={config.rateConstruction ?? 2400}
                  onChange={e => setConfig({ ...config, rateConstruction: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 text-xs font-black text-[#1e3a8a] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Luxury Interiors (₹/sqft)</label>
                <input
                  type="number"
                  value={config.rateInteriors ?? 1850}
                  onChange={e => setConfig({ ...config, rateInteriors: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 text-xs font-black text-[#1e3a8a] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Timber Decks (₹/sqft)</label>
                <input
                  type="number"
                  value={config.rateDecks ?? 750}
                  onChange={e => setConfig({ ...config, rateDecks: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 text-xs font-black text-[#1e3a8a] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Villa Renovation (₹/sqft)</label>
                <input
                  type="number"
                  value={config.rateRenovation ?? 1100}
                  onChange={e => setConfig({ ...config, rateRenovation: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded-sm border border-slate-300 text-xs font-black text-[#1e3a8a] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section Visibility Toggles */}
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#1e3a8a] block">
              4. Front-End Section Visibility Controls
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold text-slate-700">
              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xs border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showHeroEstimator ?? true}
                  onChange={e => setConfig({ ...config, showHeroEstimator: e.target.checked })}
                  className="accent-[#059669] w-4 h-4"
                />
                Show Hero Cost Estimator
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xs border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showCategoryShowcase ?? true}
                  onChange={e => setConfig({ ...config, showCategoryShowcase: e.target.checked })}
                  className="accent-[#059669] w-4 h-4"
                />
                Show 5-Discipline Showcase
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xs border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showQualitySection ?? true}
                  onChange={e => setConfig({ ...config, showQualitySection: e.target.checked })}
                  className="accent-[#059669] w-4 h-4"
                />
                Show ISO Quality Standards
              </label>
              <label className="flex items-center gap-2 p-2.5 bg-white rounded-xs border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableFloatingWhatsApp ?? true}
                  onChange={e => setConfig({ ...config, enableFloatingWhatsApp: e.target.checked })}
                  className="accent-[#059669] w-4 h-4"
                />
                Show Floating WhatsApp CTA
              </label>
            </div>
          </div>
        </form>
      )}

      {/* SUBVIEW B: MENUS, SUBMENUS & SERVICE PACKAGES */}
      {subView === "menus_services" && (
        <>
          {/* 2. Navigation Menus & Submenus Hierarchy Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Navigation Menu & Submenu Hierarchy ({menus.length} Menus)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organized navigation structure displayed in public navbar dropdowns and filter bars. Click edit to rename, reorder, or toggle visibility.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {menus.map(menu => (
                <div
                  key={menu.id}
                  className={`p-4 rounded-md border flex flex-col justify-between transition-all ${
                    menu.isActive ? "border-slate-200 bg-slate-50" : "border-dashed border-slate-300 bg-slate-100/60 opacity-75"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-mono bg-blue-100 text-[#1e3a8a] px-1.5 py-0.5 rounded-xs font-bold">
                          #{menu.order}
                        </span>
                        <span className="font-black text-xs text-[#1e3a8a] uppercase tracking-wide truncate">
                          {menu.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleMenuActive(menu)}
                          className={`p-1 rounded-xs cursor-pointer ${
                            menu.isActive ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-200"
                          }`}
                          title={menu.isActive ? "Visible on Navbar (Click to Hide)" : "Hidden (Click to Show)"}
                        >
                          {menu.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditMenu(menu)}
                          className="p-1 text-slate-500 hover:text-[#1e3a8a] transition-colors cursor-pointer"
                          title="Edit Menu"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMenu(menu.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Menu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 mt-3">
                      {menu.submenus && menu.submenus.length > 0 ? (
                        menu.submenus.map(sub => (
                          <div
                            key={sub.id}
                            className="text-xs bg-white p-2 rounded-xs border border-slate-200 flex items-center justify-between text-slate-700"
                          >
                            <span className={`truncate ${!sub.isActive ? "line-through text-slate-400" : ""}`}>
                              {sub.title}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-xs font-mono">
                                {sub._count ? sub._count.services : 0} pkgs
                              </span>
                              <button
                                type="button"
                                onClick={() => openEditSubmenu(menu.id, sub)}
                                className="text-slate-400 hover:text-[#1e3a8a] ml-0.5 cursor-pointer"
                                title="Edit Submenu"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSubmenu(sub.id)}
                                className="text-slate-300 hover:text-red-500 ml-0.5 cursor-pointer"
                                title="Delete Submenu"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400 italic block">No submenus yet</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openAddSubmenu(menu.id)}
                    className="mt-3 w-full py-1.5 rounded-xs bg-white hover:bg-slate-100 border border-slate-200 text-[#ea580c] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Submenu
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Live Services Listing & Rate Cards */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Active Service Packages & Price-Per-Sq.Ft Rate Cards ({services.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click Edit on any service package to update its rate per sq.ft, inclusions, submenu assignment, or WhatsApp triggers.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs font-bold animate-pulse">
                Loading services from PostgreSQL...
              </div>
            ) : services.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No services configured. Click "+ Add Service Package" above to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                  <div
                    key={service.id}
                    className="rounded-lg border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-40 bg-slate-100">
                        <img
                          src={service.imageUrl || "/assets/projects/project-patio.jpg"}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-[#1e3a8a] text-white px-2 py-0.5 rounded-xs text-xs font-bold uppercase">
                          {service.category}
                        </div>
                        {service.submenu && (
                          <div className="absolute top-2 right-2 bg-white/95 text-slate-800 px-2 py-0.5 rounded-xs text-xs font-bold border border-slate-200">
                            {service.submenu.title}
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2.5 py-1 rounded-xs font-mono font-black text-sm">
                          ₹{service.pricePerSqFt.toLocaleString("en-IN")}{" "}
                          <span className="text-xs text-slate-300 font-normal">/{service.priceUnit}</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h4 className="font-black text-sm text-slate-900 leading-snug">{service.title}</h4>
                        {service.subtitle && (
                          <p className="text-sm font-bold text-[#ea580c] mt-0.5">{service.subtitle}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                          {service.features &&
                            service.features.slice(0, 3).map((feat, i) => (
                              <span
                                key={i}
                                className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-xs font-medium"
                              >
                                ✓ {feat}
                              </span>
                            ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm text-slate-500 font-semibold">
                          <span className="flex items-center gap-1 text-[#059669]">
                            <MessageCircle className="w-3 h-3" /> WhatsApp: {service.enableWhatsApp ? "Active" : "Off"}
                          </span>
                          <span>Min: {service.minAreaSqFt} sq.ft</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-xs">
                        Live on Portal
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditService(service)}
                          className="px-2.5 py-1 rounded-xs bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] text-sm font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(service.id)}
                          className="p-1.5 rounded-xs text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* 4. MODAL: Add / Edit Service Package */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 my-8 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                {editingServiceId ? "Edit Service Package & Pricing" : "Create New Service Package & Pricing"}
              </h3>
              <button
                onClick={() => setShowServiceModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                    Service Package Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Modern Italian Interior Package"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                    Discipline / Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-[#1e3a8a]"
                  >
                    <option value="Architectural Construction">Architectural Construction</option>
                    <option value="Luxury Interior Design">Luxury Interior Design</option>
                    <option value="Courtyards & Landscaping">Courtyards & Landscaping</option>
                    <option value="Renovation & Fitouts">Renovation & Fitouts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    placeholder="e.g. Italian Marble, Concealed Renders & 5-Year Warranty"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs focus:outline-hidden focus:border-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                    Link to Navigation Submenu
                  </label>
                  <select
                    value={submenuId}
                    onChange={e => setSubmenuId(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                  >
                    <option value="">-- Optional Submenu Link --</option>
                    {allSubmenus.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.menuTitle} → {sub.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-orange-50/60 rounded-sm border border-orange-200">
                <div>
                  <label className="block text-sm font-bold uppercase text-[#ea580c] mb-1">
                    Price (INR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={pricePerSqFt}
                    onChange={e => setPricePerSqFt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-orange-300 text-sm font-black text-[#1e3a8a] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Price Unit</label>
                  <input
                    type="text"
                    value={priceUnit}
                    onChange={e => setPriceUnit(e.target.value)}
                    placeholder="per sq.ft"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Min Area (Sq.Ft)</label>
                  <input
                    type="number"
                    value={minAreaSqFt}
                    onChange={e => setMinAreaSqFt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={durationWeeks}
                    onChange={e => setDurationWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                />
                <div className="mt-1 flex gap-2 text-xs text-slate-500">
                  <span>Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setImageUrl("/assets/projects/project-patio.jpg")}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Patio
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl("/assets/projects/project-zen-courtyard.jpg")}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Courtyard
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl("/assets/projects/project-stone-villa.jpg")}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Villa
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl("/assets/projects/project-deck.jpg")}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Timber Deck
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Comprehensive description of materials, workmanship, and engineering scope..."
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs focus:outline-hidden focus:border-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Package Inclusions (comma-separated)
                </label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={e => setFeaturesInput(e.target.value)}
                  placeholder="3D Photorealistic VR, German Soft-Close, 10-Yr Guarantee"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={enableEnquiry}
                    onChange={e => setEnableEnquiry(e.target.checked)}
                    className="rounded text-[#ea580c]"
                  />
                  <span>Enable Online Consultation Enquiry Button</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={enableWhatsApp}
                    onChange={e => setEnableWhatsApp(e.target.checked)}
                    className="rounded text-[#059669]"
                  />
                  <span>Enable Direct WhatsApp Chat Button</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 rounded-sm border border-slate-300 text-slate-600 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  {editingServiceId ? "Update Service Package" : "Save Service & Publish Live"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Add / Edit Top Navigation Menu */}
      {showMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                {editingMenuId ? "Edit Navigation Menu" : "Add Top Navigation Menu"}
              </h3>
              <button onClick={() => setShowMenuModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Menu Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={menuTitle}
                  onChange={e => setMenuTitle(e.target.value)}
                  placeholder="e.g. Commercial Fitouts"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={menuOrder}
                    onChange={e => setMenuOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={menuActive}
                      onChange={e => setMenuActive(e.target.checked)}
                      className="accent-[#1e3a8a] w-4 h-4"
                    />
                    Visible on Navbar
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMenuModal(false)}
                  className="px-3 py-1.5 rounded-sm border border-slate-300 text-slate-600 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm bg-[#1e3a8a] text-white text-xs font-black uppercase cursor-pointer"
                >
                  {editingMenuId ? "Update Menu" : "Save Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: Add / Edit Submenu */}
      {showSubmenuModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                {editingSubmenuId
                  ? "Edit Submenu"
                  : `Add Submenu to ${menus.find(m => m.id === selectedMenuId)?.title || "Menu"}`}
              </h3>
              <button onClick={() => setShowSubmenuModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmenu} className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Submenu Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={submenuTitle}
                  onChange={e => setSubmenuTitle(e.target.value)}
                  placeholder="e.g. Italian Marble Living Revamps"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={submenuDesc}
                  onChange={e => setSubmenuDesc(e.target.value)}
                  placeholder="Optional description for dropdown tooltip"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={submenuOrder}
                    onChange={e => setSubmenuOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={submenuActive}
                      onChange={e => setSubmenuActive(e.target.checked)}
                      className="accent-[#ea580c] w-4 h-4"
                    />
                    Active Submenu
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmenuModal(false)}
                  className="px-3 py-1.5 rounded-sm border border-slate-300 text-slate-600 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm bg-[#ea580c] text-white text-xs font-black uppercase cursor-pointer"
                >
                  {editingSubmenuId ? "Update Submenu" : "Add Submenu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
