"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AgentLogEvent, AgentStatusEvent } from "@/lib/agents/events";
import type { AgentOutputs } from "@/lib/export/agent-outputs";
import type { AgentStatuses } from "@/types/agents";
import { AGENT_NAMES, createInitialAgentStatuses, type AgentName } from "@/types/agents";
import type { GTMReport } from "@/types/gtm";

export type TimelineEntry =
  | { kind: "status"; timestamp: string; data: AgentStatusEvent }
  | { kind: "log"; timestamp: string; data: AgentLogEvent };

type UseReportStreamResult = {
  agentStatuses: AgentStatuses;
  agentOutputs: AgentOutputs;
  events: AgentStatusEvent[];
  logs: AgentLogEvent[];
  timeline: TimelineEntry[];
  report: GTMReport | null;
  isComplete: boolean;
  error: string | null;
  langsmithTraceUrl: string | null;
  demoMode: boolean | null;
  selectedAgent: AgentName | null;
  setSelectedAgent: (agent: AgentName) => void;
};

function buildTimeline(
  events: AgentStatusEvent[],
  logs: AgentLogEvent[]
): TimelineEntry[] {
  return [
    ...events.map((data) => ({
      kind: "status" as const,
      timestamp: data.timestamp,
      data,
    })),
    ...logs.map((data) => ({
      kind: "log" as const,
      timestamp: data.timestamp,
      data,
    })),
  ].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

export function useReportStream(runId: string): UseReportStreamResult {
  const [agentStatuses, setAgentStatuses] = useState<AgentStatuses>(
    createInitialAgentStatuses()
  );
  const [agentOutputs, setAgentOutputs] = useState<AgentOutputs>({});
  const [events, setEvents] = useState<AgentStatusEvent[]>([]);
  const [logs, setLogs] = useState<AgentLogEvent[]>([]);
  const [report, setReport] = useState<GTMReport | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [langsmithTraceUrl, setLangsmithTraceUrl] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState<boolean | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentName | null>(null);

  const timeline = useMemo(() => buildTimeline(events, logs), [events, logs]);

  const fetchReport = useCallback(async () => {
    const res = await fetch(`/api/report/${runId}`);
    if (res.status === 202) {
      const data = await res.json();
      if (Array.isArray(data.events)) setEvents(data.events);
      if (Array.isArray(data.logs)) setLogs(data.logs);
      return;
    }
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to fetch report");
    }
    const data = await res.json();
    setReport(data.report);
    if (data.agent_statuses) setAgentStatuses(data.agent_statuses);
    if (data.agent_outputs) setAgentOutputs(data.agent_outputs);
    if (Array.isArray(data.events)) setEvents(data.events);
    if (Array.isArray(data.logs)) setLogs(data.logs);
    if (data.langsmith_trace_url) setLangsmithTraceUrl(data.langsmith_trace_url);
    if (typeof data.demo_mode === "boolean") setDemoMode(data.demo_mode);
  }, [runId]);

  useEffect(() => {
    const source = new EventSource(`/api/report/${runId}/stream`);

    source.addEventListener("agent_status", (e) => {
      const event = JSON.parse(e.data) as AgentStatusEvent;
      setEvents((prev) => [...prev, event]);
      setAgentStatuses((prev) => ({ ...prev, [event.agent]: event.status }));

      if (event.status === "done" && event.output !== undefined) {
        setAgentOutputs((prev) => ({ ...prev, [event.agent]: event.output }));
        setSelectedAgent(event.agent);
      }

      if (event.status === "running") {
        setSelectedAgent(event.agent);
      }

      if (event.status === "error" && event.error) {
        setError(event.error);
      }
    });

    source.addEventListener("agent_log", (e) => {
      const log = JSON.parse(e.data) as AgentLogEvent;
      setLogs((prev) => [...prev, log]);
      if (log.level === "error") {
        setSelectedAgent(log.agent);
      }
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

  return {
    agentStatuses,
    agentOutputs,
    events,
    logs,
    timeline,
    report,
    isComplete,
    error,
    langsmithTraceUrl,
    demoMode,
    selectedAgent,
    setSelectedAgent,
  };
}

export { AGENT_NAMES };
