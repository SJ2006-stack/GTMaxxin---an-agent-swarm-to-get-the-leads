"use client";

import { useState } from "react";
import type { Prospect, OpportunityScore, DecisionMaker } from "@/types/gtm";

type Props = {
  prospects: Prospect[];
  opportunities: OpportunityScore[];
  decisionMakers: DecisionMaker[];
};

function formatWebsiteUrl(website: string): string {
  return website.startsWith("http") ? website : `https://${website}`;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-neutral-400">
        <span>{label}</span>
        <span>{score}%</span>
      </div>
      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function priorityBadgeClass(priority: OpportunityScore["priority"]) {
  if (priority === "high") return "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50";
  if (priority === "medium") return "bg-amber-950/40 text-amber-400 border border-amber-900/50";
  return "bg-neutral-800 text-neutral-400 border border-neutral-700";
}

export function ProspectsReportSection({
  prospects,
  opportunities,
  decisionMakers,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Qualified Prospects</h2>
      <div className="space-y-2">
        {prospects.map((p) => {
          const opp = opportunities.find((o) => o.company_name === p.company_name);
          const dm = decisionMakers.find((d) => d.company_name === p.company_name);
          const isOpen = expanded === p.company_name;

          return (
            <div key={p.company_name} className="border border-neutral-800 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setExpanded(isOpen ? null : p.company_name)
                }
                className="w-full text-left px-4 py-3 hover:bg-neutral-900/40 transition-colors"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="font-semibold text-white">{p.company_name}</span>
                  <span className="text-neutral-400">{p.industry}</span>
                  {p.website && (
                    <a
                      href={formatWebsiteUrl(p.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                      {p.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  <span className="text-neutral-300">Fit {p.fit_score}%</span>
                  {opp && (
                    <span
                      className={`px-2 py-0.5 rounded border text-xs ${priorityBadgeClass(opp.priority)}`}
                    >
                      {opp.priority} ({opp.overall_score})
                    </span>
                  )}
                  {dm && (
                    <span className="text-neutral-400 truncate max-w-[200px]">
                      {dm.title}
                    </span>
                  )}
                  <span className="ml-auto text-neutral-500 text-xs">
                    {isOpen ? "▲ Hide" : "▼ Details"}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-3 border-t border-neutral-800 bg-neutral-900/30 space-y-4 text-sm">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                        ICP Match
                      </p>
                      <p className="text-neutral-300 leading-relaxed">{p.icp_match}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                        Match Rationale
                      </p>
                      <p className="text-neutral-300 leading-relaxed">{p.match_rationale}</p>
                    </div>
                  </div>

                  {opp && (
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                          Opportunity Score
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded border text-xs ${priorityBadgeClass(opp.priority)}`}
                        >
                          {opp.priority} priority · {opp.overall_score} overall
                        </span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <ScoreBar label="Fit" score={opp.fit_score} />
                        <ScoreBar label="Intent" score={opp.intent_score} />
                        <ScoreBar label="Timing" score={opp.timing_score} />
                        <ScoreBar label="Accessibility" score={opp.accessibility_score} />
                      </div>
                      <p className="text-neutral-400 text-xs mt-1">{opp.rationale}</p>
                    </div>
                  )}

                  {dm && (
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-2">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                        Decision Maker
                      </p>
                      <p className="font-semibold text-white">{dm.title}</p>
                      <p className="text-neutral-300">
                        <span className="font-medium text-neutral-400">Role:</span> {dm.role}
                      </p>
                      <p className="text-neutral-300">
                        <span className="font-medium text-neutral-400">Relevance:</span>{" "}
                        {dm.relevance}
                      </p>
                      <p className="text-neutral-300">
                        <span className="font-medium text-neutral-400">Approach:</span>{" "}
                        {dm.recommended_approach}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
