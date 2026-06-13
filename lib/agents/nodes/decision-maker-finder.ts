import type { GTMReportState } from "@/lib/agents/state";
import { DecisionMakerOutputSchema } from "@/types/gtm";
import { callLLM, parseJSONResponse } from "@/lib/llm/openrouter";
import { DECISION_MAKER_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_DECISION_MAKERS } from "@/lib/fixtures/demo-slices";
import { isMockLLM } from "@/lib/agents/tools/mock";

export async function runDecisionMakerFinder(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (isMockLLM()) {
    return {
      decision_makers: DecisionMakerOutputSchema.parse(FIXTURE_DECISION_MAKERS),
    };
  }

  const userPrompt = JSON.stringify({
    prospects: state.prospects?.prospects,
    icps: state.gtm_strategy?.icps,
    personas: state.gtm_strategy?.personas,
    gtm_strategy: state.gtm_strategy,
  });

  const raw = await callLLM(DECISION_MAKER_SYSTEM, userPrompt, { agent: "decision_maker_finder" });
  const parsed = DecisionMakerOutputSchema.parse(parseJSONResponse(raw));
  return { decision_makers: parsed };
}
