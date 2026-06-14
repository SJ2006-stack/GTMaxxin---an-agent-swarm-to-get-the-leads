import { OpenRouter } from "@openrouter/sdk";
import { isMockLLM } from "@/lib/agents/tools/mock";
import { logAgent } from "@/lib/agents/agent-logger";
import type { AgentName } from "@/types/agents";

const DEFAULT_MODEL = "openrouter/free";

let client: OpenRouter | null = null;

function getOpenRouterClient(): OpenRouter {
  if (!client) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is required for real LLM calls");
    }

    client = new OpenRouter({
      apiKey,
      httpReferer: "https://prospect-swarm.app",
      appTitle: "Prospect Swarm",
    });
  }

  return client;
}

export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    agent?: AgentName;
  }
): Promise<string> {
  if (isMockLLM()) {
    throw new Error("callLLM should not be called in MOCK_LLM mode");
  }

  const model = process.env["OPENROUTER_MODEL"] ?? DEFAULT_MODEL;
  if (options?.agent) {
    logAgent(options.agent, "info", `OpenRouter model: ${model}`);
  }
  const openrouter = getOpenRouterClient();

  const stream = await openrouter.chat.send({
    chatRequest: {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: options?.temperature ?? 0.3,
      maxTokens: options?.maxTokens ?? 4096,
      responseFormat: { type: "json_object" },
      stream: true,
    },
  });

  let response = "";
  let reasoningTokens: number | null | undefined;

  for await (const chunk of stream) {
    if (chunk.error) {
      const msg = `OpenRouter error (${chunk.error.code}): ${chunk.error.message}`;
      if (options?.agent) logAgent(options.agent, "error", "OpenRouter stream error", msg);
      throw new Error(msg);
    }

    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      response += content;
    }

    const tokens = chunk.usage?.completionTokensDetails?.reasoningTokens;
    if (tokens != null) {
      reasoningTokens = tokens;
    }
  }

  if (reasoningTokens != null) {
    console.debug(`[callLLM${options?.agent ? `:${options.agent}` : ""}] reasoningTokens: ${reasoningTokens}`);
  }

  if (!response) {
    if (options?.agent) {
      logAgent(options.agent, "error", "OpenRouter returned an empty response");
    }
    throw new Error("Empty response from OpenRouter");
  }

  return response;
}

export function parseJSONResponse<T>(raw: string): T {
  const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleaned) as T;
}

export function getLangSmithTraceUrl(runId: string): string | undefined {
  if (process.env.LANGCHAIN_TRACING_V2 !== "true") return undefined;
  const project = process.env.LANGCHAIN_PROJECT ?? "prospect-swarm";
  return `https://smith.langchain.com/o/default/projects/p/${project}?search=${runId}`;
}
