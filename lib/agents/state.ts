import { z } from "zod";
import type { AgentName, AgentStatuses } from "@/types/agents";
import { createInitialAgentStatuses } from "@/types/agents";
import {
  DecisionMakerOutputSchema,
  GTMInputSchema,
  GTMStrategistOutputSchema,
  MarketMapperOutputSchema,
  OpportunityScorerOutputSchema,
  OutreachPlannerOutputSchema,
  ProspectDiscoveryOutputSchema,
  SignalHunterOutputSchema,
  GTMReportSchema,
  type GTMInput,
  type GTMReport,
} from "@/types/gtm";
import { FIXTURE_INPUT } from "@/lib/fixtures/demo-input";

export { FIXTURE_INPUT };

export type GTMReportState = {
  run_id: string;
  input: GTMInput;
  website_content?: string;
  gtm_strategy?: z.infer<typeof GTMStrategistOutputSchema>;
  market_map?: z.infer<typeof MarketMapperOutputSchema>;
  signals?: z.infer<typeof SignalHunterOutputSchema>;
  prospects?: z.infer<typeof ProspectDiscoveryOutputSchema>;
  decision_makers?: z.infer<typeof DecisionMakerOutputSchema>;
  opportunities?: z.infer<typeof OpportunityScorerOutputSchema>;
  outreach?: z.infer<typeof OutreachPlannerOutputSchema>;
  report?: GTMReport;
  agent_statuses: AgentStatuses;
  errors: Partial<Record<AgentName, string>>;
  langsmith_trace_url?: string;
};

export function createInitialState(
  runId: string,
  input: GTMInput = FIXTURE_INPUT
): GTMReportState {
  const parsed = GTMInputSchema.parse(input);
  return {
    run_id: runId,
    input: parsed,
    agent_statuses: createInitialAgentStatuses(),
    errors: {},
  };
}

export {
  GTMInputSchema,
  GTMStrategistOutputSchema,
  MarketMapperOutputSchema,
  SignalHunterOutputSchema,
  ProspectDiscoveryOutputSchema,
  DecisionMakerOutputSchema,
  OpportunityScorerOutputSchema,
  OutreachPlannerOutputSchema,
  GTMReportSchema,
};

export type {
  GTMInput,
  GTMReport,
};
