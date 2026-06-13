import { isMockTools, MOCK_CRAWL_RESULT } from "./mock";

export async function crawlWebsite(url: string): Promise<string> {
  if (isMockTools() || !process.env.FIRECRAWL_API_KEY) {
    return MOCK_CRAWL_RESULT.markdown;
  }

  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, formats: ["markdown"] }),
  });

  if (!response.ok) {
    throw new Error(`Firecrawl error: ${response.statusText}`);
  }

  const data = (await response.json()) as { data?: { markdown?: string } };
  return data.data?.markdown ?? "";
}

export async function crawlWebsiteSafe(url: string | undefined): Promise<string> {
  if (!url) return "";
  try {
    return await crawlWebsite(url);
  } catch {
    return "";
  }
}
