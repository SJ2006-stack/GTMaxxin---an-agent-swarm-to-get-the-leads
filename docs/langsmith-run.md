# LangSmith Real Run Guide

## Setup

1. Copy `.env.example` to `.env.local`
2. Set tracing credentials:

```bash
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_api_key
LANGCHAIN_PROJECT=prospect-swarm
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=google/gemini-2.0-flash-001
TAVILY_API_KEY=your_tavily_key          # optional, capped at 5 results
FIRECRAWL_API_KEY=your_firecrawl_key    # optional
MOCK_LLM=false
MOCK_TOOLS=false
```

## Golden Fixture Run

The golden fixture input is defined in `lib/fixtures/demo-input.ts`:

- **Company:** B2B SaaS sales intelligence startup
- **Product:** AI prospecting / GTM automation tool
- **URL:** https://example.com (optional Firecrawl target)

### CLI smoke with real LLMs

```bash
MOCK_LLM=false MOCK_TOOLS=false pnpm smoke
```

Expected: ~2-3 min, all 11 agents `done`, report with 5 prospects and 5 signals max.

### LangGraph Studio

```bash
pnpm langgraph:dev
```

Open the Studio UI to step through node order and inspect per-node state diffs. Verify both parallel joins (MarketMapper ∥ SignalHunter, DecisionMakerFinder ∥ OpportunityScorer).

### Trace URLs

When `LANGCHAIN_TRACING_V2=true`, each run sets `langsmith_trace_url` on the final state. The report page footer links to LangSmith for debugging.

Pin trace URLs from golden fixture runs for demo comparison.

## Fast Iteration Loop

```bash
MOCK_LLM=true pnpm smoke          # after every graph change (~5s)
langgraph dev                       # when debugging node order
MOCK_LLM=false pnpm smoke           # before demo with real LLMs
```
