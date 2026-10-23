import React from "react";
import { MapPin, Ruler, Clock, Hammer, ArrowRight, Heart, Bookmark } from "lucide-react";
import { Project, ColorTheme } from "../../types";

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onEnquire: (project: Project) => void;
  isWishlisted?: boolean;
  isLiked?: boolean;
  onToggleWishlist?: (projectId: string) => void;
  onToggleLike?: (projectId: string) => void;
}

const colorBadgeMap: Record<ColorTheme, string> = {
  blue: "bg-[#1e3a8a] text-white",
  green: "bg-[#059669] text-white",
  red: "bg-[#dc2626] text-white",
  pink: "bg-[#db2777] text-white",
  orange: "bg-[#ea580c] text-white",
  white: "bg-slate-800 text-white"
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onSelect,
  onEnquire,
  isWishlisted = false,
  isLiked = false,
  onToggleWishlist,
  onToggleLike
}) => {
  const images = (project.images || []).map(img => typeof img === "string" ? img : img.url);
  const mainImage = images.length > 0 ? images[0] : "/assets/projects/project-zen-courtyard.jpg";
  const catColor = (project.category?.color || "blue") as ColorTheme;

  return (
    <div className="group bg-white rounded-md overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      
      {/* Photo with badges & interaction icons */}
      <div 
        onClick={() => onSelect(project)}
        className="relative aspect-16/10 overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img 
          src={mainImage} 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge with assigned color */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs shadow-sm ${colorBadgeMap[catColor]}`}>
          {project.category?.name || "Architecture"}
        </div>

        {/* Wishlist & Like action icons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Like Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleLike) onToggleLike(project.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
              isLiked 
                ? "bg-red-500 text-white hover:bg-red-600 scale-105" 
                : "bg-slate-900/60 hover:bg-slate-900/80 text-white hover:scale-105"
            }`}
            title={isLiked ? "Liked (Click to unlike)" : "Like this project (Login required)"}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`} />
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleWishlist) onToggleWishlist(project.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
              isWishlisted 
                ? "bg-[#ea580c] text-white hover:bg-[#c2410c] scale-105" 
                : "bg-slate-900/60 hover:bg-slate-900/80 text-white hover:scale-105"
            }`}
            title={isWishlisted ? "In your Wishlist (Click to remove)" : "Save to Wishlist (Login required)"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Approximate Price Tag */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-xs text-xs font-bold border border-white/20 shadow-sm">
          <span className="text-[#f97316]">Approx. ₹{project.approxPrice.toLocaleString("en-IN")}</span>
          <span className="text-[10px] text-slate-300 font-normal ml-1">({project.priceUnit})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 
            onClick={() => onSelect(project)}
            className="font-bold text-slate-900 text-base group-hover:text-[#1e3a8a] transition-colors line-clamp-1 cursor-pointer"
          >
            {project.title}
          </h3>

          {/* Location / Address */}
          <p className="flex items-center gap-1 text-slate-500 text-xs mt-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#ea580c] shrink-0" />
            <span>{project.address}, {project.city}</span>
          </p>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 bg-slate-50 rounded-xs border border-slate-100 text-slate-700 mb-4">
            {project.areaSqFt && (
              <span className="flex items-center gap-1">
                <Ruler className="w-3 h-3 text-[#1e3a8a]" /> Area: {project.areaSqFt} sq ft
              </span>
            )}
            {project.timeline && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#059669]" /> Time: {project.timeline}
              </span>
            )}
            {project.materials && (
              <span className="col-span-2 flex items-center gap-1 line-clamp-1 text-[10px] text-slate-500">
                <Hammer className="w-3 h-3 text-[#ea580c] shrink-0" /> {project.materials}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
          <button 
            type="button"
            onClick={() => onSelect(project)}
            className="flex-1 py-2 rounded-xs border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            View Details
          </button>
          <button 
            type="button"
            onClick={() => onEnquire(project)}
            className="px-3.5 py-2 rounded-xs bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            Enquire Now
          </button>
        </div>

      </div>

    </div>
  );
};
