import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { KVNamespace } from "@cloudflare/workers-types";
import { getRun, getRunEvents, subscribeToRun, bindRunsKV } from "@/lib/runs/store";
import { formatSSE } from "@/lib/agents/events";

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

  try {
    const { env } = await getCloudflareContext({ async: true });
    bindRunsKV(extractRunsKV(env));
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

  const stream = new ReadableStream({
    async start(controller) {
      const pushEvents = async () => {
        const events = await getRunEvents(runId);
        for (let i = lastEventCount; i < events.length; i++) {
          controller.enqueue(
            encoder.encode(formatSSE({ type: "agent_status", data: events[i] }))
          );
        }
        lastEventCount = events.length;
      };

      await pushEvents();

      const current = await getRun(runId);
      if (current?.status === "done") {
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

      unsubscribe = subscribeToRun(runId, (event) => {
        controller.enqueue(
          encoder.encode(formatSSE({ type: "agent_status", data: event }))
        );
        lastEventCount += 1;

        if (event.agent === "report_assembler" && event.status === "done") {
          controller.enqueue(
            encoder.encode(formatSSE({ type: "report_ready", data: { run_id: runId } }))
          );
          controller.close();
          unsubscribe?.();
          if (poll) clearInterval(poll);
        }

        if (event.status === "error") {
          controller.enqueue(
            encoder.encode(
              formatSSE({
                type: "error",
                data: { message: event.error ?? "Agent error" },
              })
            )
          );
        }
      });

      poll = setInterval(async () => {
        const latest = await getRun(runId);
        if (!latest) {
          if (poll) clearInterval(poll);
          controller.close();
          return;
        }

        await pushEvents();

        if (latest.status === "done") {
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
      }, 500);
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
