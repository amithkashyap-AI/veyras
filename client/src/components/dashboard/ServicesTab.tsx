import React, { useState, useEffect } from "react";
import { 
  Layers, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  X, 
  MessageCircle, 
  Phone, 
  FolderPlus, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Service, NavMenu, NavSubmenu } from "../../types";
import { api } from "../../services/api";

interface ServicesTabProps {
  onRefreshAll?: () => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({ onRefreshAll }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [menus, setMenus] = useState<NavMenu[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Service Modal State
  const [showAddService, setShowAddService] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Luxury Interior Design");
  const [pricePerSqFt, setPricePerSqFt] = useState<number>(1850);
  const [priceUnit, setPriceUnit] = useState("per sq.ft");
  const [minAreaSqFt, setMinAreaSqFt] = useState<number>(800);
  const [durationWeeks, setDurationWeeks] = useState<number>(8);
  const [imageUrl, setImageUrl] = useState("/assets/projects/project-patio.jpg");
  const [description, setDescription] = useState("");
  const [featuresInput, setFeaturesInput] = useState("3D Photorealistic Renders, German Soft-Close Hardware, Marine Grade BWP Ply, 5-Year Guarantee");
  const [enableEnquiry, setEnableEnquiry] = useState(true);
  const [enableWhatsApp, setEnableWhatsApp] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [submenuId, setSubmenuId] = useState("");

  // Add Menu Modal State
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [menuTitle, setMenuTitle] = useState("");
  const [menuIcon, setMenuIcon] = useState("Layers");

  // Add Submenu Modal State
  const [showAddSubmenu, setShowAddSubmenu] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [submenuTitle, setSubmenuTitle] = useState("");
  const [submenuDesc, setSubmenuDesc] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, m] = await Promise.all([
        api.getServices(),
        api.getMenus()
      ]);
      setServices(s);
      setMenus(m);
    } catch (err) {
      console.error("Failed to load services & menus:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !pricePerSqFt) {
      alert("Please enter service title and price per sq.ft");
      return;
    }

    try {
      const features = featuresInput.split(",").map(f => f.trim()).filter(Boolean);
      await api.createService({
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
        submenuId: submenuId || undefined
      });

      setShowAddService(false);
      resetServiceForm();
      alert("✅ New Service created successfully! Live on website.");
      loadData();
      if (onRefreshAll) onRefreshAll();
    } catch (err: any) {
      alert("Failed to create service: " + err.message);
    }
  };

