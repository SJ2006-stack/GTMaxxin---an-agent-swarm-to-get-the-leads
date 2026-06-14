"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { AgentLogEvent, AgentStatusEvent } from "@/swarm/events";
import type { AgentOutputs } from "@/server/export/agent-outputs";
import type { AgentStatuses } from "@/types/agents";
import { AGENT_NAMES, createInitialAgentStatuses, type AgentName } from "@/types/agents";
import type { ResearchEvidence } from "@/swarm/state";
import type { GTMInput, GTMReport } from "@/types/gtm";

export type TimelineEntry =
  | { kind: "status"; timestamp: string; data: AgentStatusEvent }
  | { kind: "log"; timestamp: string; data: AgentLogEvent };

type RunResearchEvidence = Partial<
  Record<"signal_hunter" | "prospect_discovery", ResearchEvidence>
>;

type RunContextPayload = {
  input?: GTMInput;
  website_content?: string | null;
  research_evidence?: RunResearchEvidence | null;
};

type UseReportStreamResult = {
  agentStatuses: AgentStatuses;
  agentOutputs: AgentOutputs;
  events: AgentStatusEvent[];
  logs: AgentLogEvent[];
  timeline: TimelineEntry[];
  report: GTMReport | null;
  input: GTMInput | null;
  websiteContent: string | null;
  researchEvidence: RunResearchEvidence | null;
  isComplete: boolean;
  error: string | null;
  langsmithTraceUrl: string | null;
  demoMode: boolean | null;
  selectedAgent: AgentName | null;
  setSelectedAgent: (agent: AgentName) => void;
};

function hydrateRunContext(
  data: RunContextPayload,
  setInput: Dispatch<SetStateAction<GTMInput | null>>,
  setWebsiteContent: Dispatch<SetStateAction<string | null>>,
  setResearchEvidence: Dispatch<SetStateAction<RunResearchEvidence | null>>
): void {
  if (data.input) setInput(data.input);
  if ("website_content" in data) {
    setWebsiteContent(data.website_content ?? null);
  }
  if ("research_evidence" in data) {
    setResearchEvidence(data.research_evidence ?? null);
  }
}

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

function statusKey(event: AgentStatusEvent): string {
  return `${event.timestamp}:${event.agent}:${event.status}:${event.phase}`;
}

function logKey(log: AgentLogEvent): string {
  return `${log.timestamp}:${log.agent}:${log.level}:${log.message}`;
}

function mergeEvents(
  prev: AgentStatusEvent[],
  incoming: AgentStatusEvent[]
): AgentStatusEvent[] {
  const seen = new Set(prev.map(statusKey));
  const merged = [...prev];
  for (const event of incoming) {
    const key = statusKey(event);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(event);
    }
  }
  return merged.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

function mergeLogs(prev: AgentLogEvent[], incoming: AgentLogEvent[]): AgentLogEvent[] {
  const seen = new Set(prev.map(logKey));
  const merged = [...prev];
  for (const log of incoming) {
    const key = logKey(log);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(log);
    }
  }
  return merged.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

function applyStatusEvent(
  event: AgentStatusEvent,
  setAgentStatuses: Dispatch<SetStateAction<AgentStatuses>>,
  setAgentOutputs: Dispatch<SetStateAction<AgentOutputs>>,
  setSelectedAgent: Dispatch<SetStateAction<AgentName | null>>,
  setError: Dispatch<SetStateAction<string | null>>
): void {
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
}

