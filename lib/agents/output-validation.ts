import type { AgentName } from "@/types/agents";
import { logAgent } from "@/lib/agents/agent-logger";

function countArray(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

/** Emit warnings when agent output looks incomplete or unexpected */
export function warnIfOutputAnemic(agent: AgentName, output: unknown): void {
  if (!output || typeof output !== "object") {
    logAgent(agent, "warn", "Agent returned empty or non-object output");
    return;
  }

  const data = output as Record<string, unknown>;

  switch (agent) {
    case "input_processor": {
      const input = data.input as { company?: string; product?: string } | undefined;
      if (!input?.company?.trim()) {
        logAgent(agent, "warn", "Missing company description in processed input");
      }
      if (!input?.product?.trim()) {
        logAgent(agent, "warn", "Missing product description in processed input");
      }
      if (!data.website_content) {
        logAgent(agent, "warn", "No website content available for downstream agents");
      }
      break;
    }
    case "gtm_strategist":
      if (countArray(data.icps) === 0) {
        logAgent(agent, "warn", "No ICPs generated — downstream agents may underperform");
      }
      break;
    case "market_mapper":
      if (countArray(data.primary_markets) === 0) {
        logAgent(agent, "warn", "No primary markets mapped");
      }
      break;
    case "signal_hunter":
      if (countArray(data.market_signals) === 0) {
        logAgent(agent, "warn", "No buying signals detected");
      }
      break;
    case "prospect_discovery":
      if (countArray(data.prospects) === 0) {
        logAgent(agent, "warn", "Prospect list is empty");
      }
      break;
    case "decision_maker_finder":
      if (countArray(data.decision_makers) === 0) {
        logAgent(agent, "warn", "No decision makers identified");
      }
      break;
    case "opportunity_scorer":
      if (countArray(data.ranked_opportunities) === 0) {
        logAgent(agent, "warn", "No opportunities scored");
      }
      break;
    case "outreach_planner":
      if (countArray(data.outreach_strategies) === 0) {
        logAgent(agent, "warn", "No outreach strategies drafted");
      }
      break;
    case "report_assembler":
      if (!data.summary) {
        logAgent(agent, "warn", "Final report missing executive summary");
      }
      break;
    case "join_research": {
      const merged = data.merged as { market_map?: unknown; signals?: unknown } | undefined;
      if (!merged?.market_map) {
        logAgent(agent, "error", "Join blocked: market_map missing from parallel branch");
      }
      if (!merged?.signals) {
        logAgent(agent, "error", "Join blocked: signals missing from parallel branch");
      }
      break;
    }
    case "join_qualify": {
      const merged = data.merged as
        | { decision_makers?: unknown; opportunities?: unknown }
        | undefined;
      if (!merged?.decision_makers) {
        logAgent(agent, "error", "Join blocked: decision_makers missing from parallel branch");
      }
      if (!merged?.opportunities) {
        logAgent(agent, "error", "Join blocked: opportunities missing from parallel branch");
      }
      break;
    }
  }
}
