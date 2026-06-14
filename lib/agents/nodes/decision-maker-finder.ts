import type { GTMReportState } from "@/lib/agents/state";
import { DecisionMakerOutputSchema } from "@/types/gtm";
import { DECISION_MAKER_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_DECISION_MAKERS } from "@/lib/fixtures/demo-slices";
import { executeLLMNode } from "@/lib/agents/llm-node";
import { logAgent } from "@/lib/agents/agent-logger";

export async function runDecisionMakerFinder(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (!state.prospects?.prospects.length) {
    logAgent(
      "decision_maker_finder",
      "warn",
      "No prospects in state — decision maker mapping may be empty"
    );
  }

  const result = await executeLLMNode({
    agent: "decision_maker_finder",
    state,
    schema: DecisionMakerOutputSchema,
    systemPrompt: DECISION_MAKER_SYSTEM,
    buildPrompt: (s) => ({
      prospects: s.prospects?.prospects,
      icps: s.gtm_strategy?.icps,
      personas: s.gtm_strategy?.personas,
      gtm_strategy: s.gtm_strategy,
    }),
    mapResult: (parsed) => ({ decision_makers: parsed }),
    fixture: FIXTURE_DECISION_MAKERS,
  });
  return result;
}
