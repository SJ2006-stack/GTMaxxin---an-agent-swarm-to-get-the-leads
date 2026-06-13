import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { KVNamespace } from "@cloudflare/workers-types";
import { isMockLLM } from "@/lib/agents/tools/mock";
import { bindRunsKV, getRun } from "@/lib/runs/store";

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
      return NextResponse.json(
        { status: run.status, message: "Report not ready yet" },
        { status: 202 }
      );
    }

    return NextResponse.json({
      run_id: runId,
      status: run.status,
      report: run.state.report,
      agent_statuses: run.state.agent_statuses,
      langsmith_trace_url: run.state.langsmith_trace_url,
      demo_mode: isMockLLM(),
    });
  });
}
