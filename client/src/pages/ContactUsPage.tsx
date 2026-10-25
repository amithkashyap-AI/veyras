import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompanySetting } from '../types';
import { api } from '../services/api';

interface ContactUsPageProps {
  company?: CompanySetting | null;
  currentUser?: any;
  onRequireAuth?: (pendingAction?: () => void) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ company, currentUser, onRequireAuth }) => {
  const phone = company?.phone || '089213 36363';
  const whatsapp = company?.whatsapp || '089213 36363';
  const email = company?.email || 'contact@veyrasinteriors.com';
  const address = company?.address || '#98, 1st Main, 4th Cross, Manjunatha Nagar, Rajajinagar, Bengaluru - 560010';

  const [name, setName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientPhone || !message) return;

    // If user is not authenticated, require quick Email OTP verification
    if (!currentUser && onRequireAuth) {
      onRequireAuth(async () => {
        setIsSubmitting(true);
        try {
          await api.createEnquiry({
            clientName: name,
            clientPhone,
            siteAddress: siteAddress || "Bengaluru",
            city: "Bengaluru",
            message,
            propertyType: "Direct Contact Form"
          });
          confetti({ particleCount: 70, spread: 60 });
          setIsSent(true);
        } catch (err) {
          alert("Error submitting message.");
        } finally {
          setIsSubmitting(false);
        }
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createEnquiry({
        clientName: name,
        clientPhone,
        clientEmail: currentUser?.email || "customer@veyrasinteriors.com",
        siteAddress: siteAddress || "Bengaluru",
        city: "Bengaluru",
        message,
        propertyType: "Direct Contact Form"
      });
      confetti({ particleCount: 70, spread: 60 });
      setIsSent(true);
    } catch (err) {
      alert("Error submitting message. Please message us on WhatsApp: 089213 36363");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#059669] bg-emerald-50 px-3 py-1 rounded-sm border border-emerald-200">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans">
          Contact Veyra's Construction and Interiors
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Visit our design studio or invite our engineers for an on-site evaluation and preliminary estimate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Contact Cards */}
        <div className="space-y-4">
          
          <div className="p-6 bg-white rounded-md border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-sm bg-[#10b981] text-white flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Instant WhatsApp Direct</h4>
            <p className="text-xs text-slate-500">Quickest way to share floor plans and reference photos.</p>
            <a 
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs font-bold text-[#10b981] hover:underline"
            >
              Chat on WhatsApp ({whatsapp}) →
            </a>
          </div>

          <div className="p-6 bg-white rounded-md border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-sm bg-[#ea580c] text-white flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Studio Location</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{address}</p>
          </div>

          <div className="p-6 bg-white rounded-md border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-sm bg-[#1e3a8a] text-white flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Call Our Engineers</h4>
            <a href={`tel:${phone}`} className="text-xs font-bold text-[#1e3a8a] hover:underline">
              {phone}
            </a>
          </div>

        </div>

        {/* Right 2 Cols: Interactive Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-md border border-slate-200 p-8 shadow-sm">
          {isSent ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-[#10b981] mx-auto" />
              <h3 className="text-2xl font-bold text-slate-900">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you for reaching out to Veyra's Construction and Interiors. We will call you back at {clientPhone} shortly.
              </p>
              <button 
                onClick={() => setIsSent(false)}
                className="mt-4 px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-sm cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                Send Us a Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Suresh Reddy"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input 
                    type="tel" 
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. 089213 36363"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Site Location / Address
                  </label>
                  <input 
                    type="text" 
                    value={siteAddress}
                    onChange={(e) => setSiteAddress(e.target.value)}
                    placeholder="e.g. Plot 15, Hitec City, Hyderabad"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs focus:outline-hidden focus:border-[#1e3a8a]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Project Requirements *
                  </label>
                  <textarea 
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you would like to build: Courtyard garden, luxury interior, civil construction..."
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Submitting...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
