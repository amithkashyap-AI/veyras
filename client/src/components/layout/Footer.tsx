import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, ArrowRight, ShieldCheck, Lock, KeyRound, ShieldAlert, UserCheck, Database, Cpu } from 'lucide-react';
import { CompanySetting } from '../../types';

interface FooterProps {
  setActivePage: (page: string) => void;
  company?: CompanySetting | null;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, company }) => {
  const phone = company?.phone || '089213 36363';
  const whatsapp = company?.whatsapp || '089213 36363';
  const email = company?.email || 'contact@veyrasinteriors.com';
  const address = company?.address || '#98, 1Main , 4th Cross , Manjunatha Nagar, Rajainagar-560010, Bengaluru, Karnataka';

  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-16 pb-12 border-t-4 border-[#ea580c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/branding/veyras-logo.jpg" 
                alt="Veyra's Construction" 
                className="w-12 h-12 rounded-full border border-[#ea580c]"
              />
              <div>
                <h3 className="font-extrabold text-white text-lg tracking-wider">VEYRA'S</h3>
                <p className="text-[10px] text-[#ea580c] font-bold uppercase">CONSTRUCTION AND INTERIORS</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leading turnkey architectural construction, luxury residential interiors, modern landscaped courtyards, and bespoke timber patio spaces.
            </p>
            <div className="pt-1">
              <a 
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-sm bg-[#10b981] text-white text-xs font-bold hover:bg-[#059669] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp: {whatsapp}
              </a>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Our Expertise
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Architectural Construction', color: 'text-[#38bdf8]' },
                { name: 'Modern Courtyards & Landscaping', color: 'text-[#10b981]' },
                { name: 'Luxury Interior Design', color: 'text-[#ec4899]' },
                { name: 'Modern Timber Decks & Patios', color: 'text-[#f97316]' },
                { name: 'Villa Renovation & Remodeling', color: 'text-[#ef4444]' }
              ].map((s) => (
                <li key={s.name}>
                  <button 
                    onClick={() => setActivePage('projects')}
                    className="hover:text-white transition-colors text-slate-400 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${s.color.replace('text-', 'bg-')}`} />
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Office & Studio
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#38bdf8] shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white">{phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#10b981] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ec4899] shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:30 PM</span>
              </li>
            </ul>
          </div>

          {/* Quick Consultation Request */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Free Site Consultation
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Get an accurate 3D concept layout and budget calculation for your space.
            </p>
            <button
              onClick={() => setActivePage('contact')}
              className="w-full py-2.5 rounded-sm bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Contact Our Engineers <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Single-Line Unified Footer Bar */}
        <div className="pt-8 border-t border-slate-800/80">
          <div 
            className="flex flex-nowrap items-center justify-between gap-4 text-xs text-slate-400 overflow-x-auto py-1 scrollbar-none"
            style={{ whiteSpace: 'nowrap', flexWrap: 'nowrap' }}
          >
            <div 
              className="flex flex-nowrap items-center gap-2.5 shrink-0"
              style={{ whiteSpace: 'nowrap', flexWrap: 'nowrap' }}
            >
              <span className="shrink-0">© 2026 Veyra's Construction and Interiors. All Rights Reserved.</span>
              <span className="text-slate-600 shrink-0">•</span>
              <span className="text-[#38bdf8] font-bold shrink-0">
                Maintained by AalgoLabs (OPC) PVT. LTD.
              </span>
              <span className="text-slate-600 shrink-0">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-300 bg-slate-900/90 px-2.5 py-0.5 rounded border border-slate-700/60 font-medium shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                <span>Secured with TLS 256-Bit SSL, Timed OTP (600s), Mandatory Password & RBAC Protection</span>
              </span>
            </div>

            <div 
              className="flex flex-nowrap items-center gap-3 text-slate-500 shrink-0 pl-4"
              style={{ whiteSpace: 'nowrap', flexWrap: 'nowrap' }}
            >
              <button onClick={() => setActivePage('services')} className="hover:text-slate-300 transition-colors cursor-pointer shrink-0">
                Services
              </button>
              <span className="text-slate-700 shrink-0">•</span>
              <button onClick={() => setActivePage('projects')} className="hover:text-slate-300 transition-colors cursor-pointer shrink-0">
                Portfolio
              </button>
              <span className="text-slate-700 shrink-0">•</span>
              <button onClick={() => setActivePage('contact')} className="hover:text-slate-300 transition-colors cursor-pointer shrink-0">
                Contact
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
