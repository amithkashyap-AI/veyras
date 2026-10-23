import React, { useState } from "react";
import { X, LogIn, UserPlus, Lock, Mail, User, ShieldCheck, ArrowRight, Check } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { username: string; role: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Login fields
  const [loginUser, setLoginUser] = useState("admin");
  const [loginPass, setLoginPass] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    setTimeout(() => {
      // Authenticate admin
      if ((loginUser.trim() === "admin" || loginUser.trim() === "contact@veyrasinteriors.com" || loginUser.trim() === "admin@veyrasinteriors.com") && loginPass.trim() === "admin123") {
        const userObj = { username: "Admin", role: "SuperAdmin" };
        if (rememberMe) {
          localStorage.setItem("veyras_admin_auth", JSON.stringify(userObj));
        } else {
          sessionStorage.setItem("veyras_admin_auth", JSON.stringify(userObj));
        }
        setLoading(false);
        onLoginSuccess(userObj);
        onClose();
      } else {
        setLoading(false);
        setErrorMsg("Invalid username or password. Default demo admin: admin / admin123");
      }
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    const userObj = { username: "Admin", role: "SuperAdmin" };
    localStorage.setItem("veyras_admin_auth", JSON.stringify(userObj));
    onLoginSuccess(userObj);
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPass) return;
    setRegSuccess(true);
    setTimeout(() => {
      setActiveTab("login");
      setLoginUser(regEmail);
      setRegSuccess(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      
      {/* Modal Card - Styled based on source theme main-register-holder */}
      <div className="relative w-full max-w-[480px] bg-white rounded-xl shadow-2xl overflow-hidden my-8 border-4 border-white/30 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Source Theme Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-4 z-20 w-8 h-8 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-md"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Source Theme Tabs Menu */}
        <div className="grid grid-cols-2 bg-[#f1f5f9] border-b border-slate-200 text-xs font-black uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`py-4 px-6 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              activeTab === "login" 
                ? "bg-[#1e3a8a] text-white shadow-inner" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <LogIn className="w-4 h-4 text-[#38bdf8]" />
            <span>Admin Log In</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`py-4 px-6 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              activeTab === "register" 
                ? "bg-[#1e3a8a] text-white shadow-inner" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <UserPlus className="w-4 h-4 text-[#ea580c]" />
            <span>Staff Register</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="pb-4 mb-5 border-b border-slate-100 flex items-center gap-3">
            <img 
              src="/assets/branding/veyras-logo.jpg" 
              alt="Veyra's" 
              className="w-12 h-12 rounded-full border border-[#ea580c]"
            />
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">
                {activeTab === "login" ? "Control Dashboard Sign In" : "Staff Registration"}
              </h3>
              <p className="text-[10px] font-bold text-[#ea580c] tracking-widest uppercase">
                Veyra's Construction & Interiors
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-sm bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Username or Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    placeholder="admin or contact@veyrasinteriors.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-300 text-xs font-medium focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Lost Password (Source Theme elements) */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 font-semibold text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#ea580c] w-3.5 h-3.5 rounded"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Default admin password is: admin123 (Username: admin)")}
                  className="text-xs font-bold text-[#1e3a8a] hover:underline cursor-pointer"
                >
                  Lost Your Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-extrabold uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? "Authenticating..." : "Log In to Dashboard"}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* One-Click Demo Admin Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300"
                >
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>One-Click Admin Sign In (Demo Mode)</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              {regSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm text-center text-emerald-700 text-xs font-bold">
                  Account requested! Redirecting to Log In...
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Account details will be confirmed with Veyra's Engineering operations team.
                  </p>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Staff / Architect Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2.5 rounded-sm border border-slate-300 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="architect@veyrasinteriors.com"
                      className="w-full px-3 py-2.5 rounded-sm border border-slate-300 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Choose Password <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="password"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-sm border border-slate-300 text-xs"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-extrabold uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    Register Staff Account
                  </button>
                </>
              )}
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
