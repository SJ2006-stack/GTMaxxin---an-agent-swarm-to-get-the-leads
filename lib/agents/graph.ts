import { Annotation, StateGraph, START, END, Send } from "@langchain/langgraph";
import type { GTMReportState } from "@/lib/agents/state";
import type { AgentStatusEvent } from "@/lib/agents/events";
import { createInitialState } from "@/lib/agents/state";
import type { GTMInput } from "@/types/gtm";
import { wrapNode, runJoinResearch, runJoinQualify } from "@/lib/agents/orchestrator";
import { runInputProcessor } from "@/lib/agents/nodes/input-processor";
import { runGTMStrategist } from "@/lib/agents/nodes/gtm-strategist";
import { runMarketMapper } from "@/lib/agents/nodes/market-mapper";
import { runSignalHunter } from "@/lib/agents/nodes/signal-hunter";
import { runProspectDiscovery } from "@/lib/agents/nodes/prospect-discovery";
import { runDecisionMakerFinder } from "@/lib/agents/nodes/decision-maker-finder";
import { runOpportunityScorer } from "@/lib/agents/nodes/opportunity-scorer";
import { runOutreachPlanner } from "@/lib/agents/nodes/outreach-planner";
import { runReportAssembler } from "@/lib/agents/nodes/report-assembler";
import type { AgentStatuses } from "@/types/agents";
import { createInitialAgentStatuses } from "@/types/agents";

const GTMStateAnnotation = Annotation.Root({
  run_id: Annotation<string>(),
  input: Annotation<GTMReportState["input"]>(),
  website_content: Annotation<string | undefined>({
    reducer: (_l, r) => r ?? _l,
    default: () => undefined,
  }),
  gtm_strategy: Annotation<GTMReportState["gtm_strategy"]>({
    reducer: (_l, r) => r ?? _l,
    default: () => undefined,
  }),
  market_map: Annotation<GTMReportState["market_map"]>({
    reducer: (_l, r) => r ?? _l,
    default: () => undefined,
  }),
  signals: Annotation<GTMReportState["signals"]>({
    reducer: (_l, r) => r ?? _l,
    default: () => undefined,
  }),
  prospects: Annotation<GTMReportState["prospects"]>({
    reducer: (_l, r) => r ?? _l,
    default: () => undefined,
  }),
  decision_makers: Annotation<GTMReportState["decision_makers"]>({
    reducer: (_l, r) => r ?? _l,
    default: () => undefined,
  }),
  opportunities: Annotation<GTMReportState["opportunities"]>({
    reducer: (_l, r) => r ?? _l,
    default: () => undefined,
  }),
  outreach: Annotation<GTMReportState["outreach"]>({
    reducer: (_l, r) => r ?? _l,
    default: () => undefined,
  }),
  report: Annotation<GTMReportState["report"]>({
    reducer: (_l, r) => r ?? _l,
    default: () => undefined,
  }),
  agent_statuses: Annotation<AgentStatuses>({
    reducer: (left, right) => ({ ...left, ...right }),
    default: createInitialAgentStatuses,
  }),
  errors: Annotation<GTMReportState["errors"]>({
    reducer: (left, right) => ({ ...left, ...right }),
    default: () => ({}),
  }),
  langsmith_trace_url: Annotation<string | undefined>({
    reducer: (_l, r) => r ?? _l,
    default: () => undefined,
  }),
});

type GraphState = typeof GTMStateAnnotation.State;

function toGraphState(state: GTMReportState): GraphState {
  return state as GraphState;
}

function fromGraphState(state: GraphState): GTMReportState {
  return state as GTMReportState;
}

/** Partial status update — safe for parallel branch merges */
function doneStatus(agent: keyof AgentStatuses): Partial<AgentStatuses> {
  return { [agent]: "done" };
}

