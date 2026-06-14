import type { GTMReportState } from "@/lib/agents/state";
import { MarketMapperOutputSchema } from "@/types/gtm";
import { MARKET_MAPPER_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_MARKET_MAP } from "@/lib/fixtures/demo-slices";
import { executeLLMNode } from "@/lib/agents/llm-node";

export async function runMarketMapper(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  return executeLLMNode({
    agent: "market_mapper",
    state,
    schema: MarketMapperOutputSchema,
    systemPrompt: MARKET_MAPPER_SYSTEM,
    buildPrompt: (s) => ({
      company: s.input.company,
      product: s.input.product,
      gtm_strategy: s.gtm_strategy,
      website_content: s.website_content?.slice(0, 3000),
    }),
    mapResult: (parsed) => ({ market_map: parsed }),
    fixture: FIXTURE_MARKET_MAP,
  });
}
