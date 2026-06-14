"use client";

import { useState } from "react";
import type { OutreachStrategy } from "@/types/gtm";
import { Button } from "@/components/ui/button";

type Props = {
  strategies: OutreachStrategy[];
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="default"
      className="h-7 px-2 text-xs"
      onClick={handleCopy}
    >
      {copied ? "Copied!" : `Copy ${label}`}
    </Button>
  );
}

export function OutreachReportSection({ strategies }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Outreach Strategies</h2>
      {strategies.map((s) => (
        <div key={s.company_name} className="p-4 border border-neutral-800 bg-neutral-900/30 rounded-lg space-y-3">
          <h3 className="font-medium text-white">{s.company_name}</h3>
          <p className="text-sm text-neutral-300">
            <span className="font-medium text-neutral-400">Angle:</span> {s.outreach_angle}
          </p>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded">
              <p className="font-semibold text-blue-400">Why Now</p>
              <p className="text-neutral-300 mt-1">{s.why_now}</p>
            </div>
            <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded">
              <p className="font-semibold text-emerald-400">Why Them</p>
              <p className="text-neutral-300 mt-1">{s.why_them}</p>
            </div>
          </div>
          <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-neutral-300">Email Draft</p>
              <CopyButton text={s.email_draft} label="email" />
            </div>
            <p className="text-neutral-400 mt-2 whitespace-pre-wrap border-t border-neutral-800/50 pt-2 leading-relaxed">{s.email_draft}</p>
          </div>
          <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded text-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-neutral-300">LinkedIn Draft</p>
              <CopyButton text={s.linkedin_draft} label="LinkedIn" />
            </div>
            <p className="text-neutral-400 mt-2 whitespace-pre-wrap border-t border-neutral-800/50 pt-2 leading-relaxed">{s.linkedin_draft}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
