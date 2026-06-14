import { isMockTools, MOCK_SEARCH_RESULTS } from "./mock";
import { logAgent } from "@/lib/agents/agent-logger";
import type { AgentName } from "@/types/agents";

export type SearchResult = {
  title: string;
  url: string;
  content: string;
};

export async function searchWeb(
  query: string,
  maxResults = 5,
  agent: AgentName = "signal_hunter"
): Promise<SearchResult[]> {
  if (isMockTools() || !process.env["TAVILY_API_KEY"]) {
    logAgent(
      agent,
      "info",
      "Using mock Tavily results (MOCK_TOOLS or missing TAVILY_API_KEY)"
    );
    return MOCK_SEARCH_RESULTS.slice(0, maxResults);
  }

  logAgent(agent, "step", `Tavily search: max ${maxResults} results`);
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env["TAVILY_API_KEY"],
      query,
      max_results: maxResults,
      include_answer: false,
    }),
  });

  if (!response.ok) {
    const detail = `${response.status} ${response.statusText}`;
    logAgent(agent, "error", "Tavily API request failed", detail);
    throw new Error(`Tavily error: ${response.statusText}`);
  }

  const data = (await response.json()) as {
    results?: Array<{ title: string; url: string; content: string }>;
  };

  const results = (data.results ?? []).map((r) => ({
    title: r.title,
    url: r.url,
    content: r.content,
  }));

  if (results.length === 0) {
    logAgent(agent, "warn", "Tavily returned zero results for query");
  } else {
    logAgent(agent, "info", `Tavily returned ${results.length} result(s)`);
  }

  return results;
}
