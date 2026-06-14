import type { MarketSegment } from "@/types/gtm";

type Props = {
  primaryMarkets: MarketSegment[];
  secondaryMarkets: MarketSegment[];
  adjacentMarkets: MarketSegment[];
};

function opportunityBadgeClass(size: MarketSegment["opportunity_size"]) {
  switch (size) {
    case "large":
      return "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50";
    case "medium":
      return "bg-amber-950/40 text-amber-400 border border-amber-900/50";
    case "small":
      return "bg-neutral-800 text-neutral-400 border border-neutral-700";
  }
}

function MarketGroup({
  title,
  markets,
}: {
  title: string;
  markets: MarketSegment[];
}) {
  if (markets.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-neutral-300">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {markets.map((market) => (
          <div
            key={market.name}
            className="p-4 border border-neutral-800 bg-neutral-900/30 rounded-lg flex justify-between items-start gap-3"
          >
            <div className="min-w-0">
              <h4 className="font-medium text-white">{market.name}</h4>
              <p className="text-sm text-neutral-400 mt-1">{market.description}</p>
              <p className="text-xs text-neutral-500 mt-2">{market.rationale}</p>
            </div>
            <span
              className={`shrink-0 text-xs px-2 py-1 rounded border capitalize ${opportunityBadgeClass(market.opportunity_size)}`}
            >
              {market.opportunity_size}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarketsReportSection({
  primaryMarkets,
  secondaryMarkets,
  adjacentMarkets,
}: Props) {
  const hasMarkets =
    primaryMarkets.length > 0 ||
    secondaryMarkets.length > 0 ||
    adjacentMarkets.length > 0;

  if (!hasMarkets) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Market Segments</h2>
      <MarketGroup title="Primary Markets" markets={primaryMarkets} />
      <MarketGroup title="Secondary Markets" markets={secondaryMarkets} />
      <MarketGroup title="Adjacent Markets" markets={adjacentMarkets} />
    </section>
  );
}
