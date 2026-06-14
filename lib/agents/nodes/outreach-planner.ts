import type { GTMReportState } from "@/lib/agents/state";
import { OutreachPlannerOutputSchema } from "@/types/gtm";
import { OUTREACH_PLANNER_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_OUTREACH } from "@/lib/fixtures/demo-slices";
import { executeLLMNode } from "@/lib/agents/llm-node";
import { logAgent } from "@/lib/agents/agent-logger";

export async function runOutreachPlanner(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  const topProspects =
    state.opportunities?.ranked_opportunities
      .filter((o) => o.priority === "high")
      .slice(0, 2) ??
    state.prospects?.prospects.slice(0, 2) ??
    [];

  if (topProspects.length === 0) {
    logAgent(
      "outreach_planner",
      "warn",
      "No high-priority prospects found — outreach may be generic"
    );
  } else {
    logAgent(
      "outreach_planner",
      "info",
      `Planning outreach for ${topProspects.length} top prospect(s)`
    );
  }

  return executeLLMNode({
    agent: "outreach_planner",
    state,
    schema: OutreachPlannerOutputSchema,
    systemPrompt: OUTREACH_PLANNER_SYSTEM,
    buildPrompt: (s) => ({
      company: s.input.company,
      product: s.input.product,
      prospects: s.prospects?.prospects,
      opportunities: s.opportunities?.ranked_opportunities,
      top_prospects: topProspects,
      decision_makers: s.decision_makers?.decision_makers,
      gtm_strategy: s.gtm_strategy,
      market_map: s.market_map,
      signals: s.signals,
    }),
    mapResult: (parsed) => ({ outreach: parsed }),
    fixture: FIXTURE_OUTREACH,
  });
}
