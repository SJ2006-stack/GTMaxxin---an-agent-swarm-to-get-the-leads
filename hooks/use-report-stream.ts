"use client";

import { useCallback, useEffect, useState } from "react";
import type { AgentStatusEvent } from "@/lib/agents/events";
import type { AgentStatuses } from "@/types/agents";
import { AGENT_NAMES, createInitialAgentStatuses } from "@/types/agents";
import type { GTMReport } from "@/types/gtm";

type UseReportStreamResult = {
  agentStatuses: AgentStatuses;
  events: AgentStatusEvent[];
  report: GTMReport | null;
  isComplete: boolean;
  error: string | null;
  langsmithTraceUrl: string | null;
  demoMode: boolean | null;
};

export function useReportStream(runId: string): UseReportStreamResult {
  const [agentStatuses, setAgentStatuses] = useState<AgentStatuses>(
    createInitialAgentStatuses()
  );
  const [events, setEvents] = useState<AgentStatusEvent[]>([]);
  const [report, setReport] = useState<GTMReport | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [langsmithTraceUrl, setLangsmithTraceUrl] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState<boolean | null>(null);

  const fetchReport = useCallback(async () => {
    const res = await fetch(`/api/report/${runId}`);
    if (res.status === 202) return;
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to fetch report");
    }
    const data = await res.json();
    setReport(data.report);
    if (data.agent_statuses) setAgentStatuses(data.agent_statuses);
    if (data.langsmith_trace_url) setLangsmithTraceUrl(data.langsmith_trace_url);
    if (typeof data.demo_mode === "boolean") setDemoMode(data.demo_mode);
  }, [runId]);

  useEffect(() => {
    const source = new EventSource(`/api/report/${runId}/stream`);

    source.addEventListener("agent_status", (e) => {
      const event = JSON.parse(e.data) as AgentStatusEvent;
      setEvents((prev) => [...prev, event]);
      setAgentStatuses((prev) => ({ ...prev, [event.agent]: event.status }));
    });

    source.addEventListener("report_ready", () => {
      setIsComplete(true);
      fetchReport().catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load report")
      );
      source.close();
    });

    source.addEventListener("error", (e) => {
      if (e instanceof MessageEvent && e.data) {
        const data = JSON.parse(e.data) as { message: string };
        setError(data.message);
      }
    });

    return () => source.close();
  }, [runId, fetchReport]);

  return { agentStatuses, events, report, isComplete, error, langsmithTraceUrl, demoMode };
}

export { AGENT_NAMES };
