import type { AgentName } from "@/types/agents";
import { AGENT_LABELS } from "@/types/agents";
import type { GTMReportState } from "@/swarm/state";
import { createInitialState } from "@/swarm/state";
import { createAgentStatusEvent } from "@/swarm/events";
import {
  extractAgentOutput,
  summarizeAgentOutput,
} from "@/server/export/agent-outputs";
import {
  bindAgentLogger,
  clearAgentLogger,
  logAgent,
} from "@/swarm/shared/agent-logger";
import type { SwarmEmitter } from "@/swarm/orchestrator";
import {
  buildDemoReport,
  type DemoCompany,
} from "@/fixtures/demo-companies";

/**
 * Deterministic, LLM-free replay of a pre-baked demo company through every
 * agent node. It emits the exact same status/log event shape the real graph
 * produces, so the swarm visualizer still animates ΓÇö but it finishes in a few
 * seconds and never depends on a (slow, gibberish-prone) free model.
 *
 * Phases mirror the real graph topology, including the two parallel branches.
 */
const PHASES: AgentName[][] = [
  ["input_processor"],
  ["gtm_strategist"],
  ["market_mapper", "signal_hunter"],
  ["join_research"],
  ["prospect_discovery"],
  ["decision_maker_finder", "opportunity_scorer"],
  ["join_qualify"],
  ["outreach_planner"],
  ["report_assembler"],
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Applies one agent's pre-baked slice to the working state + emits flavor logs. */
function applyAgentSlice(
  agent: AgentName,
  state: GTMReportState,
  c: DemoCompany
): void {
  switch (agent) {
    case "input_processor":
      state.website_content = c.website_content;
      logAgent(
        "input_processor",
        "info",
        `Website content captured (${c.website_content.length} chars)`
      );
      break;
    case "gtm_strategist":
      state.gtm_strategy = c.gtm_strategy;
      break;
    case "market_mapper":
      state.market_map = c.market_map;
      break;
    case "signal_hunter":
      logAgent(
        "signal_hunter",
        "step",
        `Searching web via Tavily: "${c.signal_evidence.query}"`
      );
      logAgent(
        "signal_hunter",
        "info",
        `Tavily returned ${c.signal_evidence.results.length} result(s)`
      );
      state.signals = c.signals;
      state.research_evidence = {
        ...state.research_evidence,
        signal_hunter: c.signal_evidence,
      };
      break;
    case "join_research":
      break;
    case "prospect_discovery":
      logAgent(
        "prospect_discovery",
        "step",
        `Searching web via Tavily: "${c.prospect_evidence.query}"`
      );
      logAgent(
        "prospect_discovery",
        "info",
        `Tavily returned ${c.prospect_evidence.results.length} result(s)`
      );
      state.prospects = c.prospects;
      state.research_evidence = {
        ...state.research_evidence,
        prospect_discovery: c.prospect_evidence,
      };
      break;
    case "decision_maker_finder":
      state.decision_makers = c.decision_makers;
      break;
    case "opportunity_scorer":
      state.opportunities = c.opportunities;
      break;
    case "join_qualify":
      break;
    case "outreach_planner":
      state.outreach = c.outreach;
      break;
    case "report_assembler":
      state.report = buildDemoReport(c);
      break;
  }
  state.agent_statuses[agent] = "done";
}

export async function runDemoReplay(
  runId: string,
  company: DemoCompany,
  emit?: SwarmEmitter,
  options?: { stepMs?: number }
): Promise<GTMReportState> {
  const stepMs = options?.stepMs ?? 380;
  const state = createInitialState(runId, company.input);

  bindAgentLogger(runId, (log) => emit?.({ type: "log", data: log }));

  try {
    logAgent(
      "input_processor",
      "info",
      `Loaded pre-baked demo dataset for ${company.label}`
    );

    for (const group of PHASES) {
      for (const agent of group) {
        logAgent(agent, "step", `Starting ${AGENT_LABELS[agent]}`);
        emit?.({
          type: "status",
          data: createAgentStatusEvent(runId, agent, "running"),
        });
      }

      await delay(stepMs);

      for (const agent of group) {
        applyAgentSlice(agent, state, company);
        const output = extractAgentOutput(agent, state);
        const summary = summarizeAgentOutput(agent, output);
        logAgent(agent, "info", summary);
        emit?.({
          type: "status",
          data: {
            ...createAgentStatusEvent(runId, agent, "done"),
            output,
            summary,
          },
        });
      }
    }

    return state;
  } finally {
    clearAgentLogger();
  }
}
