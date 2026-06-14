import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { KVNamespace } from "@cloudflare/workers-types";
import {
  getRun,
  subscribeToRun,
  bindRunsKV,
  type RunRecord,
} from "@/server/runs/store";
import { formatSSE } from "@/swarm/events";

export const dynamic = "force-dynamic";

function extractRunsKV(env: unknown): KVNamespace | null {
  const kv = (env as Record<string, unknown>).RUNS_KV;
  if (kv && typeof kv === "object" && "get" in kv && "put" in kv) {
    return kv as KVNamespace;
  }
  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;

  let hasKV = false;
  try {
    const { env } = await getCloudflareContext({ async: true });
    const kv = extractRunsKV(env);
    bindRunsKV(kv);
    hasKV = kv !== null;
  } catch {
    bindRunsKV(null);
  }

  const run = await getRun(runId);

  if (!run) {
    return new Response("Run not found", { status: 404 });
  }

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | undefined;
  let poll: ReturnType<typeof setInterval> | undefined;
  let lastEventCount = 0;
  let lastLogCount = 0;

  const stream = new ReadableStream({
    async start(controller) {
      // Drains a single already-fetched record, avoiding extra KV reads per tick.
      const pushBuffered = (record: RunRecord) => {
        const events = record.events ?? [];
        for (let i = lastEventCount; i < events.length; i++) {
          controller.enqueue(
            encoder.encode(formatSSE({ type: "agent_status", data: events[i] }))
          );
        }
        lastEventCount = events.length;

        const logs = record.logs ?? [];
        for (let i = lastLogCount; i < logs.length; i++) {
          controller.enqueue(
            encoder.encode(formatSSE({ type: "agent_log", data: logs[i] }))
          );
        }
        lastLogCount = logs.length;
      };

      pushBuffered(run);

      const current = run;
      if (current?.status === "done" && current.state?.report) {
        controller.enqueue(
          encoder.encode(formatSSE({ type: "report_ready", data: { run_id: runId } }))
        );
        controller.close();
        return;
      }

      if (current?.status === "error") {
        controller.enqueue(
          encoder.encode(
            formatSSE({
              type: "error",
              data: { message: current.error ?? "Unknown error" },
            })
          )
        );
        controller.close();
        return;
      }

      if (!hasKV) {
        unsubscribe = subscribeToRun(runId, (event) => {
          if (event.type === "status") {
            controller.enqueue(
              encoder.encode(formatSSE({ type: "agent_status", data: event.data }))
            );
            lastEventCount += 1;

            if (event.data.status === "error") {
              controller.enqueue(
                encoder.encode(
                  formatSSE({
                    type: "error",
                    data: { message: event.data.error ?? "Agent error" },
                  })
                )
              );
            }
          } else {
            controller.enqueue(
              encoder.encode(formatSSE({ type: "agent_log", data: event.data }))
            );
            lastLogCount += 1;
          }
        });
      }

      poll = setInterval(async () => {
        const latest = await getRun(runId);
        if (!latest) {
          if (poll) clearInterval(poll);
          controller.close();
          return;
        }

        pushBuffered(latest);

        if (latest.status === "done" && latest.state?.report) {
          controller.enqueue(
            encoder.encode(formatSSE({ type: "report_ready", data: { run_id: runId } }))
          );
          if (poll) clearInterval(poll);
          controller.close();
          unsubscribe?.();
        }

        if (latest.status === "error") {
          controller.enqueue(
            encoder.encode(
              formatSSE({
                type: "error",
                data: { message: latest.error ?? "Run failed" },
              })
            )
          );
          if (poll) clearInterval(poll);
          controller.close();
          unsubscribe?.();
        }
      }, 1000);
    },
    cancel() {
      unsubscribe?.();
      if (poll) clearInterval(poll);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
