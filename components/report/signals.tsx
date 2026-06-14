import type { BuyingSignal } from "@/types/gtm";

type Props = {
  signals: BuyingSignal[];
  intentIndicators: string[];
};

export function SignalsReportSection({ signals, intentIndicators }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Buying Signals</h2>
      <div className="grid gap-3">
        {signals.map((s, i) => (
          <div key={i} className="p-4 border border-neutral-800 bg-neutral-900/30 rounded-lg flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold uppercase text-neutral-400 tracking-wide">
                {s.signal_type}
              </span>
              <p className="text-sm text-neutral-300 mt-1">{s.description}</p>
              {s.source && (
                <p className="text-xs text-neutral-500 mt-1">Source: {s.source}</p>
              )}
            </div>
            <span
              className={`text-xs px-2 py-1 rounded border capitalize ${
                s.urgency === "high"
                  ? "bg-red-950/40 text-red-400 border-red-900/50"
                  : s.urgency === "medium"
                    ? "bg-amber-950/40 text-amber-400 border-amber-900/50"
                    : "bg-neutral-800 text-neutral-400 border-neutral-700"
              }`}
            >
              {s.urgency}
            </span>
          </div>
        ))}
      </div>
      {intentIndicators.length > 0 && (
        <div>
          <h3 className="font-medium text-neutral-200 mb-2">Intent Indicators</h3>
          <ul className="list-disc list-inside text-sm text-neutral-300 space-y-1">
            {intentIndicators.map((ind) => (
              <li key={ind}>{ind}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
