import type { GTMReportState } from "@/lib/agents/state";
import { GTMStrategistOutputSchema } from "@/types/gtm";
import { callLLM, parseJSONResponse } from "@/lib/llm/openrouter";
import { GTM_STRATEGIST_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_GTM_STRATEGY } from "@/lib/fixtures/demo-slices";
import { isMockLLM } from "@/lib/agents/tools/mock";

export async function runGTMStrategist(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (isMockLLM()) {
    return { gtm_strategy: GTMStrategistOutputSchema.parse(FIXTURE_GTM_STRATEGY) };
  }

  const userPrompt = JSON.stringify({
    company: state.input.company,
    product: state.input.product,
    website_content: state.website_content?.slice(0, 3000),
  });

  const raw = await callLLM(GTM_STRATEGIST_SYSTEM, userPrompt, { agent: "gtm_strategist" });
  const parsed = GTMStrategistOutputSchema.parse(parseJSONResponse(raw));
  return { gtm_strategy: parsed };
}
