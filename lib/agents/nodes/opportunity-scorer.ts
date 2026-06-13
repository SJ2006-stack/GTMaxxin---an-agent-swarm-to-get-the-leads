import type { GTMReportState } from "@/lib/agents/state";
import { OpportunityScorerOutputSchema } from "@/types/gtm";
import { callLLM, parseJSONResponse } from "@/lib/llm/openrouter";
import { OPPORTUNITY_SCORER_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_OPPORTUNITIES } from "@/lib/fixtures/demo-slices";
import { isMockLLM } from "@/lib/agents/tools/mock";

export async function runOpportunityScorer(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (isMockLLM()) {
    return {
      opportunities: OpportunityScorerOutputSchema.parse(FIXTURE_OPPORTUNITIES),
    };
  }

  const userPrompt = JSON.stringify({
    prospects: state.prospects?.prospects,
    signals: state.signals,
    gtm_strategy: state.gtm_strategy,
  });

  const raw = await callLLM(OPPORTUNITY_SCORER_SYSTEM, userPrompt, { agent: "opportunity_scorer" });
  const parsed = OpportunityScorerOutputSchema.parse(parseJSONResponse(raw));
  return { opportunities: parsed };
}
