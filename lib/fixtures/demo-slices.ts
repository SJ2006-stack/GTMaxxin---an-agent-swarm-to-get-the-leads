import type { GTMReportState } from "@/lib/agents/state";

export const FIXTURE_GTM_STRATEGY = {
  icps: [
    {
      name: "Mid-Market SaaS Sales Leaders",
      description: "VP Sales / CRO at Series A-C B2B SaaS companies",
      industries: ["SaaS", "FinTech", "MarTech"],
      company_size: "50-500 employees",
      pain_points: [
        "Manual prospect research takes 10+ hours/week",
        "Low reply rates on cold outreach",
        "Difficulty identifying buying signals",
      ],
    },
    {
      name: "Revenue Operations Teams",
      description: "RevOps leaders optimizing GTM efficiency",
      industries: ["SaaS", "Enterprise Software"],
      company_size: "100-1000 employees",
      pain_points: [
        "Fragmented sales intelligence tools",
        "Poor ICP definition leading to wasted pipeline",
      ],
    },
  ],
  personas: [
    {
      title: "VP of Sales",
      responsibilities: ["Pipeline generation", "Team quota attainment", "GTM strategy"],
      goals: ["Increase qualified pipeline", "Reduce CAC", "Improve win rates"],
      challenges: ["Limited SDR bandwidth", "Generic outreach", "Stale prospect data"],
    },
    {
      title: "Head of Revenue Operations",
      responsibilities: ["Sales process optimization", "Tool stack management", "Forecasting"],
      goals: ["Data-driven GTM", "Process automation", "Better lead scoring"],
      challenges: ["Tool sprawl", "Manual data enrichment", "Poor signal detection"],
    },
  ],
  target_industries: ["SaaS", "FinTech", "MarTech", "HR Tech", "DevTools"],
  value_proposition:
    "Automate the entire GTM discovery process — from ICP definition to personalized outreach — in minutes instead of weeks.",
};

export const FIXTURE_MARKET_MAP = {
  primary_markets: [
    {
      name: "B2B SaaS Sales Teams",
      description: "Companies with dedicated outbound sales motion",
      opportunity_size: "large" as const,
      rationale: "Direct product-market fit with highest willingness to pay",
    },
    {
      name: "Revenue Operations",
      description: "Teams managing GTM tech stack and processes",
      opportunity_size: "large" as const,
      rationale: "Natural buyers for automation and intelligence tools",
    },
  ],
  secondary_markets: [
    {
      name: "Sales Development Agencies",
      description: "Outsourced SDR firms serving multiple clients",
      opportunity_size: "medium" as const,
      rationale: "Need scalable prospect research for multiple ICPs",
    },
  ],
  adjacent_markets: [
    {
      name: "Marketing Agencies",
      description: "Agencies running ABM campaigns for clients",
      opportunity_size: "medium" as const,
      rationale: "Overlap in account research and intent data needs",
    },
  ],
};

export const FIXTURE_SIGNALS = {
  market_signals: [
    {
      signal_type: "Funding",
      description: "Series B raise of $25M to expand sales team",
      urgency: "high" as const,
      source: "Crunchbase",
    },
    {
      signal_type: "Hiring",
      description: "Posted 5 SDR roles in last 30 days",
      urgency: "high" as const,
      source: "LinkedIn Jobs",
    },
    {
      signal_type: "Expansion",
      description: "Opening EMEA office — need local prospecting",
      urgency: "medium" as const,
    },
    {
      signal_type: "Product Launch",
      description: "New enterprise tier launched — upsell motion needed",
      urgency: "medium" as const,
    },
    {
      signal_type: "Leadership Change",
      description: "New CRO hired from competitor",
      urgency: "high" as const,
    },
  ],
  intent_indicators: [
    "Increased job postings for sales roles",
    "Recent CRM migration (Salesforce → HubSpot)",
    "Competitor tool contract expiring Q2",
  ],
};

export const FIXTURE_PROSPECTS = {
  prospects: [
    {
      company_name: "DataFlow Analytics",
      website: "https://dataflow.io",
      industry: "SaaS / Analytics",
      fit_score: 92,
      match_rationale: "Series B SaaS with growing SDR team, perfect ICP match",
      icp_match: "Mid-Market SaaS Sales Leaders",
    },
    {
      company_name: "CloudSecure Inc",
      website: "https://cloudsecure.com",
      industry: "Cybersecurity SaaS",
      fit_score: 87,
      match_rationale: "Expanding sales org, recent funding round",
      icp_match: "Mid-Market SaaS Sales Leaders",
    },
    {
      company_name: "PayStream",
      website: "https://paystream.io",
      industry: "FinTech",
      fit_score: 85,
      match_rationale: "RevOps-led GTM, actively hiring SDRs",
      icp_match: "Revenue Operations Teams",
    },
    {
      company_name: "TalentHub",
      website: "https://talenthub.com",
      industry: "HR Tech",
      fit_score: 78,
      match_rationale: "New CRO, rebuilding outbound motion",
      icp_match: "Mid-Market SaaS Sales Leaders",
    },
    {
      company_name: "DevOps Pro",
      website: "https://devopspro.io",
      industry: "DevTools",
      fit_score: 75,
      match_rationale: "Product-led growth adding sales team",
      icp_match: "Mid-Market SaaS Sales Leaders",
    },
  ],
};

