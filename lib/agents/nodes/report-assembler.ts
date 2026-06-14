import type { GTMReportState } from "@/lib/agents/state";
import { GTMReportSchema } from "@/types/gtm";
import { callLLM, getLangSmithTraceUrl } from "@/lib/llm/openrouter";
import { REPORT_ASSEMBLER_SYSTEM } from "@/lib/agents/prompts";
import { buildFixtureReport } from "@/lib/fixtures/demo-slices";
import { isMockLLM } from "@/lib/agents/tools/mock";
import {
  logAgent,
  parseJsonWithLog,
  parseSchemaWithLog,
} from "@/lib/agents/agent-logger";

export async function runReportAssembler(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  logAgent("report_assembler", "step", "Assembling final GTM report from agent outputs");
  const baseReport = buildFixtureReport(state);

  if (isMockLLM()) {
    logAgent("report_assembler", "info", "MOCK_LLM enabled — using assembled fixture report");
    const report = parseSchemaWithLog(
      "report_assembler",
      GTMReportSchema,
      baseReport,
      "Final report"
    );
    return {
      report,
      langsmith_trace_url: getLangSmithTraceUrl(state.run_id),
    };
  }

  logAgent("report_assembler", "step", "Generating executive summary via LLM");
  const userPrompt = JSON.stringify({
    icp_count: state.gtm_strategy?.icps.length,
    prospect_count: state.prospects?.prospects.length,
    top_opportunity: state.opportunities?.ranked_opportunities[0],
  });

  const raw = await callLLM(REPORT_ASSEMBLER_SYSTEM, userPrompt, {
    agent: "report_assembler",
  });
  const { summary } = parseJsonWithLog<{ summary: string }>("report_assembler", raw);

  if (!summary?.trim()) {
    logAgent("report_assembler", "warn", "LLM returned empty summary — using default text");
  }

  const report = parseSchemaWithLog("report_assembler", GTMReportSchema, {
    ...baseReport,
    summary: summary || baseReport.summary,
  }, "Final report");

  logAgent("report_assembler", "info", "Final report validated and ready");
  return {
    report,
    langsmith_trace_url: getLangSmithTraceUrl(state.run_id),
  };
}