export function useReportStream(runId: string): UseReportStreamResult {
  const [agentStatuses, setAgentStatuses] = useState<AgentStatuses>(
    createInitialAgentStatuses()
  );
  const [agentOutputs, setAgentOutputs] = useState<AgentOutputs>({});
  const [events, setEvents] = useState<AgentStatusEvent[]>([]);
  const [logs, setLogs] = useState<AgentLogEvent[]>([]);
  const [report, setReport] = useState<GTMReport | null>(null);
  const [input, setInput] = useState<GTMInput | null>(null);
  const [websiteContent, setWebsiteContent] = useState<string | null>(null);
  const [researchEvidence, setResearchEvidence] =
    useState<RunResearchEvidence | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [langsmithTraceUrl, setLangsmithTraceUrl] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState<boolean | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentName | null>(null);
  const lastUpdateAtRef = useRef(Date.now());
  const isCompleteRef = useRef(false);
  const eventsRef = useRef<AgentStatusEvent[]>([]);
  const logsRef = useRef<AgentLogEvent[]>([]);
  const sourceRef = useRef<EventSource | null>(null);

  const timeline = useMemo(() => buildTimeline(events, logs), [events, logs]);

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  useEffect(() => {
    logsRef.current = logs;
  }, [logs]);

  const touchTimeline = useCallback(() => {
    lastUpdateAtRef.current = Date.now();
  }, []);

  const fetchReport = useCallback(async () => {
    const res = await fetch(`/api/report/${runId}`);
    if (res.status === 202) {
      const data = await res.json();
      hydrateRunContext(data, setInput, setWebsiteContent, setResearchEvidence);
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
    hydrateRunContext(data, setInput, setWebsiteContent, setResearchEvidence);
    if (data.agent_statuses) setAgentStatuses(data.agent_statuses);
    if (data.agent_outputs) setAgentOutputs(data.agent_outputs);
    if (Array.isArray(data.events)) setEvents(data.events);
    if (Array.isArray(data.logs)) setLogs(data.logs);
    if (data.langsmith_trace_url) setLangsmithTraceUrl(data.langsmith_trace_url);
    if (typeof data.demo_mode === "boolean") setDemoMode(data.demo_mode);
  }, [runId]);

  const pollRunState = useCallback(async () => {
    const res = await fetch(`/api/report/${runId}`);
    if (res.status === 202) {
      const data = await res.json();
      hydrateRunContext(data, setInput, setWebsiteContent, setResearchEvidence);
      if (Array.isArray(data.events)) {
        const incoming = data.events as AgentStatusEvent[];
        const prevEvents = eventsRef.current;
        const merged = mergeEvents(prevEvents, incoming);
        if (merged.length > prevEvents.length) {
          touchTimeline();
          const prevKeys = new Set(prevEvents.map(statusKey));
          for (const event of incoming) {
            if (!prevKeys.has(statusKey(event))) {
              applyStatusEvent(
                event,
                setAgentStatuses,
                setAgentOutputs,
                setSelectedAgent,
                setError
              );
            }
          }
          setEvents(merged);
        }
      }
      if (Array.isArray(data.logs)) {
        const incoming = data.logs as AgentLogEvent[];
        const prevLogs = logsRef.current;
        const merged = mergeLogs(prevLogs, incoming);
        if (merged.length > prevLogs.length) {
          touchTimeline();
          setLogs(merged);
        }
      }
      return;
    }
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to fetch report");
    }
    const data = await res.json();
    setReport(data.report);
    hydrateRunContext(data, setInput, setWebsiteContent, setResearchEvidence);
    if (data.agent_statuses) setAgentStatuses(data.agent_statuses);
    if (data.agent_outputs) setAgentOutputs(data.agent_outputs);
    if (Array.isArray(data.events)) setEvents(data.events);
    if (Array.isArray(data.logs)) setLogs(data.logs);
    if (data.langsmith_trace_url) setLangsmithTraceUrl(data.langsmith_trace_url);
    if (typeof data.demo_mode === "boolean") setDemoMode(data.demo_mode);
    isCompleteRef.current = true;
    setIsComplete(true);
    touchTimeline();
    sourceRef.current?.close();
  }, [runId, touchTimeline]);

  useEffect(() => {
    isCompleteRef.current = isComplete;
  }, [isComplete]);

  useEffect(() => {
    const source = new EventSource(`/api/report/${runId}/stream`);
    sourceRef.current = source;

    source.addEventListener("agent_status", (e) => {
      const event = JSON.parse(e.data) as AgentStatusEvent;
      touchTimeline();
      setEvents((prev) => [...prev, event]);
      applyStatusEvent(
        event,
        setAgentStatuses,
        setAgentOutputs,
        setSelectedAgent,
        setError
      );
    });

    source.addEventListener("agent_log", (e) => {
      const log = JSON.parse(e.data) as AgentLogEvent;
      touchTimeline();
      setLogs((prev) => [...prev, log]);
      if (log.level === "error") {
        setSelectedAgent(log.agent);
      }
    });

    source.addEventListener("report_ready", () => {
      isCompleteRef.current = true;
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

    // Safety net only: the SSE route already polls the store server-side, so
    // this fallback fires solely when the live stream goes quiet for a while.
    const pollFallback = setInterval(() => {
      if (isCompleteRef.current) return;
      if (Date.now() - lastUpdateAtRef.current < 5000) return;
      pollRunState().catch((err) =>
        setError(err instanceof Error ? err.message : "Poll failed")
      );
    }, 2000);

    return () => {
      clearInterval(pollFallback);
      source.close();
      sourceRef.current = null;
    };
  }, [runId, fetchReport, pollRunState, touchTimeline]);

  return {
    agentStatuses,
    agentOutputs,
    events,
    logs,
    timeline,
    report,
    input,
    websiteContent,
    researchEvidence,
    isComplete,
    error,
    langsmithTraceUrl,
    demoMode,
    selectedAgent,
    setSelectedAgent,
  };
}

export { AGENT_NAMES };
