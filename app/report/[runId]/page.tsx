"use client";

import { use } from "react";
import Link from "next/link";
import { AgentFlowGraph } from "@/components/swarm/agent-flow-graph";
import { AgentActivityLog } from "@/components/swarm/agent-activity-log";
import { AgentOutputExplorer } from "@/components/swarm/agent-output-explorer";
import { ICPReportSection } from "@/components/report/icp";
import { MarketsReportSection } from "@/components/report/markets";
import { SignalsReportSection } from "@/components/report/signals";
import { ProspectsReportSection } from "@/components/report/prospects";
import { OutreachReportSection } from "@/components/report/outreach";
import { useReportStream } from "@/hooks/use-report-stream";
import { Button } from "@/components/ui/button";

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
    <main className="min-h-screen p-6 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back
          </Link>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <h1 className="text-2xl font-bold">GTM Intelligence Report</h1>
            {demoMode !== null && (
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  demoMode
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {demoMode ? "Demo" : "Live"}
              </span>
            )}
            {!isComplete && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 animate-pulse">
                Swarm active
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Run {runId.slice(0, 8)}… · {doneCount}/11 agents complete
            {!isComplete && " · Running..."}
            {generatedAt && ` · Generated ${generatedAt}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {langsmithTraceUrl && (
            <a
              href={langsmithTraceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-blue-600"
            >
              LangSmith Trace ↗
            </a>
          )}
          {report && (
            <Button asChild variant="outline">
              <a href={`/api/report/${runId}/export`} download="folder.zip">
                Download folder.zip
              </a>
            </Button>
          )}
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">Agent Swarm</h2>
          <AgentFlowGraph
            agentStatuses={agentStatuses}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3 sr-only">Activity Log</h2>
          <AgentActivityLog
            timeline={timeline}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
          />
        </section>
      </div>

      <AgentOutputExplorer
        agentStatuses={agentStatuses}
        agentOutputs={agentOutputs}
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
      />

      {report && (
        <div className="space-y-10 pt-4 border-t">
          <section>
            <h2 className="text-xl font-semibold">Executive Summary</h2>
            <p className="text-gray-600 mt-2">{report.summary}</p>
          </section>

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

      {!report && !error && timeline.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="animate-pulse">Connecting to swarm stream…</div>
        </div>
      )}
    </main>
  );
}
