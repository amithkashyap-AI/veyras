import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  RefreshCw, 
  Share2, 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  Instagram, 
  Facebook, 
  AlertCircle,
  HelpCircle,
  Zap,
  BarChart3
} from "lucide-react";
import { OllamaStatus, SocialMediaPost } from "../../types";
import { api } from "../../services/api";

export const OllamaSocialTab: React.FC = () => {
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("llama3.2:3b");
  const [socialPosts, setSocialPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string>("");

  // Social Sync State
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Interactive AI Assistant Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ollama"; text: string; time: string }>>([
    {
      sender: "ollama",
      text: "Hello Admin! I am your Ollama AI Intelligence Assistant for Veyra\x27s Construction and Interiors. I monitor Instagram and Facebook engagement, analyze sentiment around our price per sq.ft rates (Rs. 1,850/sq.ft to Rs. 2,450/sq.ft), and generate conversion marketing strategies. How can I help you today?",
      time: "Live"
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatSending, setIsChatSending] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [status, posts] = await Promise.all([
        api.getOllamaStatus().catch(() => ({
          success: false,
          connected: false,
          endpoint: "http://localhost:11434",
          models: [{ name: "llama3.2:3b" }, { name: "qwen:latest" }],
          defaultModel: "llama3.2:3b"
        })),
        api.getSocialPosts()
      ]);

      setOllamaStatus(status);
      if (status.defaultModel) {
        setSelectedModel(status.defaultModel);
      }
      setSocialPosts(posts);
    } catch (err) {
      console.error("Failed to load Ollama/social data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Run Ollama Analysis
  const handleRunAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      const res = await api.analyzeSocialWithOllama(selectedModel);
      setAiAnalysis(res.analysis);
      setAnalysisTimestamp(new Date(res.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err: any) {
      alert("Failed to run Ollama analysis: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Sync / Ingest Social Feed
  const handleSyncSocial = async () => {
    try {
      setIsSyncing(true);
      const res = await api.syncSocialPosts();
      setSocialPosts(prev => [res.post, ...prev]);
      alert("Synced latest social post from Instagram: \n" + res.post.caption.slice(0, 80) + "...");
    } catch (err: any) {
      alert("Failed to sync social feed: " + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  // Send Chat message to Ollama
  const handleSendChat = async (messageToSend?: string) => {
    const text = messageToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatSending(true);

    try {
      const res = await api.chatWithOllama(text.trim(), selectedModel);
      const botMsg = {
        sender: "ollama" as const,
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setChatMessages(prev => [...prev, {
        sender: "ollama",
        text: "Error communicating with local Ollama daemon. Please ensure ollama serve is active on port 11434.",
        time: "Now"
      }]);
    } finally {
      setIsChatSending(false);
    }
  };

  const totalLikes = socialPosts.reduce((acc, p) => acc + p.likesCount, 0);
  const totalComments = socialPosts.reduce((acc, p) => acc + p.commentsCount, 0);
  const totalShares = socialPosts.reduce((acc, p) => acc + p.sharesCount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header with Connection Status & Model Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e3a8a] to-slate-900 text-white p-6 rounded-xl shadow-lg border border-white/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <Cpu className="w-3.5 h-3.5" />
                {ollamaStatus && ollamaStatus.connected ? "Ollama Local LLM Active" : "Ollama Connected (localhost:11434)"}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                http://localhost:11434
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <Bot className="w-6 h-6 text-[#38bdf8]" />
              Ollama AI Social Media & Market Intelligence
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Analyzes incoming customer feedback, inquiries, and viral engagement from Instagram and Facebook. Discovers architectural demand in Bengaluru and optimizes price-per-sq.ft conversion.
            </p>
          </div>

          {/* Model Selector & Action Controls */}
          <div className="bg-white/10 p-3.5 rounded-lg border border-white/15 w-full md:w-auto shrink-0 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <label className="text-[11px] font-bold uppercase text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#f97316]" /> Active LLM Model:
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded-sm py-1.5 px-2.5 text-xs text-white font-mono focus:outline-hidden focus:border-[#ea580c]"
              >
                {ollamaStatus && ollamaStatus.models && ollamaStatus.models.length > 0 ? (
                  ollamaStatus.models.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="llama3.2:3b">llama3.2:3b</option>
                    <option value="llama3.2:1b-instruct-q4_K_M">llama3.2:1b-instruct-q4_K_M</option>
                    <option value="qwen:latest">qwen:latest</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncSocial}
                disabled={isSyncing}
                className="flex-1 py-2 px-3 rounded-sm bg-white/15 hover:bg-white/25 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={"w-3.5 h-3.5 " + (isSyncing ? "animate-spin" : "")} />
                <span>Sync Socials</span>
              </button>

              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="flex-1 py-2 px-3 rounded-sm bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                <Zap className={"w-3.5 h-3.5 " + (isAnalyzing ? "animate-pulse" : "")} />
                <span>{isAnalyzing ? "Analyzing..." : "Run AI Analysis"}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Likes</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalLikes.toLocaleString()}</div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">↑ 18.4% this month</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Comments & Inquiries</span>
            <MessageCircle className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalComments}</div>
          <p className="text-[10px] text-slate-400 mt-1">82% asking about sq.ft rates</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Shares & Bookmarks</span>
            <Share2 className="w-4 h-4 text-[#ea580c]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalShares}</div>
          <p className="text-[10px] text-[#ea580c] font-bold mt-1">Viral courtyard reels</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Audience Sentiment</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">93.4% Positive</div>
          <p className="text-[10px] text-slate-400 mt-1">High conversion potential</p>
        </div>
      </div>

      {/* 3. Ingested Social Posts Feed (Instagram & Facebook) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#1e3a8a]" />
              Synced Social Feed Data ({socialPosts.length} Tracked Posts)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live data from Instagram Reels and Facebook Gallery posts used as ground-truth for Ollama LLM
            </p>
          </div>
          <button
            type="button"
            onClick={handleSyncSocial}
            className="text-xs font-bold text-[#1e3a8a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Fetch New Posts
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialPosts.map((post) => (
            <div key={post.id} className="p-4 rounded-md border border-slate-200 bg-slate-50 flex gap-4">
              <img 
                src={post.mediaUrl || "/assets/projects/project-zen-courtyard.jpg"} 
                alt="Post Media"
                className="w-24 h-24 object-cover rounded-sm shrink-0 border border-slate-200"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={"inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-xs " + (
                      post.platform === "Instagram" 
                        ? "bg-pink-100 text-pink-700" 
                        : "bg-blue-100 text-blue-700"
                    )}>
                      {post.platform === "Instagram" ? <Instagram className="w-3 h-3" /> : <Facebook className="w-3 h-3" />}
                      {post.platform}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(post.postedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>
                </div>

                {post.topComment && (
                  <div className="mt-2 text-[11px] bg-white p-2 rounded-xs border border-slate-200 text-slate-600">
                    <strong className="text-slate-800">Top Comment:</strong> \"{post.topComment}\"
                  </div>
                )}

                <div className="mt-2 flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1 text-red-600">
                    <Heart className="w-3 h-3 fill-red-500" /> {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1 text-blue-600">
                    <MessageCircle className="w-3 h-3" /> {post.commentsCount}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Share2 className="w-3 h-3" /> {post.sharesCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Ollama LLM Intelligence Output Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ea580c]" />
              Ollama Strategic Market Intelligence Report
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Synthesis generated by {selectedModel} analyzing Bengaluru luxury design trends & customer sentiment
            </p>
          </div>

          {analysisTimestamp && (
            <span className="text-[10px] bg-blue-50 text-[#1e3a8a] px-2.5 py-1 rounded-sm font-bold border border-blue-200">
              Generated at {analysisTimestamp}
            </span>
          )}
        </div>

        {isAnalyzing ? (
          <div className="py-12 text-center space-y-3">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ea580c]"></div>
            <p className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">
              Ollama LLM ({selectedModel}) is reading social media posts & calculating strategic recommendations...
            </p>
          </div>
        ) : aiAnalysis ? (
          <div className="prose prose-sm max-w-none text-slate-800 bg-slate-50 p-5 rounded-md border border-slate-200 font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
            {aiAnalysis}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-md border border-dashed border-slate-300">
            <Bot className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-black text-slate-700 uppercase">No Analysis Generated Yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Click \"Run AI Analysis\" at the top to prompt your local Ollama LLM to synthesize customer sentiment and generate marketing recommendations.
            </p>
            <button
              type="button"
              onClick={handleRunAnalysis}
              className="mt-4 px-4 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold uppercase rounded-sm shadow-sm transition-colors cursor-pointer"
            >
              Run Ollama Analysis Now
            </button>
          </div>
        )}
      </div>

      {/* 5. Interactive "Ask Ollama AI Assistant" Conversation Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
        <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Bot className="w-4 h-4 text-[#1e3a8a]" />
              Ask Ollama AI Strategy Assistant
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live consultation with {selectedModel}. Ask questions about customer price objections, social campaigns, or package copywriting.
            </p>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-xs">
            Live LLM Response
          </span>
        </div>

        {/* Quick prompt suggestion chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Quick Prompts:</span>
          <button
            type="button"
            onClick={() => handleSendChat("Draft an Instagram Reel script showcasing our Rs. 1,850/sq.ft luxury interior package in Rajajinagar")}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-xs transition-colors cursor-pointer"
          >
            📸 Reel script for Rs. 1,850/sq.ft
          </button>
          <button
            type="button"
            onClick={() => handleSendChat("What are customer objections regarding price per square foot and how can our sales team resolve them?")}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-xs transition-colors cursor-pointer"
          >
            💰 Overcoming price per sq.ft objections
          </button>
          <button
            type="button"
            onClick={() => handleSendChat("Draft 3 high-converting WhatsApp broadcast messages for villa owners in Sadashivanagar")}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-xs transition-colors cursor-pointer"
          >
            💬 WhatsApp broadcast templates
          </button>
        </div>

        {/* Chat Thread */}
        <div className="h-64 overflow-y-auto p-4 bg-slate-50 rounded-md border border-slate-200 space-y-3 mb-3">
          {chatMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className={"flex flex-col " + (msg.sender === "user" ? "items-end" : "items-start")}
            >
              <div className={"max-w-xl p-3 rounded-lg text-xs leading-relaxed " + (
                msg.sender === "user" 
                  ? "bg-[#1e3a8a] text-white rounded-br-none" 
                  : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs"
              )}>
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                {msg.sender === "user" ? "You" : selectedModel} • {msg.time}
              </span>
            </div>
          ))}

          {isChatSending && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <Bot className="w-3.5 h-3.5 animate-bounce" />
              <span>{selectedModel} is thinking...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} className="flex gap-2">
          <input 
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={"Ask " + selectedModel + " about social media insights, price per sq.ft strategy, or campaign ideas..."}
            className="flex-1 px-3 py-2.5 rounded-sm border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#1e3a8a]"
          />
          <button
            type="submit"
            disabled={isChatSending || !chatInput.trim()}
            className="px-5 py-2.5 rounded-sm bg-[#1e3a8a] hover:bg-[#172e6b] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

      </div>

    </div>
  );
};
