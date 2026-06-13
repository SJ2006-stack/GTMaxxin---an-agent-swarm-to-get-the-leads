"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { AGENT_LABELS, type AgentName, type AgentStatus } from "@/types/agents";
import { cn } from "@/lib/utils";

export type AgentNodeData = {
  agent: AgentName;
  status: AgentStatus;
};

const statusStyles: Record<AgentStatus, string> = {
  pending: "border-gray-300 bg-gray-50 text-gray-500",
  running: "border-blue-500 bg-blue-50 text-blue-700 animate-pulse",
  done: "border-green-500 bg-green-50 text-green-700",
  error: "border-red-500 bg-red-50 text-red-700",
};

const statusIcons: Record<AgentStatus, string> = {
  pending: "○",
  running: "◉",
  done: "✓",
  error: "✗",
};

function AgentNodeComponent({ data }: NodeProps & { data: AgentNodeData }) {
  const label = AGENT_LABELS[data.agent] ?? data.agent;

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border-2 shadow-sm min-w-[160px] text-center text-sm font-medium transition-all duration-300",
        statusStyles[data.status]
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="flex items-center justify-center gap-2">
        <span>{statusIcons[data.status]}</span>
        <span>{label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}

export const AgentNode = memo(AgentNodeComponent);
