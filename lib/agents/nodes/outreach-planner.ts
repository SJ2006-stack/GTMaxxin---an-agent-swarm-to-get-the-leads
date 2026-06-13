import type { GTMReportState } from "@/lib/agents/state";
import { OutreachPlannerOutputSchema } from "@/types/gtm";
import { callLLM, parseJSONResponse } from "@/lib/llm/openrouter";
import { OUTREACH_PLANNER_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_OUTREACH } from "@/lib/fixtures/demo-slices";
import { isMockLLM } from "@/lib/agents/tools/mock";

export async function runOutreachPlanner(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (isMockLLM()) {
    return { outreach: OutreachPlannerOutputSchema.parse(FIXTURE_OUTREACH) };
  }

  const topProspects =
    state.opportunities?.ranked_opportunities
      .filter((o) => o.priority === "high")
      .slice(0, 2) ??
    state.prospects?.prospects.slice(0, 2) ??
    [];

  const userPrompt = JSON.stringify({
    company: state.input.company,
    product: state.input.product,
    prospects: state.prospects?.prospects,
    opportunities: state.opportunities?.ranked_opportunities,
    top_prospects: topProspects,
    decision_makers: state.decision_makers?.decision_makers,
    gtm_strategy: state.gtm_strategy,
    market_map: state.market_map,
    signals: state.signals,
  });

  const raw = await callLLM(OUTREACH_PLANNER_SYSTEM, userPrompt, { agent: "outreach_planner" });
  const parsed = OutreachPlannerOutputSchema.parse(parseJSONResponse(raw));
  return { outreach: parsed };
}
