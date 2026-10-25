import React, { useState } from "react";
import {
  MessageCircle,
  Key,
  Mail,
  CreditCard,
  Globe,
  Save,
  Send,
  Bot,
  Instagram,
  CheckCircle2
} from "lucide-react";
import { SystemConfig } from "../../types";
import { api } from "../../services/api";

interface IntegrationsConfigTabProps {
  config: SystemConfig;
  setConfig: React.Dispatch<React.SetStateAction<SystemConfig | null>>;
  initialSection?: "whatsapp" | "apikeys" | "smtp" | "payment" | "seo";
  onRefreshAll?: () => void;
}

export const IntegrationsConfigTab: React.FC<IntegrationsConfigTabProps> = ({
  config,
  setConfig,
  initialSection = "whatsapp",
  onRefreshAll
}) => {
  const [section, setSection] = useState<"whatsapp" | "apikeys" | "smtp" | "payment" | "seo">(initialSection);
  const [saving, setSaving] = useState(false);
  const [testBanner, setTestBanner] = useState<string>("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.updateConfig(config);
      setConfig(updated);
      alert("✅ Configuration saved to PostgreSQL!");
      if (onRefreshAll) onRefreshAll();
    } catch {
      alert("Failed to save system configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleTestWhatsApp = async () => {
    try {
      const res = await api.testWhatsAppConfig(config.whatsappBusinessNumber);
      setTestBanner(res.message);
    } catch {
      alert("WhatsApp API test failed.");
    }
  };

  const handleTestSmtp = async () => {
    try {
      const res = await api.testSmtpConfig(config.senderEmail);
      setTestBanner(res.message);
    } catch {
      alert("SMTP test failed.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Sub-navigation bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => { setSection("whatsapp"); setTestBanner(""); }}
            className={`px-3.5 py-2 rounded-sm text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
              section === "whatsapp"
                ? "bg-[#10b981] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Cloud API
          </button>

          <button
            type="button"
            onClick={() => { setSection("apikeys"); setTestBanner(""); }}
            className={`px-3.5 py-2 rounded-sm text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
              section === "apikeys"
                ? "bg-[#1e3a8a] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Key className="w-3.5 h-3.5" /> API Keys (Ollama, Meta, Maps)
          </button>

          <button
            type="button"
            onClick={() => { setSection("smtp"); setTestBanner(""); }}
            className={`px-3.5 py-2 rounded-sm text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
              section === "smtp"
                ? "bg-[#0284c7] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Mail className="w-3.5 h-3.5" /> Email SMTP Config
          </button>

          <button
            type="button"
            onClick={() => { setSection("payment"); setTestBanner(""); }}
            className={`px-3.5 py-2 rounded-sm text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
              section === "payment"
                ? "bg-[#059669] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Payment Gateway
          </button>

          <button
            type="button"
            onClick={() => { setSection("seo"); setTestBanner(""); }}
            className={`px-3.5 py-2 rounded-sm text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
              section === "seo"
                ? "bg-[#7c3aed] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> SEO & Analytics
          </button>
        </div>
      </div>

      {testBanner && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            {testBanner}
          </span>
          <button
            type="button"
            onClick={() => setTestBanner("")}
            className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SECTION 1: WHATSAPP CONFIGURATION */}
      {section === "whatsapp" && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#10b981]" />
                WhatsApp Business Cloud API & Instant Chat Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure Meta WhatsApp Business API credentials, automated consultation replies, and floating WhatsApp chat triggers.
              </p>
            </div>
            <span className="text-xs font-bold text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200">
              Active: {config.whatsappBusinessNumber || "918921336363"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                WhatsApp API Provider
              </label>
              <select
                value={config.whatsappProvider || "Meta WhatsApp Cloud API"}
                onChange={e => setConfig({ ...config, whatsappProvider: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="Meta WhatsApp Cloud API">Meta WhatsApp Cloud API (Official Graph v20.0)</option>
                <option value="WATI Business API">WATI WhatsApp Gateway</option>
                <option value="Twilio WhatsApp API">Twilio Programmable WhatsApp</option>
                <option value="Interakt">Interakt Commerce CRM</option>
                <option value="Direct wa.me Click-to-Chat">Direct wa.me Click-to-Chat Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                WhatsApp Business Number (with Country Code) *
              </label>
              <input
                type="text"
                value={config.whatsappBusinessNumber || ""}
                onChange={e => setConfig({ ...config, whatsappBusinessNumber: e.target.value })}
                placeholder="918921336363"
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Phone Number ID (Meta Cloud)
              </label>
              <input
                type="text"
                value={config.whatsappPhoneNumberId || ""}
                onChange={e => setConfig({ ...config, whatsappPhoneNumberId: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                WhatsApp Business Account ID (WABA)
              </label>
              <input
                type="text"
                value={config.whatsappBusinessAccountId || ""}
                onChange={e => setConfig({ ...config, whatsappBusinessAccountId: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Permanent System User Access Token
              </label>
              <input
                type="password"
                value={config.whatsappAccessToken || ""}
                onChange={e => setConfig({ ...config, whatsappAccessToken: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Webhook Verify Token
              </label>
              <input
                type="text"
                value={config.whatsappWebhookToken || ""}
                onChange={e => setConfig({ ...config, whatsappWebhookToken: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Automated Welcome & Enquiry Acknowledgement Template
              </label>
              <textarea
                rows={2}
                value={config.whatsappWelcomeTemplate || ""}
                onChange={e => setConfig({ ...config, whatsappWelcomeTemplate: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={config.whatsappAutoReply ?? true}
                onChange={e => setConfig({ ...config, whatsappAutoReply: e.target.checked })}
                className="accent-[#10b981] w-4 h-4"
              />
              Auto-Send WhatsApp Confirmation on New Site Consultation Enquiry
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableFloatingWhatsApp ?? true}
                onChange={e => setConfig({ ...config, enableFloatingWhatsApp: e.target.checked })}
                className="accent-[#10b981] w-4 h-4"
              />
              Enable Direct WhatsApp Buttons Across Navbar, Services & Cards
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-sm bg-[#10b981] hover:bg-[#059669] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save WhatsApp Configuration
            </button>

            <button
              type="button"
              onClick={handleTestWhatsApp}
              className="px-4 py-2 rounded-sm border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#10b981]" /> Test WhatsApp Dispatch
            </button>
          </div>
        </form>
      )}

      {/* SECTION 2: API KEYS VAULT (OLLAMA, META ADS, MAPS, CLOUD) */}
      {section === "apikeys" && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Key className="w-5 h-5 text-[#1e3a8a]" />
              API Keys Vault: Local Ollama LLM, Meta Marketing Graph API & Cloud Services
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Centralized management for AI endpoints, Facebook/Instagram Ads Graph tokens, Google Maps, and media storage.
            </p>
          </div>

          {/* Ollama LLM Settings */}
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
              <Bot className="w-4 h-4" /> 1. Ollama Local AI Engine Configuration
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Ollama Daemon Endpoint URL
                </label>
                <input
                  type="text"
                  value={config.ollamaEndpoint || "http://localhost:11434"}
                  onChange={e => setConfig({ ...config, ollamaEndpoint: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Default LLM Model Name
                </label>
                <input
                  type="text"
                  value={config.ollamaDefaultModel || "llama3.2:3b"}
                  onChange={e => setConfig({ ...config, ollamaDefaultModel: e.target.value })}
                  placeholder="llama3.2:3b or qwen:latest"
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Sampling Temperature (0.1 - 1.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={config.ollamaTemperature ?? 0.7}
                  onChange={e => setConfig({ ...config, ollamaTemperature: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>
          </div>

          {/* Meta (Facebook & Instagram) Marketing API Keys */}
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
              <Instagram className="w-4 h-4" /> 2. Meta (Facebook & Instagram) Graph API & Pixel Keys
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Meta App ID</label>
                <input
                  type="text"
                  value={config.metaAppId || ""}
                  onChange={e => setConfig({ ...config, metaAppId: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Meta App Secret</label>
                <input
                  type="password"
                  value={config.metaAppSecret || ""}
                  onChange={e => setConfig({ ...config, metaAppSecret: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Ad Account ID (act_...)
                </label>
                <input
                  type="text"
                  value={config.metaAdAccountId || ""}
                  onChange={e => setConfig({ ...config, metaAdAccountId: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Meta Pixel ID</label>
                <input
                  type="text"
                  value={config.metaPixelId || ""}
                  onChange={e => setConfig({ ...config, metaPixelId: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Instagram Business Account ID
                </label>
                <input
                  type="text"
                  value={config.instagramAccountId || ""}
                  onChange={e => setConfig({ ...config, instagramAccountId: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Marketing API Access Token
                </label>
                <input
                  type="password"
                  value={config.metaAccessToken || ""}
                  onChange={e => setConfig({ ...config, metaAccessToken: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
            </div>
          </div>

          {/* Maps & Cloud Storage Keys */}
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1e3a8a]">
              3. Google Maps, Analytics & Cloud Media Storage Keys
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Google Maps JavaScript API Key
                </label>
                <input
                  type="password"
                  value={config.googleMapsApiKey || ""}
                  onChange={e => setConfig({ ...config, googleMapsApiKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Google Analytics 4 ID
                </label>
                <input
                  type="text"
                  value={config.googleAnalyticsId || ""}
                  onChange={e => setConfig({ ...config, googleAnalyticsId: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                  Cloudinary / S3 Media Key
                </label>
                <input
                  type="password"
                  value={config.cloudinaryApiKey || ""}
                  onChange={e => setConfig({ ...config, cloudinaryApiKey: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save All API Keys & Endpoints
            </button>
          </div>
        </form>
      )}

      {/* SECTION 3: EMAIL SMTP CONFIGURATION */}
      {section === "smtp" && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#0284c7]" /> Email SMTP Server & Timed OTP Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Outgoing mail server for 10-minute verification OTPs, password recovery, and consultation confirmation emails.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0284c7] bg-sky-50 px-2.5 py-1 rounded-xs border border-sky-200">
              OTP Expiry: {config.otpExpirySeconds || 600}s
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">SMTP Host *</label>
              <input
                type="text"
                value={config.smtpHost}
                onChange={e => setConfig({ ...config, smtpHost: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">SMTP Port *</label>
              <input
                type="number"
                value={config.smtpPort}
                onChange={e => setConfig({ ...config, smtpPort: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">SMTP Username</label>
              <input
                type="text"
                value={config.smtpUser}
                onChange={e => setConfig({ ...config, smtpUser: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                SMTP Password / App Key
              </label>
              <input
                type="password"
                value={config.smtpPass}
                onChange={e => setConfig({ ...config, smtpPass: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Sender Email Address *
              </label>
              <input
                type="email"
                value={config.senderEmail}
                onChange={e => setConfig({ ...config, senderEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Sender Display Name
              </label>
              <input
                type="text"
                value={config.senderName}
                onChange={e => setConfig({ ...config, senderName: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Email OTP Expiry Window (Seconds)
              </label>
              <input
                type="number"
                value={config.otpExpirySeconds ?? 600}
                onChange={e => setConfig({ ...config, otpExpirySeconds: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.smtpSecure}
                  onChange={e => setConfig({ ...config, smtpSecure: e.target.checked })}
                  className="accent-[#0284c7] w-4 h-4"
                />
                Enforce TLS / SSL Encrypted Mail Transport
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-sm bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save SMTP Configuration
            </button>
            <button
              type="button"
              onClick={handleTestSmtp}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-sm cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-[#0284c7]" /> Send Test Email
            </button>
          </div>
        </form>
      )}

      {/* SECTION 4: PAYMENT GATEWAY */}
      {section === "payment" && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#059669]" /> Payment Gateway & Online Advance Booking
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Collect design tokens, booking advances, and architectural retainer payments online.
              </p>
            </div>
            <span className="text-xs font-bold text-[#059669] bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200">
              {config.paymentMode} Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Payment Provider
              </label>
              <select
                value={config.paymentGateway}
                onChange={e => setConfig({ ...config, paymentGateway: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="Razorpay">Razorpay (Cards, UPI, NetBanking, EMI)</option>
                <option value="Stripe">Stripe (Global Cards)</option>
                <option value="Cashfree">Cashfree Payments</option>
                <option value="Instamojo">Instamojo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Environment Mode</label>
              <select
                value={config.paymentMode}
                onChange={e => setConfig({ ...config, paymentMode: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold bg-white"
              >
                <option value="TEST">TEST / SANDBOX</option>
                <option value="LIVE">LIVE / PRODUCTION</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                API Key ID / Public Key *
              </label>
              <input
                type="text"
                value={config.paymentApiKey}
                onChange={e => setConfig({ ...config, paymentApiKey: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                API Secret Key *
              </label>
              <input
                type="password"
                value={config.paymentApiSecret}
                onChange={e => setConfig({ ...config, paymentApiSecret: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-sm bg-[#059669] hover:bg-[#047857] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Payment Gateway
            </button>
          </div>
        </form>
      )}

      {/* SECTION 5: SEO & ANALYTICS */}
      {section === "seo" && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#7c3aed]" /> Search Engine Optimization (SEO) & Social Links
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control search engine meta titles, keywords, OpenGraph preview image, and social links.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">SEO Meta Title</label>
              <input
                type="text"
                value={config.seoTitle}
                onChange={e => setConfig({ ...config, seoTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                SEO Meta Description
              </label>
              <textarea
                rows={2}
                value={config.seoDescription}
                onChange={e => setConfig({ ...config, seoDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                Target SEO Keywords
              </label>
              <input
                type="text"
                value={config.seoKeywords}
                onChange={e => setConfig({ ...config, seoKeywords: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={config.instagramUrl || ""}
                onChange={e => setConfig({ ...config, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Facebook Page URL</label>
              <input
                type="text"
                value={config.facebookUrl || ""}
                onChange={e => setConfig({ ...config, facebookUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-sm bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save SEO & Social Settings
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
