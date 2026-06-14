#!/usr/bin/env bash
# Upload secrets from .env.local to the deployed Cloudflare Worker.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${1:-$ROOT/.env.local}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE" >&2
  exit 1
fi

SECRET_KEYS=(
  OPENROUTER_API_KEY
  FIRECRAWL_API_KEY
  TAVILY_API_KEY
  LANGCHAIN_API_KEY
)

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

for key in "${SECRET_KEYS[@]}"; do
  value="$(grep -E "^${key}=" "$ENV_FILE" | head -1 | cut -d= -f2- | sed 's/^"\(.*\)"$/\1/')"
  if [[ -n "${value:-}" ]]; then
    printf '%s=%s\n' "$key" "$value" >> "$TMP"
  fi
done

if [[ ! -s "$TMP" ]]; then
  echo "No secrets found in $ENV_FILE" >&2
  exit 1
fi

echo "Uploading secrets to Cloudflare Worker (prospect-swarm)..."
pnpm exec wrangler secret bulk "$TMP"
echo "Done. Non-secret vars live in wrangler.jsonc (vars)."
