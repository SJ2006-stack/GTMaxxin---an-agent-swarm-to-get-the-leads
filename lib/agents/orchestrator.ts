import type { AgentName, AgentStatus } from "@/types/agents";
import type { GTMReportState } from "@/lib/agents/state";
import type { AgentStatusEvent } from "@/lib/agents/events";
import { createAgentStatusEvent } from "@/lib/agents/events";

export type StatusEmitter = (event: AgentStatusEvent) => void;

export function mergeAgentStatus(
  state: GTMReportState,
  agent: AgentName,
  status: AgentStatus,
  error?: string
): Partial<GTMReportState> {
  return {
    agent_statuses: {
      ...state.agent_statuses,
      [agent]: status,
    },
    ...(error ? { errors: { ...state.errors, [agent]: error } } : {}),
  };
}

export async function wrapNode<T extends Partial<GTMReportState>>(
  agent: AgentName,
  state: GTMReportState,
  fn: (state: GTMReportState) => Promise<T>,
  emit?: StatusEmitter
): Promise<T> {
  emit?.(createAgentStatusEvent(state.run_id, agent, "running"));
  try {
    const result = await fn(state);
    emit?.(createAgentStatusEvent(state.run_id, agent, "done"));
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    emit?.(createAgentStatusEvent(state.run_id, agent, "error", message));
    throw err;
  }
}

export async function runJoinResearch(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (!state.market_map || !state.signals) {
    throw new Error("JoinResearch: missing market_map or signals");
  }
  return {};
}

export async function runJoinQualify(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (!state.decision_makers || !state.opportunities) {
    throw new Error("JoinQualify: missing decision_makers or opportunities");
  }
  return {};
}
