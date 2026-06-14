"use client";

import { use } from "react";
import Link from "next/link";
import {
  Menu,
  Zap,
  Layers,
  Terminal,
  Search,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { AgentFlowGraph } from "@/components/swarm/agent-flow-graph";
import { AgentActivityLog } from "@/components/swarm/agent-activity-log";
import { AgentOutputExplorer } from "@/components/swarm/agent-output-explorer";
import { ICPReportSection } from "@/components/report/icp";
import { MarketsReportSection } from "@/components/report/markets";
import { SignalsReportSection } from "@/components/report/signals";
import { ProspectsReportSection } from "@/components/report/prospects";
import { OutreachReportSection } from "@/components/report/outreach";
import { useReportStream } from "@/hooks/use-report-stream";

export default function ReportPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = use(params);
  const {
    agentStatuses,
    agentOutputs,
    timeline,
    report,
    isComplete,
    error,
    langsmithTraceUrl,
    demoMode,
    selectedAgent,
    setSelectedAgent,
  } = useReportStream(runId);

  const doneCount = Object.values(agentStatuses).filter((s) => s === "done").length;

  const generatedAt = report?.generated_at
    ? new Date(report.generated_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#FCD116] flex flex-col md:flex-row relative">
      
      {/* 1. LEFT VERTICAL NAVIGATION SIDEBAR (Same design as landing page) */}
      <aside className="fixed bottom-0 left-0 w-full h-16 md:h-screen md:w-14 bg-[#0A0A0A] border-t-4 md:border-t-0 md:border-r-4 border-black flex flex-row md:flex-col justify-between items-center py-2 md:py-6 px-4 md:px-0 z-50">
        
        {/* Top brand logo */}
        <div className="hidden md:flex flex-col items-center gap-1.5">
          <Link
            href="/"
            className="w-8 h-8 bg-[#FCD116] text-[#0A0A0A] flex items-center justify-center font-black text-base border-2 border-black tracking-tighter shadow-sm cursor-pointer"
          >
            PS
          </Link>
          <span className="text-[9px] font-black tracking-widest text-[#FCD116] rotate-90 my-3">SWARM</span>
        </div>

        {/* Action icons stack redirecting to homepage drawer coordinates */}
        <div className="flex flex-row md:flex-col gap-4 md:gap-6 items-center w-full justify-around md:justify-center">
          {/* Menu link */}
          <Link
            href="/?tab=menu"
            aria-label="Toggle Menu"
            className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-black bg-transparent text-[#FCD116] hover:bg-[#FCD116]/20 transition-all"
          >
            <Menu className="w-4 h-4 stroke-[3]" />
          </Link>

          {/* Launch link */}
          <Link
            href="/?tab=launch"
            aria-label="Launch Swarm Engine"
            className="p-1.5 text-neutral-500 hover:text-white transition-colors"
          >
            <Zap className="w-5 h-5 stroke-[2]" />
          </Link>

          {/* Swarm Architecture link */}
          <Link
            href="/?tab=architecture"
            aria-label="Swarm Architecture"
            className="p-1.5 text-neutral-500 hover:text-white transition-colors"
          >
            <Layers className="w-5 h-5 stroke-[2]" />
          </Link>

          {/* Live Activity Logs link */}
          <Link
            href="/?tab=logs"
            aria-label="Live Activity Logs"
            className="p-1.5 text-neutral-500 hover:text-white transition-colors"
          >
            <Terminal className="w-5 h-5 stroke-[2]" />
          </Link>

          {/* Search Reports link */}
          <Link
            href="/?tab=search"
            aria-label="Search GTM Reports"
            className="p-1.5 text-neutral-500 hover:text-white transition-colors"
          >
            <Search className="w-5 h-5 stroke-[2]" />
          </Link>
        </div>

        {/* Build version info */}
        <div className="hidden md:flex flex-col items-center gap-4 text-xs font-black text-neutral-500">
          <button className="hover:text-white transition-colors">V1</button>
          <div className="w-4 h-[2px] bg-neutral-800" />
          <span className="text-[#FCD116]">DEV</span>
        </div>
      </aside>

      {/* 2. MAIN REPORT PAGE WRAPPER */}
      <main className="flex-grow md:pl-14 pb-16 md:pb-0 flex flex-col min-w-0 bg-[#FCD116] text-[#0A0A0A] p-6 md:p-12 space-y-8 min-h-screen">
        
        {/* Header navigation bar */}
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-4 border-black pb-6">
          <div className="space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-[#0A0A0A] text-[#FCD116] px-3 py-1.5 border-2 border-black font-black uppercase text-xs brutalist-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
              BACK TO CONSOLE
            </Link>
            
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-black select-none">
                GTM Intelligence Report
              </h1>
              {demoMode !== null && (
                <span
                  className={`px-2 py-0.5 border-2 border-black text-xs font-black uppercase ${
                    demoMode ? "bg-[#0A0A0A] text-[#FCD116]" : "bg-white text-black"
                  }`}
                >
                  {demoMode ? "Demo Mode" : "Live Stream"}
                </span>
              )}
              {!isComplete && (
                <span className="px-2 py-0.5 border-2 border-black text-xs font-black uppercase bg-green-500 text-white animate-pulse">
                  Swarm Running
                </span>
              )}
            </div>
            
            <p className="text-sm font-bold text-neutral-800 uppercase tracking-wide">
              Run ID: <span className="font-mono">{runId}</span> · {doneCount}/11 Agents Complete
              {generatedAt && ` · Compiled ${generatedAt}`}
            </p>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {langsmithTraceUrl && (
              <a
                href={langsmithTraceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black px-3 py-2 border-2 border-black font-black uppercase text-xs brutalist-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1"
              >
                LangSmith Trace <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {report && (
              <a
                href={`/api/report/${runId}/export`}
                download="folder.zip"
                className="bg-[#0A0A0A] text-[#FCD116] px-4 py-2 border-2 border-black font-black uppercase text-xs brutalist-shadow brutalist-btn-hover-yellow inline-block text-center select-none"
              >
                DOWNLOAD FOLDER.ZIP
              </a>
            )}
          </div>
        </header>

        {/* Error layout */}
        {error && (
          <div className="p-4 bg-red-100 border-4 border-red-600 font-bold text-red-600 brutalist-shadow">
            {error}
          </div>
        )}

        {/* 11 Agents Flow Graph and Swarm Terminal logs */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <section className="bg-white border-4 border-black p-4 brutalist-shadow">
            <h2 className="text-xl font-display font-black uppercase mb-3 text-black tracking-tight border-b-2 border-black pb-1">
              Agent Swarm Graph
            </h2>
            <AgentFlowGraph
              agentStatuses={agentStatuses}
              selectedAgent={selectedAgent}
              onSelectAgent={setSelectedAgent}
            />
          </section>
          <AgentActivityLog
            timeline={timeline}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
        </div>

        {/* Tab outputs explorer */}
        <div className="brutalist-report-explorer">
          <AgentOutputExplorer
            agentStatuses={agentStatuses}
            agentOutputs={agentOutputs}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
        </div>

        {/* Generated report sections */}
        {report && (
          <div className="brutalist-report space-y-10 pt-8 border-t-4 border-black">
            
            {/* Executive Summary card */}
            <section className="bg-white border-4 border-black brutalist-shadow p-6">
              <h2 className="text-2xl font-black uppercase text-black border-b-2 border-black pb-2">
                Executive Summary
              </h2>
              <p className="text-black mt-4 leading-relaxed font-medium text-sm">{report.summary}</p>
            </section>

            {/* Child report segments (will be styled via css class selectors in globals.css) */}
            <ICPReportSection
              icps={report.icps}
              personas={report.personas}
              targetIndustries={report.target_industries}
              valueProposition={report.value_proposition}
            />

            <MarketsReportSection
              primaryMarkets={report.primary_markets}
              secondaryMarkets={report.secondary_markets}
              adjacentMarkets={report.adjacent_markets}
            />

            <SignalsReportSection
              signals={report.market_signals}
              intentIndicators={report.intent_indicators}
            />

            <ProspectsReportSection
              prospects={report.prospects}
              opportunities={report.ranked_opportunities}
              decisionMakers={report.decision_makers}
            />

            <OutreachReportSection strategies={report.outreach_strategies} />
          </div>
        )}

        {/* Idle stream connector */}
        {!report && !error && timeline.length === 0 && (
          <div className="text-center py-12 bg-white border-4 border-black brutalist-shadow">
            <div className="font-black animate-pulse text-lg uppercase">CONNECTING TO LIVE SWARM TELEMETRY ENGINE...</div>
          </div>
        )}
      </main>

    </div>
  );
}
