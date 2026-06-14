import type { GTMReportState } from "@/lib/agents/state";
import { GTMStrategistOutputSchema } from "@/types/gtm";
import { GTM_STRATEGIST_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_GTM_STRATEGY } from "@/lib/fixtures/demo-slices";
import { executeLLMNode } from "@/lib/agents/llm-node";

export async function runGTMStrategist(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  const gtm_strategy = await executeLLMNode({
    agent: "gtm_strategist",
    state,
    schema: GTMStrategistOutputSchema,
    systemPrompt: GTM_STRATEGIST_SYSTEM,
    buildPrompt: (s) => ({
      company: s.input.company,
      product: s.input.product,
      website_content: s.website_content?.slice(0, 3000),
    }),
    mapResult: (parsed) => ({ gtm_strategy: parsed }),
    fixture: FIXTURE_GTM_STRATEGY,
  });
  return gtm_strategy;
}
