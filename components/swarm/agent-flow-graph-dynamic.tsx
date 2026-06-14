"use client";

import dynamic from "next/dynamic";
import type { AgentStatuses, AgentName } from "@/types/agents";

type Props = {
  agentStatuses: AgentStatuses;
  selectedAgent?: AgentName | null;
  onSelectAgent?: (agent: AgentName) => void;
};

// React Flow (@xyflow/react) is a large dependency that is only needed once the
// graph is on screen, so it is code-split out of the initial bundle here.
const AgentFlowGraphInner = dynamic(
  () => import("./agent-flow-graph").then((m) => m.AgentFlowGraph),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[800px] w-full items-center justify-center border-4 border-black bg-[#0A0A0A] text-xs font-black uppercase tracking-widest text-[#FCD116]">
        Loading swarm graph…
      </div>
    ),
  }
);

export function AgentFlowGraph(props: Props) {
  return <AgentFlowGraphInner {...props} />;
}
