import React from "react";
import { X, Heart, Trash2, ArrowRight, MapPin, Building, PlusCircle } from "lucide-react";
import { Project } from "../../types";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProjects: Project[];
  onRemove: (projectId: string) => void;
  onSelectProject: (project: Project) => void;
  onEnquire: (project: Project) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProjects,
  onRemove,
  onSelectProject,
  onEnquire
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden my-8 border-4 border-white/20 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1e3a8a] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#ea580c] fill-[#ea580c]" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight font-sans">
                My Saved Wishlist
              </h2>
              <p className="text-xs text-slate-300">
                {wishlistProjects.length} design{wishlistProjects.length === 1 ? "" : "s"} saved to your account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-slate-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {wishlistProjects.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                Click the Wishlist or Like button on any project across our construction and interior listings to save your preferred designs.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {wishlistProjects.map((p) => {
                const images = (p.images || []).map(img => typeof img === "string" ? img : img.url);
                const mainImg = images.length > 0 ? images[0] : "/assets/projects/project-zen-courtyard.jpg";

                return (
                  <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => { onSelectProject(p); onClose(); }}>
                      <img 
                        src={mainImg} 
                        alt={p.title} 
                        className="w-20 h-20 rounded-md object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
                          {p.category?.name || "Architecture"}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 hover:text-[#1e3a8a] transition-colors line-clamp-1">
                          {p.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#ea580c]" />
                          <span>{p.city} • Approx. ₹{p.approxPrice.toLocaleString("en-IN")}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => { onEnquire(p); onClose(); }}
                        className="px-3 py-1.5 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Enquire
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(p.id)}
                        className="p-1.5 rounded-sm bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>Persisted securely in your account.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
