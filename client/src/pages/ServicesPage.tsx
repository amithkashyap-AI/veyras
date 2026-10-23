import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Layers, 
  Home, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  Sparkles, 
  Clock, 
  Maximize2, 
  ShieldCheck, 
  Phone, 
  MapPin,
  Search,
  Filter,
  Check
} from "lucide-react";
import { Service, NavMenu, CompanySetting } from "../types";
import { api } from "../services/api";

interface ServicesPageProps {
  company?: CompanySetting | null;
  onOpenEnquiry: (prefill?: any) => void;
  initialCategory?: string;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  company,
  onOpenEnquiry,
  initialCategory = "all"
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [menus, setMenus] = useState<NavMenu[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [loading, setLoading] = useState<boolean>(true);

  // Estimator widget state
  const [calcServiceId, setCalcServiceId] = useState<string>("");
  const [calcArea, setCalcArea] = useState<number>(1200);

  const phone = company?.phone || "089213 36363";
  const whatsapp = company?.whatsapp || "089213 36363";
  const address = company?.address || "#98, 1Main , 4th Cross , Manjunatha Nagar, Rajainagar-560010, Bengaluru, Karnataka";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, menusData] = await Promise.all([
          api.getServices(),
          api.getMenus()
        ]);
        setServices(servicesData);
        setMenus(menusData);
        if (servicesData.length > 0 && !calcServiceId) {
          setCalcServiceId(servicesData[0].id);
        }
      } catch (err) {
        console.error("Failed to load services data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { label: "All Services", value: "all" },
    { label: "Architectural Construction", value: "Architectural Construction" },
    { label: "Luxury Interior Design", value: "Luxury Interior Design" },
    { label: "Courtyards & Landscaping", value: "Courtyards & Landscaping" },
    { label: "Renovation & Fitouts", value: "Renovation & Fitouts" }
  ];

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === "all" || s.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.subtitle && s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedCalcService = services.find(s => s.id === calcServiceId) || services[0];
  const calculatedEstimate = selectedCalcService ? selectedCalcService.pricePerSqFt * (calcArea || 0) : 0;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-r from-[#1e3a8a] via-[#172e6b] to-[#0f172a] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#ea580c] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#38bdf8] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            Turnkey Construction & Luxury Interiors
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Our Architectural & Interior Services
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-medium leading-relaxed mb-6">
            Transparent price-per-square-foot execution. From seismic structural foundations to imported marble finishes, bespoke Zen courtyards, and German modular kitchens.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-sm border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
              {address}
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-sm border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
              10-Year Structural Warranty
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-sm border border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
              On-Time Handover Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC MENUS / SUBMENUS PILLS & SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-5 border border-slate-200">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={"px-3.5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all cursor-pointer " + (
                    selectedCategory === cat.value
                      ? "bg-[#1e3a8a] text-white shadow-md scale-102"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services or features..."
                className="w-full pl-9 pr-3 py-2 rounded-sm border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#1e3a8a]"
              />
            </div>
          </div>

          {/* Submenus shortcuts */}
          {menus.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Filter className="w-3 h-3 text-[#ea580c]" /> Disciplines:
              </span>
              {menus.map((m) => (
                <div key={m.id} className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-xs">
                  <span className="font-semibold text-[#1e3a8a]">{m.title}</span>
                  <span className="text-[10px] text-slate-400">({m.submenus ? m.submenus.length : 0})</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 3. SERVICES LISTING GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Available Service Packages ({filteredServices.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent rate cards with verified materials and turnkey site supervision
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => onOpenEnquiry()}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" /> Book Free Site Visit
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-lg p-5 border border-slate-200 animate-pulse space-y-4">
                <div className="w-full h-48 bg-slate-200 rounded-sm" />
                <div className="h-4 bg-slate-200 w-3/4 rounded-xs" />
                <div className="h-3 bg-slate-200 w-1/2 rounded-xs" />
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-slate-200">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No services match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting \"All Services\" or clearing your search term.</p>
            <button
              type="button"
              onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
              className="mt-4 px-4 py-2 bg-[#1e3a8a] text-white text-xs font-bold uppercase rounded-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const waMessage = encodeURIComponent(
                "Hello Veyras Construction and Interiors! I am interested in your " + service.title + " package (Rs." + service.pricePerSqFt.toLocaleString("en-IN") + " " + service.priceUnit + "). Please share more details and site inspection availability."
              );

              return (
                <div 
                  key={service.id}
                  className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-200 group"
                >
                  {/* Image & Price Per Sq.Ft Badge */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img 
                      src={service.imageUrl || "/assets/projects/project-patio.jpg"} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Category pill */}
                    <div className="absolute top-3 left-3 bg-[#1e3a8a]/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-xs text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {service.category}
                    </div>

                    {/* Submenu tag if available */}
                    {service.submenu && (
                      <div className="absolute top-3 right-3 bg-white/95 text-slate-800 px-2.5 py-1 rounded-xs text-[10px] font-bold border border-slate-200 shadow-sm">
                        {service.submenu.title}
                      </div>
                    )}

                    {/* Prominent Price Tag Banner */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-300 block">
                          Turnkey Rate
                        </span>
                        <div className="flex items-baseline gap-1 text-white">
                          <span className="text-2xl font-black tracking-tight text-[#f97316]">
                            ₹{service.pricePerSqFt.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            /{service.priceUnit || "per sq.ft"}
                          </span>
                        </div>
                      </div>

                      {service.durationWeeks && (
                        <div className="text-right text-[11px] text-slate-300 font-medium">
                          <span className="block text-[9px] uppercase tracking-wider text-slate-400">Duration</span>
                          <span>{service.durationWeeks} Weeks</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#1e3a8a] transition-colors leading-snug">
                        {service.title}
                      </h3>
                      
                      {service.subtitle && (
                        <p className="text-xs font-bold text-[#ea580c] mt-0.5">
                          {service.subtitle}
                        </p>
                      )}

                      <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Inclusions / Highlights */}
                      {service.features && service.features.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Package Inclusions:
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {service.features.slice(0, 4).map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                                <span className="text-[11px] font-medium leading-snug">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: Enquiry & WhatsApp */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                      {service.enableEnquiry && (
                        <button
                          type="button"
                          onClick={() => onOpenEnquiry({
                            project: {
                              id: service.id,
                              title: service.title,
                              approxPrice: service.pricePerSqFt * (service.minAreaSqFt || 1000)
                            },
                            serviceName: service.title,
                            approxPrice: "₹" + service.pricePerSqFt + " / sq.ft",
                            areaSqFt: service.minAreaSqFt || 1000,
                            preferredStyle: service.category
                          })}
                          className="w-full py-2.5 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Book Consultation / Enquiry</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {service.enableWhatsApp && (
                        <a
                          href={"https://wa.me/" + whatsapp.replace(/[^0-9]/g, "") + "?text=" + waMessage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-sm bg-[#10b981] hover:bg-[#059669] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat via WhatsApp</span>
                        </a>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* 4. INSTANT TURNKEY COST ESTIMATOR BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-slate-900 to-[#1e3a8a] text-white rounded-xl p-6 sm:p-8 shadow-xl border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            <div className="lg:col-span-1">
              <span className="text-[10px] font-bold tracking-widest text-[#ea580c] uppercase">
                Interactive Cost Estimator
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1">
                Estimate Your Project
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Enter your approximate built-up area to calculate the budget for your home or villa.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Select Package
                </label>
                <select
                  value={calcServiceId}
                  onChange={(e) => setCalcServiceId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white focus:outline-hidden focus:border-[#ea580c]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} (₹{s.pricePerSqFt}/sq.ft)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Area (Sq. Ft)
                </label>
                <input 
                  type="number"
                  min={100}
                  step={50}
                  value={calcArea}
                  onChange={(e) => setCalcArea(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-sm py-2 px-3 text-xs text-white focus:outline-hidden focus:border-[#ea580c]"
                />
              </div>

              <div className="bg-white/10 p-3 rounded-sm border border-white/15 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">
                  Approx. Turnkey Cost
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#f97316]">
                  ₹{calculatedEstimate.toLocaleString("en-IN")}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenEnquiry({
                    serviceName: selectedCalcService ? selectedCalcService.title : "Turnkey Package",
                    areaSqFt: calcArea,
                    approxPrice: "₹" + calculatedEstimate.toLocaleString("en-IN")
                  })}
                  className="mt-1 text-[10px] font-bold text-white hover:text-[#38bdf8] underline block mx-auto cursor-pointer"
                >
                  Book Site Visit with Estimate →
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
