import type { BuyingSignal } from "@/types/gtm";

type Props = {
  signals: BuyingSignal[];
  intentIndicators: string[];
};

export function SignalsReportSection({ signals, intentIndicators }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Buying Signals</h2>
      <div className="grid gap-3">
        {signals.map((s, i) => (
          <div key={i} className="p-4 border rounded-lg flex justify-between items-start">
            <div>
              <span className="text-xs font-medium uppercase text-gray-500">
                {s.signal_type}
              </span>
              <p className="text-sm mt-1">{s.description}</p>
              {s.source && (
                <p className="text-xs text-gray-400 mt-1">Source: {s.source}</p>
              )}
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                s.urgency === "high"
                  ? "bg-red-100 text-red-700"
                  : s.urgency === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {s.urgency}
            </span>
          </div>
        ))}
      </div>
      {intentIndicators.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Intent Indicators</h3>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {intentIndicators.map((ind) => (
              <li key={ind}>{ind}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
