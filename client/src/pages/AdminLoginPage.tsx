import React, { useState } from 'react';
import { Lock, KeyRound, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, Building2, Eye, EyeOff } from 'lucide-react';
import { AuthUser } from '../types';

interface AdminLoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onBackToHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToHome
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      // Validate Admin credentials
      const cleanUser = username.trim().toLowerCase();
      if ((cleanUser === 'admin' || cleanUser === 'admin@veyrasinteriors.com') && password === 'admin123') {
        const adminUser: AuthUser = {
          id: 'admin-master',
          email: 'admin@veyrasinteriors.com',
          name: 'Principal Architect & Admin',
          role: 'ADMIN'
        };
        localStorage.setItem('veyras_admin_auth', JSON.stringify(adminUser));
        localStorage.setItem('veyras_user_auth', JSON.stringify(adminUser));
        onLoginSuccess(adminUser);
      } else {
        setErrorMsg('Invalid administrative credentials. Access restricted.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-900 py-16 px-4 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#1e3a8a]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#ea580c]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-md text-white">
        
        {/* Back Link */}
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#ea580c]" /> Return to Public Portal
        </button>

        {/* Header with Logo */}
        <div className="flex items-center gap-3.5 pb-6 mb-6 border-b border-slate-700/60">
          <img 
            src="/assets/branding/veyras-logo.jpg" 
            alt="Veyra's Construction and Interiors" 
            className="w-14 h-14 object-contain rounded-full border-2 border-[#ea580c] shadow-lg"
          />
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">
              VEYRA'S <span className="text-[#ea580c]">ADMIN</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Studio Operations & CMS Gateway
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mb-6 p-3 rounded-md bg-[#1e3a8a]/20 border border-[#1e3a8a]/40 text-slate-300 text-xs flex items-start gap-2.5 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
          <span>
            <strong>Confidential Portal:</strong> Authorized personnel only. Controls live project listings, pricing, client enquiries, and payment gateways.
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Identifier / Email
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or admin@veyrasinteriors.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/80 rounded-md border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ea580c] transition-colors"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-900/80 rounded-md border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#ea580c] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-md bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Operations Panel'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-700/60 text-center">
          <span className="text-[11px] text-slate-400">
            Authorized Studio credentials: <code className="text-slate-300 bg-slate-900/60 px-1.5 py-0.5 rounded font-mono">admin</code> / <code className="text-slate-300 bg-slate-900/60 px-1.5 py-0.5 rounded font-mono">admin123</code>
          </span>
        </div>

      </div>
    </div>
  );
};
