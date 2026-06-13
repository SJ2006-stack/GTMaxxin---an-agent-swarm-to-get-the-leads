import { isMockTools, MOCK_SEARCH_RESULTS } from "./mock";

export type SearchResult = {
  title: string;
  url: string;
  content: string;
};

export async function searchWeb(
  query: string,
  maxResults = 5
): Promise<SearchResult[]> {
  if (isMockTools() || !process.env.TAVILY_API_KEY) {
    return MOCK_SEARCH_RESULTS.slice(0, maxResults);
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      max_results: maxResults,
      include_answer: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily error: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    results?: Array<{ title: string; url: string; content: string }>;
  };

  return (data.results ?? []).map((r) => ({
    title: r.title,
    url: r.url,
    content: r.content,
  }));
}
