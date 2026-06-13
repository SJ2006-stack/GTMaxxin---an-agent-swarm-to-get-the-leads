import type { GTMReportState } from "@/lib/agents/state";
import { ProspectDiscoveryOutputSchema, MAX_PROSPECTS } from "@/types/gtm";
import { callLLM, parseJSONResponse } from "@/lib/llm/openrouter";
import { PROSPECT_DISCOVERY_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_PROSPECTS } from "@/lib/fixtures/demo-slices";
import { isMockLLM } from "@/lib/agents/tools/mock";
import { searchWeb } from "@/lib/agents/tools/tavily";

export async function runProspectDiscovery(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (isMockLLM()) {
    const prospects = ProspectDiscoveryOutputSchema.parse(FIXTURE_PROSPECTS);
    return {
      prospects: {
        prospects: prospects.prospects.slice(0, MAX_PROSPECTS),
      },
    };
  }

  const icps = state.gtm_strategy?.icps.map((i) => i.name).join(", ") ?? "";
  const searchResults = await searchWeb(
    `companies matching ICP: ${icps} ${state.input.product}`,
    MAX_PROSPECTS
  );

  const userPrompt = JSON.stringify({
    company: state.input.company,
    product: state.input.product,
    gtm_strategy: state.gtm_strategy,
    market_map: state.market_map,
    signals: state.signals,
    search_results: searchResults,
    max_prospects: MAX_PROSPECTS,
  });

  const raw = await callLLM(PROSPECT_DISCOVERY_SYSTEM, userPrompt, { agent: "prospect_discovery" });
  const parsed = ProspectDiscoveryOutputSchema.parse(parseJSONResponse(raw));
  return {
    prospects: {
      prospects: parsed.prospects.slice(0, MAX_PROSPECTS),
    },
  };
}
