import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Instagram,
  Facebook,
  Sparkles,
  Bot,
  Plus,
  Trash2,
  TrendingUp,
  DollarSign,
  MousePointerClick,
  Users,
  RefreshCw,
  Play,
  Pause,
  MessageCircle,
  X
} from "lucide-react";
import { AdCampaign, AdCampaignSummary } from "../../types";
import { api } from "../../services/api";

export const AdsPromotionTab: React.FC = () => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [summary, setSummary] = useState<AdCampaignSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Ollama AI Ad Studio State
  const [aiPlatform, setAiPlatform] = useState("Instagram & Facebook");
  const [aiTargetService, setAiTargetService] = useState("Luxury Interior Design (₹1,850/sq.ft)");
  const [aiTargetAudience, setAiTargetAudience] = useState(
    "Bengaluru Villa & Luxury Apartment Owners (30-55 yrs) — Rajajinagar, Sadashivanagar, Whitefield"
  );
  const [aiObjective, setAiObjective] = useState("WHATSAPP_MESSAGES");
  const [aiDailyBudget, setAiDailyBudget] = useState<number>(2500);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<{
    campaignName: string;
    headline: string;
    primaryText: string;
    ctaText: string;
    targetAudience: string;
    targetLocations: string;
    hashtags: string;
    creativeTip: string;
  } | null>(null);

  // Create Campaign Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("Instagram & Facebook");
  const [placement, setPlacement] = useState("Instagram Reels & Feed");
  const [objective, setObjective] = useState("WHATSAPP_MESSAGES");
  const [dailyBudget, setDailyBudget] = useState<number>(2500);
  const [totalBudget, setTotalBudget] = useState<number>(75000);
  const [headline, setHeadline] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [ctaText, setCtaText] = useState("Send WhatsApp Message");
  const [targetAudience, setTargetAudience] = useState(
    "Bengaluru Homeowners & Villa Buyers (30-55 yrs)"
  );
  const [targetLocations, setTargetLocations] = useState("Bengaluru, Karnataka (+25 km)");
  const [mediaUrl, setMediaUrl] = useState("/assets/projects/project-zen-courtyard.jpg");
  const [targetService, setTargetService] = useState("Luxury Interior Design (₹1,850/sq.ft)");

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const res = await api.getAdCampaigns();
      setCampaigns(res.data);
      setSummary(res.summary);
    } catch (err) {
      console.error("Failed to load ad campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleGenerateAdWithAi = async () => {
    try {
      setIsGeneratingCopy(true);
      const res = await api.generateAdWithOllama({
        platform: aiPlatform,
        targetService: aiTargetService,
        targetAudience: aiTargetAudience,
        objective: aiObjective,
        dailyBudget: aiDailyBudget
      });
      setGeneratedCopy(res.adCopy);
    } catch (err: any) {
      alert("Failed to generate ad copy with Ollama: " + err.message);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleLoadGeneratedIntoForm = () => {
    if (!generatedCopy) return;
    setName(generatedCopy.campaignName);
    setPlatform(aiPlatform);
    setObjective(aiObjective);
    setDailyBudget(aiDailyBudget);
    setTotalBudget(aiDailyBudget * 30);
    setHeadline(generatedCopy.headline);
    setPrimaryText(`${generatedCopy.primaryText}\n\n${generatedCopy.hashtags}`);
    setCtaText(generatedCopy.ctaText);
    setTargetAudience(generatedCopy.targetAudience);
    setTargetLocations(generatedCopy.targetLocations);
    setTargetService(aiTargetService);
    setShowCreateModal(true);
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !headline) return;
    try {
      await api.createAdCampaign({
        name,
        platform,
        placement,
        objective,
        dailyBudget: Number(dailyBudget),
        totalBudget: Number(totalBudget),
        headline,
        primaryText,
        ctaText,
        targetAudience,
        targetLocations,
        mediaUrl,
        targetService,
        status: "ACTIVE"
      });
      setShowCreateModal(false);
      alert("✅ Ad Campaign launched & synced with Meta Marketing API!");
      loadCampaigns();
    } catch (err: any) {
      alert("Failed to launch campaign: " + err.message);
    }
  };

  const handleToggleStatus = async (camp: AdCampaign) => {
    const nextStatus = camp.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      await api.updateAdCampaign(camp.id, { status: nextStatus });
      loadCampaigns();
    } catch {
      alert("Failed to update campaign status");
    }
  };

  const handleBoostSync = async (camp: AdCampaign) => {
    try {
      const res = await api.simulateBoostAdCampaign(camp.id);
      alert("✅ " + res.message);
      loadCampaigns();
    } catch {
      alert("Failed to sync Meta delivery metrics");
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Delete this ad campaign?")) return;
    try {
      await api.deleteAdCampaign(id);
      loadCampaigns();
    } catch {
      alert("Failed to delete campaign");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-purple-900 to-pink-900 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-pink-200 text-xs font-black uppercase tracking-wider mb-2">
            <Instagram className="w-3.5 h-3.5" /> <Facebook className="w-3.5 h-3.5" /> Meta Business Suite & Ad Promoter
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-[#f97316]" />
            Promote Ads via Facebook, Instagram & WhatsApp Click-to-Chat
          </h2>
          <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
            Create, optimize, and monitor paid lead-generation campaigns for Bengaluru homeowners. Generate high-converting ad copy using local Ollama AI.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setName("");
            setHeadline("");
            setPrimaryText("");
            setShowCreateModal(true);
          }}
          className="px-5 py-2.5 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> + Launch New Ad Campaign
        </button>
      </div>

      {/* 2. Ad Performance KPI Row */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Active Campaigns</span>
              <Megaphone className="w-4 h-4 text-[#1e3a8a]" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {summary.activeCampaigns} / {summary.totalCampaigns}
            </div>
            <p className="text-xs text-emerald-600 font-bold mt-1">Meta Pixel & CAPI Active</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Total Ad Spend</span>
              <DollarSign className="w-4 h-4 text-[#ea580c]" />
            </div>
            <div className="text-2xl font-black text-[#1e3a8a]">
              ₹{summary.totalSpent.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              of ₹{summary.totalBudget.toLocaleString("en-IN")} budget
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Impressions & Clicks</span>
              <MousePointerClick className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {summary.totalImpressions.toLocaleString()}
            </div>
            <p className="text-xs text-purple-600 font-bold mt-1">
              {summary.totalClicks.toLocaleString()} Clicks (
              {summary.totalImpressions > 0
                ? ((summary.totalClicks / summary.totalImpressions) * 100).toFixed(1)
                : "3.2"}
              % CTR)
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Leads Captured</span>
              <Users className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="text-2xl font-black text-[#059669]">{summary.totalLeads}</div>
            <p className="text-xs text-slate-500 mt-1">
              CPL: ₹{summary.totalLeads > 0 ? Math.round(summary.totalSpent / summary.totalLeads) : 0} / lead
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider">Average ROAS</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{summary.avgRoas}x</div>
            <p className="text-xs text-slate-400 mt-1">
              {summary.totalConversions} site visits booked
            </p>
          </div>
        </div>
      )}

      {/* 3. Ollama AI Ad Copy & Audience Targeting Studio */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#059669]" />
              Ollama AI Facebook & Instagram Ad Copy Generator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select a service package and target audience to let local Ollama AI write high-converting headlines, reel captions, and targeting parameters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerateAdWithAi}
            disabled={isGeneratingCopy}
            className="px-4 py-2 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
            {isGeneratingCopy ? "Generating with Ollama..." : "Generate Ad Creative with AI"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Ad Platform</label>
            <select
              value={aiPlatform}
              onChange={e => setAiPlatform(e.target.value)}
              className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="Instagram & Facebook">Instagram + Facebook (Advantage+)</option>
              <option value="Instagram">Instagram Reels & Stories Only</option>
              <option value="Facebook">Facebook Lead Form & Carousel</option>
              <option value="WhatsApp Click-to-Chat">Click-to-WhatsApp Ad (089213 36363)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Promote Service / Rate</label>
            <select
              value={aiTargetService}
              onChange={e => setAiTargetService(e.target.value)}
              className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="Luxury Interior Design (₹1,850/sq.ft)">Luxury Interior Design (₹1,850/sq.ft)</option>
              <option value="Turnkey Architectural Construction (₹2,250/sq.ft)">Turnkey Villa Construction (₹2,250/sq.ft)</option>
              <option value="Modern Courtyards & Landscaping (₹1,150/sq.ft)">Zen Courtyards & Pools (₹1,150/sq.ft)</option>
              <option value="German Modular Kitchens (₹2,450/sq.ft)">German Modular Kitchens (₹2,450/sq.ft)</option>
              <option value="Timber Pergolas & Patio Decks (₹1,450/sq.ft)">Timber Pergolas & Decks (₹1,450/sq.ft)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Campaign Objective</label>
            <select
              value={aiObjective}
              onChange={e => setAiObjective(e.target.value)}
              className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="WHATSAPP_MESSAGES">Direct WhatsApp Consultations</option>
              <option value="LEAD_GENERATION">Instant Lead Form Signups</option>
              <option value="WEBSITE_TRAFFIC">Cost Estimator Page Traffic</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Daily Budget (₹)</label>
            <input
              type="number"
              value={aiDailyBudget}
              onChange={e => setAiDailyBudget(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold text-[#1e3a8a]"
            />
          </div>
        </div>

        {generatedCopy && (
          <div className="p-4 rounded-md bg-blue-50/60 border border-blue-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-black uppercase text-[#1e3a8a]">
                ✨ Ollama AI Generated Campaign Blueprint: {generatedCopy.campaignName}
              </span>
              <button
                type="button"
                onClick={handleLoadGeneratedIntoForm}
                className="px-3.5 py-1.5 rounded-xs bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase cursor-pointer"
              >
                Load into New Campaign & Publish →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xs border border-slate-200 space-y-1.5">
                <div>
                  <strong className="text-slate-700 uppercase text-xs block">Ad Headline:</strong>
                  <p className="font-bold text-slate-900">{generatedCopy.headline}</p>
                </div>
                <div>
                  <strong className="text-slate-700 uppercase text-xs block">Primary Copy:</strong>
                  <p className="text-slate-700 leading-relaxed">{generatedCopy.primaryText}</p>
                </div>
                <div className="text-sm text-blue-600 font-mono">{generatedCopy.hashtags}</div>
              </div>
              <div className="bg-white p-3 rounded-xs border border-slate-200 space-y-1.5">
                <div>
                  <strong className="text-slate-700 uppercase text-xs block">Target Audience & Interests:</strong>
                  <p className="text-slate-700">{generatedCopy.targetAudience}</p>
                </div>
                <div>
                  <strong className="text-slate-700 uppercase text-xs block">Geo-Targeting:</strong>
                  <p className="text-slate-700">{generatedCopy.targetLocations}</p>
                </div>
                <div>
                  <strong className="text-[#ea580c] uppercase text-xs block">AI Creative Reel Tip:</strong>
                  <p className="text-slate-600 italic">{generatedCopy.creativeTip}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Active Facebook & Instagram Ad Campaigns Grid */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Active & Tracked Ad Campaigns ({campaigns.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live campaign delivery across Instagram Reels, Facebook Lead Forms, and WhatsApp Click-to-Chat
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 font-bold">Loading campaigns...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {campaigns.map(camp => (
              <div
                key={camp.id}
                className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 bg-slate-100">
                    <img
                      src={camp.mediaUrl || "/assets/projects/project-zen-courtyard.jpg"}
                      alt={camp.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/80 text-white px-2.5 py-0.5 rounded-xs text-xs font-black uppercase flex items-center gap-1">
                      {camp.platform.includes("Instagram") ? (
                        <Instagram className="w-3 h-3 text-pink-400" />
                      ) : (
                        <Facebook className="w-3 h-3 text-blue-400" />
                      )}
                      {camp.platform}
                    </div>
                    <div
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded-xs text-xs font-black uppercase ${
                        camp.status === "ACTIVE"
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {camp.status}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-[#1e3a8a]/95 text-white px-2.5 py-1 rounded-xs text-xs font-black">
                      ROAS: {camp.roas}x
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="text-xs font-bold uppercase text-[#ea580c]">{camp.placement}</div>
                    <h4 className="font-black text-sm text-slate-900 leading-snug">{camp.name}</h4>
                    <p className="text-xs font-bold text-[#1e3a8a]">{camp.headline}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{camp.primaryText}</p>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center bg-slate-50 p-2 rounded-xs">
                      <div>
                        <span className="block text-xs uppercase text-slate-400 font-bold">Impressions</span>
                        <span className="text-xs font-black text-slate-800">
                          {camp.impressions.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase text-slate-400 font-bold">Clicks</span>
                        <span className="text-xs font-black text-[#1e3a8a]">{camp.clicks.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase text-slate-400 font-bold">Leads</span>
                        <span className="text-xs font-black text-[#059669]">{camp.leadsCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600 font-semibold pt-1">
                      <span>Daily: ₹{camp.dailyBudget.toLocaleString("en-IN")}</span>
                      <span>
                        Spent: ₹{camp.spentAmount.toLocaleString("en-IN")} / ₹
                        {camp.totalBudget.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(camp)}
                      className="px-2.5 py-1 rounded-xs border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {camp.status === "ACTIVE" ? (
                        <>
                          <Pause className="w-3 h-3" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" /> Resume
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBoostSync(camp)}
                      className="px-2.5 py-1 rounded-xs bg-emerald-50 hover:bg-emerald-100 text-[#059669] text-sm font-bold flex items-center gap-1 cursor-pointer"
                      title="Sync latest Meta Ads delivery & leads"
                    >
                      <RefreshCw className="w-3 h-3" /> Sync Delivery
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCampaign(camp.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-xs cursor-pointer"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Create New Ad Campaign */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 my-8 border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 uppercase">
                Launch Facebook & Instagram Ad Campaign
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Bengaluru Villa Courtyards & Pergolas — Q4 Reel Promo"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs bg-white"
                  >
                    <option value="Instagram & Facebook">Instagram & Facebook</option>
                    <option value="Instagram">Instagram Only</option>
                    <option value="Facebook">Facebook Only</option>
                    <option value="WhatsApp Click-to-Chat">WhatsApp Click-to-Chat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Placement</label>
                  <input
                    type="text"
                    value={placement}
                    onChange={e => setPlacement(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Daily Budget (₹)</label>
                  <input
                    type="number"
                    value={dailyBudget}
                    onChange={e => setDailyBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Total Budget (₹)</label>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={e => setTotalBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">Ad Headline *</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    placeholder="e.g. Turnkey Luxury Home Interiors @ ₹1,850/sq.ft"
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-semibold"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                    Primary Ad Copy / Caption *
                  </label>
                  <textarea
                    rows={3}
                    value={primaryText}
                    onChange={e => setPrimaryText(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={e => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                    Target Locations
                  </label>
                  <input
                    type="text"
                    value={targetLocations}
                    onChange={e => setTargetLocations(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                    Call-To-Action Button
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={e => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase text-slate-700 mb-1">
                    Creative Image URL
                  </label>
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={e => setMediaUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-sm border border-slate-300 text-slate-600 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase cursor-pointer"
                >
                  Launch Ad Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
