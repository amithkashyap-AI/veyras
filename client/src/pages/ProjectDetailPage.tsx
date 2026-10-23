import React, { useState, useEffect } from "react";
import { Project, Review } from "../types";
import { 
  MapPin, 
  Ruler, 
  Heart, 
  Bookmark, 
  Clock, 
  Hammer, 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  Star, 
  MessageSquare, 
  Send,
  User,
  ShieldCheck,
  Lock
} from "lucide-react";
import { api } from "../services/api";

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onEnquire: (project: Project) => void;
  currentUser?: any;
  onRequireAuth?: (pendingAction?: () => void, title?: string, desc?: string) => void;
  isWishlisted?: boolean;
  isLiked?: boolean;
  onToggleWishlist?: (projectId: string) => void;
  onToggleLike?: (projectId: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  onBack,
  onEnquire,
  currentUser,
  onRequireAuth,
  isWishlisted = false,
  isLiked = false,
  onToggleWishlist,
  onToggleLike
}) => {
  const rawImages = project.images || [];
  const images = rawImages.map((img: any) => typeof img === "string" ? img : img.url);
  const mainImage = images.length > 0 ? images[0] : "/assets/projects/project-zen-courtyard.jpg";

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadReviews = async () => {
    try {
      const data = await api.getReviews(project.id);
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [project.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!currentUser && onRequireAuth) {
      onRequireAuth(async () => {
        await submitReviewAction();
      });
      return;
    }

    await submitReviewAction();
  };

  const submitReviewAction = async () => {
    setSubmittingReview(true);
    try {
      const created = await api.createReview({
        projectId: project.id,
        userName: currentUser?.name || "Verified Client",
        userEmail: currentUser?.email || "client@veyras.com",
        rating: newRating,
        comment: newComment.trim()
      });
      setReviews([created, ...reviews]);
      setNewComment("");
      alert("✅ Thank you! Your review and rating have been posted.");
    } catch (err) {
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Designs
      </button>

      {/* Title & Metadata */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c] bg-orange-50 px-3 py-1 rounded-sm">
            {project.category?.name || "Architectural Design"}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-sans">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#ea580c]" />
              {project.address}, {project.city}, {project.state || "Karnataka"}
            </span>
            <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-sm">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {averageRating} ({reviews.length} Verified Reviews)
            </span>
          </div>

          {/* Interactive Wishlist & Like action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <button
              type="button"
              onClick={() => onToggleWishlist?.(project.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer border ${
                isWishlisted
                  ? "bg-[#ea580c] text-white border-[#ea580c] shadow-xs"
                  : "bg-white text-slate-700 hover:bg-orange-50 hover:text-[#ea580c] border-slate-300"
              }`}
              title={isWishlisted ? "Click to remove from Wishlist" : "Save to Wishlist (Login required)"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? "fill-white" : ""}`} />
              <span>{isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleLike?.(project.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer border ${
                isLiked
                  ? "bg-red-500 text-white border-red-500 shadow-xs"
                  : "bg-white text-slate-700 hover:bg-red-50 hover:text-red-500 border-slate-300"
              }`}
              title={isLiked ? "Click to unlike" : "Like this design (Login required)"}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`} />
              <span>{isLiked ? "Liked Design" : "Like This Design"}</span>
            </button>
          </div>
        </div>

        {/* Approximate Price Box */}
        <div className="bg-[#1e3a8a] text-white p-5 rounded-md text-right shrink-0 shadow-md">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-300">
            {project.priceUnit}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#f97316]">
            ₹{project.approxPrice.toLocaleString("en-IN")}
          </div>
          <button
            onClick={() => onEnquire(project)}
            className="mt-3 w-full py-2.5 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            Enquire & Order Estimate
          </button>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-md overflow-hidden">
        <div className="aspect-16/10 bg-slate-100 overflow-hidden">
          <img src={mainImage} alt={project.title} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {images.slice(1, 3).map((img: string, idx: number) => (
            <div key={idx} className="aspect-16/10 bg-slate-100 overflow-hidden">
              <img src={img} alt={`Detail ${idx + 2}`} className="w-full h-full object-cover" />
            </div>
          ))}
          {images.length < 2 && (
            <div className="aspect-16/10 bg-slate-100 overflow-hidden">
              <img src="/assets/projects/project-deck.jpg" alt="Detail 2" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Specifications & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left 2 Cols: Details & Reviews */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 font-sans">Design Overview & Concept</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Technical Specifications */}
          <div className="p-6 bg-white rounded-md border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Project Technical Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Built-up Footprint</span>
                <span className="font-bold text-slate-800">{project.areaSqFt || 650} Sq Ft</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Execution Timeline</span>
                <span className="font-bold text-slate-800">{project.timeline || "30 - 45 Days"}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Materials Used</span>
                <span className="font-bold text-slate-800">{project.materials || "Teakwood, Granite, LED"}</span>
              </div>
            </div>
          </div>

          {/* CUSTOMER REVIEWS & COMMENTS SECTION */}
          <div className="bg-white rounded-md border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-sans">
                  <MessageSquare className="w-5 h-5 text-[#ea580c]" /> Client Reviews & Ratings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real feedback from property owners and architects who executed this design.
                </p>
              </div>
              <span className="text-xs font-black bg-amber-50 text-amber-700 px-3 py-1 rounded-sm border border-amber-200">
                {reviews.length} Comments
              </span>
            </div>

            {/* Write a Review Form */}
            <div className="bg-slate-50 p-5 rounded-md border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Leave a Comment & Star Rating
              </h4>

              {currentUser ? (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Your Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating ? "fill-amber-500 text-amber-500" : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-700 ml-2">{newRating} of 5 Stars</span>
                  </div>

                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={`Comment on the design, materials, finish quality, or consultation experience...`}
                    className="w-full px-3 py-2.5 rounded-sm border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Posting as: <strong>{currentUser.name || currentUser.email}</strong>
                    </span>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Post Comment
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-white rounded-sm border border-slate-200 text-center space-y-2">
                  <p className="text-xs text-slate-600">
                    To write a comment or rating, please verify your email (no password needed).
                  </p>
                  <button
                    type="button"
                    onClick={() => onRequireAuth && onRequireAuth()}
                    className="px-5 py-2 bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-[#38bdf8]" /> Quick Email Verification
                  </button>
                </div>
              )}
            </div>

            {/* Existing Comments List */}
            <div className="space-y-4 divide-y divide-slate-100">
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  Be the first verified customer to leave a review for this design!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1e3a8a]/10 text-[#1e3a8a] font-bold text-xs flex items-center justify-center">
                          {rev.userName[0]?.toUpperCase() || "C"}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                          <span className="text-[10px] text-[#059669] font-semibold ml-2">✔ Verified</span>
                        </div>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-9">
                      "{rev.comment}"
                    </p>
                    <span className="text-[10px] text-slate-400 pl-9 block">
                      {new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

        {/* Right 1 Col: Quick Consultation card */}
        <div className="space-y-4">
          <div className="p-6 bg-slate-50 rounded-md border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Need This Exact Design?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              We can customize dimensions, materials, and lighting to match your plot boundaries.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onEnquire(project)}
                className="w-full py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Place Order Enquiry
              </button>
              <a
                href="https://wa.me/9108921336363"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold flex items-center justify-center gap-1.5 rounded-sm transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp: 089213 36363
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
