import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  UserPlus,
  Key,
  Trash2,
  Heart,
  Star,
  MessageSquare,
  Bot,
  Sparkles,
  Search,
  X
} from "lucide-react";
import { AuthUser, UserRole } from "../../types";
import { api } from "../../services/api";

export const UsersRolesTab: React.FC = () => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Add User Modal
  const [showAddUser, setShowAddUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("veyras2026");
  const [newRole, setNewRole] = useState<UserRole>("ARCHITECT");
  const [newTitle, setNewTitle] = useState("Senior Interior Architect");
  const [newDepartment, setNewDepartment] = useState("Design & Execution");
  const [newMustChange, setNewMustChange] = useState(true);

  // Reset Password Modal
  const [resetTargetUser, setResetTargetUser] = useState<AuthUser | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState("");

  // Ollama User Behavior Analysis
  const [aiUserAnalysis, setAiUserAnalysis] = useState("");
  const [isAnalyzingUsers, setIsAnalyzingUsers] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    try {
      await api.createUser({
        name: newName,
        email: newEmail,
        phone: newPhone,
        password: newPassword,
        role: newRole,
        title: newTitle,
        department: newDepartment,
        mustChangePassword: newMustChange
      });
      setShowAddUser(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      alert("✅ New user account & role created in PostgreSQL!");
      loadUsers();
    } catch (err: any) {
      alert("Failed to create user: " + err.message);
    }
  };

  const handleRoleChange = async (user: AuthUser, role: string) => {
    try {
      await api.updateUser(user.id, { role });
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, role } : u)));
    } catch {
      alert("Failed to update user role");
    }
  };

  const handleStatusToggle = async (user: AuthUser) => {
    const nextStatus = user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    try {
      await api.updateUser(user.id, { status: nextStatus });
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, status: nextStatus } : u)));
    } catch {
      alert("Failed to update user status");
    }
  };

  const handleResetUserPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser || resetPasswordValue.trim().length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }
    try {
      await api.updateUser(resetTargetUser.id, {
        newPassword: resetPasswordValue.trim(),
        mustChangePassword: false
      });
      alert(`✅ Password updated for ${resetTargetUser.email}`);
      setResetTargetUser(null);
      setResetPasswordValue("");
      loadUsers();
    } catch {
      alert("Failed to reset password");
    }
  };

  const handleDeleteUser = async (user: AuthUser) => {
    if (user.email === "admin@veyrasinteriors.com") {
      alert("Primary Super Admin account cannot be deleted.");
      return;
    }
    if (!confirm(`Delete user account ${user.email}?`)) return;
    try {
      await api.deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch {
      alert("Failed to delete user");
    }
  };

  const handleRunUserAiAnalysis = async () => {
    try {
      setIsAnalyzingUsers(true);
      const res = await api.analyzeUsersWithOllama("llama3.2:3b");
      setAiUserAnalysis(res.analysis);
    } catch (err: any) {
      alert("Failed to run Ollama user behavior analysis: " + err.message);
    } finally {
      setIsAnalyzingUsers(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesSearch =
      !searchQuery ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.title && u.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const roleBadgeClass = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-700 border-red-200";
      case "MANAGER":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "ARCHITECT":
        return "bg-blue-100 text-[#1e3a8a] border-blue-200";
      case "EDITOR":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1e3a8a] shrink-0" />
            User Directory, RBAC Roles & Behavioral Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage client portal users and internal staff roles (Admin, Manager, Architect, Editor), audit wishlists/likes, and run Ollama AI buyer-intent scoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleRunUserAiAnalysis}
            disabled={isAnalyzingUsers}
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2.5 rounded-sm bg-[#059669] hover:bg-[#047857] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Bot className="w-4 h-4 shrink-0" />
            <span>{isAnalyzingUsers ? "Analyzing..." : "AI Cohort Analysis"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddUser(true)}
            className="flex-1 sm:flex-initial justify-center px-4 py-2.5 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4 shrink-0" /> <span>+ Add Staff / User</span>
          </button>
        </div>
      </div>

      {/* 2. Role Distribution KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        {[
          { label: "Total Accounts", count: users.length, role: "ALL", color: "text-slate-900" },
          { label: "Super Admins", count: users.filter(u => u.role === "ADMIN").length, role: "ADMIN", color: "text-red-600" },
          { label: "Managers", count: users.filter(u => u.role === "MANAGER").length, role: "MANAGER", color: "text-purple-600" },
          { label: "Architects / Staff", count: users.filter(u => u.role === "ARCHITECT" || u.role === "EDITOR").length, role: "ARCHITECT", color: "text-[#1e3a8a]" },
          { label: "Portal Clients", count: users.filter(u => u.role === "USER").length, role: "USER", color: "text-[#059669]" }
        ].map(card => (
          <div
            key={card.label}
            onClick={() => setRoleFilter(card.role)}
            className={`bg-white p-3.5 sm:p-4 rounded-md border cursor-pointer transition-all ${
              roleFilter === card.role ? "border-[#1e3a8a] ring-1 ring-[#1e3a8a]" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">{card.label}</span>
            <div className={`text-xl sm:text-2xl font-black mt-1 ${card.color}`}>{card.count}</div>
          </div>
        ))}
      </div>

      {/* Ollama AI User Behavior Output */}
      {aiUserAnalysis && (
        <div className="bg-emerald-50/60 rounded-lg border border-emerald-200 p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 shrink-0" /> Ollama AI User Behavior & Lead Intent Report
            </h3>
            <button
              type="button"
              onClick={() => setAiUserAnalysis("")}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="bg-white p-4 rounded-md border border-emerald-100 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
            {aiUserAnalysis}
          </div>
        </div>
      )}

      {/* 3. Users & Roles (Mobile Cards + Desktop Table) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {["ALL", "ADMIN", "MANAGER", "ARCHITECT", "EDITOR", "USER"].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-xs text-xs font-black uppercase cursor-pointer ${
                  roleFilter === r ? "bg-[#1e3a8a] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search name, email, or title..."
              className="w-full pl-8 pr-3 py-2 rounded-sm border border-slate-300 text-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 font-bold text-xs">
            Loading user accounts from PostgreSQL...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">No matching users found.</div>
        ) : (
          <>
            {/* Mobile Phone User Cards (< md) */}
            <div className="md:hidden divide-y divide-slate-200">
              {filteredUsers.map(u => (
                <div key={u.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-black text-slate-900 text-sm">{u.name}</div>
                      <div className="text-xs text-slate-500 font-mono break-all">{u.email}</div>
                      {u.phone && <div className="text-xs text-slate-400">{u.phone}</div>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(u)}
                      className={`px-2 py-0.5 rounded-xs text-xs font-bold uppercase shrink-0 ${
                        u.status === "SUSPENDED"
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {u.status || "ACTIVE"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-800">{u.title || "Client"}</div>
                      <div className="text-slate-400">{u.department || "General"}</div>
                    </div>
                    <div className="flex items-center gap-2.5 font-bold">
                      <span className="flex items-center gap-1 text-pink-600">
                        <Heart className="w-3.5 h-3.5 fill-pink-500" /> {u.wishlistCount || 0}
                      </span>
                      <span className="flex items-center gap-1 text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {u.reviewsCount || 0}
                      </span>
                      <span className="flex items-center gap-1 text-[#1e3a8a]">
                        <MessageSquare className="w-3.5 h-3.5" /> {u.enquiriesCount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u, e.target.value)}
                      className={`flex-1 px-2.5 py-2 rounded-sm text-xs font-black uppercase border ${roleBadgeClass(
                        u.role
                      )}`}
                    >
                      <option value="ADMIN">ADMIN (Full Access)</option>
                      <option value="MANAGER">MANAGER (Ops & Ads)</option>
                      <option value="ARCHITECT">ARCHITECT (Projects & Leads)</option>
                      <option value="EDITOR">EDITOR (CMS & Menus)</option>
                      <option value="USER">USER (Client Portal)</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        setResetTargetUser(u);
                        setResetPasswordValue("");
                      }}
                      className="px-3 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Key className="w-3.5 h-3.5" /> Reset PW
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteUser(u)}
                      className="p-2 rounded-sm bg-red-50 text-red-600 border border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">User / Staff Details</th>
                    <th className="py-3 px-4">Title & Department</th>
                    <th className="py-3 px-4">Assigned Role (RBAC)</th>
                    <th className="py-3 px-4">Portal Activity</th>
                    <th className="py-3 px-4">Security & Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{u.email}</div>
                        {u.phone && <div className="text-xs text-slate-400">{u.phone}</div>}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{u.title || "Client"}</div>
                        <div className="text-xs text-slate-400">{u.department || "General"}</div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u, e.target.value)}
                          className={`px-2 py-1 rounded-xs text-xs font-black uppercase border cursor-pointer ${roleBadgeClass(
                            u.role
                          )}`}
                        >
                          <option value="ADMIN">ADMIN (Full Access)</option>
                          <option value="MANAGER">MANAGER (Ops & Ads)</option>
                          <option value="ARCHITECT">ARCHITECT (Projects & Leads)</option>
                          <option value="EDITOR">EDITOR (CMS & Menus)</option>
                          <option value="USER">USER (Client Portal)</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5 text-xs font-semibold">
                          <span className="flex items-center gap-1 text-pink-600" title="Saved Wishlists">
                            <Heart className="w-3 h-3 fill-pink-500" /> {u.wishlistCount || 0}
                          </span>
                          <span className="flex items-center gap-1 text-amber-600" title="Reviews Posted">
                            <Star className="w-3 h-3 fill-amber-400" /> {u.reviewsCount || 0}
                          </span>
                          <span className="flex items-center gap-1 text-[#1e3a8a]" title="Enquiries Submitted">
                            <MessageSquare className="w-3 h-3" /> {u.enquiriesCount || 0}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {u.likesCount || 0} Project Likes
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusToggle(u)}
                            className={`px-2 py-0.5 rounded-xs text-xs font-bold uppercase cursor-pointer ${
                              u.status === "SUSPENDED"
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {u.status || "ACTIVE"}
                          </button>
                          {u.mustChangePassword && (
                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-xs font-bold">
                              Reset Pending
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setResetTargetUser(u);
                              setResetPasswordValue("");
                            }}
                            className="p-2 rounded-xs bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="Reset User Password"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            className="p-2 rounded-xs hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* 4. Role-Based Access Control (RBAC) Matrix Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 sm:p-5">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#1e3a8a] shrink-0" />
          Role-Based Access Control (RBAC) Governance Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 min-w-[540px]">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase">
              <tr>
                <th className="py-2.5 px-3 border-b border-slate-200">Role Tier</th>
                <th className="py-2.5 px-3 border-b border-slate-200">CMS & Menus</th>
                <th className="py-2.5 px-3 border-b border-slate-200">Enquiries & Orders</th>
                <th className="py-2.5 px-3 border-b border-slate-200">Meta Ads & Ollama AI</th>
                <th className="py-2.5 px-3 border-b border-slate-200">API Keys, SMTP & Users</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-3 font-black text-red-700">ADMIN (Super Admin)</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Full Control</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Full Control</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Full Control</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Full Control</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-black text-purple-700">MANAGER (Operations)</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Edit & Publish</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Manage Pipeline</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Manage Campaigns</td>
                <td className="py-2 px-3 text-slate-400">Read-Only</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-black text-[#1e3a8a]">ARCHITECT (Design Lead)</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Portfolio & Rates</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Site Consultations</td>
                <td className="py-2 px-3 text-slate-600">View AI Insights</td>
                <td className="py-2 px-3 text-slate-400">Restricted</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-black text-amber-700">EDITOR (Content)</td>
                <td className="py-2 px-3 text-emerald-600 font-bold">✓ Menus, Services, SEO</td>
                <td className="py-2 px-3 text-slate-400">Restricted</td>
                <td className="py-2 px-3 text-slate-600">Draft Copy Only</td>
                <td className="py-2 px-3 text-slate-400">Restricted</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-black text-emerald-700">USER (Verified Client)</td>
                <td className="py-2 px-3 text-slate-500">Public Browsing</td>
                <td className="py-2 px-3 text-slate-500">Submit Enquiries & Wishlist</td>
                <td className="py-2 px-3 text-slate-400">Hidden</td>
                <td className="py-2 px-3 text-slate-400">Hidden</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add User / Staff */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-5 sm:p-6 border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-900 uppercase">Create Staff or User Account</h3>
              <button onClick={() => setShowAddUser(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. Ar. Karthik Shetty"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="karthik@veyrasinteriors.com"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="+91 98450 00000"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Assign RBAC Role *</label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="ADMIN">ADMIN (Super Admin)</option>
                    <option value="MANAGER">MANAGER (Operations & Ads)</option>
                    <option value="ARCHITECT">ARCHITECT (Design & Projects)</option>
                    <option value="EDITOR">EDITOR (CMS & Menus)</option>
                    <option value="USER">USER (Client Portal)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Job Title / Designation</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={e => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Initial Password *</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newMustChange}
                  onChange={e => setNewMustChange(e.target.checked)}
                  className="accent-[#ea580c] w-4 h-4"
                />
                Require mandatory password change on first login
              </label>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 rounded-sm border border-slate-300 text-slate-600 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-[#1e3a8a] text-white text-xs font-black uppercase cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reset Password */}
      {resetTargetUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-5 sm:p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-900 uppercase">
                Reset Password: {resetTargetUser.name}
              </h3>
              <button onClick={() => setResetTargetUser(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleResetUserPassword} className="space-y-4">
              <p className="text-xs text-slate-500">
                Setting a new password for <strong>{resetTargetUser.email}</strong> ({resetTargetUser.role}).
              </p>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">New Password *</label>
                <input
                  type="text"
                  value={resetPasswordValue}
                  onChange={e => setResetPasswordValue(e.target.value)}
                  placeholder="Enter new password (min 4 chars)"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                  required
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="px-3 py-1.5 rounded-sm border border-slate-300 text-slate-600 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-sm bg-[#ea580c] text-white text-xs font-black uppercase cursor-pointer"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
