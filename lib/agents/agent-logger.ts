import type { AgentName } from "@/types/agents";
import type { AgentLogEvent } from "@/lib/agents/events";
import type { z } from "zod";

type LogEmitter = (event: AgentLogEvent) => void;

let emitLog: LogEmitter | null = null;
let currentRunId: string | null = null;

export function bindAgentLogger(runId: string, emitter: LogEmitter): void {
  currentRunId = runId;
  emitLog = emitter;
}

export function clearAgentLogger(): void {
  emitLog = null;
  currentRunId = null;
}

export function logAgent(
  agent: AgentName,
  level: AgentLogEvent["level"],
  message: string,
  detail?: string
): void {
  if (!emitLog || !currentRunId) return;
  emitLog({
    run_id: currentRunId,
    agent,
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(detail ? { detail } : {}),
  });
}

export function truncate(text: string, max = 240): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

export function parseJsonWithLog<T>(agent: AgentName, raw: string): T {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned) as T;
    logAgent(agent, "info", "Parsed LLM JSON response");
    return parsed;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logAgent(
      agent,
      "error",
      "Failed to parse LLM response as JSON",
      truncate(raw, 400)
    );
    throw new Error(`JSON parse error: ${message}`);
  }
}

export function parseSchemaWithLog<T>(
  agent: AgentName,
  schema: z.ZodType<T>,
  data: unknown,
  label: string
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
      .join("; ");
    logAgent(agent, "error", `${label} validation failed`, issues);
    throw result.error;
  }
  logAgent(agent, "info", `${label} passed schema validation`);
  return result.data;
}