export const FIXTURE_DECISION_MAKERS = {
  decision_makers: [
    {
      company_name: "DataFlow Analytics",
      role: "Economic Buyer",
      title: "VP of Sales",
      relevance: "Owns pipeline targets and tool budget",
      recommended_approach: "Lead with ROI on SDR productivity gains",
    },
    {
      company_name: "CloudSecure Inc",
      role: "Champion",
      title: "Head of Revenue Operations",
      relevance: "Evaluates and implements sales tools",
      recommended_approach: "Demo automation capabilities and integrations",
    },
    {
      company_name: "PayStream",
      role: "Economic Buyer",
      title: "CRO",
      relevance: "Final decision on GTM investments",
      recommended_approach: "Reference similar FinTech wins",
    },
    {
      company_name: "TalentHub",
      role: "Champion",
      title: "Director of Sales Development",
      relevance: "Daily user, strong influence on tool selection",
      recommended_approach: "Free pilot with their top 50 accounts",
    },
    {
      company_name: "DevOps Pro",
      role: "Influencer",
      title: "Founder & CEO",
      relevance: "Building first sales team, hands-on buyer",
      recommended_approach: "Founder-to-founder outreach on GTM efficiency",
    },
  ],
};

export const FIXTURE_OPPORTUNITIES = {
  ranked_opportunities: [
    {
      company_name: "DataFlow Analytics",
      fit_score: 92,
      intent_score: 88,
      timing_score: 95,
      accessibility_score: 80,
      overall_score: 89,
      priority: "high" as const,
      rationale: "Series B + 5 SDR hires + new CRO = perfect timing",
    },
    {
      company_name: "CloudSecure Inc",
      fit_score: 87,
      intent_score: 82,
      timing_score: 85,
      accessibility_score: 75,
      overall_score: 82,
      priority: "high" as const,
      rationale: "RevOps champion identified, active evaluation window",
    },
    {
      company_name: "PayStream",
      fit_score: 85,
      intent_score: 78,
      timing_score: 80,
      accessibility_score: 70,
      overall_score: 78,
      priority: "medium" as const,
      rationale: "Strong fit but longer sales cycle expected",
    },
    {
      company_name: "TalentHub",
      fit_score: 78,
      intent_score: 90,
      timing_score: 88,
      accessibility_score: 85,
      overall_score: 85,
      priority: "high" as const,
      rationale: "New CRO rebuilding stack — first-mover advantage",
    },
    {
      company_name: "DevOps Pro",
      fit_score: 75,
      intent_score: 70,
      timing_score: 72,
      accessibility_score: 90,
      overall_score: 77,
      priority: "medium" as const,
      rationale: "Accessible founder but smaller deal size",
    },
  ],
};

export const FIXTURE_OUTREACH = {
  outreach_strategies: [
    {
      company_name: "DataFlow Analytics",
      outreach_angle: "SDR productivity multiplier after Series B",
      why_now: "Just raised $25M and hiring 5 SDRs — need prospecting infrastructure now",
      why_them: "Analytics SaaS with complex ICP — our AI agents excel at multi-segment research",
      email_draft:
        "Hi [VP Sales], congrats on the Series B! With 5 new SDR roles open, I imagine prospect research is becoming a bottleneck. We help SaaS teams like DataFlow automate ICP-to-outreach in minutes. Worth a 15-min look?",
      linkedin_draft:
        "Saw DataFlow's Series B news — exciting growth! Curious how you're scaling prospect research with the new SDR hires. We've helped similar analytics SaaS teams 3x their qualified pipeline. Happy to share what's working.",
    },
    {
      company_name: "TalentHub",
      outreach_angle: "New CRO stack rebuild opportunity",
      why_now: "New CRO typically evaluates entire GTM stack in first 90 days",
      why_them: "HR Tech with outbound motion rebuild — perfect for our GTM intelligence platform",
      email_draft:
        "Hi [CRO], welcome to TalentHub! As you rebuild the outbound motion, our AI agents can generate a complete GTM report — ICPs, signals, prospects, outreach — in under 3 minutes. Want to see it run on TalentHub's market?",
      linkedin_draft:
        "Congrats on the CRO role at TalentHub! Rebuilding outbound? We automate the entire GTM discovery process with AI agents. Happy to generate a free intelligence report for your top accounts.",
    },
  ],
};

export function buildFixtureReport(state: GTMReportState) {
  return {
    summary:
      "Complete GTM intelligence report for B2B SaaS sales intelligence startup. Identified 2 ICPs, 5 high-fit prospects, and prioritized outreach strategies.",
    icps: state.gtm_strategy?.icps ?? FIXTURE_GTM_STRATEGY.icps,
    personas: state.gtm_strategy?.personas ?? FIXTURE_GTM_STRATEGY.personas,
    target_industries:
      state.gtm_strategy?.target_industries ?? FIXTURE_GTM_STRATEGY.target_industries,
    value_proposition:
      state.gtm_strategy?.value_proposition ?? FIXTURE_GTM_STRATEGY.value_proposition,
    primary_markets: state.market_map?.primary_markets ?? FIXTURE_MARKET_MAP.primary_markets,
    secondary_markets:
      state.market_map?.secondary_markets ?? FIXTURE_MARKET_MAP.secondary_markets,
    adjacent_markets: state.market_map?.adjacent_markets ?? FIXTURE_MARKET_MAP.adjacent_markets,
    market_signals: state.signals?.market_signals ?? FIXTURE_SIGNALS.market_signals,
    intent_indicators: state.signals?.intent_indicators ?? FIXTURE_SIGNALS.intent_indicators,
    prospects: state.prospects?.prospects ?? FIXTURE_PROSPECTS.prospects,
    decision_makers:
      state.decision_makers?.decision_makers ?? FIXTURE_DECISION_MAKERS.decision_makers,
    ranked_opportunities:
      state.opportunities?.ranked_opportunities ?? FIXTURE_OPPORTUNITIES.ranked_opportunities,
    outreach_strategies:
      state.outreach?.outreach_strategies ?? FIXTURE_OUTREACH.outreach_strategies,
    generated_at: new Date().toISOString(),
  };
}
