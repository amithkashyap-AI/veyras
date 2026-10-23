import React, { useState } from 'react';
import { LogIn, LogOut, User, Lock, Heart, Bookmark, 
  Building2, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Menu, 
  X, 
  PlusCircle, 
  LayoutDashboard,
  Home,
  Layers,
  Calculator,
  Mail
} from 'lucide-react';
import { CompanySetting } from '../../types';

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
  onOpenAdminLogin,
  onChangePassword,
  onLogout,
  wishlistCount = 0,
  onOpenWishlist
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const phone = company?.phone || '089213 36363';
  const whatsapp = company?.whatsapp || '089213 36363';
  const address = company?.address || '#98, 1Main , 4th Cross , Manjunatha Nagar, Rajainagar-560010, Bengaluru, Karnataka';
  const isAdmin = currentUser && (currentUser.role === 'ADMIN' || currentUser.email?.includes('admin'));

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white">
      {/* Top Contact Bar (Blue & Green Accents) */}
      <div className="bg-[#1e3a8a] text-white text-xs py-2 px-4 border-b border-[#172e6b]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex flex-wrap items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
              {address}
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-200">
              <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
              Mon - Sat: 9:00 AM - 7:30 PM
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* WhatsApp direct click (Green) */}
            <a 
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Veyra's%20Construction%20and%20Interiors,%20I%20would%20like%20to%20enquire%20about%20a%20project`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#10b981] hover:bg-[#059669] text-white font-bold transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: {whatsapp}</span>
            </a>

            <a 
              href={`tel:${phone}`}
              className="hidden sm:flex items-center gap-1.5 hover:text-[#38bdf8] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>{phone}</span>
            </a>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/20">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-white/15 px-2.5 py-1 rounded-sm border border-white/25">
                  <User className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span className="max-w-[140px] truncate">{currentUser.email || currentUser.username || currentUser.name || 'User'}</span>
                  {currentUser.role === 'ADMIN' || (currentUser.email && currentUser.email.includes('admin')) ? (
                    <span className="text-[9px] bg-[#dc2626] text-white px-1.5 py-0.2 rounded-xs font-black uppercase tracking-wider">ADMIN</span>
                  ) : currentUser.mustChangePassword ? (
                    <span className="text-[9px] bg-[#ea580c] text-white px-1.5 py-0.2 rounded-xs font-black uppercase tracking-wider animate-pulse">SET PWD</span>
                  ) : (
                    <span className="text-[9px] bg-[#059669] text-white px-1.5 py-0.2 rounded-xs font-black uppercase tracking-wider">VERIFIED</span>
                  )}
                </div>
                {onOpenWishlist && (
                  <button
                    type="button"
                    onClick={onOpenWishlist}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-[10px] font-bold transition-colors cursor-pointer shadow-xs"
                    title="View My Saved Wishlist"
                  >
                    <Heart className="w-3 h-3 fill-white" />
                    <span>Wishlist ({wishlistCount})</span>
                  </button>
                )}
                {onChangePassword && (
                  <button
                    type="button"
                    onClick={onChangePassword}
                    className={`hidden sm:inline-flex px-2 py-1 rounded-xs text-[10px] font-bold transition-colors cursor-pointer ${
                      currentUser.mustChangePassword
                        ? "bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-xs font-black animate-pulse"
                        : "bg-white/15 hover:bg-white/25 text-white"
                    }`}
                    title="Set or Change Password"
                  >
                    Change Password
                  </button>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-2 py-1 rounded-xs bg-red-600/80 hover:bg-red-600 text-white text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Sign Out"
                >
                  <LogOut className="w-2.5 h-2.5" /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Normal User Sign In / Register (Email OTP Only - No Admin visible) */}
                <button
                  type="button"
                  onClick={onOpenUserLogin || onOpenLogin}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                  title="Sign In or Register with Email OTP to contact studio or post ratings"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>User Login / Register</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Main Navigation Tier */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo from user attachment */}
            <div 
              onClick={() => setActivePage('home')}
              className="flex items-center gap-3 cursor-pointer group py-2"
            >
              <img 
                src="/assets/branding/veyras-logo.jpg" 
                alt="Veyra's Construction and Interiors" 
                className="w-14 h-14 object-contain rounded-full border-2 border-[#ea580c]/60 shadow-sm group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                  VEYRA'S
                </h1>
                <p className="text-[10px] font-bold tracking-widest text-[#ea580c] uppercase mt-0.5">
                  CONSTRUCTION AND INTERIORS
                </p>
                <p className="text-[9px] text-slate-500 font-medium tracking-wide">
                  BUILDING SPACES • CREATING LIFESTYLES
                </p>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActivePage('home')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  activePage === 'home' ? 'bg-[#1e3a8a] text-white' : 'text-slate-700 hover:text-[#1e3a8a] hover:bg-slate-50'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => setActivePage('services')}
                className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1 ${
                  activePage === 'services' ? 'bg-[#1e3a8a] text-white' : 'text-slate-700 hover:text-[#1e3a8a] hover:bg-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
                Our Services
              </button>

              <button
                onClick={() => setActivePage('projects')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  activePage === 'projects' ? 'bg-[#1e3a8a] text-white' : 'text-slate-700 hover:text-[#1e3a8a] hover:bg-slate-50'
                }`}
              >
                Projects & Designs
              </button>

              <button
                onClick={() => setActivePage('estimator')}
                className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1 ${
                  activePage === 'estimator' ? 'bg-[#1e3a8a] text-white' : 'text-slate-700 hover:text-[#1e3a8a] hover:bg-slate-50'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-[#ea580c]" />
                Cost Estimator
              </button>

              <button
                onClick={() => setActivePage('contact')}
                className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1 ${
                  activePage === 'contact' ? 'bg-[#1e3a8a] text-white' : 'text-slate-700 hover:text-[#1e3a8a] hover:bg-slate-50'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#059669]" />
                Contact Us
              </button>

              {isAdmin && (
                <button
                  onClick={() => setActivePage('dashboard')}
                  className={`px-3 py-2 rounded-md transition-colors flex items-center gap-1 ${
                    activePage === 'dashboard' ? 'bg-[#ea580c] text-white' : 'text-slate-700 hover:text-[#ea580c] hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin Dashboard
                </button>
              )}
            </nav>

            {/* Quick Action Button */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onOpenEnquiry}
                className="px-5 py-2.5 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Book Consultation
              </button>
            </div>

            {/* Mobile menu hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={onOpenEnquiry}
                className="px-3 py-1.5 rounded-sm bg-[#ea580c] text-white text-[11px] font-bold"
              >
                Enquire
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-md"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 text-sm font-semibold">
          <button 
            onClick={() => { setActivePage('home'); setMobileOpen(false); }}
            className="w-full text-left py-2 px-3 rounded hover:bg-slate-100"
          >
            Home
          </button>
          <button 
            onClick={() => { setActivePage('services'); setMobileOpen(false); }}
            className="w-full text-left py-2 px-3 rounded hover:bg-slate-100 font-bold text-[#1e3a8a]"
          >
            Our Services
          </button>
          <button 
            onClick={() => { setActivePage('projects'); setMobileOpen(false); }}
            className="w-full text-left py-2 px-3 rounded hover:bg-slate-100"
          >
            Projects & Designs
          </button>
          <button 
            onClick={() => { setActivePage('estimator'); setMobileOpen(false); }}
            className="w-full text-left py-2 px-3 rounded hover:bg-slate-100 text-[#ea580c]"
          >
            Cost Estimator
          </button>
          <button 
            onClick={() => { setActivePage('contact'); setMobileOpen(false); }}
            className="w-full text-left py-2 px-3 rounded hover:bg-slate-100 text-[#059669]"
          >
            Contact Us
          </button>
          {isAdmin && (
            <button 
              onClick={() => { setActivePage('dashboard'); setMobileOpen(false); }}
              className="w-full text-left py-2 px-3 rounded bg-slate-900 text-white"
            >
              Control Dashboard
            </button>
          )}

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            {currentUser ? (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 px-3 flex items-center justify-between">
                  <span>Logged in as: {currentUser.email || currentUser.username}</span>
                </div>
                {onChangePassword && (
                  <button 
                    onClick={() => { onChangePassword(); setMobileOpen(false); }}
                    className="w-full text-left py-2 px-3 rounded bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                  >
                    Change / Set Password
                  </button>
                )}
                <button 
                  onClick={() => { if (onLogout) onLogout(); setMobileOpen(false); }}
                  className="w-full text-left py-2 px-3 rounded bg-red-50 text-red-600 text-xs font-bold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => { if (onOpenUserLogin) onOpenUserLogin(); else if (onOpenLogin) onOpenLogin(); setMobileOpen(false); }}
                  className="w-full py-2 px-3 rounded bg-[#ea580c] text-white text-xs font-bold text-center"
                >
                  User Sign In / Register (Email OTP)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
