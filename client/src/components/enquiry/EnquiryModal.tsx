import React, { useState } from 'react';
import { X, Send, MessageCircle, CheckCircle2, Building, Ruler, MapPin, Phone, User, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project } from '../../types';
import { api } from '../../services/api';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject?: Project | null;
  prefill?: any;
  currentUser?: any;
  onRequireAuth?: (pendingAction?: () => void, title?: string, desc?: string) => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  selectedProject,
  prefill,
  currentUser,
  onRequireAuth
}) => {
  if (!isOpen) return null;

  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');

  React.useEffect(() => {
    if (isOpen && currentUser) {
      if (currentUser.email) setClientEmail(currentUser.email);
      if (currentUser.name) setClientName(currentUser.name);
    }
  }, [isOpen, currentUser]);
  const [siteAddress, setSiteAddress] = useState('');
  const [city, setCity] = useState(selectedProject?.city || 'Hyderabad');
  const [propertyType, setPropertyType] = useState('Residential Villa');
  const [areaSqFt, setAreaSqFt] = useState<number>(selectedProject?.areaSqFt || prefill?.areaSqFt || 1200);
  const [approxBudget, setApproxBudget] = useState(
    selectedProject ? `₹${selectedProject.approxPrice.toLocaleString('en-IN')}` : (prefill?.approxBudget || '₹5,00,000 - ₹15,00,000')
  );
  const [preferredStyle, setPreferredStyle] = useState('Modern Minimalist');
  const [message, setMessage] = useState(
    selectedProject 
      ? `Interested in implementing the design: "${selectedProject.title}" at my property. Please schedule site visit.` 
      : 'Looking for turnkey interior design and construction services. Please contact me with quotation.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitEnquiryData = async () => {
    setIsSubmitting(true);
    try {
      await api.createEnquiry({
        projectId: selectedProject?.id,
        clientName: clientName || currentUser?.name || 'Client',
        clientPhone,
        clientEmail: currentUser?.email || clientEmail || 'client@example.com',
        siteAddress: siteAddress || 'Site Address to be verified during consultation',
        city,
        propertyType,
        areaSqFt: Number(areaSqFt),
        approxBudget,
        preferredStyle,
        message
      });

      confetti({ particleCount: 75, spread: 65 });
      setIsSuccess(true);
    } catch (err) {
      alert('Failed to send enquiry. Please contact directly on WhatsApp: 089213 36363');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !message) {
      alert('Please fill out your name, contact phone number, and requirements.');
      return;
    }

    if (!currentUser && onRequireAuth) {
      onRequireAuth(
        async () => {
          await submitEnquiryData();
        },
        "User Registration Required to Place Order / Enquiry",
        "Please register with your email address and verification code to submit your consultation order."
      );
      return;
    }

    await submitEnquiryData();
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Veyra's Construction and Interiors!%0A%0A*Name:* ${clientName || 'Client'}%0A*Phone:* ${clientPhone}%0A*Site City:* ${city}%0A*Address:* ${siteAddress}%0A*Property:* ${propertyType} (${areaSqFt} sq ft)%0A*Budget:* ${approxBudget}%0A*Requirements:* ${message}`
    );
    window.open(`https://wa.me/9108921336363?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-md max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-sans">
              Enquiry Received Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-bold text-slate-800">{clientName}</span>. Your design enquiry has been logged into our PostgreSQL CRM. Our project engineer will contact you shortly on <span className="font-bold text-slate-800">{clientPhone}</span>.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-5 py-2.5 rounded-sm bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> Message Directly on WhatsApp
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-sm bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c] bg-orange-50 px-2 py-0.5 rounded-sm">
                Project Consultation & Orders
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-sans">
                {selectedProject ? `Order Enquiry: ${selectedProject.title}` : 'Request Construction & Interior Consultation'}
              </h2>
              <p className="text-xs text-slate-500">
                Provide your site address and requirements for accurate cost estimation and site inspection.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    placeholder="e.g. Rajesh Varma"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-sm border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Contact Phone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="tel" 
                    placeholder="e.g. 089213 36363"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-sm border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Site City *
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Hyderabad, Bangalore, Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#1e3a8a]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#1e3a8a] bg-white"
                >
                  <option value="Residential Villa">Residential Villa</option>
                  <option value="Courtyard & Landscape">Courtyard & Landscape Garden</option>
                  <option value="Apartment / Penthouse">Apartment / Penthouse</option>
                  <option value="Commercial Office / Retail">Commercial Office / Retail</option>
                  <option value="Independent House Renovation">Independent House Renovation</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Site Address / Location Details *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text" 
                    placeholder="e.g. Plot 42, Road No. 12, Jubilee Hills"
                    value={siteAddress}
                    onChange={(e) => setSiteAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-sm border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Approximate Built-up Area (Sq Ft)
                </label>
                <input 
                  type="number" 
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Approximate Budget Range
                </label>
                <input 
                  type="text" 
                  value={approxBudget}
                  onChange={(e) => setApproxBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#1e3a8a]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Project Description & Specifications *
                </label>
                <textarea 
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#1e3a8a]"
                  placeholder="Detail your requirements: materials, timber decking, water fountain, kitchen styling, timeline..."
                  required
                />
              </div>

            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="px-4 py-2.5 rounded-sm bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Directly
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Submitting...' : 'Submit Order Enquiry'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
