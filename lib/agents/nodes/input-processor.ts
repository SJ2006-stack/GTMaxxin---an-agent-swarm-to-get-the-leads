import type { GTMReportState } from "@/lib/agents/state";
import { GTMInputSchema } from "@/types/gtm";
import { crawlWebsiteSafe } from "@/lib/agents/tools/firecrawl";
import { FIXTURE_WEBSITE_CONTENT } from "@/lib/fixtures/demo-input";
import { isMockLLM } from "@/lib/agents/tools/mock";

export async function runInputProcessor(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  const input = GTMInputSchema.parse(state.input);

  if (isMockLLM()) {
    return {
      input,
      website_content: FIXTURE_WEBSITE_CONTENT,
    };
  }

  const website_content = input.url
    ? await crawlWebsiteSafe(input.url)
    : undefined;

  return { input, website_content };
}
