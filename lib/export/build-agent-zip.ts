import { zipSync, strToU8 } from "fflate";
import type { GTMReportState } from "@/lib/agents/state";
import { AGENT_NAMES } from "@/types/agents";
import { extractAgentOutput } from "@/lib/export/agent-outputs";

function addJson(
  files: Record<string, Uint8Array>,
  path: string,
  data: unknown
): void {
  files[path] = strToU8(JSON.stringify(data, null, 2));
}

/** Build folder.zip with one subfolder per agent containing its output JSON */
export function buildAgentOutputZip(state: GTMReportState): Uint8Array {
  const files: Record<string, Uint8Array> = {};
  const root = "folder";

  for (const agent of AGENT_NAMES) {
    const filename =
      agent === "report_assembler" ? "gtm-report.json" : "output.json";
    addJson(files, `${root}/${agent}/${filename}`, extractAgentOutput(agent, state));
  }

  addJson(files, `${root}/manifest.json`, {
    run_id: state.run_id,
    generated_at: state.report?.generated_at ?? null,
    agent_statuses: state.agent_statuses,
    errors: state.errors,
  });

  return zipSync(files);
}