  const resetServiceForm = () => {
    setTitle("");
    setSubtitle("");
    setDescription("");
    setPricePerSqFt(1850);
    setFeaturesInput("3D Photorealistic Renders, German Soft-Close Hardware, Marine Grade BWP Ply, 5-Year Guarantee");
    setSubmenuId("");
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      alert("Service removed from PostgreSQL");
      if (onRefreshAll) onRefreshAll();
    } catch (err: any) {
      alert("Failed to delete service");
    }
  };

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuTitle) return;
    try {
      await api.createMenu({ title: menuTitle, icon: menuIcon });
      setShowAddMenu(false);
      setMenuTitle("");
      alert("✅ Navigation menu created!");
      loadData();
    } catch (err: any) {
      alert("Failed to create menu: " + err.message);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm("Delete this navigation menu and all its submenus?")) return;
    try {
      await api.deleteMenu(id);
      loadData();
    } catch (err: any) {
      alert("Failed to delete menu");
    }
  };

  const handleCreateSubmenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenuId || !submenuTitle) return;
    try {
      await api.createSubmenu(selectedMenuId, {
        title: submenuTitle,
        description: submenuDesc
      });
      setShowAddSubmenu(false);
      setSubmenuTitle("");
      setSubmenuDesc("");
      alert("✅ Submenu added!");
      loadData();
    } catch (err: any) {
      alert("Failed to create submenu");
    }
  };

  const handleDeleteSubmenu = async (id: string) => {
    if (!confirm("Delete this submenu?")) return;
    try {
      await api.deleteSubmenu(id);
      loadData();
    } catch (err: any) {
      alert("Failed to delete submenu");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#ea580c]" />
            Services, Menus & Per-Square-Foot Rates
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public services, menu hierarchies, price per sq.ft rate cards, WhatsApp triggers, and inclusions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddMenu(true)}
            className="px-3 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" /> + New Menu
          </button>
          <button
            type="button"
            onClick={() => setShowAddService(true)}
            className="px-4 py-2 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> + Add Service Package
          </button>
        </div>
      </div>

      {/* 2. Navigation Menus & Submenus Hierarchy Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Menu & Submenu Hierarchy ({menus.length} Menus)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Organized navigation structure displayed in public navbar dropdowns and filter bars
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {menus.map((menu) => (
            <div key={menu.id} className="p-4 rounded-md border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-xs text-[#1e3a8a] uppercase tracking-wide">
                    {menu.title}
                  </span>
                  <button
                    onClick={() => handleDeleteMenu(menu.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Menu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 mt-3">
                  {menu.submenus && menu.submenus.length > 0 ? (
                    menu.submenus.map((sub) => (
                      <div key={sub.id} className="text-xs bg-white p-2 rounded-xs border border-slate-200 flex items-center justify-between text-slate-700">
                        <span className="truncate">{sub.title}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-xs font-mono">
                            {sub._count ? sub._count.services : 0} pkgs
                          </span>
                          <button
                            onClick={() => handleDeleteSubmenu(sub.id)}
                            className="text-slate-300 hover:text-red-500 ml-1 cursor-pointer"
                            title="Delete Submenu"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-400 italic block">No submenus yet</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedMenuId(menu.id);
                  setShowAddSubmenu(true);
                }}
                className="mt-3 w-full py-1.5 rounded-xs bg-white hover:bg-slate-100 border border-slate-200 text-[#ea580c] text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
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
              Active Service Packages & Price-Per-Sq.Ft Rates ({services.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live rate cards rendered on the public website with online enquiry and WhatsApp chat buttons
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
            {services.map((service) => (
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
                    <div className="absolute top-2 left-2 bg-[#1e3a8a] text-white px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase">
                      {service.category}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2.5 py-1 rounded-xs font-mono font-black text-sm">
                      ₹{service.pricePerSqFt.toLocaleString("en-IN")} <span className="text-[10px] text-slate-300 font-normal">/{service.priceUnit}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-black text-sm text-slate-900 leading-snug">
                      {service.title}
                    </h4>
                    {service.subtitle && (
                      <p className="text-[11px] font-bold text-[#ea580c] mt-0.5">
                        {service.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                      {service.features && service.features.slice(0, 3).map((feat, i) => (
                        <span key={i} className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-xs font-medium">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1 text-[#059669]">
                        <MessageCircle className="w-3 h-3" /> WhatsApp: {service.enableWhatsApp ? "Active" : "Off"}
                      </span>
                      <span>Min: {service.minAreaSqFt} sq.ft</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-xs">
                    Live on Portal
                  </span>
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
            ))}
          </div>
        )}
      </div>

      {/* 4. MODAL: Add New Service Package */}
      {showAddService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 my-8 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                Create New Service Package & Pricing
              </h3>
              <button 
                onClick={() => setShowAddService(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Service Package Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Modern Italian Interior Package"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Discipline / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-[#1e3a8a]"
                  >
                    <option value="Architectural Construction">Architectural Construction</option>
                    <option value="Luxury Interior Design">Luxury Interior Design</option>
                    <option value="Courtyards & Landscaping">Courtyards & Landscaping</option>
                    <option value="Renovation & Fitouts">Renovation & Fitouts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Tagline / Subtitle
                </label>
                <input 
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Italian Marble, Concealed Renders & 5-Year Warranty"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs focus:outline-hidden focus:border-[#1e3a8a]"
                />
              </div>

              {/* Pricing Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-orange-50/60 rounded-sm border border-orange-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#ea580c] mb-1">
                    Price (INR) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number"
                    min={100}
                    value={pricePerSqFt}
                    onChange={(e) => setPricePerSqFt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-orange-300 text-sm font-black text-[#1e3a8a] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Price Unit
                  </label>
                  <input 
                    type="text"
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    placeholder="per sq.ft"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Min Area (Sq. Ft)
                  </label>
                  <input 
                    type="number"
                    value={minAreaSqFt}
                    onChange={(e) => setMinAreaSqFt(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Hero Image URL
                </label>
                <input 
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                />
                <div className="mt-1 flex gap-2 text-[10px] text-slate-500">
                  <span>Quick Presets:</span>
                  <button type="button" onClick={() => setImageUrl("/assets/projects/project-patio.jpg")} className="text-blue-600 underline">Patio</button>
                  <button type="button" onClick={() => setImageUrl("/assets/projects/project-zen-courtyard.jpg")} className="text-blue-600 underline">Courtyard</button>
                  <button type="button" onClick={() => setImageUrl("/assets/projects/project-stone-villa.jpg")} className="text-blue-600 underline">Villa</button>
                  <button type="button" onClick={() => setImageUrl("/assets/projects/project-kitchen.jpg")} className="text-blue-600 underline">Kitchen</button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Description
                </label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of materials, workmanship, and engineering scope..."
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs focus:outline-hidden focus:border-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Package Inclusions (comma-separated)
                </label>
                <input 
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="3D Photorealistic VR, German Soft-Close, 10-Yr Guarantee"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input 
                    type="checkbox" 
                    checked={enableEnquiry} 
                    onChange={(e) => setEnableEnquiry(e.target.checked)} 
                    className="rounded text-[#ea580c]"
                  />
                  <span>Enable Online Consultation Enquiry Button</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input 
                    type="checkbox" 
                    checked={enableWhatsApp} 
                    onChange={(e) => setEnableWhatsApp(e.target.checked)} 
                    className="rounded text-[#059669]"
                  />
                  <span>Enable Direct WhatsApp Chat Button</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="px-4 py-2 rounded-sm border border-slate-300 text-slate-600 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Save Service & Publish Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Add New Navigation Menu */}
      {showAddMenu && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Add Top Navigation Menu
              </h3>
              <button onClick={() => setShowAddMenu(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMenu} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Menu Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  value={menuTitle}
                  onChange={(e) => setMenuTitle(e.target.value)}
                  placeholder="e.g. Commercial Fitouts"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
                  required
                  autoFocus
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMenu(false)}
                  className="px-3 py-1.5 rounded-sm border border-slate-300 text-slate-600 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm bg-[#1e3a8a] text-white text-xs font-black uppercase"
                >
                  Save Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: Add Submenu */}
      {showAddSubmenu && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Add Submenu to {menus.find(m => m.id === selectedMenuId)?.title}
              </h3>
              <button onClick={() => setShowAddSubmenu(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmenu} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Submenu Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  value={submenuTitle}
                  onChange={(e) => setSubmenuTitle(e.target.value)}
                  placeholder="e.g. Italian Marble Living Revamps"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                  Description (Optional)
                </label>
                <input 
                  type="text"
                  value={submenuDesc}
                  onChange={(e) => setSubmenuDesc(e.target.value)}
                  placeholder="Brief description for SEO and previews"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubmenu(false)}
                  className="px-3 py-1.5 rounded-sm border border-slate-300 text-slate-600 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm bg-[#ea580c] text-white text-xs font-black uppercase"
                >
                  Save Submenu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
