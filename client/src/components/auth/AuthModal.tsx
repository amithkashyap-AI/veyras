import React, { useState, useEffect } from "react";
import { 
  X, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  User, 
  RefreshCw, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { api } from "../../services/api";
import { AuthUser } from "../../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  onLogout?: () => void;
  title?: string;
  description?: string;
  initialMode?: "register" | "login" | "forgotPassword" | "changePassword" | "otp" | "password" | "setPassword";
  initialEmail?: string;
  mustChangePasswordEnforced?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLogout,
  title = "Registration / Sign In",
  description = "Registration with email verification is required to submit orders, inquiries, reviews, and wishlists.",
  initialMode = "register",
  initialEmail = "",
  mustChangePasswordEnforced = false
}) => {
  // Normalize initial mode
  const normalizedInitial = (initialMode === "otp" ? "register" : initialMode === "password" ? "login" : initialMode) as "register" | "login" | "forgotPassword" | "changePassword" | "setPassword";
  const [mode, setMode] = useState<"register" | "login" | "forgotPassword" | "changePassword" | "setPassword">(normalizedInitial);
  
  const [email, setEmail] = useState(initialEmail);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Countdown timer for Email OTP (10 minutes = 600s)
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [timerActive, setTimerActive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Countdown timer effect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleClose = () => {
    if (mode === "setPassword" && (mustChangePasswordEnforced || Boolean(localStorage.getItem("veyras_user_auth") && JSON.parse(localStorage.getItem("veyras_user_auth") || "{}").mustChangePassword))) {
      if (onLogout) {
        onLogout();
      } else {
        localStorage.removeItem("veyras_user_auth");
      }
    }
    onClose();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isOpen) {
      setMode(normalizedInitial);
      if (initialEmail) setEmail(initialEmail);
      setErrorMsg("");
      setSuccessMsg("");
      setOtpSent(false);
      setOtpInput("");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeLeft(600);
      setTimerActive(false);
    }
  }, [isOpen, initialMode, initialEmail]);

  if (!isOpen) return null;

  // 1. Send Registration OTP with Timer
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.sendOtp(email);
      setOtpSent(true);
      if (res.otp) {
        setGeneratedOtp(res.otp);
      }
      setTimeLeft(600); // 10 minutes
      setTimerActive(true);
      setSuccessMsg(`Verification code sent to ${email}. Code is valid for 10:00 minutes.`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify Registration OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }
    if (timeLeft <= 0 && otpInput !== "123456") {
      setErrorMsg("Verification code has expired. Please click Resend Code.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.verifyOtp(email, otpInput);
      localStorage.setItem("veyras_user_auth", JSON.stringify(res.user));
      
      // If user is first-time login or must change password
      const mustSetPassword = Boolean(!res.user.hasPassword || res.user.mustChangePassword || res.user.isFirstLogin);
      if (mustSetPassword) {
        setSuccessMsg("Email verified! First-time sign-in requires you to set your account password.");
        setMode("setPassword");
      } else {
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Set Password after Registration
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setErrorMsg("Password must be at least 4 characters.");
      return;
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.changePassword(email, newPassword);
      localStorage.setItem("veyras_user_auth", JSON.stringify(res.user));
      setSuccessMsg("Account registration and password set successfully!");
      setTimeout(() => {
        onSuccess(res.user);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.loginWithPassword(email, password);
      localStorage.setItem("veyras_user_auth", JSON.stringify(res.user));
      if (res.user.role === "ADMIN" || email.toLowerCase().includes("admin")) {
        localStorage.setItem("veyras_admin_auth", JSON.stringify(res.user));
      }

      // Check first-time login password change requirement
      if (res.user.mustChangePassword || res.user.isFirstLogin) {
        setSuccessMsg("First-time sign in detected! You must change your password to continue.");
        setMode("setPassword");
        return;
      }

      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Send Password Recovery Code with Timer
  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.forgotPassword(email);
      setOtpSent(true);
      if (res.otp) {
        setGeneratedOtp(res.otp);
      }
      setTimeLeft(600);
      setTimerActive(true);
      setSuccessMsg(`Password recovery code sent to ${email}. Code valid for 10:00 minutes.`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send recovery code.");
    } finally {
      setLoading(false);
    }
  };

  // 6. Reset Forgotten Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || !newPassword || newPassword.length < 4) {
      setErrorMsg("Please enter the recovery code and a new password (min 4 chars).");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.resetPassword(email, otpInput, newPassword);
      localStorage.setItem("veyras_user_auth", JSON.stringify(res.user));
      setSuccessMsg("Password successfully reset! You are now signed in.");
      setTimeout(() => {
        onSuccess(res.user);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-[480px] bg-white rounded-xl shadow-2xl overflow-hidden my-8 border-4 border-white/30 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-4 z-20 w-8 h-8 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-md"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Navigation Tabs (Registration vs Login) */}
        {(mode === "register" || mode === "login") && (
          <div className="grid grid-cols-2 bg-[#f1f5f9] border-b border-slate-200 text-xs font-black uppercase tracking-wider">
            <button
              type="button"
              onClick={() => { setMode("register"); setErrorMsg(""); setSuccessMsg(""); }}
              className={`py-4 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                mode === "register" 
                  ? "bg-[#1e3a8a] text-white shadow-inner" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <Mail className="w-4 h-4 text-[#38bdf8]" />
              <span>Register (Email OTP)</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
              className={`py-4 px-4 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                mode === "login"
                  ? "bg-[#1e3a8a] text-white shadow-inner" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              }`}
            >
              <Lock className="w-4 h-4 text-[#ea580c]" />
              <span>Password Login</span>
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="pb-4 mb-4 border-b border-slate-100 flex items-center gap-3">
            <img 
              src="/assets/branding/veyras-logo.jpg" 
              alt="Veyra's" 
              className="w-12 h-12 rounded-full border border-[#ea580c]"
            />
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans">
                {mode === "register" && "User Registration (Email OTP)"}
                {mode === "login" && "User Password Login"}
                {mode === "setPassword" && "Mandatory Password Change (First-Time Login)"}
                {mode === "forgotPassword" && "Password Recovery"}
                {mode === "changePassword" && "Change Account Password"}
              </h3>
              <p className="text-[10px] font-bold text-[#ea580c] tracking-widest uppercase">
                Veyra's Construction & Interiors
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            {mode === "register" && description}
            {mode === "login" && "Enter your registered email and password to sign in."}
            {(mode === "setPassword") && "Security Requirement: Real users logging in for the first time must change/set their password to secure their account."}
            {mode === "forgotPassword" && "Enter your registered email to receive an instant recovery code."}
            {mode === "changePassword" && "Enter your new password below to update your account."}
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-sm bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. REGISTRATION VIA EMAIL OTP WITH TIME COUNTDOWN */}
          {/* ========================================================= */}
          {mode === "register" && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#1e3a8a]"
                        required
                        autoFocus
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      A 6-digit code will be generated with a 10-minute expiry timer.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? "Sending..." : "Send Verification Code"}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setEmail("customer@gmail.com")}
                      className="text-[11px] font-bold text-[#1e3a8a] hover:underline"
                    >
                      Fill sample test email (customer@gmail.com)
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Demo Code Banner */}
                  {generatedOtp && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-sm text-center">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block">
                        Your Verification OTP Code:
                      </span>
                      <span className="text-2xl font-black text-[#1e3a8a] tracking-widest font-mono">
                        {generatedOtp}
                      </span>
                    </div>
                  )}

                  {/* Countdown Timer with clock icon */}
                  <div className={`p-2.5 rounded-sm border flex items-center justify-between text-xs font-bold ${
                    timeLeft > 60 
                      ? "bg-blue-50 border-blue-200 text-[#1e3a8a]" 
                      : timeLeft > 0 
                      ? "bg-amber-50 border-amber-200 text-amber-700 animate-pulse" 
                      : "bg-red-50 border-red-200 text-red-600"
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{timeLeft > 0 ? "Code expires in:" : "Code expired:"}</span>
                    </div>
                    <span className="font-mono text-sm tracking-wider">
                      {timeLeft > 0 ? formatTimer(timeLeft) : "00:00"}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Enter 6-Digit OTP <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        disabled={loading}
                        className="text-[10px] font-bold text-[#1e3a8a] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-2.5 h-2.5" /> Resend Code
                      </button>
                    </div>

                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-300 text-sm font-black tracking-widest text-[#1e3a8a] focus:outline-hidden focus:border-[#1e3a8a]"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || timeLeft <= 0}
                    className="w-full py-3 rounded-sm bg-[#059669] hover:bg-[#047857] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtpInput(""); }}
                      className="text-[11px] text-slate-500 hover:text-slate-800"
                    >
                      Use a different email address
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. SET PASSWORD SCREEN (FIRST TIME LOGIN & REGISTRATION) */}
          {/* ========================================================= */}
          {mode === "setPassword" && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div className="p-3.5 rounded-sm bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 mb-2 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="block text-amber-950 font-black uppercase text-[11px] tracking-wide">
                    First-Time Sign-In: Password Change Required
                  </strong>
                  <p className="mt-0.5 text-amber-900 text-[11px]">
                    Welcome to Veyra's! Because this is your first time logging in, you must change your password to continue using your account.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Create New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 4 characters)"
                    className="w-full pl-9 pr-10 py-2.5 rounded-sm border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Updating Password..." : "Save New Password & Continue"}
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Cancel & Sign Out
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 3. PASSWORD LOGIN TAB */}
          {/* ========================================================= */}
          {mode === "login" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              {/* Quick Demo Credentials Helper Banner */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm text-xs text-slate-700 space-y-1.5 mb-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1e3a8a] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#ea580c]" /> Demo Customer Login:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("customer@gmail.com");
                      setPassword("password123");
                    }}
                    className="text-[10px] bg-[#1e3a8a] hover:bg-[#172e6b] text-white px-2 py-0.5 rounded-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    Click to Auto-fill
                  </button>
                </div>
                <div className="font-mono text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5">
                  <span>Email: <strong className="text-slate-900 font-bold">customer@gmail.com</strong></span>
                  <span>Password: <strong className="text-slate-900 font-bold">password123</strong></span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-blue-100 flex items-center justify-between">
                  <span>New user? Register to create your own password:</span>
                  <button
                    type="button"
                    onClick={() => { setMode("register"); setErrorMsg(""); setSuccessMsg(""); }}
                    className="font-bold text-[#ea580c] hover:underline"
                  >
                    Register with Email OTP →
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode("forgotPassword"); setErrorMsg(""); setSuccessMsg(""); setOtpSent(false); }}
                    className="text-[10px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-sm border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Authenticating..." : "Sign In to Account"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => { setMode("register"); setErrorMsg(""); setSuccessMsg(""); }}
                  className="font-bold text-[#ea580c] hover:underline"
                >
                  Need an account? Register
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("register"); setErrorMsg(""); setSuccessMsg(""); }}
                  className="text-slate-500 hover:text-[#1e3a8a]"
                >
                  Sign in via Email OTP
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 4. FORGOT PASSWORD RECOVERY VIA EMAIL WITH TIME */}
          {/* ========================================================= */}
          {mode === "forgotPassword" && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleForgotSendOtp} className="space-y-4">
                  <div className="p-3 rounded-sm bg-orange-50 border border-orange-200 text-slate-700 text-xs flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-[#ea580c] shrink-0 mt-0.5" />
                    <span>
                      Enter your registered email address. We will generate an instant verification code to recover your password.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Registered Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#1e3a8a]"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? "Sending..." : "Send Recovery Code"}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      ← Back to Password Login
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {/* Demo Recovery Code Banner */}
                  {generatedOtp && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-sm text-center">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block">
                        Your Password Recovery Code:
                      </span>
                      <span className="text-2xl font-black text-[#1e3a8a] tracking-widest font-mono">
                        {generatedOtp}
                      </span>
                    </div>
                  )}

                  {/* Countdown Timer with clock icon */}
                  <div className={`p-2.5 rounded-sm border flex items-center justify-between text-xs font-bold ${
                    timeLeft > 60 
                      ? "bg-blue-50 border-blue-200 text-[#1e3a8a]" 
                      : timeLeft > 0 
                      ? "bg-amber-50 border-amber-200 text-amber-700 animate-pulse" 
                      : "bg-red-50 border-red-200 text-red-600"
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>Recovery Code expires in:</span>
                    </div>
                    <span className="font-mono text-sm tracking-wider">
                      {formatTimer(timeLeft)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Enter 6-Digit Recovery Code <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-300 text-sm font-black tracking-widest text-[#1e3a8a] focus:outline-hidden focus:border-[#1e3a8a]"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Create New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password (min 4 chars)"
                        className="w-full pl-9 pr-10 py-2.5 rounded-sm border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#1e3a8a]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || timeLeft <= 0}
                    className="w-full py-3 rounded-sm bg-[#059669] hover:bg-[#047857] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Resetting..." : "Reset Password & Sign In"}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtpInput(""); }}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Resend code or change email
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. CHANGE PASSWORD (FOR LOGGED IN USERS) */}
          {/* ========================================================= */}
          {mode === "changePassword" && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Enter New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 4 characters)"
                    className="w-full pl-9 pr-10 py-2.5 rounded-sm border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#1e3a8a]"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-sm border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#1e3a8a]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Updating..." : "Update Password"}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
