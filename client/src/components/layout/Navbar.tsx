import React, { useState, useEffect } from 'react';
import {
  LogOut,
  User,
  Heart,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  Layers,
  Calculator,
  Mail,
  ChevronDown,
  Home,
  Building2,
  KeyRound
} from 'lucide-react';
import { CompanySetting, NavMenu } from '../../types';
import { api } from '../../services/api';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  company?: CompanySetting | null;
  onOpenEnquiry: () => void;
  currentUser?: any | null;
  onOpenLogin?: () => void;
  onOpenUserLogin?: () => void;
  onOpenAdminLogin?: () => void;
  onChangePassword?: () => void;
  onLogout?: () => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activePage, 
  setActivePage, 
  company,
  onOpenEnquiry,
  currentUser,
  onOpenLogin,
  onOpenUserLogin,
  onChangePassword,
  onLogout,
  wishlistCount = 0,
  onOpenWishlist
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navMenus, setNavMenus] = useState<NavMenu[]>([]);

  useEffect(() => {
    api.getMenus()
      .then(menus => setNavMenus(menus.filter(m => m.isActive)))
      .catch(() => {});
  }, [activePage]);

  const phone = company?.phone || '089213 36363';
  const whatsapp = company?.whatsapp || '089213 36363';
  const address = company?.address || '#98, 1st Main, 4th Cross, Manjunatha Nagar, Rajajinagar, Bengaluru - 560010';
  const isAdmin = currentUser && (['ADMIN', 'MANAGER', 'ARCHITECT', 'EDITOR'].includes(currentUser.role) || currentUser.email?.includes('admin'));

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      {/* Top Contact & User Bar */}
      <div className="bg-[#1e3a8a] text-white text-xs py-2 px-3 sm:px-6 border-b border-[#172e6b]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Address & Hours (Hidden on small phones to keep top bar compact, shown in mobile drawer) */}
          <div className="hidden md:flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-200 truncate max-w-md lg:max-w-xl">
              <MapPin className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              <span className="truncate">{address}</span>
            </span>
            <span className="hidden xl:flex items-center gap-1.5 text-slate-200 shrink-0">
              <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
              {company?.workingHours || 'Mon - Sat: 9:00 AM - 7:30 PM'}
            </span>
          </div>

          {/* Action Pills: WhatsApp, Phone & Auth Controls */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <a 
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Veyra's%20Construction%20and%20Interiors,%20I%20would%20like%20to%20enquire%20about%20a%20project`}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#10b981] hover:bg-[#059669] text-white font-bold transition-colors cursor-pointer text-xs whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span>WhatsApp: {whatsapp}</span>
              </a>

              <a 
                href={`tel:${phone}`}
                className="hidden sm:inline-flex items-center gap-1 text-slate-200 hover:text-[#38bdf8] transition-colors text-xs font-semibold whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                <span>{phone}</span>
              </a>
            </div>

            {currentUser ? (
              <div className="flex flex-wrap items-center gap-1.5 sm:pl-2 sm:border-l border-white/20">
                <div className="inline-flex items-center gap-1.5 text-xs text-white bg-white/10 px-2 py-1 rounded-sm border border-white/20">
                  <User className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                  <span className="max-w-[100px] sm:max-w-[140px] truncate font-semibold">
                    {currentUser.name || currentUser.email}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
                      {currentUser.role || 'Admin'}
                    </span>
                  )}
                </div>

                {onOpenWishlist && (
                  <button
                    type="button"
                    onClick={onOpenWishlist}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                    title="View Saved Wishlist"
                  >
                    <Heart className="w-3 h-3 fill-white shrink-0" />
                    <span className="hidden sm:inline">Wishlist</span>
                    <span>({wishlistCount})</span>
                  </button>
                )}

                {onChangePassword && (
                  <button
                    type="button"
                    onClick={onChangePassword}
                    className="hidden lg:inline-flex px-2.5 py-1 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                    title="Change Password"
                  >
                    Change Password
                  </button>
                )}

                <button
                  type="button"
                  onClick={onLogout}
                  className="px-2.5 py-1 rounded-sm bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                  title="Sign Out"
                >
                  <LogOut className="w-3 h-3 shrink-0" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenUserLogin || onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Main Navigation Tier — Auto-height (min-h-20 py-2.5) so logo & text NEVER overflow */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[76px] py-2.5 gap-3">
            
            {/* Brand Logo & Title */}
            <div 
              onClick={() => { setActivePage('home'); setMobileOpen(false); }}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
            >
              <img 
                src={company?.logoUrl || "/assets/branding/veyras-logo.jpg"} 
                alt="Veyra's Construction and Interiors" 
                className="w-11 h-11 sm:w-13 sm:h-13 object-contain rounded-full border-2 border-[#ea580c]/60 shadow-xs group-hover:scale-105 transition-transform shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="flex flex-col justify-center">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-tight">
                  VEYRA'S
                </span>
                <span className="text-[10px] sm:text-xs font-extrabold tracking-wider text-[#ea580c] uppercase leading-tight">
                  CONSTRUCTION & INTERIORS
                </span>
                <span className="hidden sm:block text-[10px] text-slate-500 font-semibold tracking-wide leading-tight mt-0.5">
                  {company?.tagline || 'Building Spaces • Creating Lifestyles'}
                </span>
              </div>
            </div>

            {/* Desktop Nav Links — Single line whitespace-nowrap with clean spacing */}
            <nav className="hidden xl:flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider">
              <button
                onClick={() => setActivePage('home')}
                className={`px-3 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activePage === 'home' ? 'bg-[#1e3a8a] text-white' : 'text-slate-700 hover:text-[#1e3a8a] hover:bg-slate-100'
                }`}
              >
                Home
              </button>

              {/* Services with Dynamic Admin-Managed Menus Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => setActivePage('services')}
                  className={`px-3 py-2 rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activePage === 'services' ? 'bg-[#1e3a8a] text-white' : 'text-slate-700 hover:text-[#1e3a8a] hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                  <span>Our Services</span>
                  {navMenus.length > 0 && <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0" />}
                </button>

                {navMenus.length > 0 && (
                  <div className="absolute left-0 top-full pt-1 hidden group-hover:block z-50 w-72">
                    <div className="bg-white rounded-md shadow-xl border border-slate-200 p-3 space-y-2.5 normal-case">
                      {navMenus.map((menu) => (
                        <div key={menu.id} className="border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                          <div
                            onClick={() => setActivePage('services')}
                            className="text-xs font-black uppercase tracking-wider text-[#1e3a8a] hover:text-[#ea580c] cursor-pointer"
                          >
                            {menu.title}
                          </div>
                          {menu.submenus && menu.submenus.filter(s => s.isActive).length > 0 && (
                            <div className="mt-1 pl-2 space-y-1">
                              {menu.submenus.filter(s => s.isActive).map((sub) => (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => setActivePage('services')}
                                  className="block w-full text-left text-xs text-slate-600 hover:text-[#ea580c] font-semibold py-0.5 cursor-pointer"
                                >
                                  • {sub.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActivePage('projects')}
                className={`px-3 py-2 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activePage === 'projects' ? 'bg-[#1e3a8a] text-white' : 'text-slate-700 hover:text-[#1e3a8a] hover:bg-slate-100'
                }`}
              >
                Projects & Designs
              </button>

              <button
                onClick={() => setActivePage('estimator')}
                className={`px-3 py-2 rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activePage === 'estimator' ? 'bg-[#1e3a8a] text-white' : 'text-slate-700 hover:text-[#1e3a8a] hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
                <span>Cost Estimator</span>
              </button>

              <button
                onClick={() => setActivePage('contact')}
                className={`px-3 py-2 rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activePage === 'contact' ? 'bg-[#1e3a8a] text-white' : 'text-slate-700 hover:text-[#1e3a8a] hover:bg-slate-100'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                <span>Contact Us</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => setActivePage('dashboard')}
                  className={`px-3.5 py-2 rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    activePage === 'dashboard'
                      ? 'bg-[#ea580c] text-white shadow-xs'
                      : 'bg-orange-50 text-[#ea580c] border border-orange-200 hover:bg-[#ea580c] hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                  <span>Admin Dashboard</span>
                </button>
              )}
            </nav>

            {/* Right CTA & Mobile Menu Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              {isAdmin && activePage !== 'dashboard' && (
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="xl:hidden px-2.5 py-2 rounded-sm bg-slate-900 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
              )}

              <button
                onClick={onOpenEnquiry}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-extrabold uppercase tracking-wider shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Book Consultation</span>
                <span className="sm:hidden">Enquire</span>
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-white border-b-2 border-slate-200 px-4 py-4 space-y-2 shadow-xl max-h-[82vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <button 
              onClick={() => { setActivePage('home'); setMobileOpen(false); }}
              className={`w-full text-left py-2.5 px-3.5 rounded-md font-bold text-sm flex items-center gap-2.5 ${
                activePage === 'home' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" /> Home
            </button>

            <button 
              onClick={() => { setActivePage('services'); setMobileOpen(false); }}
              className={`w-full text-left py-2.5 px-3.5 rounded-md font-bold text-sm flex items-center gap-2.5 ${
                activePage === 'services' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 text-[#38bdf8] shrink-0" /> Our Services & Rates
            </button>

            <button 
              onClick={() => { setActivePage('projects'); setMobileOpen(false); }}
              className={`w-full text-left py-2.5 px-3.5 rounded-md font-bold text-sm flex items-center gap-2.5 ${
                activePage === 'projects' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#ea580c] shrink-0" /> Projects & Designs
            </button>

            <button 
              onClick={() => { setActivePage('estimator'); setMobileOpen(false); }}
              className={`w-full text-left py-2.5 px-3.5 rounded-md font-bold text-sm flex items-center gap-2.5 ${
                activePage === 'estimator' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              <Calculator className="w-4 h-4 text-[#ea580c] shrink-0" /> Cost Estimator
            </button>

            <button 
              onClick={() => { setActivePage('contact'); setMobileOpen(false); }}
              className={`w-full text-left py-2.5 px-3.5 rounded-md font-bold text-sm flex items-center gap-2.5 ${
                activePage === 'contact' ? 'bg-[#1e3a8a] text-white' : 'hover:bg-slate-100 text-slate-800'
              }`}
            >
              <Mail className="w-4 h-4 text-[#059669] shrink-0" /> Contact Us
            </button>

            {isAdmin && (
              <button 
                onClick={() => { setActivePage('dashboard'); setMobileOpen(false); }}
                className={`w-full text-left py-2.5 px-3.5 rounded-md font-bold text-sm flex items-center gap-2.5 ${
                  activePage === 'dashboard' ? 'bg-[#ea580c] text-white' : 'bg-slate-900 text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" /> Admin Control Dashboard
              </button>
            )}
          </div>

          {/* Dynamic Submenus inside Mobile Drawer */}
          {navMenus.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Service Categories
              </div>
              <div className="flex flex-wrap gap-1.5 px-2">
                {navMenus.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setActivePage('services'); setMobileOpen(false); }}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-[#1e3a8a] font-bold px-2.5 py-1 rounded-sm"
                  >
                    {m.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contact & Auth Footer in Mobile Drawer */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <div className="text-xs text-slate-500 px-2 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#1e3a8a] shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>

            {currentUser ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {onChangePassword && (
                  <button 
                    onClick={() => { onChangePassword(); setMobileOpen(false); }}
                    className="flex-1 py-2 px-3 rounded-sm bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> Change Password
                  </button>
                )}
                <button 
                  onClick={() => { if (onLogout) onLogout(); setMobileOpen(false); }}
                  className="flex-1 py-2 px-3 rounded-sm bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { if (onOpenUserLogin) onOpenUserLogin(); else if (onOpenLogin) onOpenLogin(); setMobileOpen(false); }}
                className="w-full py-2.5 px-3 rounded-sm bg-[#ea580c] text-white text-xs font-bold text-center"
              >
                User Sign In / Register (Email OTP)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
