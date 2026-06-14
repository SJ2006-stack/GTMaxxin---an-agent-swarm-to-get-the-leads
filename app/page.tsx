"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  MapPin,
  Calendar,
  Ticket,
  X,
  Play,
  Pause,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  Cpu,
  Layers,
  Terminal,
  SearchCode,
} from "lucide-react";
import { FIXTURE_INPUT } from "@/lib/fixtures/demo-input";

// 11 Agents Swarm Architecture Data
const AGENTS_LIST = [
  {
    id: "agent-1",
    name: "GTM Strategist Agent",
    role: "Core Strategy",
    description: "Analyzes the product and company description to create target buyer personas, Ideal Customer Profiles (ICPs), and pain point maps.",
    output: "ICPs, persona documents, target industry profiles.",
    stage: "STAGE 1",
  },
  {
    id: "agent-2",
    name: "Market Mapper Agent",
    role: "Market Expansion",
    description: "Identifies adjacent industries, primary/secondary market sizing, and hidden opportunities to sell the product.",
    output: "Adjacent markets, industry coordinates.",
    stage: "STAGE 2 (PARALLEL)",
  },
  {
    id: "agent-3",
    name: "Signal Hunter Agent",
    role: "Intent Detection",
    description: "Scans for intent buying signals such as recent funding rounds, hiring activity, product launches, or expansion announcements.",
    output: "Intent signals, trigger event logs.",
    stage: "STAGE 2 (PARALLEL)",
  },
  {
    id: "agent-4",
    name: "Prospect Discovery Agent",
    role: "Account Targeting",
    description: "Searches for companies matching the target ICP criteria and filters them based on identified signals.",
    output: "Qualified accounts list, match rationale.",
    stage: "STAGE 3",
  },
  {
    id: "agent-5",
    name: "Decision Maker Finder",
    role: "Contact Discovery",
    description: "Discovers key decision-makers at the target prospects (e.g., CEO, Founder, CRO, VP Sales, VP Growth).",
    output: "Stakeholder names, titles, email guidelines.",
    stage: "STAGE 4 (PARALLEL)",
  },
  {
    id: "agent-6",
    name: "Opportunity Scorer Agent",
    role: "Prioritization Engine",
    description: "Scores and ranks prospects based on fit score, intent score, timing score, and accessibility.",
    output: "Opportunity rank matrix, fit ratings.",
    stage: "STAGE 4 (PARALLEL)",
  },
  {
    id: "agent-7",
    name: "Outreach Planner Agent",
    role: "Playbook Crafting",
    description: "Drafts highly personalized outreach email templates and custom LinkedIn connection notes targeting specific stakeholder pain points.",
    output: "Personalized outreach sequences, copy variations.",
    stage: "STAGE 5",
  },
];

// Feature capabilities using the beautiful generated art pieces
const CORE_ENGINES = [
  {
    id: "eng-1",
    title: "GTM STRATEGIST ENGINE",
    agent: "GTM STRATEGIST",
    stage: "STAGE 1 - PROFILE",
    image: "/gtm_strategy_relevant.png",
    accentColor: "#FCD116",
    description:
      "Leverages deep linguistic analysis to map out target buyer personas, key pain points, and precise company size categories tailored to your unique value proposition.",
    curator: "AI Swarm Strategist Node",
  },
  {
    id: "eng-2",
    title: "SIGNAL HUNTER ENGINE",
    agent: "SIGNAL HUNTER",
    stage: "STAGE 2 - INTENT",
    image: "/signal_hunter_relevant.png",
    accentColor: "#86EFAC",
    description:
      "Scrapes and indexes live corporate events, monitoring hiring patterns, executive shakeups, and Series A-D funding triggers to time outreach campaigns perfectly.",
    curator: "Web Intent Scraper Node",
  },
  {
    id: "eng-3",
    title: "MARKET MAPPER ENGINE",
    agent: "MARKET MAPPER",
    stage: "STAGE 3 - EXPANSION",
    image: "/museum_abstract_art.png",
    accentColor: "#60A5FA",
    description:
      "Identifies adjacent industries, secondary market sizing vectors, and hidden commercial categories where the product can be positioned.",
    curator: "AI Market Mapper Node",
  },
  {
    id: "eng-4",
    title: "PROSPECT DISCOVERY ENGINE",
    agent: "PROSPECT DISCOVERY",
    stage: "STAGE 4 - TARGETING",
    image: "/museum_installation.png",
    accentColor: "#F472B6",
    description:
      "Scans matching corporate accounts globally and qualifies them against buyer persona and signal requirements verified by live search.",
    curator: "AI Prospect Finder Node",
  },
  {
    id: "eng-5",
    title: "DECISION MAKER FINDER",
    agent: "DECISION MAKER",
    stage: "STAGE 5 - CONTACTS",
    image: "/museum_portrait.png",
    accentColor: "#C084FC",
    description:
      "Locates profile URLs, roles, and structural departments of key business contacts and stakeholders matching targeting criteria.",
    curator: "AI Contact Scraper Node",
  },
  {
    id: "eng-6",
    title: "OUTREACH PLANNER ENGINE",
    agent: "OUTREACH PLANNER",
    stage: "STAGE 6 - PLAYBOOKS",
    image: "/outreach_planner_relevant.png",
    accentColor: "#F87171",
    description:
      "Automatically writes bespoke, context-aware drafts addressing the core challenges of CEO, CRO, and VP roles without sounding like generic AI templates.",
    curator: "Playbook Writer Node",
  },
];

