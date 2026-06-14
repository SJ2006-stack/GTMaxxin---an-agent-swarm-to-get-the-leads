import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { KVNamespace } from "@cloudflare/workers-types";
import { GTMInputSchema } from "@/types/gtm";
import { runSwarmGraph } from "@/lib/agents/graph";
import { isMockLLM } from "@/lib/agents/tools/mock";
import { createRun, updateRun, appendEvent, appendLog, bindRunsKV } from "@/lib/runs/store";
import type { SwarmStreamEvent } from "@/lib/agents/events";

export const maxDuration = 300;

function extractRunsKV(env: unknown): KVNamespace | null {
  const kv = (env as Record<string, unknown>).RUNS_KV;
  if (kv && typeof kv === "object" && "get" in kv && "put" in kv) {
    return kv as KVNamespace;
  }
  return null;
}

function isMockFromPlatformEnv(env: unknown): boolean {
  const value = (env as Record<string, string | undefined>).MOCK_LLM;
  return value === "true" || value === "1";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = GTMInputSchema.parse(body);
    const runId = randomUUID();

    let ctx: { waitUntil: (p: Promise<unknown>) => void } | undefined;
    let platformEnv: unknown;
    try {
      const cf = await getCloudflareContext({ async: true });
      ctx = cf.ctx;
      platformEnv = cf.env;
      bindRunsKV(extractRunsKV(cf.env));
    } catch {
      bindRunsKV(null);
    }

    const mockMode =
      platformEnv !== undefined
        ? isMockFromPlatformEnv(platformEnv)
        : isMockLLM();

    await createRun(runId);
    await updateRun(runId, { status: "running" });

    const pendingEvents: Promise<void>[] = [];

    const runPromise = runSwarmGraph(runId, input, (event: SwarmStreamEvent) => {
      if (event.type === "status") {
        pendingEvents.push(appendEvent(runId, event.data));
      } else {
        pendingEvents.push(appendLog(runId, event.data));
      }
    })
      .then(async (finalState) => {
        await Promise.all(pendingEvents);
        await updateRun(runId, {
          status: "done",
          state: finalState,
        });
      })
      .catch(async (err) => {
        await Promise.all(pendingEvents);
        await updateRun(runId, {
          status: "error",
          error: err instanceof Error ? err.message : String(err),
        });
      });

    if (mockMode) {
      await runPromise;
    } else if (ctx?.waitUntil) {
      ctx.waitUntil(runPromise);
    } else {
      void runPromise;
    }

    return NextResponse.json({ run_id: runId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
