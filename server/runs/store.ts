import type { GTMReportState } from "@/swarm/state";
import type { AgentStatusEvent, AgentLogEvent, SwarmStreamEvent } from "@/swarm/events";
import type { AgentOutputs } from "@/server/export/agent-outputs";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { KVNamespace } from "@cloudflare/workers-types";

export type RunStatus = "pending" | "running" | "done" | "error";

export type RunRecord = {
  run_id: string;
  status: RunStatus;
  state?: GTMReportState;
  agent_outputs?: AgentOutputs;
  events: AgentStatusEvent[];
  logs: AgentLogEvent[];
  error?: string;
  demo_mode?: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Persistence model
 * -----------------
 * A swarm run emits many status/log events. Re-reading and re-serializing the
 * entire (large) run record to KV on every single event is O(n┬▓) write
 * amplification and will hit Cloudflare KV's ~1 write/sec-per-key limit.
 *
 * Instead, the isolate that owns the run keeps the authoritative record in
 * memory (`liveRuns`), mutates it in place, and flushes to KV on a throttle.
 * Reader isolates (the SSE/stream route) never populate `liveRuns`, so their
 * reads always go straight to KV and stay fresh.
 */
const FLUSH_INTERVAL_MS = 750;

const memoryRuns = new Map<string, RunRecord>();
const liveRuns = new Map<string, RunRecord>();
const flushTimers = new Map<string, ReturnType<typeof setTimeout>>();
const flushChains = new Map<string, Promise<void>>();
const dirtyRuns = new Set<string>();
const streamListeners = new Map<string, Set<(event: SwarmStreamEvent) => void>>();
let boundKV: KVNamespace | null | undefined;

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

/** Always returns fresh data: cached record for the writer isolate, KV otherwise. */
async function readFresh(runId: string): Promise<RunRecord | undefined> {
  const cached = liveRuns.get(runId);
  if (cached) return cached;

  const kv = await getRunsKV();
  if (kv) {
    const record = (await kv.get(runKey(runId), "json")) as RunRecord | null;
    if (record && !record.logs) record.logs = [];
    return record ?? undefined;
  }

  const mem = memoryRuns.get(runId);
  if (mem && !mem.logs) mem.logs = [];
  return mem;
}

async function persist(record: RunRecord): Promise<void> {
  const kv = await getRunsKV();
  if (kv) {
    await kv.put(runKey(record.run_id), JSON.stringify(record));
    return;
  }
  memoryRuns.set(record.run_id, record);
}

/** Writes the current in-memory record to KV, serializing puts per run. */
function flush(runId: string): Promise<void> {
  const record = liveRuns.get(runId);
  if (!record) return Promise.resolve();
  dirtyRuns.delete(runId);

  const previous = flushChains.get(runId) ?? Promise.resolve();
  const next = previous.then(() => persist(record)).catch(() => undefined);
  flushChains.set(runId, next);
  return next;
}

/** Marks the run dirty and ensures a single pending throttled flush. */
function scheduleFlush(runId: string): void {
  dirtyRuns.add(runId);
  if (flushTimers.has(runId)) return;

  const timer = setTimeout(() => {
    flushTimers.delete(runId);
    if (dirtyRuns.has(runId)) void flush(runId);
  }, FLUSH_INTERVAL_MS);
  flushTimers.set(runId, timer);
}

/** Cancels any pending throttle and persists immediately, awaiting completion. */
async function forceFlush(runId: string): Promise<void> {
  const timer = flushTimers.get(runId);
  if (timer) {
    clearTimeout(timer);
    flushTimers.delete(runId);
  }
  await flush(runId);
  await (flushChains.get(runId) ?? Promise.resolve());
}

function releaseRun(runId: string): void {
  const timer = flushTimers.get(runId);
  if (timer) clearTimeout(timer);
  flushTimers.delete(runId);
  flushChains.delete(runId);
  dirtyRuns.delete(runId);
  liveRuns.delete(runId);
}

function ownRecord(record: RunRecord): RunRecord {
  liveRuns.set(record.run_id, record);
  return record;
}

function notifyListeners(runId: string, event: SwarmStreamEvent): void {
  const listeners = streamListeners.get(runId);
  if (listeners) {
    for (const listener of listeners) {
      listener(event);
    }
  }
}

export async function createRun(runId: string): Promise<RunRecord> {
  const now = new Date().toISOString();
  const record: RunRecord = {
    run_id: runId,
    status: "pending",
    events: [],
    logs: [],
    created_at: now,
    updated_at: now,
  };
  ownRecord(record);
  await persist(record);
  return record;
}

export async function getRun(runId: string): Promise<RunRecord | undefined> {
  return readFresh(runId);
}

export async function updateRun(
  runId: string,
  patch: Partial<RunRecord>
): Promise<RunRecord | undefined> {
  let record = liveRuns.get(runId);
  if (!record) {
    const fresh = await readFresh(runId);
    if (!fresh) return undefined;
    record = ownRecord(fresh);
  }

  Object.assign(record, patch, { updated_at: new Date().toISOString() });

  const isTerminal = record.status === "done" || record.status === "error";
  await forceFlush(runId);
  if (isTerminal) releaseRun(runId);
  return record;
}

export async function appendEvent(
  runId: string,
  event: AgentStatusEvent
): Promise<void> {
  let record = liveRuns.get(runId);
  if (!record) {
    const fresh = await readFresh(runId);
    if (fresh) record = ownRecord(fresh);
  }

  if (record) {
    record.events.push(event);
    if (event.status === "done" && event.output !== undefined) {
      record.agent_outputs = {
        ...record.agent_outputs,
        [event.agent]: event.output,
      };
    }
    record.updated_at = new Date().toISOString();
    scheduleFlush(runId);
  }

  notifyListeners(runId, { type: "status", data: event });
}

export async function appendLog(
  runId: string,
  log: AgentLogEvent
): Promise<void> {
  let record = liveRuns.get(runId);
  if (!record) {
    const fresh = await readFresh(runId);
    if (fresh) record = ownRecord(fresh);
  }

  if (record) {
    record.logs.push(log);
    record.updated_at = new Date().toISOString();
    scheduleFlush(runId);
  }

  notifyListeners(runId, { type: "log", data: log });
}

export function subscribeToRun(
  runId: string,
  listener: (event: SwarmStreamEvent) => void
): () => void {
  if (!streamListeners.has(runId)) {
    streamListeners.set(runId, new Set());
  }
  streamListeners.get(runId)!.add(listener);
  return () => {
    streamListeners.get(runId)?.delete(listener);
  };
}

export async function getRunEvents(runId: string): Promise<AgentStatusEvent[]> {
  const run = await readFresh(runId);
  return run?.events ?? [];
}

export async function getRunLogs(runId: string): Promise<AgentLogEvent[]> {
  const run = await readFresh(runId);
  return run?.logs ?? [];
}
