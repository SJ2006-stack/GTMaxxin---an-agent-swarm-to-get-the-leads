#!/usr/bin/env tsx
/**
 * Isolated node test: npx tsx scripts/test-node.ts --agent gtm_strategist
 */
import { createInitialState } from "../lib/agents/state";
import { FIXTURE_INPUT } from "../lib/fixtures/demo-input";
import type { AgentName } from "../types/agents";
import { runInputProcessor } from "../lib/agents/nodes/input-processor";
import { runGTMStrategist } from "../lib/agents/nodes/gtm-strategist";
import { runMarketMapper } from "../lib/agents/nodes/market-mapper";
import { runSignalHunter } from "../lib/agents/nodes/signal-hunter";
import { runProspectDiscovery } from "../lib/agents/nodes/prospect-discovery";
import { runDecisionMakerFinder } from "../lib/agents/nodes/decision-maker-finder";
import { runOpportunityScorer } from "../lib/agents/nodes/opportunity-scorer";
import { runOutreachPlanner } from "../lib/agents/nodes/outreach-planner";
import { runReportAssembler } from "../lib/agents/nodes/report-assembler";
import {
  FIXTURE_GTM_STRATEGY,
  FIXTURE_MARKET_MAP,
  FIXTURE_SIGNALS,
  FIXTURE_PROSPECTS,
  FIXTURE_DECISION_MAKERS,
  FIXTURE_OPPORTUNITIES,
  FIXTURE_OUTREACH,
} from "../lib/fixtures/demo-slices";

const NODE_RUNNERS: Partial<
  Record<AgentName, (state: ReturnType<typeof createInitialState>) => Promise<unknown>>
> = {
  input_processor: runInputProcessor,
  gtm_strategist: runGTMStrategist,
  market_mapper: runMarketMapper,
  signal_hunter: runSignalHunter,
  prospect_discovery: runProspectDiscovery,
  decision_maker_finder: runDecisionMakerFinder,
  opportunity_scorer: runOpportunityScorer,
  outreach_planner: runOutreachPlanner,
  report_assembler: runReportAssembler,
};

function buildStateForAgent(agent: AgentName) {
  const state = createInitialState(`test-${agent}`, FIXTURE_INPUT);
  state.gtm_strategy = FIXTURE_GTM_STRATEGY;
  state.market_map = FIXTURE_MARKET_MAP;
  state.signals = FIXTURE_SIGNALS;
  state.prospects = FIXTURE_PROSPECTS;
  state.decision_makers = FIXTURE_DECISION_MAKERS;
  state.opportunities = FIXTURE_OPPORTUNITIES;
  state.outreach = FIXTURE_OUTREACH;
  return state;
}

async function main() {
  process.env.MOCK_LLM = "true";
  const agentArg = process.argv.find((a) => a.startsWith("--agent="))?.split("=")[1]
    ?? process.argv[process.argv.indexOf("--agent") + 1];

  if (!agentArg || !(agentArg in NODE_RUNNERS)) {
    console.error("Usage: test-node.ts --agent <agent_name>");
    console.error("Available:", Object.keys(NODE_RUNNERS).join(", "));
    process.exit(1);
  }

  const agent = agentArg as AgentName;
  const runner = NODE_RUNNERS[agent]!;
  const state = buildStateForAgent(agent);

  console.log(`Testing node: ${agent}`);
  const result = await runner(state);
  console.log(JSON.stringify(result, null, 2));
  console.log(`✅ ${agent} passed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
