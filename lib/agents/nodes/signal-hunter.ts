import type { GTMReportState } from "@/lib/agents/state";
import { SignalHunterOutputSchema, MAX_SIGNALS } from "@/types/gtm";
import { SIGNAL_HUNTER_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_SIGNALS } from "@/lib/fixtures/demo-slices";
import { executeLLMNode } from "@/lib/agents/llm-node";
import { searchWeb } from "@/lib/agents/tools/tavily";
import { isMockLLM } from "@/lib/agents/tools/mock";
import { logAgent, parseSchemaWithLog } from "@/lib/agents/agent-logger";

export async function runSignalHunter(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (isMockLLM()) {
    logAgent("signal_hunter", "info", "MOCK_LLM enabled — using fixture signals");
    const signals = parseSchemaWithLog(
      "signal_hunter",
      SignalHunterOutputSchema,
      FIXTURE_SIGNALS,
      "Fixture signals"
    );
    return {
      signals: {
        ...signals,
        market_signals: signals.market_signals.slice(0, MAX_SIGNALS),
      },
    };
  }

  const query = `${state.input.company} ${state.input.product} buying signals funding hiring`;
  logAgent("signal_hunter", "step", `Searching web via Tavily: "${query}"`);
  const searchResults = await searchWeb(query, MAX_SIGNALS, "signal_hunter");

  return executeLLMNode({
    agent: "signal_hunter",
    state,
    schema: SignalHunterOutputSchema,
    systemPrompt: SIGNAL_HUNTER_SYSTEM,
    buildPrompt: (s) => ({
      company: s.input.company,
      product: s.input.product,
      gtm_strategy: s.gtm_strategy,
      search_results: searchResults,
      max_signals: MAX_SIGNALS,
    }),
    mapResult: (parsed) => ({
      signals: {
        ...parsed,
        market_signals: parsed.market_signals.slice(0, MAX_SIGNALS),
      },
    }),
    fixture: FIXTURE_SIGNALS,
  });
}
