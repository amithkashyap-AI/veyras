import React from 'react';
import { Category, ColorTheme } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface CategoryShowcaseProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
}

const colorStyles: Record<ColorTheme, { border: string; badge: string; text: string; bg: string }> = {
  blue: {
    border: 'border-[#1e3a8a]',
    badge: 'bg-[#1e3a8a] text-white',
    text: 'text-[#1e3a8a]',
    bg: 'hover:bg-blue-50/50'
  },
  green: {
    border: 'border-[#059669]',
    badge: 'bg-[#059669] text-white',
    text: 'text-[#059669]',
    bg: 'hover:bg-emerald-50/50'
  },
  red: {
    border: 'border-[#dc2626]',
    badge: 'bg-[#dc2626] text-white',
    text: 'text-[#dc2626]',
    bg: 'hover:bg-red-50/50'
  },
  pink: {
    border: 'border-[#db2777]',
    badge: 'bg-[#db2777] text-white',
    text: 'text-[#db2777]',
    bg: 'hover:bg-pink-50/50'
  },
  orange: {
    border: 'border-[#ea580c]',
    badge: 'bg-[#ea580c] text-white',
    text: 'text-[#ea580c]',
    bg: 'hover:bg-orange-50/50'
  },
  white: {
    border: 'border-slate-300',
    badge: 'bg-slate-900 text-white',
    text: 'text-slate-900',
    bg: 'hover:bg-slate-50'
  }
};

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ 
  categories, 
  onSelectCategory 
}) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#ea580c] bg-orange-50 px-3 py-1 rounded-sm border border-orange-200">
              Disciplines & Categories
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 font-sans">
              Our Construction & Interior Spectrum
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-xl">
              Specialized departments staffed by certified structural architects, landscape artists, and interior execution craftsmen.
            </p>
          </div>
          <button 
            onClick={() => onSelectCategory('all')}
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wider text-[#1e3a8a] hover:text-[#ea580c] flex items-center gap-1 transition-colors cursor-pointer"
          >
            View All Portfolios <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Distinct Categories with Requested Color Combinations (Blue, Green, Red, Pink, Orange) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat) => {
            const theme = colorStyles[cat.color] || colorStyles.blue;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`group bg-white rounded-md overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${theme.bg}`}
              >
                {/* Photo Preview */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img 
                    src={cat.image || '/assets/projects/project-zen-courtyard.jpg'} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Category Color Tag (Blue, Green, Red, Pink, Orange) */}
                  <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider shadow-sm ${theme.badge}`}>
                    {cat.color}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className={`font-bold text-sm tracking-tight group-hover:underline ${theme.text}`}>
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-400">
                      {cat.projectCount || 4} Designs
                    </span>
                    <span className={`font-bold ${theme.text}`}>
                      Explore →
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
