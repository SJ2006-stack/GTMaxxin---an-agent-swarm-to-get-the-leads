"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AgentNode, type AgentNodeData } from "./agent-node";
import type { AgentStatuses } from "@/types/agents";
import type { AgentName } from "@/types/agents";

const nodeTypes = { agent: AgentNode };

type Props = {
  agentStatuses: AgentStatuses;
  selectedAgent?: AgentName | null;
  onSelectAgent?: (agent: AgentName) => void;
};

const GRAPH_NODES: { id: AgentName; x: number; y: number }[] = [
  { id: "input_processor", x: 400, y: 0 },
  { id: "gtm_strategist", x: 400, y: 100 },
  { id: "market_mapper", x: 200, y: 220 },
  { id: "signal_hunter", x: 600, y: 220 },
  { id: "join_research", x: 400, y: 320 },
  { id: "prospect_discovery", x: 400, y: 420 },
  { id: "decision_maker_finder", x: 200, y: 540 },
  { id: "opportunity_scorer", x: 600, y: 540 },
  { id: "join_qualify", x: 400, y: 660 },
  { id: "outreach_planner", x: 400, y: 760 },
  { id: "report_assembler", x: 400, y: 860 },
];

const GRAPH_EDGES: Edge[] = [
  { id: "e1", source: "input_processor", target: "gtm_strategist", animated: true },
  { id: "e2", source: "gtm_strategist", target: "market_mapper", animated: true },
  { id: "e3", source: "gtm_strategist", target: "signal_hunter", animated: true },
  { id: "e4", source: "market_mapper", target: "join_research" },
  { id: "e5", source: "signal_hunter", target: "join_research" },
  { id: "e6", source: "join_research", target: "prospect_discovery", animated: true },
  { id: "e7", source: "prospect_discovery", target: "decision_maker_finder", animated: true },
  { id: "e8", source: "prospect_discovery", target: "opportunity_scorer", animated: true },
  { id: "e9", source: "decision_maker_finder", target: "join_qualify" },
  { id: "e10", source: "opportunity_scorer", target: "join_qualify" },
  { id: "e11", source: "join_qualify", target: "outreach_planner", animated: true },
  { id: "e12", source: "outreach_planner", target: "report_assembler", animated: true },
];

export function AgentFlowGraph({
  agentStatuses,
  selectedAgent,
  onSelectAgent,
}: Props) {
  const nodes: Node<AgentNodeData>[] = useMemo(
    () =>
      GRAPH_NODES.map(({ id, x, y }) => ({
        id,
        type: "agent",
        position: { x, y },
        data: {
          agent: id,
          status: agentStatuses[id] ?? "pending",
          selected: selectedAgent === id,
        },
      })),
    [agentStatuses, selectedAgent]
  );

  return (
    <div className="h-[500px] w-full rounded-lg border border-gray-200 bg-white">
      <ReactFlow
        nodes={nodes}
        edges={GRAPH_EDGES}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        onNodeClick={(_, node) => onSelectAgent?.(node.id as AgentName)}
      >
        <Background />
        <Controls showInteractive={false} />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
