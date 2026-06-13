import { zipSync, strToU8 } from "fflate";
import type { GTMReportState } from "@/lib/agents/state";
import { AGENT_LABELS, type AgentName } from "@/types/agents";

function addJson(
  files: Record<string, Uint8Array>,
  path: string,
  data: unknown
): void {
  files[path] = strToU8(JSON.stringify(data, null, 2));
}

/** Build folder.zip with one subfolder per agent containing its output JSON */
export function buildAgentOutputZip(state: GTMReportState): Uint8Array {
  const files: Record<string, Uint8Array> = {};
  const root = "folder";

  addJson(files, `${root}/input_processor/output.json`, {
    agent: AGENT_LABELS.input_processor,
    input: state.input,
    website_content: state.website_content ?? null,
  });

  addJson(files, `${root}/gtm_strategist/output.json`, {
    agent: AGENT_LABELS.gtm_strategist,
    ...state.gtm_strategy,
  });

  addJson(files, `${root}/market_mapper/output.json`, {
    agent: AGENT_LABELS.market_mapper,
    ...state.market_map,
  });

  addJson(files, `${root}/signal_hunter/output.json`, {
    agent: AGENT_LABELS.signal_hunter,
    ...state.signals,
  });

  addJson(files, `${root}/join_research/output.json`, {
    agent: AGENT_LABELS.join_research,
    merged: {
      market_map: state.market_map ?? null,
      signals: state.signals ?? null,
    },
  });

  addJson(files, `${root}/prospect_discovery/output.json`, {
    agent: AGENT_LABELS.prospect_discovery,
    ...state.prospects,
  });

  addJson(files, `${root}/decision_maker_finder/output.json`, {
    agent: AGENT_LABELS.decision_maker_finder,
    ...state.decision_makers,
  });

  addJson(files, `${root}/opportunity_scorer/output.json`, {
    agent: AGENT_LABELS.opportunity_scorer,
    ...state.opportunities,
  });

  addJson(files, `${root}/join_qualify/output.json`, {
    agent: AGENT_LABELS.join_qualify,
    merged: {
      decision_makers: state.decision_makers ?? null,
      opportunities: state.opportunities ?? null,
    },
  });

  addJson(files, `${root}/outreach_planner/output.json`, {
    agent: AGENT_LABELS.outreach_planner,
    ...state.outreach,
  });

  addJson(files, `${root}/report_assembler/gtm-report.json`, {
    agent: AGENT_LABELS.report_assembler,
    ...state.report,
  });

  addJson(files, `${root}/manifest.json`, {
    run_id: state.run_id,
    generated_at: state.report?.generated_at ?? null,
    agent_statuses: state.agent_statuses,
    errors: state.errors,
    agents: Object.fromEntries(
      (Object.keys(AGENT_LABELS) as AgentName[]).map((name) => [name, AGENT_LABELS[name]])
    ),
  });

  return zipSync(files);
}
