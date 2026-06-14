import { isMockTools, MOCK_CRAWL_RESULT } from "./mock";
import { logAgent } from "@/lib/agents/agent-logger";

export async function crawlWebsite(url: string): Promise<string> {
  if (isMockTools() || !process.env["FIRECRAWL_API_KEY"]) {
    logAgent(
      "input_processor",
      "info",
      "Using mock Firecrawl content (MOCK_TOOLS or missing FIRECRAWL_API_KEY)"
    );
    return MOCK_CRAWL_RESULT.markdown;
  }

  logAgent("input_processor", "step", `Firecrawl scrape: ${url}`);
  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env["FIRECRAWL_API_KEY"]}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, formats: ["markdown"] }),
  });

  if (!response.ok) {
    const detail = `${response.status} ${response.statusText}`;
    logAgent("input_processor", "error", "Firecrawl API request failed", detail);
    throw new Error(`Firecrawl error: ${response.statusText}`);
  }

  const data = (await response.json()) as { data?: { markdown?: string } };
  const markdown = data.data?.markdown ?? "";
  if (!markdown) {
    logAgent("input_processor", "warn", "Firecrawl response contained no markdown");
  }
  return markdown;
}

export async function crawlWebsiteSafe(url: string | undefined): Promise<string> {
  if (!url) return "";
  try {
    return await crawlWebsite(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logAgent("input_processor", "error", "Firecrawl crawl failed", message);
    return "";
  }
}
