import type { z } from "zod";
import type { AgentName } from "@/types/agents";
import type { GTMReportState } from "@/lib/agents/state";
import { logAgent, parseJsonWithLog, parseSchemaWithLog, truncate } from "@/lib/agents/agent-logger";
import { callLLM } from "@/lib/llm/openrouter";
import { isMockLLM } from "@/lib/agents/tools/mock";

type LLMNodeOptions<T> = {
  agent: AgentName;
  state: GTMReportState;
  schema: z.ZodType<T>;
  systemPrompt: string;
  buildPrompt: (state: GTMReportState) => Record<string, unknown>;
  mapResult: (parsed: T) => Partial<GTMReportState>;
  fixture: T;
  fixtureLabel?: string;
};

export async function executeLLMNode<T>(
  options: LLMNodeOptions<T>
): Promise<Partial<GTMReportState>> {
  const {
    agent,
    state,
    schema,
    systemPrompt,
    buildPrompt,
    mapResult,
    fixture,
    fixtureLabel = "Fixture",
  } = options;

  if (isMockLLM()) {
    logAgent(agent, "info", "MOCK_LLM enabled — loading fixture data");
    const parsed = parseSchemaWithLog(agent, schema, fixture, fixtureLabel);
    return mapResult(parsed);
  }

  logAgent(agent, "step", "Calling OpenRouter LLM");
  const promptPayload = buildPrompt(state);
  logAgent(agent, "info", "Prepared LLM input", truncate(JSON.stringify(promptPayload)));

  const raw = await callLLM(systemPrompt, JSON.stringify(promptPayload), { agent });
  logAgent(agent, "info", `LLM response received (${raw.length} chars)`);

  const json = parseJsonWithLog<unknown>(agent, raw);
  const parsed = parseSchemaWithLog(agent, schema, json, "LLM output");
  return mapResult(parsed);
}
