import type { GTMReportState } from "@/lib/agents/state";
import { GTMInputSchema } from "@/types/gtm";
import { crawlWebsiteSafe } from "@/lib/agents/tools/firecrawl";
import { FIXTURE_WEBSITE_CONTENT } from "@/lib/fixtures/demo-input";
import { isMockLLM } from "@/lib/agents/tools/mock";
import { logAgent, parseSchemaWithLog } from "@/lib/agents/agent-logger";

export async function runInputProcessor(
  state: GTMReportState
): Promise<Partial<GTMReportState>> {
  logAgent("input_processor", "step", "Validating GTM input schema");
  const input = parseSchemaWithLog(
    "input_processor",
    GTMInputSchema,
    state.input,
    "GTM input"
  );
  logAgent(
    "input_processor",
    "info",
    "Input accepted",
    `company="${input.company.slice(0, 80)}" product="${input.product.slice(0, 80)}"`
  );

  if (isMockLLM()) {
    logAgent("input_processor", "info", "MOCK_LLM enabled — using fixture website content");
    return { input, website_content: FIXTURE_WEBSITE_CONTENT };
  }

  if (!input.url) {
    logAgent(
      "input_processor",
      "warn",
      "No website URL provided — skipping Firecrawl crawl"
    );
    return { input, website_content: undefined };
  }

  logAgent("input_processor", "step", `Crawling website via Firecrawl: ${input.url}`);
  const website_content = await crawlWebsiteSafe(input.url);
  if (!website_content) {
    logAgent(
      "input_processor",
      "warn",
      "Firecrawl returned no content — continuing without website context"
    );
  } else {
    logAgent(
      "input_processor",
      "info",
      `Website content captured (${website_content.length} chars)`
    );
  }

  return { input, website_content };
}
