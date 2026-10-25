import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Bot,
  Sparkles,
  CheckCircle2,
  Building2,
  MapPin,
  Heart,
  Star,
  DollarSign,
  FileSpreadsheet,
  RefreshCw,
  Clock
} from "lucide-react";
import { ExecutiveReportSummary, Enquiry } from "../../types";
import { api } from "../../services/api";

interface ReportsAnalyticsTabProps {
  enquiries: Enquiry[];
}

export const ReportsAnalyticsTab: React.FC<ReportsAnalyticsTabProps> = ({ enquiries }) => {
  const [report, setReport] = useState<ExecutiveReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("llama3.2:3b");
  const [aiReportText, setAiReportText] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await api.getReportsSummary();
      setReport(data);
      if (data.recentAiLogs && data.recentAiLogs.length > 0) {
        const execLog = data.recentAiLogs.find(l => l.analysisType === "EXECUTIVE_REPORT") || data.recentAiLogs[0];
        if (execLog && !aiReportText) {
          setAiReportText(execLog.response);
        }
      }
    } catch (err) {
      console.error("Failed to load executive report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleGenerateAiExecutiveReport = async () => {
    try {
      setIsGeneratingAi(true);
      const res = await api.analyzeExecutiveReportWithOllama(selectedModel);
      setAiReportText(res.analysis);
      loadSummary();
    } catch (err: any) {
      alert("Failed to run Ollama executive analysis: " + err.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleExportEnquiriesCsv = () => {
    const headers = ["ID", "Client Name", "Email", "Phone", "City", "Site Address", "Property Type", "Area SqFt", "Approx Budget", "Status", "Created At"];
    const rows = enquiries.map(e => [
      e.id,
      `"${(e.clientName || "").replace(/"/g, '""')}"`,
      e.clientEmail,
      e.clientPhone,
      e.city,
      `"${(e.siteAddress || "").replace(/"/g, '""')}"`,
      e.propertyType,
      e.areaSqFt || "",
      `"${(e.approxBudget || "").replace(/"/g, '""')}"`,
      e.status,
      e.createdAt
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `veyras_enquiries_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExecutiveJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), ...report, aiSynthesis: aiReportText }, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `veyras_executive_analytics_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !report) {
    return (
      <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
        <div className="inline-block animate-spin rounded-full h-7 w-7 border-b-2 border-[#1e3a8a] mb-3" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Aggregating Executive Pipeline & Revenue Reports...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Top Control Bar */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1e3a8a]" />
            Executive Reports, Pipeline Funnel & Ollama AI Business Audit
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time conversion funnel, discipline revenue breakdown, locality demand, and local Ollama LLM executive synthesis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportEnquiriesCsv}
            className="px-3.5 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#059669]" /> Export Leads CSV
          </button>
          <button
            type="button"
            onClick={handleExportExecutiveJson}
            className="px-3.5 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#1e3a8a]" /> Export Full JSON Report
          </button>
          <button
            type="button"
            onClick={loadSummary}
            className="px-3 py-2 rounded-sm border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* 2. Executive KPI Scorecard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active Lead Pipeline</span>
            <DollarSign className="w-4 h-4 text-[#1e3a8a]" />
          </div>
          <div className="text-2xl font-black text-[#1e3a8a]">
            ₹{(report.kpis.activePipelineValue / 100000).toFixed(1)} Lakhs
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Across {report.kpis.totalEnquiries} client enquiries
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Lead-to-Site Visit Rate</span>
            <TrendingUp className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-2xl font-black text-[#059669]">
            {report.kpis.conversionRatePct}%
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            Scheduled / Quoted / Active
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">User Wishlists & Likes</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {report.kpis.totalWishlists + report.kpis.totalLikes}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {report.kpis.totalWishlists} Wishlisted • {report.kpis.totalLikes} Liked
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Client Satisfaction</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {report.kpis.avgRating} / 5.0
          </div>
          <p className="text-xs text-slate-400 mt-1">
            From {report.kpis.totalReviews} verified project reviews
          </p>
        </div>
      </div>

      {/* 3. Pipeline Funnel & Discipline Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel by Status */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Enquiry & Order Conversion Funnel
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Stage-by-stage breakdown of client orders and estimated project value
              </p>
            </div>
            <span className="text-sm font-bold text-[#1e3a8a] bg-blue-50 px-2.5 py-1 rounded-xs">
              {report.kpis.totalEnquiries} Total
            </span>
          </div>

          <div className="space-y-3">
            {report.pipelineByStatus.map(stage => (
              <div key={stage.status} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{stage.status.replace(/_/g, " ")}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-semibold">{stage.count} leads ({stage.percentage}%)</span>
                    <span className="font-mono font-bold text-[#1e3a8a]">
                      ₹{(stage.estimatedValue / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stage.status === "COMPLETED" || stage.status === "IN_PROGRESS"
                        ? "bg-[#059669]"
                        : stage.status === "CANCELLED"
                        ? "bg-red-400"
                        : "bg-[#1e3a8a]"
                    }`}
                    style={{ width: `${Math.max(stage.percentage, stage.count > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Performance Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#ea580c]" />
                Performance by Architectural Discipline
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Projects, customer inquiries, likes, wishlists, and average package value
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Discipline</th>
                  <th className="py-2.5 px-3">Designs</th>
                  <th className="py-2.5 px-3">Leads</th>
                  <th className="py-2.5 px-3">Likes/Wish</th>
                  <th className="py-2.5 px-3">Avg Est.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.categoryPerformance.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{cat.name}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{cat.projectsCount}</td>
                    <td className="py-2.5 px-3 font-bold text-[#059669]">{cat.enquiriesCount}</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {cat.likesCount} ♥ / {cat.wishlistsCount} ★
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#1e3a8a]">
                      ₹{(cat.avgPrice / 100000).toFixed(1)}L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* City Breakdown Pills */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Geographic Demand Breakdown:
            </span>
            <div className="flex flex-wrap gap-2">
              {report.cityBreakdown.map(loc => (
                <span
                  key={loc.city}
                  className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xs font-semibold text-slate-700"
                >
                  <MapPin className="w-3 h-3 text-[#ea580c]" />
                  {loc.city}: <strong className="text-[#1e3a8a]">{loc.enquiries} leads</strong> ({loc.projects} projects)
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Ollama AI Executive Business Intelligence Synthesis */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#059669]" />
              Ollama AI Executive Business & Revenue Audit
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Synthesizes live PostgreSQL pipeline metrics, sq.ft package pricing, and Meta Ad ROAS using your local Ollama LLM.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              className="px-3 py-2 rounded-sm border border-slate-300 text-xs font-mono bg-slate-50"
            >
              <option value="llama3.2:3b">llama3.2:3b</option>
              <option value="llama3.2:1b-instruct-q4_K_M">llama3.2:1b-instruct-q4_K_M</option>
              <option value="qwen:latest">qwen:latest</option>
            </select>
            <button
              type="button"
              onClick={handleGenerateAiExecutiveReport}
              disabled={isGeneratingAi}
              className="px-4 py-2 rounded-sm bg-[#059669] hover:bg-[#047857] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isGeneratingAi ? "Synthesizing with Ollama..." : "Generate AI Executive Report"}
            </button>
          </div>
        </div>

        {isGeneratingAi ? (
          <div className="py-10 text-center space-y-2">
            <div className="inline-block animate-spin rounded-full h-7 w-7 border-b-2 border-[#059669]" />
            <p className="text-xs font-bold text-slate-600 uppercase">
              Ollama ({selectedModel}) is auditing enquiries, portfolio valuation & ad ROI...
            </p>
          </div>
        ) : aiReportText ? (
          <div className="bg-slate-50 p-5 rounded-md border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
            {aiReportText}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-md border border-dashed border-slate-300">
            <p className="text-xs text-slate-500">
              Click <strong>"Generate AI Executive Report"</strong> above to run a live Ollama LLM audit across your pipeline, user base, and marketing campaigns.
            </p>
          </div>
        )}

        {/* Recent AI Audit Logs History */}
        {report.recentAiLogs && report.recentAiLogs.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Recent Ollama AI Audit Logs ({report.recentAiLogs.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {report.recentAiLogs.slice(0, 4).map(log => (
                <div
                  key={log.id}
                  onClick={() => setAiReportText(log.response)}
                  className="p-2.5 rounded-xs border border-slate-200 hover:border-[#1e3a8a] bg-white flex items-center justify-between text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                    <span className="font-bold text-slate-800">{log.analysisType}</span>
                    <span className="font-mono text-xs text-slate-500">({log.modelName})</span>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">
                    {new Date(log.createdAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
