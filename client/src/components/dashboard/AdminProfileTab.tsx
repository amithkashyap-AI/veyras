import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  ShieldCheck,
  Save,
  KeyRound,
  CheckCircle2,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";
import { AuthUser } from "../../types";
import { api } from "../../services/api";

export const AdminProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<string>("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      const savedAdmin = localStorage.getItem("veyras_admin_auth") || sessionStorage.getItem("veyras_admin_auth");
      const parsed = savedAdmin ? JSON.parse(savedAdmin) : null;
      const email = parsed?.email || "admin@veyrasinteriors.com";
      const data = await api.getAdminProfile(email);
      setProfile(data);
    } catch (err) {
      console.error("Failed to load admin profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const updated = await api.updateAdminProfile({
        id: profile.id,
        currentEmail: profile.email,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        title: profile.title,
        department: profile.department,
        bio: profile.bio,
        twoFactorEnabled: profile.twoFactorEnabled
      });
      setProfile(updated);
      localStorage.setItem("veyras_admin_auth", JSON.stringify(updated));
      alert("✅ Admin profile updated in PostgreSQL!");
    } catch (err: any) {
      alert("Failed to update admin profile: " + err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus("");
    if (newPassword.trim().length < 4) {
      alert("New password must be at least 4 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    try {
      const res = await api.changeAdminPassword({
        email: profile?.email || "admin@veyrasinteriors.com",
        currentPassword: currentPassword || undefined,
        newPassword: newPassword.trim()
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus(res.message || "Admin password updated!");
      alert("✅ Admin password updated in PostgreSQL!");
    } catch (err: any) {
      alert("Password update failed: " + err.message);
    }
  };

  if (loading || !profile) {
    return (
      <div className="p-10 text-center bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-400">
        Loading Admin Profile & Security Settings...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Admin Identity Banner */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1e3a8a] to-[#ea580c] text-white flex items-center justify-center text-2xl font-black shadow-md">
            {(profile.name || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">{profile.name}</h2>
              <span className="px-2 py-0.5 rounded-xs bg-red-100 text-red-700 text-xs font-black uppercase">
                {profile.role}
              </span>
            </div>
            <p className="text-xs font-bold text-[#1e3a8a] mt-0.5">
              {profile.title || "Principal Architect & Managing Director"} • {profile.department || "Executive Leadership"}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{profile.email}</p>
          </div>
        </div>

        <div className="flex flex-col items-end text-right text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> TLS 256-Bit SSL & RBAC Active
          </span>
          {profile.lastLoginAt && (
            <span className="text-xs text-slate-400 mt-1">
              Last Login: {new Date(profile.lastLoginAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* 2. Two-Column Layout: Profile Editor & Change Password */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Edit Admin Profile */}
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1e3a8a]" />
                Admin Profile & Contact Details
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Update your executive profile, designation, and security preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={profile.name || ""}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Admin Login Email *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={profile.email || ""}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Direct Phone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={profile.phone || ""}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-sm border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Designation Title
              </label>
              <div className="relative">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={profile.title || ""}
                  onChange={e => setProfile({ ...profile, title: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-sm border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={profile.department || ""}
                onChange={e => setProfile({ ...profile, department: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Executive Bio / Signature Note
              </label>
              <textarea
                rows={3}
                value={profile.bio || ""}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={profile.twoFactorEnabled ?? true}
              onChange={e => setProfile({ ...profile, twoFactorEnabled: e.target.checked })}
              className="accent-[#1e3a8a] w-4 h-4"
            />
            Enable 10-Minute Timed Email OTP Two-Factor Verification
          </label>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Admin Profile
            </button>
          </div>
        </form>

        {/* Right: Change Admin Password */}
        <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#ea580c]" />
              Change Admin Password
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Update your master administrator password stored in PostgreSQL
            </p>
          </div>

          {passwordStatus && (
            <div className="p-3 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {passwordStatus}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password (default: admin123)"
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                New Password *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 text-sm text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#ea580c]" /> Active Security Policies:
            </div>
            <p>• Admin portal isolated at <code>/#admin-login</code></p>
            <p>• First-time client logins enforce mandatory password update</p>
            <p>• Email OTP codes expire strictly after 600 seconds (10:00 timer)</p>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" /> Update Admin Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
