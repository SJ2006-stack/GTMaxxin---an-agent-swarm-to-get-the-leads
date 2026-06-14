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
  pending: "text-neutral-400 font-bold",
  running: "text-blue-600 font-black",
  done: "text-black font-black",
  error: "text-red-600 font-black",
} as const;

const logLevelLabel = {
  step: "STEP",
  info: "INFO",
  warn: "WARN",
  error: "ERR ",
} as const;

const logLevelColor = {
  step: "text-blue-600 font-black",
  info: "text-neutral-500 font-bold",
  warn: "text-amber-600 font-black",
  error: "text-red-600 font-black",
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
    <div className="flex flex-col h-full min-h-[420px] border-4 border-black bg-white overflow-hidden brutalist-shadow">
      <div className="px-4 py-3 border-b-4 border-black bg-white flex items-center justify-between gap-2">
        <h2 className="text-sm font-display font-black text-black uppercase tracking-tight">
          Swarm Terminal
        </h2>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-black">
          <span className="text-neutral-500">{timeline.length} lines</span>
          {warnCount > 0 && (
            <span className="bg-[#FCD116] border-2 border-black px-1.5 py-0.5 text-black">{warnCount} warn</span>
          )}
          {errorCount > 0 && (
            <span className="bg-red-500 border-2 border-black px-1.5 py-0.5 text-white">{errorCount} err</span>
          )}
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-sans text-xs leading-relaxed space-y-1 bg-white"
      >
        {timeline.length === 0 && (
          <p className="text-neutral-400 italic">Waiting for swarm stream…</p>
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
                  "w-full text-left rounded-none px-2 py-1.5 hover:bg-neutral-100 transition-colors border border-transparent",
                  isSelected
                    ? "bg-[#FCD116]/20 border-black font-bold"
                    : "text-[#0A0A0A]",
                  event.status === "running" && "animate-pulse"
                )}
              >
                <span className="text-neutral-400">[{formatTime(entry.timestamp)}]</span>{" "}
                <span className={statusColor[event.status]}>
                  {statusIcon[event.status]}
                </span>{" "}
                <span className="text-neutral-700 font-bold">{label}</span>{" "}
                <span className="text-neutral-500">→ {event.status}</span>
                {event.summary && event.status === "done" && (
                  <span className="text-black font-bold"> · {event.summary}</span>
                )}
                {event.error && (
                  <span className="block pl-4 text-red-600 font-bold mt-0.5">{event.error}</span>
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
                "w-full text-left rounded-none px-2 py-1.5 hover:bg-neutral-100 transition-colors border border-transparent",
                isSelected
                  ? "bg-[#FCD116]/20 border-black font-bold"
                  : "text-[#0A0A0A]"
              )}
            >
              <span className="text-neutral-400">[{formatTime(entry.timestamp)}]</span>{" "}
              <span className={logLevelColor[log.level]}>{logLevelLabel[log.level]}</span>{" "}
              <span className="text-neutral-700 font-bold">{AGENT_LABELS[log.agent]}</span>{" "}
              <span className="text-black">{log.message}</span>
              {log.detail && (
                <span
                  className={cn(
                    "block pl-4 mt-0.5 break-all text-xs",
                    log.level === "error"
                      ? "text-red-700 font-bold"
                      : log.level === "warn"
                        ? "text-amber-700 font-bold"
                        : "text-neutral-500"
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
