import type { GTMReportState } from "@/lib/agents/state";
import { GTMReportSchema } from "@/types/gtm";
import { callLLM, parseJSONResponse, getLangSmithTraceUrl } from "@/lib/llm/openrouter";
import { REPORT_ASSEMBLER_SYSTEM } from "@/lib/agents/prompts";
import { buildFixtureReport } from "@/lib/fixtures/demo-slices";
import { isMockLLM } from "@/lib/agents/tools/mock";

export async function runReportAssembler(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  const baseReport = buildFixtureReport(state);

  if (isMockLLM()) {
    return {
      report: GTMReportSchema.parse(baseReport),
      langsmith_trace_url: getLangSmithTraceUrl(state.run_id),
    };
  }

  const userPrompt = JSON.stringify({
    icp_count: state.gtm_strategy?.icps.length,
    prospect_count: state.prospects?.prospects.length,
    top_opportunity: state.opportunities?.ranked_opportunities[0],
  });

  const raw = await callLLM(REPORT_ASSEMBLER_SYSTEM, userPrompt, { agent: "report_assembler" });
  const { summary } = parseJSONResponse<{ summary: string }>(raw);

  const report = GTMReportSchema.parse({
    ...baseReport,
    summary,
  });

  return {
    report,
    langsmith_trace_url: getLangSmithTraceUrl(state.run_id),
  };
}
