import type { ICP, Persona } from "@/types/gtm";

type Props = {
  icps: ICP[];
  personas: Persona[];
  targetIndustries: string[];
  valueProposition: string;
};

export function ICPReportSection({
  icps,
  personas,
  targetIndustries,
  valueProposition,
}: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Ideal Customer Profiles</h2>
      <p className="text-gray-600">{valueProposition}</p>
      <div className="flex flex-wrap gap-2">
        {targetIndustries.map((ind) => (
          <span
            key={ind}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
          >
            {ind}
          </span>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {icps.map((icp) => (
          <div key={icp.name} className="p-4 border rounded-lg">
            <h3 className="font-medium">{icp.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{icp.description}</p>
            <p className="text-xs text-gray-500 mt-2">Size: {icp.company_size}</p>
            {icp.pain_points.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Pain Points</p>
                <ul className="mt-1 text-sm list-disc list-inside text-gray-600">
                  {icp.pain_points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {personas.map((p) => (
          <div key={p.title} className="p-4 border rounded-lg bg-gray-50 space-y-2">
            <h3 className="font-medium">{p.title}</h3>
            {p.responsibilities.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Responsibilities</p>
                <p className="text-sm text-gray-600 mt-0.5">{p.responsibilities.join(", ")}</p>
              </div>
            )}
            {p.goals.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Goals</p>
                <p className="text-sm text-gray-600 mt-0.5">{p.goals.join(", ")}</p>
              </div>
            )}
            {p.challenges.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Challenges</p>
                <ul className="mt-0.5 text-sm list-disc list-inside text-gray-600">
                  {p.challenges.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
