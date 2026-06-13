function envFlag(name: "MOCK_LLM" | "MOCK_TOOLS"): boolean {
  const value = process.env[name];
  return value === "true" || value === "1";
}

export function isMockLLM(): boolean {
  return envFlag("MOCK_LLM");
}

export function isMockTools(): boolean {
  return envFlag("MOCK_TOOLS") || isMockLLM();
}

export const MOCK_SEARCH_RESULTS = [
  {
    title: "Top SaaS Companies Hiring SDRs 2026",
    url: "https://example.com/saas-hiring",
    content: "Series B SaaS companies are aggressively hiring SDR teams...",
  },
  {
    title: "B2B Sales Intelligence Market Report",
    url: "https://example.com/market-report",
    content: "The sales intelligence market is growing 25% YoY...",
  },
  {
    title: "RevOps Tool Stack Trends",
    url: "https://example.com/revops-trends",
    content: "Revenue operations teams are consolidating GTM tools...",
  },
];

export const MOCK_CRAWL_RESULT = {
  markdown: `# Acme Sales Intelligence
AI-powered GTM platform for B2B sales teams.
Features: prospect discovery, signal detection, outreach automation.`,
  metadata: { title: "Acme Sales Intelligence" },
};
