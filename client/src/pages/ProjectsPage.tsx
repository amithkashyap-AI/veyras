import React, { useState, useMemo } from 'react';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Category, Project } from '../types';
import { Search, SlidersHorizontal, RotateCcw, Building, Ruler, IndianRupee } from 'lucide-react';

interface ProjectsPageProps {
  categories: Category[];
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onEnquire: (project: Project) => void;
  initialCategory?: string;
  wishlistIds?: string[];
  likedIds?: string[];
  onToggleWishlist?: (projectId: string) => void;
  onToggleLike?: (projectId: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  categories,
  projects,
  onSelectProject,
  onEnquire,
  initialCategory = 'all',
  wishlistIds = [],
  likedIds = [],
  onToggleWishlist,
  onToggleLike
}) => {
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(15000000);
  const [cityFilter, setCityFilter] = useState('all');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (selectedCat !== 'all') {
        const catSlug = p.category?.slug || p.categoryId;
        if (catSlug !== selectedCat) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesAddress = p.address.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
        const matchesMat = (p.materials || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesAddress && !matchesMat) return false;
      }
      if (cityFilter !== 'all' && p.city.toLowerCase() !== cityFilter.toLowerCase()) {
        return false;
      }
      if (p.approxPrice > maxPrice) return false;
      return true;
    });
  }, [projects, selectedCat, search, maxPrice, cityFilter]);

  const cities = Array.from(new Set(projects.map(p => p.city)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#ea580c] bg-orange-50 px-3 py-1 rounded-sm border border-orange-200">
          Portfolio Explorer
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2 font-sans">
          Constructions, Courtyards & Interior Listings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Showing <span className="font-bold text-slate-900">{filtered.length}</span> architectural designs with approximate execution costs.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-md border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Keyword Search */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Search Keywords
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Courtyard, villa, marble, teak..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-sm border border-slate-300 text-xs focus:outline-hidden focus:border-[#1e3a8a]"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Category
            </label>
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-hidden focus:border-[#1e3a8a]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Location City
            </label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-hidden focus:border-[#1e3a8a]"
            >
              <option value="all">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedCat('all');
                setSearch('');
                setCityFilter('all');
                setMaxPrice(15000000);
              }}
              className="w-full py-2 rounded-sm border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>

        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-md border border-slate-200">
            <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-base">No designs found</h4>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filters or searching a different material.</p>
          </div>
        ) : (
          filtered.map((p) => (
            <ProjectCard 
              key={p.id}
              project={p}
              onSelect={onSelectProject}
              onEnquire={onEnquire}
              isWishlisted={wishlistIds.includes(p.id)}
              isLiked={likedIds.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
              onToggleLike={onToggleLike}
            />
          ))
        )}
      </div>

    </div>
  );
};
