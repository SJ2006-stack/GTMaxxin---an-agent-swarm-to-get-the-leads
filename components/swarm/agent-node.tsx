"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { AGENT_LABELS, type AgentName, type AgentStatus } from "@/types/agents";
import { cn } from "@/lib/utils";

export type AgentNodeData = {
  agent: AgentName;
  status: AgentStatus;
  selected?: boolean;
};

const statusStyles: Record<AgentStatus, string> = {
  pending: "border-neutral-700 bg-[#0A0A0A] border-2",
  running: "border-blue-500 bg-[#0A0A0A] border-4 shadow-[3px_3px_0px_0px_#3b82f6] animate-pulse",
  done: "border-emerald-500 bg-[#0A0A0A] border-4 shadow-[3px_3px_0px_0px_#10b981]",
  error: "border-red-500 bg-[#0A0A0A] border-4 shadow-[3px_3px_0px_0px_#ef4444]",
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
        "px-4 py-3 rounded-none text-center text-sm font-black transition-all duration-300 cursor-pointer text-white",
        statusStyles[data.status],
        data.selected && "ring-4 ring-[#FCD116] ring-offset-[#0A0A0A] scale-105"
      )}
      style={{ color: "#ffffff" }}
    >
      <Handle type="target" position={Position.Top} className="!bg-neutral-700" />
      <div className="flex items-center justify-center gap-2 text-white" style={{ color: "#ffffff" }}>
        <span className="text-white" style={{ color: "#ffffff" }}>{statusIcons[data.status]}</span>
        <span className="text-white" style={{ color: "#ffffff" }}>{label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-neutral-700" />
    </div>
  );
}

export const AgentNode = memo(AgentNodeComponent);
