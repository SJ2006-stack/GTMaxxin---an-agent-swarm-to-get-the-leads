import type { AgentName } from "@/types/agents";
import { AGENT_PHASES } from "@/types/agents";

export type AgentStatusEvent = {
  run_id: string;
  agent: AgentName;
  status: "pending" | "running" | "done" | "error";
  phase: 0 | 1 | 2 | 3 | 4 | 5;
  timestamp: string;
  error?: string;
  output?: unknown;
  summary?: string;
};

export type AgentLogEvent = {
  run_id: string;
  agent: AgentName;
  level: "step" | "info" | "warn" | "error";
  message: string;
  detail?: string;
  timestamp: string;
};

export type SwarmStreamEvent =
  | { type: "status"; data: AgentStatusEvent }
  | { type: "log"; data: AgentLogEvent };

export function createAgentStatusEvent(
  runId: string,
  agent: AgentName,
  status: AgentStatusEvent["status"],
  error?: string
): AgentStatusEvent {
  return {
    run_id: runId,
    agent,
    status,
    phase: AGENT_PHASES[agent],
    timestamp: new Date().toISOString(),
    ...(error ? { error } : {}),
  };
}

export type SSEEvent =
  | { type: "agent_status"; data: AgentStatusEvent }
  | { type: "agent_log"; data: AgentLogEvent }
  | { type: "report_ready"; data: { run_id: string } }
  | { type: "error"; data: { message: string } };

export function formatSSE(event: SSEEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
}
