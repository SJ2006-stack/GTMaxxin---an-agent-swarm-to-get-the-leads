import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { KVNamespace } from "@cloudflare/workers-types";
import { buildAgentOutputZip } from "@/lib/export/build-agent-zip";
import { bindRunsKV, getRun } from "@/lib/runs/store";

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

  if (run.status === "error") {
    return new Response(run.error ?? "Run failed", { status: 500 });
  }

  if (!run.state?.report) {
    return new Response("Report not ready yet", { status: 202 });
  }

  const zip = buildAgentOutputZip(run.state);

  return new Response(zip.buffer.slice(zip.byteOffset, zip.byteOffset + zip.byteLength) as ArrayBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="folder.zip"',
      "Cache-Control": "no-store",
    },
  });
}