export function createSwarmGraph(emit?: (event: AgentStatusEvent) => void) {
  const graph = new StateGraph(GTMStateAnnotation)
    .addNode("input_processor", async (state: GraphState) => {
      const s = fromGraphState(state);
      const result = await wrapNode("input_processor", s, runInputProcessor, emit);
      return { ...result, agent_statuses: doneStatus("input_processor") };
    })
    .addNode("gtm_strategist", async (state: GraphState) => {
      const s = fromGraphState(state);
      const result = await wrapNode("gtm_strategist", s, runGTMStrategist, emit);
      return { ...result, agent_statuses: doneStatus("gtm_strategist") };
    })
    .addNode("market_mapper", async (state: GraphState) => {
      const s = fromGraphState(state);
      const result = await wrapNode("market_mapper", s, runMarketMapper, emit);
      return { ...result, agent_statuses: doneStatus("market_mapper") };
    })
    .addNode("signal_hunter", async (state: GraphState) => {
      const s = fromGraphState(state);
      const result = await wrapNode("signal_hunter", s, runSignalHunter, emit);
      return { ...result, agent_statuses: doneStatus("signal_hunter") };
    })
    .addNode("join_research", async (state: GraphState) => {
      const s = fromGraphState(state);
      const result = await wrapNode("join_research", s, runJoinResearch, emit);
      return { ...result, agent_statuses: doneStatus("join_research") };
    })
    .addNode("prospect_discovery", async (state: GraphState) => {
      const s = fromGraphState(state);
      const result = await wrapNode("prospect_discovery", s, runProspectDiscovery, emit);
      return { ...result, agent_statuses: doneStatus("prospect_discovery") };
    })
    .addNode("decision_maker_finder", async (state: GraphState) => {
      const s = fromGraphState(state);
      const result = await wrapNode(
        "decision_maker_finder",
        s,
        runDecisionMakerFinder,
        emit
      );
      return { ...result, agent_statuses: doneStatus("decision_maker_finder") };
    })
    .addNode("opportunity_scorer", async (state: GraphState) => {
      const s = fromGraphState(state);
      const result = await wrapNode("opportunity_scorer", s, runOpportunityScorer, emit);
      return { ...result, agent_statuses: doneStatus("opportunity_scorer") };
    })
    .addNode("join_qualify", async (state: GraphState) => {
      const s = fromGraphState(state);
      const result = await wrapNode("join_qualify", s, runJoinQualify, emit);
      return { ...result, agent_statuses: doneStatus("join_qualify") };
    })
    .addNode("outreach_planner", async (state: GraphState) => {
      const s = fromGraphState(state);
      const result = await wrapNode("outreach_planner", s, runOutreachPlanner, emit);
      return { ...result, agent_statuses: doneStatus("outreach_planner") };
    })
    .addNode("report_assembler", async (state: GraphState) => {
      const s = fromGraphState(state);
      const result = await wrapNode("report_assembler", s, runReportAssembler, emit);
      return { ...result, agent_statuses: doneStatus("report_assembler") };
    })
    .addEdge(START, "input_processor")
    .addEdge("input_processor", "gtm_strategist")
    .addConditionalEdges("gtm_strategist", (state: GraphState) => [
      new Send("market_mapper", state),
      new Send("signal_hunter", state),
    ])
    .addEdge("market_mapper", "join_research")
    .addEdge("signal_hunter", "join_research")
    .addEdge("join_research", "prospect_discovery")
    .addConditionalEdges("prospect_discovery", (state: GraphState) => [
      new Send("decision_maker_finder", state),
      new Send("opportunity_scorer", state),
    ])
    .addEdge("decision_maker_finder", "join_qualify")
    .addEdge("opportunity_scorer", "join_qualify")
    .addEdge("join_qualify", "outreach_planner")
    .addEdge("outreach_planner", "report_assembler")
    .addEdge("report_assembler", END);

  return graph.compile();
}

export async function runSwarmGraph(
  runId: string,
  input: GTMInput,
  emit?: (event: AgentStatusEvent) => void
): Promise<GTMReportState> {
  const graph = createSwarmGraph(emit);
  const initial = toGraphState(createInitialState(runId, input));
  const final = await graph.invoke(initial);
  return fromGraphState(final);
}

/** LangGraph Studio entrypoint */
export const graph = createSwarmGraph();
