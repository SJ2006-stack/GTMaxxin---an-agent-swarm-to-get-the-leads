import type { GTMReportState } from "@/lib/agents/state";
import { AGENT_LABELS, AGENT_NAMES, type AgentName } from "@/types/agents";

export type AgentOutputs = Partial<Record<AgentName, unknown>>;

export function mergeStateWithResult(
  state: GTMReportState,
  result: Partial<GTMReportState>
): GTMReportState {
  return { ...state, ...result };
}

export function extractAgentOutput(
  agent: AgentName,
  state: GTMReportState
): unknown {
  switch (agent) {
    case "input_processor":
      return {
        agent: AGENT_LABELS.input_processor,
        input: state.input,
        website_content: state.website_content ?? null,
      };
    case "gtm_strategist":
      return { agent: AGENT_LABELS.gtm_strategist, ...state.gtm_strategy };
    case "market_mapper":
      return { agent: AGENT_LABELS.market_mapper, ...state.market_map };
    case "signal_hunter":
      return { agent: AGENT_LABELS.signal_hunter, ...state.signals };
    case "join_research":
      return {
        agent: AGENT_LABELS.join_research,
        merged: {
          market_map: state.market_map ?? null,
          signals: state.signals ?? null,
        },
      };
    case "prospect_discovery":
      return { agent: AGENT_LABELS.prospect_discovery, ...state.prospects };
    case "decision_maker_finder":
      return { agent: AGENT_LABELS.decision_maker_finder, ...state.decision_makers };
    case "opportunity_scorer":
      return { agent: AGENT_LABELS.opportunity_scorer, ...state.opportunities };
    case "join_qualify":
      return {
        agent: AGENT_LABELS.join_qualify,
        merged: {
          decision_makers: state.decision_makers ?? null,
          opportunities: state.opportunities ?? null,
        },
      };
    case "outreach_planner":
      return { agent: AGENT_LABELS.outreach_planner, ...state.outreach };
    case "report_assembler":
      return { agent: AGENT_LABELS.report_assembler, ...state.report };
    default:
      return { agent: AGENT_LABELS[agent] };
  }
}

export function extractAllAgentOutputs(state: GTMReportState): AgentOutputs {
  return Object.fromEntries(
    AGENT_NAMES.map((agent) => [agent, extractAgentOutput(agent, state)])
  ) as AgentOutputs;
}

function countArray(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

export function summarizeAgentOutput(agent: AgentName, output: unknown): string {
  if (!output || typeof output !== "object") return "Completed";

  const data = output as Record<string, unknown>;

  switch (agent) {
    case "input_processor": {
      const url = (data.input as { url?: string })?.url;
      return url
        ? "Parsed input and crawled website content"
        : "Parsed company and product input";
    }
    case "gtm_strategist":
      return `Generated ${countArray(data.icps)} ICP(s), ${countArray(data.personas)} persona(s)`;
    case "market_mapper":
      return `Mapped ${countArray(data.primary_markets)} primary, ${countArray(data.secondary_markets)} secondary, ${countArray(data.adjacent_markets)} adjacent markets`;
    case "signal_hunter":
      return `Detected ${countArray(data.market_signals)} buying signal(s)`;
    case "join_research":
      return "Merged market map and buying signals";
    case "prospect_discovery":
      return `Discovered ${countArray(data.prospects)} qualified prospect(s)`;
    case "decision_maker_finder":
      return `Identified ${countArray(data.decision_makers)} decision maker(s)`;
    case "opportunity_scorer":
      return `Scored ${countArray(data.ranked_opportunities)} opportunit${countArray(data.ranked_opportunities) === 1 ? "y" : "ies"}`;
    case "join_qualify":
      return "Merged decision makers and opportunity scores";
    case "outreach_planner":
      return `Drafted ${countArray(data.outreach_strategies)} outreach strateg${countArray(data.outreach_strategies) === 1 ? "y" : "ies"}`;
    case "report_assembler":
      return "Assembled final GTM intelligence report";
    default:
      return "Completed";
  }
}
