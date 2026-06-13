import type { GTMReportState } from "@/lib/agents/state";
import type { AgentStatusEvent } from "@/lib/agents/events";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { KVNamespace } from "@cloudflare/workers-types";

export type RunStatus = "pending" | "running" | "done" | "error";

export type RunRecord = {
  run_id: string;
  status: RunStatus;
  state?: GTMReportState;
  events: AgentStatusEvent[];
  error?: string;
  created_at: string;
  updated_at: string;
};

const memoryRuns = new Map<string, RunRecord>();
const memoryListeners = new Map<string, Set<(event: AgentStatusEvent) => void>>();
let boundKV: KVNamespace | null | undefined;

/** Bind KV for the current request + waitUntil background work */
export function bindRunsKV(kv: KVNamespace | null): void {
  boundKV = kv;
}

function runKey(runId: string): string {
  return `run:${runId}`;
}

async function getRunsKV(): Promise<KVNamespace | null> {
  if (boundKV !== undefined) return boundKV;

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = getCloudflareContext({ async: false });
    const kv = (env as Record<string, unknown>).RUNS_KV;
    if (kv && typeof kv === "object" && "get" in kv && "put" in kv) {
      return kv as KVNamespace;
    }
  } catch {
    // fall through
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    const kv = (env as Record<string, unknown>).RUNS_KV;
    if (kv && typeof kv === "object" && "get" in kv && "put" in kv) {
      return kv as KVNamespace;
    }
  } catch {
    // Local next dev without Cloudflare bindings
  }
  return null;
}

async function readRun(runId: string): Promise<RunRecord | undefined> {
  const kv = await getRunsKV();
  if (kv) {
    const record = await kv.get(runKey(runId), "json");
    return (record as RunRecord | null) ?? undefined;
  }
  return memoryRuns.get(runId);
}

async function writeRun(record: RunRecord): Promise<void> {
  const kv = await getRunsKV();
  if (kv) {
    await kv.put(runKey(record.run_id), JSON.stringify(record));
    return;
  }
  memoryRuns.set(record.run_id, record);
}

export async function createRun(runId: string): Promise<RunRecord> {
  const now = new Date().toISOString();
  const record: RunRecord = {
    run_id: runId,
    status: "pending",
    events: [],
    created_at: now,
    updated_at: now,
  };
  await writeRun(record);
  return record;
}

export async function getRun(runId: string): Promise<RunRecord | undefined> {
  return readRun(runId);
}

export async function updateRun(
  runId: string,
  patch: Partial<RunRecord>
): Promise<RunRecord | undefined> {
  const existing = await readRun(runId);
  if (!existing) return undefined;

  const updated: RunRecord = {
    ...existing,
    ...patch,
    updated_at: new Date().toISOString(),
  };
  await writeRun(updated);
  return updated;
}

export async function appendEvent(
  runId: string,
  event: AgentStatusEvent
): Promise<void> {
  const run = await readRun(runId);
  if (run) {
    run.events.push(event);
    run.updated_at = new Date().toISOString();
    await writeRun(run);
  }

  const listeners = memoryListeners.get(runId);
  if (listeners) {
    for (const listener of listeners) {
      listener(event);
    }
  }
}

export function subscribeToRun(
  runId: string,
  listener: (event: AgentStatusEvent) => void
): () => void {
  if (!memoryListeners.has(runId)) {
    memoryListeners.set(runId, new Set());
  }
  memoryListeners.get(runId)!.add(listener);
  return () => {
    memoryListeners.get(runId)?.delete(listener);
  };
}

export async function getRunEvents(runId: string): Promise<AgentStatusEvent[]> {
  const run = await readRun(runId);
  return run?.events ?? [];
}
