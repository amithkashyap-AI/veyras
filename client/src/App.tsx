import React, { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ContactUsPage } from "./pages/ContactUsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { EnquiryModal } from "./components/enquiry/EnquiryModal";
import { AuthModal } from "./components/auth/AuthModal";
import { WishlistModal } from "./components/wishlist/WishlistModal";
import { Lock } from "lucide-react";
import { Category, Project, CompanySetting, AuthUser } from "./types";
import { api } from "./services/api";

export const App: React.FC = () => {
  const getInitialPage = () => {
    const hash = window.location.hash.replace("#", "").trim();
    if (["home", "services", "projects", "estimator", "contact", "dashboard", "admin-login", "admin"].includes(hash)) {
      return (hash === "admin" || hash === "admin-login") ? "admin-login" : hash;
    }
    const path = window.location.pathname.replace("/", "").trim();
    if (["home", "services", "projects", "estimator", "contact", "dashboard", "admin-login", "admin"].includes(path)) {
      return (path === "admin" || path === "admin-login") ? "admin-login" : path;
    }
    return "home";
  };

  const [activePage, setActivePageState] = useState<string>(getInitialPage());

  const setActivePage = (page: string) => {
    setActivePageState(page);
    window.location.hash = page;
  };

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "").trim();
      if (["home", "services", "projects", "estimator", "contact", "dashboard", "admin-login", "admin"].includes(hash)) {
        setActivePageState((hash === "admin" || hash === "admin-login") ? "admin-login" : hash);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [company, setCompany] = useState<CompanySetting | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryPrefill, setEnquiryPrefill] = useState<any>(null);
  const [initialCategory, setInitialCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // User interactions: Wishlist & Likes
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);

  // Authenticated user state (Admin or verified customer via Email OTP)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const savedAdmin = localStorage.getItem("veyras_admin_auth") || sessionStorage.getItem("veyras_admin_auth");
      if (savedAdmin) return JSON.parse(savedAdmin);
      const savedUser = localStorage.getItem("veyras_user_auth");
      if (savedUser) return JSON.parse(savedUser);
      return null;
    } catch {
      return null;
    }
  });

  // Load user wishlist and likes when logged in
  useEffect(() => {
    if (currentUser?.email) {
      api.getUserInteractions(currentUser.email)
        .then((data) => {
          setWishlistIds(data.wishlist || []);
          setLikedIds(data.likes || []);
        })
        .catch(console.error);
    } else {
      setWishlistIds([]);
      setLikedIds([]);
    }
  }, [currentUser]);

  // Mandate password change when real user logs in for the first time
  useEffect(() => {
    if (currentUser && (currentUser.mustChangePassword || currentUser.isFirstLogin) && currentUser.role !== "ADMIN") {
      setAuthModalConfig({
        isOpen: true,
        mode: "setPassword",
        title: "First-Time Sign-In: Password Change Required",
        description: "Welcome to Veyra's! Real users logging in for the first time must set/change their password to secure their account."
      });
    }
  }, [currentUser]);

  // Auth modal state for customer interactions (Email OTP)
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: "register" | "login" | "forgotPassword" | "changePassword" | "otp" | "password" | "setPassword";
    title?: string;
    description?: string;
  }>({
    isOpen: false,
    mode: "register"
  });

  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const triggerAuthModal = (
    callback?: () => void,
    title = "Quick Email OTP Verification",
    description = "Only your email is required to submit messages, post reviews, save wishlists, and like designs.",
    mode: "register" | "login" | "forgotPassword" | "changePassword" | "otp" | "password" | "setPassword" = "register"
  ) => {
    if (callback) {
      setPendingAction(() => callback);
    }
    setAuthModalConfig({
      isOpen: true,
      mode,
      title,
      description
    });
  };

  // Toggle Wishlist action with Login Gating
  const handleToggleWishlist = async (projectId: string) => {
    if (!currentUser) {
      triggerAuthModal(
        () => handleToggleWishlist(projectId),
        "Sign In to Save Wishlist",
        "Only your email is required to receive an instant OTP code and save this project to your private wishlist."
      );
      return;
    }

    try {
      const res = await api.toggleWishlist(currentUser.email, projectId);
      if (res.isWishlisted) {
        setWishlistIds((prev) => [...prev, projectId]);
      } else {
        setWishlistIds((prev) => prev.filter((id) => id !== projectId));
      }
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
    }
  };

  // Toggle Like action with Login Gating
  const handleToggleLike = async (projectId: string) => {
    if (!currentUser) {
      triggerAuthModal(
        () => handleToggleLike(projectId),
        "Sign In to Like Design",
        "Only your email is required to receive an instant OTP code to like and bookmark architectural designs."
      );
      return;
    }

    try {
      const res = await api.toggleLike(currentUser.email, projectId);
      if (res.isLiked) {
        setLikedIds((prev) => [...prev, projectId]);
      } else {
        setLikedIds((prev) => prev.filter((id) => id !== projectId));
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("veyras_admin_auth");
    sessionStorage.removeItem("veyras_admin_auth");
    localStorage.removeItem("veyras_user_auth");
    setCurrentUser(null);
    setWishlistIds([]);
    setLikedIds([]);
    setActivePage("home");
  };

  const loadAllData = async () => {
    try {
      const [cats, projs, comp] = await Promise.all([
        api.getCategories(),
        api.getProjects(),
        api.getCompanySettings()
      ]);
      setCategories(cats);
      setProjects(projs);
      setCompany(comp);
    } catch (err) {
      console.error("Failed to load Veyras data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenEnquiry = (prefillData?: any) => {
    if (prefillData?.project) {
      setSelectedProject(prefillData.project);
    }
    setEnquiryPrefill(prefillData);
    setIsEnquiryOpen(true);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setActivePage("project-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleExplore = (categorySlug?: string) => {
    if (categorySlug) setInitialCategory(categorySlug);
    setActivePage("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isAdmin = currentUser && (currentUser.role === "ADMIN" || currentUser.email?.includes("admin"));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* Navbar with WhatsApp, Logo & Links (Admin hidden for normal visitors) */}
      <Navbar 
        activePage={activePage}
        setActivePage={(p) => {
          setActivePage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        company={company}
        onOpenEnquiry={() => handleOpenEnquiry()}
        currentUser={currentUser}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistModalOpen(true)}
        onOpenLogin={() => triggerAuthModal(undefined, "User Sign In / Registration", "Only your email address is required to receive an instant verification OTP code.", "otp")}
        onOpenUserLogin={() => triggerAuthModal(undefined, "User Sign In / Registration", "Only your email address is required to receive an instant verification OTP code.", "otp")}
        onChangePassword={() => triggerAuthModal(undefined, "Change Account Password", "Enter your email and your new password to update.", "changePassword")}
        onLogout={handleLogout}
      />

      {/* Main Pages */}
      <main className="flex-1">
        {activePage === "home" && (
          <HomePage 
            categories={categories}
            projects={projects}
            company={company}
            onSelectProject={handleSelectProject}
            onExplore={handleExplore}
            onOpenEnquiry={handleOpenEnquiry}
            wishlistIds={wishlistIds}
            likedIds={likedIds}
            onToggleWishlist={handleToggleWishlist}
            onToggleLike={handleToggleLike}
          />
        )}

        {activePage === "services" && (
          <ServicesPage 
            company={company}
            onOpenEnquiry={handleOpenEnquiry}
            initialCategory={initialCategory}
          />
        )}

        {(activePage === "projects" || activePage === "estimator") && (
          <ProjectsPage 
            categories={categories}
            projects={projects}
            onSelectProject={handleSelectProject}
            onEnquire={(proj) => handleOpenEnquiry({ project: proj })}
            initialCategory={initialCategory}
            wishlistIds={wishlistIds}
            likedIds={likedIds}
            onToggleWishlist={handleToggleWishlist}
            onToggleLike={handleToggleLike}
          />
        )}

        {activePage === "project-detail" && selectedProject && (
          <ProjectDetailPage 
            project={selectedProject}
            onBack={() => setActivePage("projects")}
            onEnquire={(proj) => handleOpenEnquiry({ project: proj })}
            currentUser={currentUser}
            isWishlisted={wishlistIds.includes(selectedProject.id)}
            isLiked={likedIds.includes(selectedProject.id)}
            onToggleWishlist={handleToggleWishlist}
            onToggleLike={handleToggleLike}
            onRequireAuth={(cb, title, desc) => triggerAuthModal(
              cb, 
              title || "Verify Email to Continue", 
              desc || "Only an email verification code is required to rate, comment, like, or save this project.", 
              "otp"
            )}
          />
        )}

        {activePage === "contact" && (
          <ContactUsPage 
            company={company} 
            currentUser={currentUser}
            onRequireAuth={(cb) => triggerAuthModal(
              cb, 
              "Verify Email to Send Message", 
              "Only an email verification code is required to connect with our design team.", 
              "otp"
            )}
          />
        )}

        {/* Dedicated Separate Admin URL Route: /#admin-login or /#admin */}
        {(activePage === "admin-login" || activePage === "admin") && (
          <AdminLoginPage 
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setActivePage("dashboard");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onBackToHome={() => {
              setActivePage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* Admin Operations Control Dashboard */}
        {activePage === "dashboard" && (
          isAdmin ? (
            <DashboardPage 
              onRefreshAll={loadAllData} 
              onViewProject={(proj) => {
                setSelectedProject(proj);
                setActivePage("project-detail");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onNavigate={(page) => {
                setActivePage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onLogout={handleLogout}
            />
          ) : (
            <div className="max-w-md mx-auto px-4 py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Restricted</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                This internal operations dashboard requires verified administrative privileges. For security, please sign in via the authorized URL.
              </p>
              <div className="pt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActivePage("admin-login")}
                  className="px-5 py-2.5 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Go to Admin Login Portal
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage("home")}
                  className="px-5 py-2.5 rounded-sm bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer (No Admin Links Visible) */}
      <Footer 
        setActivePage={(p) => {
          setActivePage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }} 
        company={company} 
      />

      {/* Direct Order / Consultation Modal */}
      <EnquiryModal 
        isOpen={isEnquiryOpen}
        onClose={() => {
          setIsEnquiryOpen(false);
          setEnquiryPrefill(null);
        }}
        selectedProject={selectedProject}
        prefill={enquiryPrefill}
        currentUser={currentUser}
        onRequireAuth={(cb, title, desc) => triggerAuthModal(
          cb,
          title || "User Registration Required to Place Order / Enquiry",
          desc || "Please register with your email address and verification code to submit your consultation order.",
          "register"
        )}
      />

      {/* Normal User Email OTP Verification Modal */}
      <AuthModal 
        isOpen={authModalConfig.isOpen}
        onClose={() => {
          if (currentUser?.mustChangePassword || currentUser?.isFirstLogin) {
            handleLogout();
          }
          setAuthModalConfig(prev => ({ ...prev, isOpen: false }));
        }}
        onLogout={handleLogout}
        initialMode={authModalConfig.mode}
        initialEmail={currentUser?.email || ""}
        mustChangePasswordEnforced={Boolean(currentUser?.mustChangePassword || currentUser?.isFirstLogin)}
        title={authModalConfig.title}
        description={authModalConfig.description}
        onSuccess={(user) => {
          setCurrentUser(user);
          setAuthModalConfig(prev => ({ ...prev, isOpen: false }));
          if (pendingAction) {
            const cb = pendingAction;
            setPendingAction(null);
            setTimeout(() => {
              cb();
            }, 100);
          }
        }}
      />

      {/* Saved Wishlist Drawer/Modal */}
      <WishlistModal 
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        wishlistProjects={projects.filter(p => wishlistIds.includes(p.id))}
        onRemove={handleToggleWishlist}
        onSelectProject={handleSelectProject}
        onEnquire={(proj) => handleOpenEnquiry({ project: proj })}
      />

    </div>
  );
};
