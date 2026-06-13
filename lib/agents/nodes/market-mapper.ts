import type { GTMReportState } from "@/lib/agents/state";
import { MarketMapperOutputSchema } from "@/types/gtm";
import { callLLM, parseJSONResponse } from "@/lib/llm/openrouter";
import { MARKET_MAPPER_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_MARKET_MAP } from "@/lib/fixtures/demo-slices";
import { isMockLLM } from "@/lib/agents/tools/mock";

export async function runMarketMapper(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (isMockLLM()) {
    return { market_map: MarketMapperOutputSchema.parse(FIXTURE_MARKET_MAP) };
  }

  const userPrompt = JSON.stringify({
    company: state.input.company,
    product: state.input.product,
    gtm_strategy: state.gtm_strategy,
    website_content: state.website_content?.slice(0, 3000),
  });

  const raw = await callLLM(MARKET_MAPPER_SYSTEM, userPrompt, { agent: "market_mapper" });
  const parsed = MarketMapperOutputSchema.parse(parseJSONResponse(raw));
  return { market_map: parsed };
}
