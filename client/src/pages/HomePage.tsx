import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Category, Project, CompanySetting, SystemConfig } from '../types';
import { ShieldCheck, Award, Ruler, CheckCircle, MessageCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

interface HomePageProps {
  categories: Category[];
  projects: Project[];
  company?: CompanySetting | null;
  onSelectProject: (project: Project) => void;
  onExplore: (categorySlug?: string) => void;
  onOpenEnquiry: (prefill?: any) => void;
  wishlistIds?: string[];
  likedIds?: string[];
  onToggleWishlist?: (projectId: string) => void;
  onToggleLike?: (projectId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  projects,
  company,
  onSelectProject,
  onExplore,
  onOpenEnquiry,
  wishlistIds = [],
  likedIds = [],
  onToggleWishlist,
  onToggleLike
}) => {
  const [config, setConfig] = useState<SystemConfig | null>(null);

  useEffect(() => {
    api.getConfig().then(setConfig).catch(() => {});
  }, []);

  const whatsapp = config?.whatsappBusinessNumber || company?.whatsapp || '089213 36363';
  const showAnnouncement = config?.showAnnouncementBar ?? true;
  const announcementText = config?.announcementText || '✨ Complimentary 3D Architectural Concept & On-Site Consultation in Bengaluru — Call/WhatsApp 089213 36363';
  const showCategoryShowcase = config?.showCategoryShowcase ?? true;
  const showQualitySection = config?.showQualitySection ?? true;

  return (
    <div className="space-y-16 pb-20 bg-slate-50">
      {/* Live Admin-Controlled Promo Announcement Banner */}
      {showAnnouncement && announcementText && (
        <div className="bg-gradient-to-r from-[#ea580c] via-[#d97706] to-[#ea580c] text-white text-xs font-bold py-2 px-4 text-center shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{announcementText}</span>
            <button
              type="button"
              onClick={() => onOpenEnquiry()}
              className="underline font-black ml-2 cursor-pointer hover:text-slate-900"
            >
              Book Now →
            </button>
          </div>
        </div>
      )}

      {/* Hero Banner with Dynamic Cost Estimator */}
      <div className={showAnnouncement ? "-mt-16" : ""}>
        <HeroBanner 
          categories={categories}
          config={config}
          onOpenEnquiry={onOpenEnquiry}
          onExplore={onExplore}
        />
      </div>

      {/* 5 Distinct Disciplines / Categories with Color Codes */}
      {showCategoryShowcase && (
        <CategoryShowcase 
          categories={categories}
          onSelectCategory={onExplore}
        />
      )}

      {/* Featured Projects Gallery with Approximate Costs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#1e3a8a] bg-blue-50 px-3 py-1 rounded-sm border border-blue-200">
              Architectural Portfolio
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 font-sans">
              Featured Constructions & Interior Designs
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Explore completed residential courtyards, luxury villas, and bespoke interiors with approximate project costs.
            </p>
          </div>
          <button 
            onClick={() => onExplore('all')}
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-[#ea580c] hover:text-[#c2410c] flex items-center gap-1 transition-colors cursor-pointer"
          >
            Explore All Designs ({projects.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard 
              key={p.id}
              project={p}
              onSelect={onSelectProject}
              onEnquire={(proj) => onOpenEnquiry({ project: proj })}
              isWishlisted={wishlistIds.includes(p.id)}
              isLiked={likedIds.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onToggleLike={onToggleLike}
            />
          ))}
        </div>
      </section>

      {/* Veyra's Construction & Interiors Engineering Quality Standard */}
      {showQualitySection && (
        <section className="bg-white py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#059669] bg-emerald-50 px-3 py-1 rounded-sm border border-emerald-200">
                Turnkey Excellence
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-sans">
                Why Homeowners & Architects Choose Veyra's
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Complete civil construction and interior fitouts governed by strict ISO-grade quality benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-50 rounded-sm border border-slate-200">
                <div className="w-10 h-10 rounded-sm bg-[#1e3a8a] text-white flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Structural Safety Guarantee</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  FEA structural calculations and soil-tested RCC foundation design for lifetime durability.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-sm border border-slate-200">
                <div className="w-10 h-10 rounded-sm bg-[#059669] text-white flex items-center justify-center mb-4">
                  <Ruler className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">3D Photoreal Visualization</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Experience full 4K architectural renders and virtual walkthroughs before physical ground-breaking.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-sm border border-slate-200">
                <div className="w-10 h-10 rounded-sm bg-[#ea580c] text-white flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Premium Verified Materials</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Imported Italian marbles, treated teakwood composites, and premium German architectural fittings.
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-sm border border-slate-200">
                <div className="w-10 h-10 rounded-sm bg-[#db2777] text-white flex items-center justify-center mb-4">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">On-Time Handover Penalty</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fixed contractual completion timelines backed by escrow-aligned milestone delivery.
                </p>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Direct WhatsApp Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1e3a8a] text-white rounded-md p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#38bdf8]">
              Ready to Transform Your Space?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-sans">
              Schedule an On-Site Architectural Consultation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our lead interior architect and structural engineer will visit your plot or property with material samples and 3D concept plans.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a 
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Veyra's%20Team,%20I%20would%20like%20to%20book%20a%20site%20consultation`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-sm bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
            <button
              onClick={() => onOpenEnquiry()}
              className="px-6 py-3 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            >
              Order Online Enquiry
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
