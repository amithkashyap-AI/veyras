import React, { useState } from 'react';
import { Calculator, ArrowRight, Sparkles } from 'lucide-react';
import { Category, SystemConfig } from '../../types';

interface HeroBannerProps {
  categories: Category[];
  config?: SystemConfig | null;
  onOpenEnquiry: (prefill?: any) => void;
  onExplore: (categorySlug?: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  categories, 
  config,
  onOpenEnquiry
}) => {
  const [selectedService, setSelectedService] = useState('courtyards-landscaping');
  const [areaSqFt, setAreaSqFt] = useState<number>(650);
  const [qualityGrade, setQualityGrade] = useState<'Standard' | 'Premium' | 'Ultra Luxury'>('Premium');

  // Dynamic cost calculator rates controlled from Admin Dashboard Front-End CMS
  const rates: Record<string, { baseRate: number; label: string }> = {
    'courtyards-landscaping': { baseRate: config?.rateCourtyard ?? 650, label: 'Courtyard & Landscape' },
    'architectural-construction': { baseRate: config?.rateConstruction ?? 2400, label: 'Turnkey Construction' },
    'luxury-interiors': { baseRate: config?.rateInteriors ?? 1850, label: 'Luxury Interiors' },
    'timber-decks-patios': { baseRate: config?.rateDecks ?? 750, label: 'Timber Decks & Pergolas' },
    'villa-renovation': { baseRate: config?.rateRenovation ?? 1100, label: 'Villa Renovation' }
  };

  const gradeMultipliers = {
    'Standard': 0.85,
    'Premium': 1.0,
    'Ultra Luxury': 1.45
  };

  const currentRate = rates[selectedService] || rates['courtyards-landscaping'];
  const approxTotal = Math.round(areaSqFt * currentRate.baseRate * gradeMultipliers[qualityGrade]);

  const badgeText = config?.heroBadgeText || "Veyra's Construction & Interiors";
  const heroTitle = config?.heroTitle || "Building Spaces •";
  const heroHighlight = config?.heroHighlightText || "Creating Lifestyles";
  const heroSubtitle = config?.heroSubtitle || "From turnkey civil structural construction to bespoke modern courtyards, reflection pools, and high-end residential interiors.";
  const heroBg = config?.heroBgImage || "/assets/projects/project-zen-courtyard.jpg";
  const showEstimator = config?.showHeroEstimator ?? true;

  return (
    <div className="relative min-h-[620px] lg:min-h-[680px] flex items-center justify-center overflow-hidden">
      
      {/* Background Image controlled via Admin CMS */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Veyra's Architectural Courtyard" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/80 to-slate-950/70 backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ea580c]/20 border border-[#ea580c]/50 text-[#f97316] text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          {badgeText}
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 font-sans">
          {heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] via-[#ec4899] to-[#38bdf8]">{heroHighlight}</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-200 font-normal leading-relaxed mb-10">
          {heroSubtitle}
        </p>

        {/* Dynamic Project Cost Estimator Card */}
        {showEstimator && (
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-2xl max-w-4xl mx-auto border border-white/20 text-left">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#ea580c]" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Interactive Project Cost & Design Estimator
                </h3>
              </div>
              <span className="text-sm font-semibold text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200">
                Instant Approximate Budget
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Service Category */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Project Category
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-sm border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-hidden focus:border-[#1e3a8a]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Approximate Area */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Area: {areaSqFt} Sq Ft
                </label>
                <input 
                  type="range"
                  min={200}
                  max={5000}
                  step={50}
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full mt-2 accent-[#ea580c] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                  <span>200 sq ft</span>
                  <span>5,000+ sq ft</span>
                </div>
              </div>

              {/* Quality Grade */}
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Finish Specification
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-sm border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-hidden focus:border-[#1e3a8a]"
                >
                  <option value="Standard">Standard Execution</option>
                  <option value="Premium">Premium Architecture</option>
                  <option value="Ultra Luxury">Ultra Luxury Imported</option>
                </select>
              </div>

              {/* Estimated Price & Book CTA */}
              <div className="bg-slate-50 p-3 rounded-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-500">Approx. Estimate:</span>
                  <div className="text-xl font-extrabold text-[#1e3a8a]">
                    ₹{approxTotal.toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenEnquiry({
                    service: currentRate.label,
                    areaSqFt,
                    approxBudget: `₹${approxTotal.toLocaleString('en-IN')}`
                  })}
                  className="mt-2 w-full py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  Book Inspection <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
