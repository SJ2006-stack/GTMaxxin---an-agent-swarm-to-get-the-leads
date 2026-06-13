export const AGENT_NAMES = [
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
] as const;

export type AgentName = (typeof AGENT_NAMES)[number];

export const AGENT_PHASES: Record<AgentName, 0 | 1 | 2 | 3 | 4 | 5> = {
  input_processor: 0,
  gtm_strategist: 1,
  market_mapper: 2,
  signal_hunter: 2,
  join_research: 2,
  prospect_discovery: 3,
  decision_maker_finder: 4,
  opportunity_scorer: 4,
  join_qualify: 4,
  outreach_planner: 5,
  report_assembler: 5,
};

export const AGENT_LABELS: Record<AgentName, string> = {
  input_processor: "Input Processor",
  gtm_strategist: "GTM Strategist",
  market_mapper: "Market Mapper",
  signal_hunter: "Signal Hunter",
  join_research: "Research Join",
  prospect_discovery: "Prospect Discovery",
  decision_maker_finder: "Decision Maker Finder",
  opportunity_scorer: "Opportunity Scorer",
  join_qualify: "Qualify Join",
  outreach_planner: "Outreach Planner",
  report_assembler: "Report Assembler",
};

export type AgentStatus = "pending" | "running" | "done" | "error";

export type AgentStatuses = Record<AgentName, AgentStatus>;

export function createInitialAgentStatuses(): AgentStatuses {
  return Object.fromEntries(
    AGENT_NAMES.map((name) => [name, "pending" as AgentStatus])
  ) as AgentStatuses;
}
