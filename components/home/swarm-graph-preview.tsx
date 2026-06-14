"use client";

import { useEffect, useMemo, useState } from "react";
import { AgentFlowGraph } from "@/components/swarm/agent-flow-graph-dynamic";
import {
  AGENT_NAMES,
  createInitialAgentStatuses,
  type AgentName,
  type AgentStatuses,
} from "@/types/agents";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MeshGradient } from "@/components/ui/mesh-gradient";

const DEMO_SEQUENCE: AgentName[] = [
  "input_processor",
  "gtm_strategist",
  "market_mapper",
  "signal_hunter",
  "join_research",
  "prospect_discovery",
  "decision_maker_finder",
  "opportunity_scorer",
  "join_qualify",
  "outreach_planner",
  "report_assembler",
];

function buildDemoStatuses(activeIndex: number): AgentStatuses {
  const statuses = createInitialAgentStatuses();

  DEMO_SEQUENCE.forEach((agent, i) => {
    if (i < activeIndex) statuses[agent] = "done";
    else if (i === activeIndex) statuses[agent] = "running";
  });

  return statuses;
}

export function SwarmGraphPreview() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (DEMO_SEQUENCE.length + 2));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const agentStatuses = useMemo(
    () => buildDemoStatuses(Math.min(activeIndex, DEMO_SEQUENCE.length - 1)),
    [activeIndex]
  );

  const doneCount = Object.values(agentStatuses).filter((s) => s === "done").length;

  return (
    <section id="architecture-section" className="relative border-b-4 border-black overflow-hidden">
      <MeshGradient variant="dark" className="opacity-40" />

      <div className="relative p-6 md:p-12 space-y-8 bg-[#FCD116]/95">
        <ScrollReveal className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-4 border-black pb-4 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-neutral-600 block">
              LANGGRAPH TOPOLOGY
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-black mt-1">
              THE GTMAXXIN WORKFLOW GRAPH
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-black">
            <span className="bg-black text-[#FCD116] px-3 py-1.5 border-2 border-black">
              {AGENT_NAMES.length} NODES
            </span>
            <span className="bg-white text-black px-3 py-1.5 border-2 border-black brutalist-shadow">
              {doneCount}/{AGENT_NAMES.length} SIMULATED
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="border-4 border-black brutalist-shadow-lg overflow-hidden">
            <AgentFlowGraph agentStatuses={agentStatuses} />
          </div>
        </ScrollReveal>

        {/* Compact step cards for mobile fallback context */}
        <ScrollReveal delay={200}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { step: "01", name: "GTM STRATEGIST", status: "ICP Setup" },
              { step: "02", name: "MAPPER & HUNTER", status: "Parallel Scan" },
              { step: "03", name: "PROSPECT DISCOVERY", status: "Account Fit" },
              { step: "04", name: "FINDER & SCORER", status: "Ranking" },
              { step: "05", name: "OUTREACH PLANNER", status: "Copy Creation" },
            ].map((p, idx) => (
              <div
                key={p.step}
                className="bg-white border-4 border-black p-3 brutalist-shadow flex flex-col justify-between min-h-[100px] animate-on-scroll is-visible"
                style={{ transitionDelay: `${idx * 60}ms` }}
              >
                <span className="font-mono text-[10px] bg-black text-[#FCD116] px-1 py-0.5 border border-black font-black w-fit">
                  {p.step}
                </span>
                <div>
                  <h4 className="font-black text-[11px] uppercase leading-tight mt-2">{p.name}</h4>
                  <p className="text-[9px] font-bold text-neutral-500 uppercase mt-0.5">{p.status}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