export default function ProspectSwarmHomepage() {
  const router = useRouter();

  // Navigation & Drawer states
  // 'menu' | 'launch' | 'architecture' | 'logs' | 'search'
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  // Form states prefilled with fixtures
  const [company, setCompany] = useState(FIXTURE_INPUT.company);
  const [product, setProduct] = useState(FIXTURE_INPUT.product);
  const [url, setUrl] = useState(FIXTURE_INPUT.url ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search reports state
  const [searchQuery, setSearchQuery] = useState("");
  const [pastReports, setPastReports] = useState([
    { id: "demo-1", title: "B2B SaaS Sales Intelligence Startup GTM", date: "JUNE 14, 2026" },
    { id: "demo-2", title: "CyberSecurity Threat Monitoring Platform Outreach", date: "JUNE 12, 2026" },
    { id: "demo-3", title: "FinTech Automated Reconciliation Campaign", date: "MAY 28, 2026" },
  ]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);

  // Selected Engine Modal state
  const [selectedEngine, setSelectedEngine] = useState<any>(null);

  // Swarm Radio Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(25);
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>([
    15, 30, 45, 10, 60, 25, 80, 40, 15, 50,
  ]);

  // Simulated Live Activity Logs
  const [logs, setLogs] = useState<string[]>([
    "System Initialized. Awaiting Swarm Launch Request...",
    "Swarm Node [GTM-STRATEGIST] ready in standby mode.",
    "Swarm Node [MARKET-MAPPER] synced to target vector data.",
    "Swarm Node [SIGNAL-HUNTER] listening on live funding feed APIs.",
  ]);

  // Add random logs when active or idle
  useEffect(() => {
    const logInterval = setInterval(() => {
      const mockMessages = [
        "Signal Hunter scanned 45 domains for expansion triggers.",
        "GTM Strategist mapped adjacent ICP category for Enterprise Security.",
        "Decision Maker Finder query constructed for VP Sales personnel.",
        "Scoring Engine fit matrix normalized.",
        "Outreach Planner created A/B testing variables.",
        "LangGraph node transition: GTM Strategist -> Parallel (Mapper, Hunter)",
        "Supabase telemetry updated successfully.",
      ];
      const randomMsg = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      const timeStr = new Date().toTimeString().split(" ")[0];
      setLogs((prev) => [`[${timeStr}] ${randomMsg}`, ...prev.slice(0, 15)]);
    }, 4000);
    return () => clearInterval(logInterval);
  }, []);

  // Filter reports
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredReports(pastReports);
      return;
    }
    const query = searchQuery.toLowerCase();
    setFilteredReports(
      pastReports.filter((r) => r.title.toLowerCase().includes(query))
    );
  }, [searchQuery, pastReports]);

  // Audio guide/radio animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setVisualizerHeights(
          Array.from({ length: 10 }, () => Math.floor(Math.random() * 85) + 15)
        );
        setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Submit form handler
  async function handleLaunchSwarm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Add log
    const timeStr = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [`[${timeStr}] 🚀 LAUNCHING SWARM FOR: "${company}"...`, ...prev]);

    try {
      const res = await fetch("/api/report/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, product, url: url || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to start run");
      }

      const { run_id } = await res.json();
      router.push(`/report/${run_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  const toggleDrawer = (drawerName: string) => {
    if (activeDrawer === drawerName) {
      setActiveDrawer(null);
    } else {
      setActiveDrawer(drawerName);
    }
  };

  const closeAllDrawers = () => {
    setActiveDrawer(null);
  };

  return (
    <div className="min-h-screen bg-[#FCD116] flex flex-col md:flex-row relative">
      
      {/* 1. LEFT VERTICAL NAVIGATION SIDEBAR (Matte Black Column) */}
      <aside className="fixed bottom-0 left-0 w-full h-16 md:h-screen md:w-14 bg-[#0A0A0A] border-t-4 md:border-t-0 md:border-r-4 border-black flex flex-row md:flex-col justify-between items-center py-2 md:py-6 px-4 md:px-0 z-50">
        
        {/* Top brand circle */}
        <div className="hidden md:flex flex-col items-center gap-1.5">
          <div className="w-8 h-8 bg-[#FCD116] text-[#0A0A0A] flex items-center justify-center font-black text-base border-2 border-black tracking-tighter shadow-sm">
            PS
          </div>
          <span className="text-[9px] font-black tracking-widest text-[#FCD116] rotate-90 my-3">SWARM</span>
        </div>

        {/* Action icons stack */}
        <div className="flex flex-row md:flex-col gap-4 md:gap-6 items-center w-full justify-around md:justify-center">
          
          {/* Menu Drawer Toggle */}
          <button
            onClick={() => toggleDrawer("menu")}
            aria-label="Toggle Menu"
            className={`w-9 h-9 flex items-center justify-center rounded-full border-2 border-black transition-all ${
              activeDrawer === "menu"
                ? "bg-[#FCD116] text-[#0A0A0A] scale-95"
                : "bg-transparent text-[#FCD116] hover:bg-[#FCD116]/20"
            }`}
          >
            <Menu className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Launch Swarm Tab */}
          <button
            onClick={() => toggleDrawer("launch")}
            aria-label="Launch Swarm Engine"
            className={`p-1.5 transition-transform duration-100 active:scale-90 relative ${
              activeDrawer === "launch" ? "text-[#FCD116]" : "text-neutral-500 hover:text-white"
            }`}
          >
            <Zap className="w-5 h-5 stroke-[2]" />
            {company && product && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black animate-pulse" />
            )}
          </button>

          {/* Swarm Architecture Tab */}
          <button
            onClick={() => toggleDrawer("architecture")}
            aria-label="Swarm Architecture"
            className={`p-1.5 transition-transform duration-100 active:scale-90 ${
              activeDrawer === "architecture" ? "text-[#FCD116]" : "text-neutral-500 hover:text-white"
            }`}
          >
            <Layers className="w-5 h-5 stroke-[2]" />
          </button>

          {/* Live Activity Logs Tab */}
          <button
            onClick={() => toggleDrawer("logs")}
            aria-label="Live Activity Logs"
            className={`p-1.5 transition-transform duration-100 active:scale-90 ${
              activeDrawer === "logs" ? "text-[#FCD116]" : "text-neutral-500 hover:text-white"
            }`}
          >
            <Terminal className="w-5 h-5 stroke-[2]" />
          </button>

          {/* Search Reports Tab */}
          <button
            onClick={() => toggleDrawer("search")}
            aria-label="Search GTM Reports"
            className={`p-1.5 transition-transform duration-100 active:scale-90 ${
              activeDrawer === "search" ? "text-[#FCD116]" : "text-neutral-500 hover:text-white"
            }`}
          >
            <Search className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Build version info */}
        <div className="hidden md:flex flex-col items-center gap-4 text-xs font-black text-neutral-500">
          <button className="hover:text-white transition-colors">V1</button>
          <div className="w-4 h-[2px] bg-neutral-800" />
          <span className="text-[#FCD116]">DEV</span>
        </div>
      </aside>

      {/* 2. SLIDE-OUT DRAWERS (Mustard Yellow panels) */}
      {activeDrawer && (
        <div
          onClick={closeAllDrawers}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
        />
      )}

      <div
        className={`fixed top-0 bottom-16 md:bottom-0 left-0 md:left-14 w-full md:w-[450px] bg-[#FCD116] border-r-4 border-black z-40 transform transition-transform duration-300 ease-out brutalist-shadow-lg flex flex-col justify-between overflow-y-auto ${
          activeDrawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b-4 border-black flex justify-between items-center bg-[#0A0A0A] text-[#FCD116]">
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
            {activeDrawer === "menu" && "NAVIGATION"}
            {activeDrawer === "launch" && "RUN SWARM ENGINE"}
            {activeDrawer === "architecture" && "11 SWARM AGENTS"}
            {activeDrawer === "logs" && "LIVE ACTIVITY LOGS"}
            {activeDrawer === "search" && "GTM REPORTS DIRECTORY"}
          </h2>
          <button
            onClick={closeAllDrawers}
            className="p-1 border-2 border-[#FCD116] bg-[#0A0A0A] text-[#FCD116] hover:bg-[#FCD116] hover:text-[#0A0A0A] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 flex-grow text-[#0A0A0A]">
          
          {/* MENU DRAWER CONTENT */}
          {activeDrawer === "menu" && (
            <nav className="flex flex-col gap-6 pt-4">
              {[
                { title: "LAUNCH SWARM", action: () => toggleDrawer("launch") },
                { title: "AGENT ARCHITECTURE", action: () => toggleDrawer("architecture") },
                { title: "LIVE ACTIVITY LOGS", action: () => toggleDrawer("logs") },
                { title: "SEARCH REPORTS", action: () => toggleDrawer("search") },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                  }}
                  className="text-3xl font-black tracking-tight text-left text-[#0A0A0A] hover:translate-x-2 transition-transform duration-100 flex items-center justify-between border-b-4 border-black pb-2 w-full"
                >
                  <span>{item.title}</span>
                  <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>
              ))}
            </nav>
          )}

          {/* LAUNCH ENGINE FORM DRAWER CONTENT */}
          {activeDrawer === "launch" && (
            <div className="space-y-6">
              <p className="text-sm font-bold leading-relaxed">
                Feed your corporate parameters to spin up the 11-agent intelligence pipeline. Results will compile in real-time.
              </p>

              <form onSubmit={handleLaunchSwarm} className="space-y-6">
                
                {/* Company Description */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-black">
                    COMPANY DESCRIPTION
                  </label>
                  <textarea
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    rows={3}
                    placeholder="E.g., B2B SaaS Sales Intelligence Platform..."
                    className="w-full bg-white border-4 border-black px-4 py-3 font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-neutral-400"
                  />
                </div>

                {/* Product Description */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-black">
                    PRODUCT DESCRIPTION
                  </label>
                  <textarea
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    required
                    rows={4}
                    placeholder="Describe target features and features..."
                    className="w-full bg-white border-4 border-black px-4 py-3 font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-neutral-400"
                  />
                </div>

                {/* Website URL */}
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-black">
                    WEBSITE URL (OPTIONAL)
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-white border-4 border-black px-4 py-3 font-bold text-sm focus:outline-none focus:ring-0 placeholder:text-neutral-400"
                  />
                </div>

                {error && <p className="text-xs text-red-600 font-bold border-2 border-red-600 p-2 bg-red-100">{error}</p>}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black text-[#FCD116] font-black text-lg border-4 border-black brutalist-shadow brutalist-btn-hover-yellow flex items-center justify-center gap-2 active:scale-95 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-[#FCD116] animate-spin inline-block mr-1" />
                      SPINNING UP SWARM...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 fill-current" />
                      LAUNCH SWARM ENGINE
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* AGENT ARCHITECTURE DRAWER CONTENT */}
          {activeDrawer === "architecture" && (
            <div className="space-y-6">
              <p className="text-sm font-bold">The Prospect Swarm works concurrently over LangGraph to split, research, qualify, and score prospects.</p>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {AGENTS_LIST.map((agent, idx) => (
                  <div key={idx} className="border-4 border-black p-4 bg-white brutalist-shadow">
                    <div className="flex justify-between items-start">
                      <span className="bg-[#0A0A0A] text-[#FCD116] text-[10px] font-black px-2 py-0.5 border border-black">
                        {agent.stage}
                      </span>
                      <span className="text-[10px] font-black uppercase text-neutral-500">{agent.role}</span>
                    </div>
                    <h4 className="font-black text-base mt-2 leading-tight uppercase">{agent.name}</h4>
                    <p className="text-xs text-neutral-600 font-medium mt-1 leading-relaxed">{agent.description}</p>
                    
                    <div className="mt-3 text-[11px] font-black border-t-2 border-black pt-2 text-[#0A0A0A]">
                      <span className="text-neutral-500 uppercase">OUTPUT: </span>
                      <span>{agent.output}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIVE LOGS DRAWER CONTENT */}
          {activeDrawer === "logs" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold">Real-time state transitions and scraper updates from the active LangGraph swarms.</p>
                <span className="flex items-center gap-1 text-[10px] font-black text-neutral-500 bg-black/10 px-2 py-0.5 border border-black">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                  LIVE TELEMETRY
                </span>
              </div>

              <div className="bg-white text-black p-4 border-4 border-black brutalist-shadow font-sans text-xs leading-relaxed h-[60vh] overflow-y-auto space-y-2 flex flex-col-reverse">
                {logs.map((log, idx) => (
                  <div key={idx} className="border-b border-neutral-200 pb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEARCH GTM REPORTS DRAWER CONTENT */}
          {activeDrawer === "search" && (
            <div className="space-y-6">
              <p className="text-sm font-bold font-sans">Search and review historic GTM Swarm runs recorded in the database.</p>
              
              <input
                type="text"
                placeholder="Type query to filter runs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-4 border-black px-4 py-3 font-bold text-sm focus:outline-none placeholder:text-neutral-400"
              />

              <div className="space-y-4">
                <p className="text-xs font-black text-neutral-500 uppercase">PREVIOUS RUNS ({filteredReports.length})</p>
                <div className="space-y-3">
                  {filteredReports.map((report, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        // Redirect to the GTM report demo URL
                        router.push(`/report/48e886c6-bb41-47e3-8a3a-99c25631520c`);
                      }}
                      className="bg-white border-4 border-black p-3 hover:bg-[#0A0A0A] hover:text-[#FCD116] transition-colors cursor-pointer flex justify-between items-center brutalist-shadow"
                    >
                      <div>
                        <h4 className="font-black text-sm uppercase leading-tight">{report.title}</h4>
                        <p className="text-[10px] font-bold text-neutral-400 mt-1">{report.date}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t-4 border-black bg-[#0A0A0A] text-[#FCD116] text-xs font-black flex justify-between">
          <span>PROSPECT SWARM</span>
          <span>DEV ENGINE ACTIVE</span>
        </div>
      </div>

      {/* 3. MAIN HOMEPAGE CONTENT WRAPPER */}
      <main className="flex-grow md:pl-14 pb-16 md:pb-0 flex flex-col min-w-0 bg-[#FCD116]">
        
        {/* UPPER HERO WELCOME BANNER (Saturated Primary Yellow Background) */}
        <section className="bg-[#FCD116] border-b-4 border-black flex flex-col">
          
          {/* Header row with inverted brand text */}
          <div className="border-b-4 border-black p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            {/* Logo block */}
            <div className="flex flex-col text-left">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none select-none">
                PROSPECT
              </h1>
              <div className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none select-none flex items-center gap-1">
                {/* Mirroring/rotating SWARM upside down for Bauhaus brutalist feel */}
                <span className="inline-block transform rotate-180 origin-center text-matte-black selection:bg-black selection:text-[#FCD116]">
                  SWARM
                </span>
                <span className="text-[10px] font-black bg-black text-[#FCD116] px-1.5 py-0.5 ml-2 uppercase">
                  11 AGENTS ACTIVE
                </span>
              </div>
            </div>

            {/* Quick status button indicators */}
            <div className="flex flex-wrap gap-2 text-xs font-black">
              <span className="bg-black text-[#FCD116] px-3 py-1.5 border-2 border-black flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                SWARM CONTROLLER: READY
              </span>
              <a
                href="#"
                onClick={() => toggleDrawer("logs")}
                className="bg-white text-black px-3 py-1.5 border-2 border-black brutalist-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000]"
              >
                VIEW LOG TELEMETRY
              </a>
            </div>
          </div>

          {/* Giant Typographical Banner */}
          <div className="py-12 md:py-24 px-6 md:px-12 text-center relative border-b-4 border-black overflow-hidden bg-gradient-to-b from-[#FCD116] to-[#ebc110]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_0%,transparent_70%)] pointer-events-none" />
            
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-black tracking-tighter leading-none select-none my-4">
              ORCHESTRATE
            </h2>
            
            {/* Micro Dots separator */}
            <div className="flex justify-center gap-1.5 my-6">
              <span className="w-2.5 h-2.5 bg-black rounded-full" />
              <span className="w-2.5 h-2.5 bg-black/40 rounded-full" />
              <span className="w-2.5 h-2.5 bg-black/10 rounded-full" />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
              
              {/* < LAUNCH SWARM ENGINE Button (Inverted Black block) */}
              <button
                onClick={() => toggleDrawer("launch")}
                className="w-full sm:w-auto bg-black text-[#FCD116] font-black text-lg px-8 py-4 border-4 border-black brutalist-shadow-yellow brutalist-btn-hover-yellow flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5 stroke-[3]" />
                LAUNCH ENGINE
              </button>

              {/* VIEW ARCHITECTURE > Button (Yellow block) */}
              <a
                href="#architecture-section"
                className="w-full sm:w-auto bg-[#FCD116] text-black font-black text-lg px-8 py-4 border-4 border-black brutalist-shadow brutalist-btn-hover flex items-center justify-center gap-2"
              >
                SWARM ARCHITECTURE
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </a>
            </div>
          </div>
        </section>

        {/* LOWER PRODUCTS/ENGINES SECTION (Grid using our generated images!) */}
        <section id="engines" className="p-6 md:p-12 space-y-12 bg-[#FCD116]">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-4 border-black pb-4 gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-neutral-600 block">
                SWARM PIPELINE SEGMENTS
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight mt-1 text-black">
                CORE ENGINES
              </h3>
            </div>
            <p className="text-sm font-bold max-w-sm text-neutral-800 leading-tight">
              A collaborative network of LLM agents carrying state across specialized business roles.
            </p>
          </div>

          {/* Brutalist Infinite Marquee of Cards */}
          <div className="relative overflow-hidden w-full py-4 -mx-6 md:-mx-12 px-6 md:px-12 border-y-4 border-black bg-black/5">
            <div className="animate-marquee-container flex gap-8">
              {[...CORE_ENGINES, ...CORE_ENGINES].map((eng, idx) => (
                <article
                  key={`${eng.id}-${idx}`}
                  className="w-[340px] flex-shrink-0 bg-white border-4 border-black brutalist-shadow flex flex-col justify-between overflow-hidden relative group transition-all duration-200"
                >
                  {/* Accent Stage Tag */}
                  <div
                    className="absolute top-0 right-0 border-b-4 border-l-4 border-black px-3 py-1 font-black text-[10px] uppercase z-10 text-black"
                    style={{ backgroundColor: eng.accentColor }}
                  >
                    {eng.stage}
                  </div>

                  {/* Card visual using generated images */}
                  <div className="h-64 border-b-4 border-black bg-neutral-100 relative overflow-hidden">
                    <img
                      src={eng.image}
                      alt={eng.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors pointer-events-none" />
                  </div>

                  {/* Card Copy */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2 text-black">
                      <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                        {eng.agent}
                      </p>
                      <h4 className="text-base font-black uppercase leading-tight tracking-tight group-hover:underline">
                        {eng.title}
                      </h4>
                      <p className="text-xs font-bold text-neutral-600 leading-relaxed line-clamp-3">
                        {eng.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t-2 border-dashed border-black flex justify-between items-center text-xs font-black">
                      <span className="text-neutral-500">{eng.stage}</span>
                      <button
                        onClick={() => setSelectedEngine(eng)}
                        className="px-3 py-1.5 border-2 border-black text-black hover:bg-black hover:text-[#FCD116] transition-colors uppercase"
                      >
                        SPECS SHEET
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SWARM VOICE/DEBRIEF PILLAR (Replacing Museum Audio Guide) */}
        <section className="bg-black text-[#FCD116] border-y-4 border-black p-8 md:p-12 relative overflow-hidden">
          
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#FCD116]/10 to-transparent pointer-events-none" />
          
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
            
            {/* Description details */}
            <div className="space-y-4 text-left">
              <span className="bg-[#FCD116] text-[#0A0A0A] text-xs font-black px-2 py-1 uppercase border border-black">
                SWARM BRIEFING
              </span>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none text-white">
                GTM STRATEGIST VOICE LOGS
              </h3>
              <p className="text-xs text-neutral-400 max-w-md leading-relaxed font-bold">
                Play the latest strategy brief recorded by the GTM Strategist. Listen to simulated agents dialoguing about target segments and outreach strategies.
              </p>
            </div>

            {/* Audio Widget Box */}
            <div className="w-full md:w-[380px] bg-[#0A0A0A] border-4 border-[#FCD116] p-6 brutalist-shadow-yellow space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black tracking-widest text-[#FCD116] uppercase">AGENT PODCAST</span>
                <span className="flex items-center gap-1 text-[10px] font-black text-neutral-500">
                  <Volume2 className="w-3.5 h-3.5" /> SWARM STATION
                </span>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-black text-neutral-400">
                  <span>02:18</span>
                  <span>05:30</span>
                </div>
                <div className="h-3 bg-neutral-800 border-2 border-black relative overflow-hidden cursor-pointer">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-[#FCD116] transition-all duration-300"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              </div>

              {/* Simulated Audio Wave Visualizer */}
              <div className="h-16 flex items-end justify-between px-2 bg-neutral-900 border-2 border-black py-2">
                {visualizerHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-2 bg-[#FCD116] rounded-sm transition-all duration-150"
                    style={{ height: `${isPlaying ? h : 15}%` }}
                  />
                ))}
              </div>

              {/* Player controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-left">
                  <p className="font-black text-white leading-none">BRIEFING: MULTI-AGENT SHARING</p>
                  <p className="text-[10px] font-bold text-neutral-500 mt-1">NODE 01 OVER STATE VECTOR</p>
                </div>
                
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-[#FCD116] text-[#0A0A0A] flex items-center justify-center border-2 border-black hover:bg-[#FCD116]/80 transition-colors active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 stroke-[3]" />
                  ) : (
                    <Play className="w-6 h-6 stroke-[3] ml-0.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PIPELINE OVERVIEW STEPS (Replacing Museum Timeline) */}
        <section id="architecture-section" className="p-6 md:p-12 space-y-8 bg-[#FCD116] border-b-4 border-black">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-black border-b-4 border-black pb-3">
            THE SWARM WORKFLOW GRAPH
          </h3>
          
          {/* Multi-step Pipeline Visualizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { step: "01", name: "GTM STRATEGIST", status: "ICP Setup" },
              { step: "02", name: "MAPPER & HUNTER", status: "Parallel Scan" },
              { step: "03", name: "PROSPECT DISCOVERY", status: "Account Fit" },
              { step: "04", name: "FINDER & SCORER", status: "Ranking" },
              { step: "05", name: "OUTREACH PLANNER", status: "Copy Creation" },
            ].map((p, idx) => (
              <div key={idx} className="bg-white border-4 border-black p-4 brutalist-shadow flex flex-col justify-between h-36">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs bg-black text-[#FCD116] px-1.5 py-0.5 border border-black font-black">
                    {p.step}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase leading-tight mt-3">{p.name}</h4>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase mt-1">{p.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM PROSPECT SWARM DETAIL PANELS */}
        <section className="grid md:grid-cols-2 border-b-4 border-black">
          
          {/* Col 1: Abstract Brutalist Quote/Motto */}
          <div className="p-8 md:p-12 bg-[#0A0A0A] text-[#FCD116] border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-between space-y-8">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white">
              DARING, <br />
              AVANT-GARDE, <br />
              AUTOMATED.
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-neutral-300 font-medium">
                Prospect Swarm coordinates distinct AI roles, bypassing linear limitations to compile structured target maps at developer speed.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => toggleDrawer("launch")}
                  className="bg-[#FCD116] text-black font-black uppercase text-sm border-2 border-black px-6 py-3 hover:translate-x-1 transition-transform"
                >
                  START SWARM ENGINE
                </button>
              </div>
            </div>
          </div>

          {/* Col 2: High Contrast Metrics */}
          <div className="p-8 md:p-12 bg-white text-[#0A0A0A] flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-black text-neutral-500 uppercase tracking-widest block">
                SWARM PERFORMANCE TELEMETRY
              </span>
              <p className="text-2xl font-black uppercase leading-tight text-[#0A0A0A]">
                "SHARING SYSTEM CONTEXT OVER GRAPH STATE PREVENTS MODEL DRIFT AND ENSURES HIGH FIT MATCHES."
              </p>
              <p className="text-xs font-bold text-neutral-500 uppercase">— lead swarm architect</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t-2 border-black pt-6">
              <div>
                <p className="text-4xl font-black">11</p>
                <p className="text-xs text-neutral-500 font-bold uppercase mt-1">Autonomous roles working in sync</p>
              </div>
              <div>
                <p className="text-4xl font-black">45ms</p>
                <p className="text-xs text-neutral-500 font-bold uppercase mt-1">Speed per mock node execution</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FOOTER */}
        <footer className="bg-[#0A0A0A] text-neutral-500 border-t-4 border-black p-8 text-center text-xs font-bold space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto gap-4">
            <div className="text-left">
              <p className="text-white font-black text-sm uppercase">PROSPECT SWARM</p>
              <p className="text-[10px] text-neutral-500 font-bold mt-1">Next-Gen GTM Multi-Agent Platform</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Swarm Specs</a>
            </div>
          </div>
          <p className="text-[10px] text-neutral-700">
            © {new Date().getFullYear()} Prospect Swarm. Built with Next.js, LangGraph & Tailwind.
          </p>
        </footer>
      </main>

      {/* 5. SPEC SHEET DETAIL LIGHTBOX MODAL */}
      {selectedEngine && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border-8 border-black w-full max-w-4xl max-h-[90vh] overflow-y-auto brutalist-shadow-yellow-lg flex flex-col md:flex-row relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedEngine(null)}
              className="absolute top-4 right-4 bg-black text-[#FCD116] border-4 border-black p-2 hover:bg-[#FCD116] hover:text-[#0A0A0A] z-10 transition-colors"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>

            {/* Left image container */}
            <div className="md:w-1/2 bg-neutral-100 border-b-8 md:border-b-0 md:border-r-8 border-black relative min-h-[300px]">
              <img
                src={selectedEngine.image}
                alt={selectedEngine.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right details */}
            <div className="md:w-1/2 p-8 flex flex-col justify-between text-[#0A0A0A]">
              <div className="space-y-6">
                <div>
                  <span
                    className="inline-block px-2 py-1 text-xs font-black uppercase text-black border border-black"
                    style={{ backgroundColor: selectedEngine.accentColor }}
                  >
                    {selectedEngine.stage}
                  </span>
                  <h3 className="text-3xl font-black uppercase mt-3 tracking-tight leading-none">
                    {selectedEngine.title}
                  </h3>
                  <p className="text-sm font-black text-neutral-500 uppercase mt-1">
                    ENGINE COMPONENT: {selectedEngine.agent}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-neutral-400">ENGINE SPECIFICATIONS</h4>
                  <p className="text-sm leading-relaxed font-medium">
                    {selectedEngine.description}
                  </p>
                </div>

                <div className="space-y-2 border-t-2 border-black pt-4">
                  <div className="flex justify-between text-xs font-bold text-neutral-600">
                    <span>ROLE DELEGATOR</span>
                    <span className="font-black text-[#0A0A0A]">{selectedEngine.curator}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-neutral-600">
                    <span>EXECUTION STAGE</span>
                    <span className="font-black text-[#0A0A0A]">{selectedEngine.stage}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 flex gap-4">
                <button
                  onClick={() => {
                    setSelectedEngine(null);
                    toggleDrawer("launch");
                  }}
                  className="flex-grow bg-black text-[#FCD116] border-4 border-black py-3 font-black text-center uppercase hover:bg-neutral-800 transition-colors"
                >
                  RUN SWARM ENGINE NOW
                </button>
                <button
                  onClick={() => setSelectedEngine(null)}
                  className="bg-transparent border-4 border-black text-black px-6 py-3 font-black uppercase hover:bg-neutral-100 transition-colors"
                >
                  CLOSE
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
