#!/usr/bin/env bash
# Build .dev.vars for local Cloudflare preview from .env.local
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${1:-$ROOT/.env.local}"
OUT="$ROOT/.dev.vars"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE" >&2
  exit 1
fi

{
  echo "NEXTJS_ENV=development"
  grep -E '^(OPENROUTER_API_KEY|OPENROUTER_MODEL|FIRECRAWL_API_KEY|TAVILY_API_KEY|LANGCHAIN_TRACING_V2|LANGCHAIN_API_KEY|LANGCHAIN_PROJECT|MOCK_LLM|MOCK_TOOLS)=' "$ENV_FILE" || true
} > "$OUT"

echo "Wrote $OUT (gitignored — for wrangler/opennext preview only)"
