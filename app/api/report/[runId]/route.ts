import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { KVNamespace } from "@cloudflare/workers-types";
import { isMockLLM } from "@/swarm/tools/mock";
import { bindRunsKV, getRun, getRunEvents, getRunLogs } from "@/server/runs/store";

function extractRunsKV(env: unknown): KVNamespace | null {
  const kv = (env as Record<string, unknown>).RUNS_KV;
  if (kv && typeof kv === "object" && "get" in kv && "put" in kv) {
    return kv as KVNamespace;
  }
  return null;
}

async function withRunsKV<T>(fn: () => Promise<T>): Promise<T> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    bindRunsKV(extractRunsKV(env));
  } catch {
    bindRunsKV(null);
  }
  return fn();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { runId } = await params;

  return withRunsKV(async () => {
    const run = await getRun(runId);

    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    if (run.status === "error") {
      return NextResponse.json({ error: run.error }, { status: 500 });
    }

    if (!run.state?.report) {
      const [events, logs] = await Promise.all([
        getRunEvents(runId),
        getRunLogs(runId),
      ]);
      return NextResponse.json(
        {
          status: run.status,
          message: "Report not ready yet",
          input: run.state?.input,
          website_content: run.state?.website_content ?? null,
          research_evidence: run.state?.research_evidence ?? null,
          events,
          logs,
        },
        { status: 202 }
      );
    }

    const [events, logs] = await Promise.all([
      getRunEvents(runId),
      getRunLogs(runId),
    ]);

    return NextResponse.json({
      run_id: runId,
      status: run.status,
      report: run.state.report,
      input: run.state.input,
      website_content: run.state.website_content ?? null,
      research_evidence: run.state.research_evidence ?? null,
      agent_statuses: run.state.agent_statuses,
      agent_outputs: run.agent_outputs ?? {},
      langsmith_trace_url: run.state.langsmith_trace_url,
      demo_mode: run.demo_mode ?? isMockLLM(),
      events,
      logs,
    });
  });
}
