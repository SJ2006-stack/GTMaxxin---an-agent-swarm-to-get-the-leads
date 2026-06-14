import type { AgentName } from "@/types/agents";
import type { GTMReportState } from "@/lib/agents/state";
import type { AgentStatusEvent, SwarmStreamEvent } from "@/lib/agents/events";
import { logAgent } from "@/lib/agents/agent-logger";
import {
  extractAgentOutput,
  mergeStateWithResult,
  summarizeAgentOutput,
} from "@/lib/export/agent-outputs";
import { warnIfOutputAnemic } from "@/lib/agents/output-validation";
import { createAgentStatusEvent } from "@/lib/agents/events";
import { AGENT_LABELS } from "@/types/agents";

export type SwarmEmitter = (event: SwarmStreamEvent) => void;

export async function wrapNode<T extends Partial<GTMReportState>>(
  agent: AgentName,
  state: GTMReportState,
  fn: (state: GTMReportState) => Promise<T>,
  emit?: SwarmEmitter
): Promise<T> {
  logAgent(agent, "step", `Starting ${AGENT_LABELS[agent]}`);
  emit?.({ type: "status", data: createAgentStatusEvent(state.run_id, agent, "running") });

  try {
    const result = await fn(state);
    const merged = mergeStateWithResult(state, result);
    const output = extractAgentOutput(agent, merged);

    warnIfOutputAnemic(agent, output);

    const summary = summarizeAgentOutput(agent, output);
    logAgent(agent, "info", summary);

    emit?.({
      type: "status",
      data: {
        ...createAgentStatusEvent(state.run_id, agent, "done"),
        output,
        summary,
      },
    });

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logAgent(agent, "error", `${AGENT_LABELS[agent]} failed`, message);
    emit?.({
      type: "status",
      data: createAgentStatusEvent(state.run_id, agent, "error", message),
    });
    throw err;
  }
}

export async function runJoinResearch(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  logAgent("join_research", "step", "Synchronizing parallel research branches");
  if (!state.market_map) {
    logAgent("join_research", "error", "Expected market_map from Market Mapper — not found");
  }
  if (!state.signals) {
    logAgent("join_research", "error", "Expected signals from Signal Hunter — not found");
  }
  if (!state.market_map || !state.signals) {
    throw new Error("JoinResearch: missing market_map or signals");
  }
  logAgent("join_research", "info", "Market map and signals merged successfully");
  return {};
}

export async function runJoinQualify(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  logAgent("join_qualify", "step", "Synchronizing qualification branches");
  if (!state.decision_makers) {
    logAgent(
      "join_qualify",
      "error",
      "Expected decision_makers from Decision Maker Finder — not found"
    );
  }
  if (!state.opportunities) {
    logAgent(
      "join_qualify",
      "error",
      "Expected opportunities from Opportunity Scorer — not found"
    );
  }
  if (!state.decision_makers || !state.opportunities) {
    throw new Error("JoinQualify: missing decision_makers or opportunities");
  }
  logAgent("join_qualify", "info", "Decision makers and opportunity scores merged");
  return {};
}
