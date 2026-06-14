"use client";

import { useState } from "react";
import type { AgentOutputs } from "@/lib/export/agent-outputs";
import {
  AGENT_LABELS,
  AGENT_NAMES,
  type AgentName,
  type AgentStatuses,
} from "@/types/agents";
import { cn } from "@/lib/utils";

type Props = {
  agentStatuses: AgentStatuses;
  agentOutputs: AgentOutputs;
  selectedAgent: AgentName | null;
  onSelectAgent: (agent: AgentName) => void;
};

function OutputPreview({ agent, output }: { agent: AgentName; output: unknown }) {
  if (!output || typeof output !== "object") {
    return <p className="text-sm text-gray-500">No output data.</p>;
  }

  const data = output as Record<string, unknown>;

  if (agent === "gtm_strategist" && Array.isArray(data.icps)) {
    return (
      <ul className="space-y-2">
        {(data.icps as Array<{ name: string; description: string }>).map((icp) => (
          <li key={icp.name} className="text-sm border-l-2 border-blue-400 pl-3">
            <p className="font-medium text-gray-900">{icp.name}</p>
            <p className="text-gray-600">{icp.description}</p>
          </li>
        ))}
      </ul>
    );
  }

  if (agent === "prospect_discovery" && Array.isArray(data.prospects)) {
    return (
      <ul className="space-y-2">
        {(data.prospects as Array<{ company_name: string; fit_score: number; industry: string }>).map(
          (p) => (
            <li
              key={p.company_name}
              className="flex justify-between text-sm border-b border-gray-100 pb-2"
            >
              <span className="font-medium">{p.company_name}</span>
              <span className="text-gray-500">
                {p.industry} · {p.fit_score}% fit
              </span>
            </li>
          )
        )}
      </ul>
    );
  }

  if (agent === "signal_hunter" && Array.isArray(data.market_signals)) {
    return (
      <ul className="space-y-2">
        {(data.market_signals as Array<{ signal_type: string; urgency: string; description: string }>).map(
          (s, i) => (
            <li key={i} className="text-sm">
              <span
                className={cn(
                  "inline-block px-1.5 py-0.5 rounded text-xs mr-2",
                  s.urgency === "high"
                    ? "bg-red-100 text-red-700"
                    : s.urgency === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                )}
              >
                {s.urgency}
              </span>
              <span className="font-medium">{s.signal_type}</span>
              <p className="text-gray-600 mt-0.5">{s.description}</p>
            </li>
          )
        )}
      </ul>
    );
  }

  if (agent === "outreach_planner" && Array.isArray(data.outreach_strategies)) {
    return (
      <ul className="space-y-3">
        {(data.outreach_strategies as Array<{ company_name: string; outreach_angle: string }>).map(
          (s) => (
            <li key={s.company_name} className="text-sm">
              <p className="font-medium text-gray-900">{s.company_name}</p>
              <p className="text-gray-600">{s.outreach_angle}</p>
            </li>
          )
        )}
      </ul>
    );
  }

  if (agent === "report_assembler" && typeof data.summary === "string") {
    return <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>;
  }

  return (
    <pre className="text-xs bg-gray-50 border rounded p-3 overflow-x-auto text-gray-800">
      {JSON.stringify(output, null, 2)}
    </pre>
  );
}

const statusDot: Record<string, string> = {
  pending: "bg-gray-300",
  running: "bg-blue-500 animate-pulse",
  done: "bg-green-500",
  error: "bg-red-500",
};

export function AgentOutputExplorer({
  agentStatuses,
  agentOutputs,
  selectedAgent,
  onSelectAgent,
}: Props) {
  const [showRaw, setShowRaw] = useState(false);
  const active = selectedAgent ?? AGENT_NAMES.find((a) => agentOutputs[a]) ?? AGENT_NAMES[0];
  const output = agentOutputs[active];
  const status = agentStatuses[active];

  return (
    <section className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b bg-gray-50 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Agent Outputs</h2>
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showRaw}
            onChange={(e) => setShowRaw(e.target.checked)}
            className="rounded"
          />
          Show raw JSON
        </label>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] min-h-[320px]">
        <div className="border-b lg:border-b-0 lg:border-r border-gray-200 p-2 space-y-1 max-h-[360px] overflow-y-auto">
          {AGENT_NAMES.map((agent) => {
            const hasOutput = agentOutputs[agent] !== undefined;
            const agentStatus = agentStatuses[agent];

            return (
              <button
                key={agent}
                type="button"
                onClick={() => onSelectAgent(agent)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2",
                  active === agent
                    ? "bg-blue-50 text-blue-900 ring-1 ring-blue-200"
                    : "hover:bg-gray-50 text-gray-700",
                  !hasOutput && agentStatus === "pending" && "opacity-50"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full shrink-0", statusDot[agentStatus])} />
                <span className="truncate">{AGENT_LABELS[agent]}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 overflow-y-auto max-h-[360px]">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium text-gray-900">{AGENT_LABELS[active]}</h3>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full capitalize",
                status === "done"
                  ? "bg-green-100 text-green-700"
                  : status === "running"
                    ? "bg-blue-100 text-blue-700"
                    : status === "error"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
              )}
            >
              {status}
            </span>
          </div>

          {!output && status !== "done" && (
            <p className="text-sm text-gray-500 italic">
              {status === "running"
                ? "Agent is working… output will appear when complete."
                : "Output not available yet."}
            </p>
          )}

          {output !== undefined && !showRaw && (
            <OutputPreview agent={active} output={output} />
          )}

          {output !== undefined && showRaw && (
            <pre className="text-xs bg-gray-950 text-green-400 rounded p-4 overflow-x-auto">
              {JSON.stringify(output, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
