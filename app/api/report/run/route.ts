import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { KVNamespace } from "@cloudflare/workers-types";
import { GTMInputSchema } from "@/types/gtm";
import { runSwarmGraph } from "@/swarm/graph";
import { runDemoReplay } from "@/swarm/demo-runner";
import { resolveDemoCompany } from "@/fixtures/demo-companies";
import { createRun, updateRun, appendEvent, appendLog, bindRunsKV } from "@/server/runs/store";
import type { SwarmStreamEvent } from "@/swarm/events";

export const maxDuration = 300;

function extractRunsKV(env: unknown): KVNamespace | null {
  const kv = (env as Record<string, unknown>).RUNS_KV;
  if (kv && typeof kv === "object" && "get" in kv && "put" in kv) {
    return kv as KVNamespace;
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = GTMInputSchema.parse(body);
    const runId = randomUUID();

    let ctx: { waitUntil: (p: Promise<unknown>) => void } | undefined;
    try {
      const cf = await getCloudflareContext({ async: true });
      ctx = cf.ctx;
      bindRunsKV(extractRunsKV(cf.env));
    } catch {
      bindRunsKV(null);
    }

    // Pre-baked demo companies (Microsoft, Apple, SpaceX) replay instantly
    // without any LLM/tool calls, so the demo is fast and deterministic.
    const demoCompany = resolveDemoCompany(input);

    await createRun(runId);
    await updateRun(runId, { status: "running", demo_mode: demoCompany !== null });

    const pendingEvents: Promise<void>[] = [];

    const emit = (event: SwarmStreamEvent) => {
      if (event.type === "status") {
        pendingEvents.push(appendEvent(runId, event.data));
      } else {
        pendingEvents.push(appendLog(runId, event.data));
      }
    };

    const execute = demoCompany
      ? runDemoReplay(runId, demoCompany, emit)
      : runSwarmGraph(runId, input, emit);

    const runPromise = execute
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

    if (ctx?.waitUntil) {
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
