import type { GTMReportState } from "@/lib/agents/state";
import { SignalHunterOutputSchema, MAX_SIGNALS } from "@/types/gtm";
import { callLLM, parseJSONResponse } from "@/lib/llm/openrouter";
import { SIGNAL_HUNTER_SYSTEM } from "@/lib/agents/prompts";
import { FIXTURE_SIGNALS } from "@/lib/fixtures/demo-slices";
import { isMockLLM } from "@/lib/agents/tools/mock";
import { searchWeb } from "@/lib/agents/tools/tavily";

export async function runSignalHunter(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  if (isMockLLM()) {
    const signals = SignalHunterOutputSchema.parse(FIXTURE_SIGNALS);
    return {
      signals: {
        ...signals,
        market_signals: signals.market_signals.slice(0, MAX_SIGNALS),
      },
    };
  }

  const searchResults = await searchWeb(
    `${state.input.company} ${state.input.product} buying signals funding hiring`,
    MAX_SIGNALS
  );

  const userPrompt = JSON.stringify({
    company: state.input.company,
    product: state.input.product,
    gtm_strategy: state.gtm_strategy,
    search_results: searchResults,
    max_signals: MAX_SIGNALS,
  });

  const raw = await callLLM(SIGNAL_HUNTER_SYSTEM, userPrompt, { agent: "signal_hunter" });
  const parsed = SignalHunterOutputSchema.parse(parseJSONResponse(raw));
  return {
    signals: {
      ...parsed,
      market_signals: parsed.market_signals.slice(0, MAX_SIGNALS),
    },
  };
}
