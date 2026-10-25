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
  const address = company?.address || '#98, 1st Main, 4th Cross, Manjunatha Nagar, Rajajinagar, Bengaluru - 560010';

  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-16 pb-10 border-t-4 border-[#ea580c]">
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
                <p className="text-xs text-[#ea580c] font-bold uppercase tracking-wider">CONSTRUCTION AND INTERIORS</p>
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
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#10b981] text-white text-xs font-bold hover:bg-[#059669] transition-colors shadow-sm"
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
                { name: 'Architectural Construction', color: 'bg-[#38bdf8]' },
                { name: 'Modern Courtyards & Landscaping', color: 'bg-[#10b981]' },
                { name: 'Luxury Interior Design', color: 'bg-[#ec4899]' },
                { name: 'Modern Timber Decks & Patios', color: 'bg-[#f97316]' },
                { name: 'Villa Renovation & Remodeling', color: 'bg-[#ef4444]' }
              ].map((s) => (
                <li key={s.name}>
                  <button 
                    onClick={() => setActivePage('projects')}
                    className="hover:text-white transition-colors text-slate-400 flex items-center gap-2 cursor-pointer"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
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
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#10b981] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
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
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Get an accurate 3D concept layout and budget calculation tailored to your space.
            </p>
            <button
              onClick={() => setActivePage('contact')}
              className="w-full py-2.5 rounded-sm bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              Contact Our Engineers <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Clean, Streamlined Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
            <span>© 2026 Veyra's Construction and Interiors. All Rights Reserved.</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-[#38bdf8] font-medium">Maintained by AalgoLabs</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button 
              onClick={() => setActivePage('services')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Services
            </button>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => setActivePage('projects')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Portfolio
            </button>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => setActivePage('contact')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
