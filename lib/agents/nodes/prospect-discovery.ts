import type { GTMReportState } from "@/lib/agents/state";
import { ProspectDiscoveryOutputSchema, MAX_PROSPECTS } from "@/types/gtm";
import { PROSPECT_DISCOVERY_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_PROSPECTS } from "@/lib/fixtures/demo-slices";
import { executeLLMNode } from "@/lib/agents/llm-node";
import { searchWeb } from "@/lib/agents/tools/tavily";
import { isMockLLM } from "@/lib/agents/tools/mock";
import { logAgent, parseSchemaWithLog } from "@/lib/agents/agent-logger";

export async function runProspectDiscovery(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (isMockLLM()) {
    logAgent("prospect_discovery", "info", "MOCK_LLM enabled — using fixture prospects");
    const prospects = parseSchemaWithLog(
      "prospect_discovery",
      ProspectDiscoveryOutputSchema,
      FIXTURE_PROSPECTS,
      "Fixture prospects"
    );
    return {
      prospects: { prospects: prospects.prospects.slice(0, MAX_PROSPECTS) },
    };
  }

  const icps = state.gtm_strategy?.icps.map((i) => i.name).join(", ") ?? "";
  if (!icps) {
    logAgent(
      "prospect_discovery",
      "warn",
      "No ICPs in state — prospect search may return poor results"
    );
  }

  const query = `companies matching ICP: ${icps} ${state.input.product}`;
  logAgent("prospect_discovery", "step", `Searching prospects via Tavily: "${query}"`);
  const searchResults = await searchWeb(query, MAX_PROSPECTS, "prospect_discovery");

  return executeLLMNode({
    agent: "prospect_discovery",
    state,
    schema: ProspectDiscoveryOutputSchema,
    systemPrompt: PROSPECT_DISCOVERY_SYSTEM,
    buildPrompt: (s) => ({
      company: s.input.company,
      product: s.input.product,
      gtm_strategy: s.gtm_strategy,
      market_map: s.market_map,
      signals: s.signals,
      search_results: searchResults,
      max_prospects: MAX_PROSPECTS,
    }),
    mapResult: (parsed) => ({
      prospects: { prospects: parsed.prospects.slice(0, MAX_PROSPECTS) },
    }),
    fixture: FIXTURE_PROSPECTS,
  });
}
