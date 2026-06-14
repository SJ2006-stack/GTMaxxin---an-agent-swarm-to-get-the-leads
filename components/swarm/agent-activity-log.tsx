"use client";

import { useEffect, useRef } from "react";
import type { TimelineEntry } from "@/hooks/use-report-stream";
import { AGENT_LABELS, type AgentName } from "@/types/agents";
import { cn } from "@/lib/utils";

type Props = {
  timeline: TimelineEntry[];
  selectedAgent: AgentName | null;
  onSelectAgent: (agent: AgentName) => void;
};

const statusIcon = {
  pending: "○",
  running: "◉",
  done: "✓",
  error: "✗",
} as const;

const statusColor = {
  pending: "text-gray-400",
  running: "text-blue-400",
  done: "text-green-400",
  error: "text-red-400",
} as const;

const logLevelLabel = {
  step: "STEP",
  info: "INFO",
  warn: "WARN",
  error: "ERR ",
} as const;

const logLevelColor = {
  step: "text-cyan-400",
  info: "text-gray-300",
  warn: "text-amber-400",
  error: "text-red-400",
} as const;

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function AgentActivityLog({ timeline, selectedAgent, onSelectAgent }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [timeline.length]);

  const errorCount = timeline.filter(
    (e) => e.kind === "log" && e.data.level === "error"
  ).length;
  const warnCount = timeline.filter(
    (e) => e.kind === "log" && e.data.level === "warn"
  ).length;

  return (
    <div className="flex flex-col h-full min-h-[420px] rounded-lg border border-gray-200 bg-gray-950 overflow-hidden shadow-inner">
      <div className="px-4 py-2 border-b border-gray-800 bg-gray-900 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
          Swarm Terminal
        </span>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-gray-500">{timeline.length} lines</span>
          {warnCount > 0 && (
            <span className="text-amber-400">{warnCount} warn</span>
          )}
          {errorCount > 0 && (
            <span className="text-red-400">{errorCount} err</span>
          )}
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed space-y-0.5"
      >
        {timeline.length === 0 && (
          <p className="text-gray-500 italic">Waiting for swarm stream…</p>
        )}
        {timeline.map((entry, i) => {
          if (entry.kind === "status") {
            const event = entry.data;
            const label = AGENT_LABELS[event.agent];
            const isSelected = selectedAgent === event.agent;

            return (
              <button
                key={`status-${event.agent}-${event.status}-${entry.timestamp}-${i}`}
                type="button"
                onClick={() => onSelectAgent(event.agent)}
                className={cn(
                  "w-full text-left rounded px-1 py-0.5 hover:bg-gray-900/80",
                  isSelected && "bg-gray-900 ring-1 ring-blue-500/30",
                  event.status === "running" && "animate-pulse"
                )}
              >
                <span className="text-gray-600">[{formatTime(entry.timestamp)}]</span>{" "}
                <span className={statusColor[event.status]}>
                  {statusIcon[event.status]}
                </span>{" "}
                <span className="text-gray-400">{label}</span>{" "}
                <span className="text-gray-500">→ {event.status}</span>
                {event.summary && event.status === "done" && (
                  <span className="text-green-400/90"> · {event.summary}</span>
                )}
                {event.error && (
                  <span className="block pl-4 text-red-400 mt-0.5">{event.error}</span>
                )}
              </button>
            );
          }

          const log = entry.data;
          const isSelected = selectedAgent === log.agent;

          return (
            <button
              key={`log-${log.agent}-${log.level}-${entry.timestamp}-${i}`}
              type="button"
              onClick={() => onSelectAgent(log.agent)}
              className={cn(
                "w-full text-left rounded px-1 py-0.5 hover:bg-gray-900/80",
                isSelected && "bg-gray-900 ring-1 ring-blue-500/30"
              )}
            >
              <span className="text-gray-600">[{formatTime(entry.timestamp)}]</span>{" "}
              <span className={logLevelColor[log.level]}>{logLevelLabel[log.level]}</span>{" "}
              <span className="text-gray-500">{AGENT_LABELS[log.agent]}</span>{" "}
              <span className="text-gray-200">{log.message}</span>
              {log.detail && (
                <span
                  className={cn(
                    "block pl-4 mt-0.5 break-all",
                    log.level === "error"
                      ? "text-red-300/90"
                      : log.level === "warn"
                        ? "text-amber-300/80"
                        : "text-gray-500"
                  )}
                >
                  ↳ {log.detail}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
