import { createInitialAgentStatuses } from "@/types/agents";
import type { GTMInput, GTMReport } from "@/types/gtm";
import type { GTMReportState, ResearchEvidence } from "@/swarm/state";

/**
 * Pre-baked demo datasets.
 *
 * Free / low-cost LLMs are too slow (and too noisy) for a live demo, so for the
 * three showcase companies ΓÇö Microsoft, Apple, SpaceX ΓÇö we ship a complete,
 * schema-valid set of agent outputs. The demo replay runner streams these
 * through every agent node so the swarm still animates, but the result is
 * instant and deterministic. No API keys required.
 */
export type DemoCompany = {
  id: "microsoft" | "apple" | "spacex";
  label: string;
  tagline: string;
  matchKeywords: string[];
  input: GTMInput;
  website_content: string;
  gtm_strategy: NonNullable<GTMReportState["gtm_strategy"]>;
  market_map: NonNullable<GTMReportState["market_map"]>;
  signals: NonNullable<GTMReportState["signals"]>;
  signal_evidence: ResearchEvidence;
  prospects: NonNullable<GTMReportState["prospects"]>;
  prospect_evidence: ResearchEvidence;
  decision_makers: NonNullable<GTMReportState["decision_makers"]>;
  opportunities: NonNullable<GTMReportState["opportunities"]>;
  outreach: NonNullable<GTMReportState["outreach"]>;
  summary: string;
};

const MICROSOFT: DemoCompany = {
  id: "microsoft",
  label: "Microsoft",
  tagline: "Azure + Copilot ┬╖ enterprise cloud & AI",
  matchKeywords: ["microsoft", "msft", "azure", "copilot"],
  input: {
    company: "Microsoft",
    product:
      "Microsoft Azure cloud platform and Microsoft Copilot AI assistant ΓÇö cloud migration, a unified data estate (Microsoft Fabric), and org-wide generative AI productivity for the enterprise",
    url: "https://azure.microsoft.com",
  },
  website_content: `Microsoft Azure & Copilot for the Enterprise
The trusted cloud to migrate workloads, unify your data estate, and bring secure
generative AI to every employee. Azure delivers global scale, security, and
compliance; Microsoft Fabric unifies analytics; and Copilot puts AI into Microsoft
365, GitHub, and line-of-business apps. Outcomes: lower infrastructure TCO, faster
modernization, and measurable AI productivity gains.`,
  gtm_strategy: {
    icps: [
      {
        name: "Cloud-Modernizing Enterprises",
        description:
          "Global 2000 enterprises migrating legacy on-prem and competitor-cloud workloads to public cloud",
        industries: ["Financial Services", "Manufacturing", "Retail"],
        company_size: "5,000+ employees",
        pain_points: [
          "Aging on-prem data centers with rising maintenance cost",
          "Fragmented data estate blocking enterprise AI",
          "Pressure to cut IT opex while scaling capacity",
        ],
      },
      {
        name: "AI-First Productivity Buyers",
        description:
          "Enterprises rolling out generative AI to knowledge workers with governance and measurable ROI",
        industries: ["Professional Services", "Technology", "Healthcare"],
        company_size: "1,000-50,000 employees",
        pain_points: [
          "Knowledge workers losing hours to repetitive manual tasks",
          "Shadow AI and data-governance risk",
          "Hard to prove ROI from early AI pilots",
        ],
      },
      {
        name: "Regulated Cloud Adopters",
        description:
          "Highly regulated organizations needing compliant, sovereign-grade cloud",
        industries: ["Banking", "Healthcare", "Public Sector"],
        company_size: "10,000+ employees",
        pain_points: [
          "Strict data residency and compliance requirements",
          "Legacy systems that are hard to certify",
          "Security and sovereignty concerns with public cloud",
        ],
      },
    ],
    personas: [
      {
        title: "Chief Information Officer",
        responsibilities: ["IT strategy", "Cloud & infrastructure roadmap", "Vendor consolidation"],
        goals: ["Reduce total cost of ownership", "Accelerate cloud migration", "Enable enterprise AI safely"],
        challenges: ["Legacy tech debt", "Cloud skills gaps", "Budget scrutiny"],
      },
      {
        title: "Chief Data & AI Officer",
        responsibilities: ["Data platform strategy", "AI governance", "Analytics enablement"],
        goals: ["Operationalize AI responsibly", "Unify the data estate", "Drive measurable AI ROI"],
        challenges: ["Data silos", "Model governance", "Scarce AI talent"],
      },
      {
        title: "VP of IT Infrastructure",
        responsibilities: ["Datacenter & cloud operations", "Reliability & security", "Migration execution"],
        goals: ["Improve uptime", "Cut infrastructure cost", "Modernize core workloads"],
        challenges: ["Migration risk", "Tooling sprawl", "24/7 reliability demands"],
      },
    ],
    target_industries: [
      "Financial Services",
      "Manufacturing",
      "Retail",
      "Healthcare",
      "Public Sector",
      "Professional Services",
    ],
    value_proposition:
      "Azure + Copilot give enterprises one trusted platform to migrate workloads, unify their data estate, and put secure generative AI in the hands of every employee ΓÇö cutting infrastructure cost while accelerating innovation.",
  },
  market_map: {
    primary_markets: [
      {
        name: "Cloud Migration & Modernization",
        description: "Enterprises moving on-prem and competitor-cloud workloads to Azure",
        opportunity_size: "large",
        rationale: "Largest spend pool with strong displacement opportunity against legacy infrastructure",
      },
      {
        name: "Enterprise Generative AI (Copilot)",
        description: "Org-wide rollout of AI productivity across Microsoft 365 and line-of-business apps",
        opportunity_size: "large",
        rationale: "Fastest-growing demand with high seat-based expansion potential",
      },
    ],
    secondary_markets: [
      {
        name: "Data & Analytics (Microsoft Fabric)",
        description: "Unified analytics, data warehousing, and real-time intelligence",
        opportunity_size: "medium",
        rationale: "Pulls through compute, storage, and AI consumption across the estate",
      },
    ],
    adjacent_markets: [
      {
        name: "Industry & Sovereign Cloud",
        description: "Compliant vertical and government cloud offerings",
        opportunity_size: "medium",
        rationale: "Unlocks regulated accounts that competitors struggle to serve",
      },
      {
        name: "Developer Platform (GitHub + Azure)",
        description: "AI-assisted software delivery for engineering organizations",
        opportunity_size: "medium",
        rationale: "Expands footprint with developer orgs and drives Azure consumption",
      },
    ],
  },
  signals: {
    market_signals: [
      {
        signal_type: "Cloud Migration Mandate",
        description: "Multiple Global 2000 firms set multi-year public-cloud migration targets for 2026",
        urgency: "high",
        source: "Gartner",
        citations: [
          {
            url: "https://www.gartner.com/en/newsroom",
            title: "Gartner Forecasts Worldwide Public Cloud Spending to Grow",
            snippet: "Enterprises are accelerating migration of mission-critical workloads to public cloud...",
          },
        ],
      },
      {
        signal_type: "Generative AI Budget Expansion",
        description: "Enterprises increasing 2026 budgets specifically for generative AI deployments",
        urgency: "high",
        source: "IDC",
        citations: [
          {
            url: "https://www.idc.com/getdoc.jsp",
            title: "IDC Worldwide AI and Generative AI Spending Guide",
            snippet: "Generative AI spending is forecast to grow at a rapid CAGR through 2027...",
          },
        ],
      },
      {
        signal_type: "Datacenter Lease Expiration",
        description: "A wave of enterprise datacenter contracts expiring is driving cloud exits",
        urgency: "medium",
        source: "CBRE",
        citations: [
          {
            url: "https://www.cbre.com/insights",
            title: "Data Center Trends Report",
            snippet: "Expiring on-prem and colocation contracts are accelerating cloud migration decisions...",
          },
        ],
      },
      {
        signal_type: "Compliance / Sovereignty Pressure",
        description: "New data-residency regulations push regulated firms toward sovereign cloud",
        urgency: "medium",
        source: "Reuters",
        citations: [
          {
            url: "https://www.reuters.com/technology/",
            title: "New Data Sovereignty Rules Reshape Enterprise Cloud Choices",
            snippet: "Regulators are tightening data-residency requirements for banks and healthcare...",
          },
        ],
      },
      {
        signal_type: "Leadership Change",
        description: "Newly appointed CIOs at major enterprises typically re-evaluate cloud vendors",
        urgency: "high",
        source: "The Wall Street Journal",
        citations: [
          {
            url: "https://www.wsj.com/tech",
            title: "CIO Transitions Trigger Cloud Vendor Re-Evaluations",
            snippet: "Incoming technology leaders frequently reset platform and vendor strategy...",
          },
        ],
      },
    ],
    intent_indicators: [
      "Spike in job postings for Azure and cloud-migration engineers",
      "RFPs referencing multi-cloud strategy and AI governance",
      "Public C-suite statements committing to an enterprise AI roadmap",
    ],
  },
  signal_evidence: {
    query: "Microsoft Azure Copilot enterprise cloud migration AI adoption buying signals 2026",
    results: [
      {
        title: "Gartner Forecasts Worldwide Public Cloud Spending to Grow",
        url: "https://www.gartner.com/en/newsroom",
        content: "Enterprises are accelerating migration of mission-critical workloads to public cloud platforms...",
      },
      {
        title: "IDC Worldwide AI and Generative AI Spending Guide",
        url: "https://www.idc.com/getdoc.jsp",
        content: "Generative AI spending is forecast to grow at a rapid CAGR as enterprises move from pilots to production...",
      },
    ],
  },
  prospects: {
    prospects: [
      {
        company_name: "Kroger",
        website: "https://www.kroger.com",
        industry: "Retail / Grocery",
        fit_score: 93,
        match_rationale: "National retailer modernizing supply chain and data platform for AI-driven personalization",
        icp_match: "Cloud-Modernizing Enterprises",
        citations: [
          {
            url: "https://www.kroger.com/about",
            title: "Kroger Technology & Digital Strategy",
            snippet: "Kroger is investing in data, analytics, and personalization at national scale...",
          },
        ],
      },
      {
        company_name: "HSBC",
        website: "https://www.hsbc.com",
        industry: "Banking / Financial Services",
        fit_score: 90,
        match_rationale: "Global bank with strict compliance needs migrating toward sovereign-grade cloud",
        icp_match: "Regulated Cloud Adopters",
        citations: [
          {
            url: "https://www.hsbc.com/who-we-are/our-strategy",
            title: "HSBC Technology and Digital Transformation",
            snippet: "HSBC is modernizing core systems while meeting strict regulatory requirements...",
          },
        ],
      },
      {
        company_name: "Siemens",
        website: "https://www.siemens.com",
        industry: "Manufacturing / Industrial",
        fit_score: 88,
        match_rationale: "Industrial leader scaling IoT and AI workloads on cloud across global operations",
        icp_match: "Cloud-Modernizing Enterprises",
        citations: [
          {
            url: "https://www.siemens.com/digital",
            title: "Siemens Digital Industries",
            snippet: "Siemens is expanding industrial IoT and AI initiatives on cloud infrastructure...",
          },
        ],
      },
      {
        company_name: "CVS Health",
        website: "https://www.cvshealth.com",
        industry: "Healthcare",
        fit_score: 86,
        match_rationale: "Healthcare org needing compliant data and AI to improve member experience",
        icp_match: "AI-First Productivity Buyers",
        citations: [
          {
            url: "https://www.cvshealth.com/about-cvs-health",
            title: "CVS Health Digital and Data Strategy",
            snippet: "CVS Health is investing in data platforms and AI for member engagement...",
          },
        ],
      },
      {
        company_name: "Delta Air Lines",
        website: "https://www.delta.com",
        industry: "Airlines / Travel",
        fit_score: 84,
        match_rationale: "Airline modernizing operations and deploying AI to corporate and frontline staff",
        icp_match: "AI-First Productivity Buyers",
        citations: [
          {
            url: "https://www.delta.com/us/en/about-delta/overview",
            title: "Delta Technology and Operations",
            snippet: "Delta is modernizing operational systems and exploring AI to improve reliability...",
          },
        ],
      },
    ],
  },
  prospect_evidence: {
    query: "enterprises migrating to Azure cloud AI 2026 Kroger HSBC Siemens CVS Delta digital transformation",
    results: [
      {
        title: "Enterprise Cloud Migration Case Studies",
        url: "https://www.gartner.com/en/newsroom",
        content: "Large retailers, banks, and manufacturers are standardizing on hyperscale cloud platforms...",
      },
      {
        title: "Healthcare and Airline AI Modernization",
        url: "https://www.idc.com/getdoc.jsp",
        content: "Regulated and operations-heavy enterprises are adopting governed AI to cut costs and improve CX...",
      },
    ],
  },
  decision_makers: {
    decision_makers: [
      {
        company_name: "Kroger",
        role: "Economic Buyer",
        title: "Chief Information Officer",
        relevance: "Owns the cloud and data-platform budget",
        recommended_approach: "Lead with retail supply-chain modernization ROI and Microsoft Fabric data unification",
      },
      {
        company_name: "HSBC",
        role: "Economic Buyer",
        title: "Group Chief Information Officer",
        relevance: "Final authority on cloud vendor selection and compliance",
        recommended_approach: "Anchor on sovereign cloud, security posture, and regulatory track record",
      },
      {
        company_name: "Siemens",
        role: "Champion",
        title: "Chief Digital Officer",
        relevance: "Drives industrial IoT and AI initiatives across business units",
        recommended_approach: "Propose co-innovation on Azure IoT plus Copilot for engineering productivity",
      },
      {
        company_name: "CVS Health",
        role: "Champion",
        title: "VP, Data & AI",
        relevance: "Leads AI governance and enterprise analytics",
        recommended_approach: "Offer a compliant Copilot pilot scoped to member-services workflows",
      },
      {
        company_name: "Delta Air Lines",
        role: "Influencer",
        title: "VP, IT Infrastructure",
        relevance: "Owns migration execution and operational reliability",
        recommended_approach: "Build the reliability and cost case for migrating core operational workloads",
      },
    ],
  },
  opportunities: {
    ranked_opportunities: [
      {
        company_name: "Kroger",
        fit_score: 93,
        intent_score: 85,
        timing_score: 88,
        accessibility_score: 78,
        overall_score: 88,
        priority: "high",
        rationale: "Active modernization mandate plus clear personalization ROI makes this the top priority",
      },
      {
        company_name: "Siemens",
        fit_score: 88,
        intent_score: 82,
        timing_score: 80,
        accessibility_score: 80,
        overall_score: 83,
        priority: "high",
        rationale: "Engaged Chief Digital Officer champion with strong co-innovation appetite",
      },
      {
        company_name: "HSBC",
        fit_score: 90,
        intent_score: 80,
        timing_score: 82,
        accessibility_score: 70,
        overall_score: 82,
        priority: "high",
        rationale: "Strong fit; compliance lengthens the cycle but sovereign cloud is a clear differentiator",
      },
      {
        company_name: "Delta Air Lines",
        fit_score: 84,
        intent_score: 76,
        timing_score: 80,
        accessibility_score: 82,
        overall_score: 80,
        priority: "medium",
        rationale: "Accessible infrastructure owner; deal expands meaningfully after initial migration",
      },
      {
        company_name: "CVS Health",
        fit_score: 86,
        intent_score: 78,
        timing_score: 76,
        accessibility_score: 74,
        overall_score: 79,
        priority: "medium",
        rationale: "Solid fit; procurement and compliance gates extend timing",
      },
    ],
  },
  outreach: {
    outreach_strategies: [
      {
        company_name: "Kroger",
        outreach_angle: "Retail modernization and AI personalization on Azure + Fabric",
        why_now: "National personalization and supply-chain initiatives need a unified data and AI platform now",
        why_them: "Massive first-party data plus a clear modernization mandate make Azure + Fabric a strong fit",
        email_draft:
          "Hi [CIO], as Kroger scales personalization and supply-chain intelligence, the data estate becomes the bottleneck. Azure + Microsoft Fabric unify that estate and bring governed AI to every team. Could we share how similar retailers cut infra cost while accelerating AI? 20 minutes next week?",
        linkedin_draft:
          "Following Kroger's data and personalization push ΓÇö impressive scale. We help national retailers unify their data estate on Azure + Fabric and deploy governed Copilot. Happy to share a relevant retail blueprint.",
      },
      {
        company_name: "Siemens",
        outreach_angle: "Industrial AI co-innovation with Azure IoT + Copilot",
        why_now: "Global industrial AI and IoT initiatives are scaling and need elastic, governed cloud",
        why_them: "Siemens' engineering depth pairs naturally with Azure IoT and Copilot for engineering productivity",
        email_draft:
          "Hi [CDO], your industrial AI roadmap is exactly where Azure IoT and Copilot shine. We'd love to explore a co-innovation pilot that boosts engineering productivity while standardizing your cloud. Open to a short working session?",
        linkedin_draft:
          "Big fan of Siemens' digital industries work. We partner with industrial leaders on Azure IoT + Copilot co-innovation. Would value a quick exchange on your AI productivity goals.",
      },
      {
        company_name: "HSBC",
        outreach_angle: "Sovereign, compliant cloud for global banking",
        why_now: "Tightening data-residency rules make sovereign-grade cloud a board-level priority",
        why_them: "HSBC's compliance bar matches Azure's regulated-industry track record and sovereign options",
        email_draft:
          "Hi [Group CIO], with data-residency requirements tightening, Azure's sovereign and compliance capabilities can de-risk HSBC's modernization. Could we walk through how peer banks meet regulators while accelerating cloud? Happy to bring a compliance-focused architecture.",
        linkedin_draft:
          "Tracking HSBC's modernization and compliance priorities. We support global banks on sovereign, compliant Azure deployments. Glad to share a regulated-cloud reference architecture.",
      },
    ],
  },
  summary:
    "GTM intelligence report for Microsoft (Azure + Copilot). Identified 3 ICPs across cloud modernization, enterprise AI productivity, and regulated cloud, plus 5 high-fit enterprise prospects ΓÇö led by Kroger, Siemens, and HSBC. Prioritized outreach focuses on data-estate unification, industrial AI co-innovation, and sovereign compliant cloud.",
};

const APPLE: DemoCompany = {
  id: "apple",
  label: "Apple",
  tagline: "Apple at Work ┬╖ Mac, iPhone, iPad",
  matchKeywords: ["apple", "apple at work", "apple business manager"],
  input: {
    company: "Apple",
    product:
      "Apple at Work ΓÇö Mac, iPhone, and iPad for the enterprise with Apple Business Manager, employee-choice programs, zero-touch deployment, and built-in security",
    url: "https://www.apple.com/business/",
  },
  website_content: `Apple at Work
Deploy Mac, iPhone, and iPad at scale with zero-touch provisioning through Apple
Business Manager, strong built-in security and privacy, and the experience employees
love. Employee-choice programs improve attraction and retention, while a lower total
cost of ownership and high residual value make the business case. Works with leading
MDM solutions for streamlined management.`,
  gtm_strategy: {
    icps: [
      {
        name: "Employee-Choice Enterprises",
        description:
          "Organizations offering Mac and iPhone choice to attract and retain top talent",
        industries: ["Technology", "Professional Services", "Financial Services"],
        company_size: "1,000-50,000 employees",
        pain_points: [
          "Top talent increasingly expects Apple devices",
          "High management cost and friction of legacy Windows fleets",
          "Security and BYOD complexity across device types",
        ],
      },
      {
        name: "Design & Creative-Led Organizations",
        description: "Media and software firms standardizing on Mac for creative and engineering work",
        industries: ["Media", "Advertising", "Software"],
        company_size: "200-10,000 employees",
        pain_points: [
          "Creative and engineering teams need Mac performance",
          "Cross-device workflow friction slows production",
          "Inconsistent creative hardware standards",
        ],
      },
      {
        name: "Frontline & Field Operations",
        description: "Enterprises equipping frontline staff with iPad and iPhone",
        industries: ["Retail", "Healthcare", "Travel & Hospitality"],
        company_size: "5,000+ employees",
        pain_points: [
          "Paper-based and legacy frontline workflows",
          "Device ruggedness and manageability at scale",
          "Slow onboarding of seasonal and frontline staff",
        ],
      },
    ],
    personas: [
      {
        title: "Chief Information Officer",
        responsibilities: ["Endpoint strategy", "Security & compliance", "IT cost management"],
        goals: ["Lower total cost of ownership", "Strengthen security posture", "Improve employee experience"],
        challenges: ["Mixed-fleet management", "Security at scale", "Budget justification"],
      },
      {
        title: "Head of Digital Employee Experience",
        responsibilities: ["Workplace technology", "Employee productivity", "Device programs"],
        goals: ["Boost employee satisfaction", "Enable choice", "Reduce support tickets"],
        challenges: ["Legacy device friction", "Change management", "Measuring experience ROI"],
      },
      {
        title: "VP of IT Endpoint Management",
        responsibilities: ["Device deployment & MDM", "Lifecycle management", "Support operations"],
        goals: ["Zero-touch deployment", "Reduce provisioning time", "Standardize management"],
        challenges: ["Manual provisioning", "Tooling complexity", "Scaling support"],
      },
    ],
    target_industries: [
      "Technology",
      "Professional Services",
      "Financial Services",
      "Media",
      "Retail",
      "Healthcare",
    ],
    value_proposition:
      "Apple at Work lets enterprises deploy Mac, iPhone, and iPad at scale with zero-touch provisioning, strong built-in security, and the experience employees love ΓÇö improving productivity, retention, and total cost of ownership.",
  },
  market_map: {
    primary_markets: [
      {
        name: "Employee-Choice Mac Programs",
        description: "Enterprise Mac rollouts driven by talent attraction and TCO",
        opportunity_size: "large",
        rationale: "Strong demand among knowledge-worker organizations with proven retention impact",
      },
      {
        name: "Frontline iPad & iPhone Deployments",
        description: "Digitizing frontline and field operations with iPad and iPhone",
        opportunity_size: "large",
        rationale: "High-volume device demand across retail, healthcare, and travel",
      },
    ],
    secondary_markets: [
      {
        name: "Apple Business Manager & MDM Ecosystem",
        description: "Zero-touch deployment and management with leading MDM partners",
        opportunity_size: "medium",
        rationale: "Reduces deployment friction and pulls through device volume",
      },
    ],
    adjacent_markets: [
      {
        name: "Creative & Engineering Workstations",
        description: "High-performance Mac for creative and developer teams",
        opportunity_size: "medium",
        rationale: "Mac performance and silicon advantage win design and engineering orgs",
      },
      {
        name: "Retail Point-of-Sale on iPad",
        description: "iPad-based POS and store associate experiences",
        opportunity_size: "medium",
        rationale: "Expands footprint in store operations and customer experience",
      },
    ],
  },
  signals: {
    market_signals: [
      {
        signal_type: "Device Refresh Cycle",
        description: "Large enterprises entering a device refresh window after return-to-office",
        urgency: "high",
        source: "IDC",
        citations: [
          {
            url: "https://www.idc.com/getdoc.jsp",
            title: "IDC Worldwide Enterprise Device Tracker",
            snippet: "Enterprises are refreshing aging device fleets and evaluating employee-choice programs...",
          },
        ],
      },
      {
        signal_type: "Talent Attraction Initiative",
        description: "Companies adopting device choice to attract and retain engineering talent",
        urgency: "high",
        source: "LinkedIn",
        citations: [
          {
            url: "https://www.linkedin.com/pulse/",
            title: "Why Device Choice Is a Talent Strategy",
            snippet: "Employers increasingly offer Mac and iPhone choice to compete for top talent...",
          },
        ],
      },
      {
        signal_type: "Security Diversification",
        description: "Security incidents pushing IT toward platform diversification and stronger endpoints",
        urgency: "medium",
        source: "Reuters",
        citations: [
          {
            url: "https://www.reuters.com/technology/cybersecurity/",
            title: "Enterprises Rethink Endpoint Security Strategy",
            snippet: "Rising endpoint threats are prompting CISOs to re-evaluate platform mix and security defaults...",
          },
        ],
      },
      {
        signal_type: "Frontline Digitization",
        description: "Retail and healthcare orgs digitizing frontline workflows with mobile devices",
        urgency: "medium",
        source: "Gartner",
        citations: [
          {
            url: "https://www.gartner.com/en/newsroom",
            title: "Frontline Worker Technology Investment Rises",
            snippet: "Organizations are equipping frontline workers with mobile devices and purpose-built apps...",
          },
        ],
      },
      {
        signal_type: "Sustainability Program",
        description: "Sustainability mandates favor high residual-value, long-lifecycle devices",
        urgency: "low",
        source: "Bloomberg",
        citations: [
          {
            url: "https://www.bloomberg.com/green",
            title: "Corporate Sustainability Shapes IT Procurement",
            snippet: "Device lifecycle, repairability, and residual value increasingly influence purchasing...",
          },
        ],
      },
    ],
    intent_indicators: [
      "Internal employee-choice pilot announcements",
      "Job posts requiring Apple device management (Jamf/MDM) skills",
      "RFPs for zero-touch deployment and frontline device programs",
    ],
  },
  signal_evidence: {
    query: "Apple at Work enterprise Mac iPhone iPad employee choice deployment buying signals 2026",
    results: [
      {
        title: "IDC Worldwide Enterprise Device Tracker",
        url: "https://www.idc.com/getdoc.jsp",
        content: "Enterprises are refreshing device fleets and expanding employee-choice programs...",
      },
      {
        title: "Why Device Choice Is a Talent Strategy",
        url: "https://www.linkedin.com/pulse/",
        content: "Offering Mac and iPhone choice has become a measurable lever for talent attraction and retention...",
      },
    ],
  },
  prospects: {
    prospects: [
      {
        company_name: "SAP",
        website: "https://www.sap.com",
        industry: "Enterprise Software",
        fit_score: 92,
        match_rationale: "Large tech employer with an established employee-choice Mac program ready to expand",
        icp_match: "Employee-Choice Enterprises",
        citations: [
          {
            url: "https://www.sap.com/about.html",
            title: "SAP Workplace and Employee Experience",
            snippet: "SAP supports employee device choice across a large global workforce...",
          },
        ],
      },
      {
        company_name: "Deloitte",
        website: "https://www.deloitte.com",
        industry: "Professional Services",
        fit_score: 90,
        match_rationale: "Global professional-services firm with a large Mac and iPhone fleet and refresh cadence",
        icp_match: "Employee-Choice Enterprises",
        citations: [
          {
            url: "https://www2.deloitte.com/us/en.html",
            title: "Deloitte Digital Workplace",
            snippet: "Deloitte equips consultants with mobile-first devices for client work...",
          },
        ],
      },
      {
        company_name: "Marriott International",
        website: "https://www.marriott.com",
        industry: "Travel & Hospitality",
        fit_score: 87,
        match_rationale: "Hospitality leader digitizing frontline associate workflows with iPad and iPhone",
        icp_match: "Frontline & Field Operations",
        citations: [
          {
            url: "https://www.marriott.com/about/culture-and-values.mi",
            title: "Marriott Associate Technology",
            snippet: "Marriott is modernizing on-property associate tools and guest experiences...",
          },
        ],
      },
      {
        company_name: "Capital One",
        website: "https://www.capitalone.com",
        industry: "Financial Services",
        fit_score: 85,
        match_rationale: "Tech-forward bank with strong security needs and an employee-choice culture",
        icp_match: "Employee-Choice Enterprises",
        citations: [
          {
            url: "https://www.capitalone.com/tech/",
            title: "Capital One Technology Culture",
            snippet: "Capital One emphasizes a modern, secure technology workplace...",
          },
        ],
      },
      {
        company_name: "Salesforce",
        website: "https://www.salesforce.com",
        industry: "Technology",
        fit_score: 84,
        match_rationale: "Mac-first engineering culture with appetite to standardize creative and dev hardware",
        icp_match: "Design & Creative-Led Organizations",
        citations: [
          {
            url: "https://www.salesforce.com/company/",
            title: "Salesforce Workplace Technology",
            snippet: "Salesforce invests in employee experience and modern device programs...",
          },
        ],
      },
    ],
  },
  prospect_evidence: {
    query: "enterprise Apple device programs SAP Deloitte Marriott Capital One Salesforce employee choice frontline",
    results: [
      {
        title: "Enterprise Employee-Choice Program Benchmarks",
        url: "https://www.idc.com/getdoc.jsp",
        content: "Leading technology and professional-services firms run mature Mac employee-choice programs...",
      },
      {
        title: "Frontline Mobility in Hospitality and Retail",
        url: "https://www.gartner.com/en/newsroom",
        content: "Hospitality and retail leaders are deploying iPad and iPhone to digitize frontline work...",
      },
    ],
  },
  decision_makers: {
    decision_makers: [
      {
        company_name: "SAP",
        role: "Economic Buyer",
        title: "Chief Information Officer",
        relevance: "Owns endpoint strategy and device program budget",
        recommended_approach: "Quantify TCO and retention gains from expanding the Mac employee-choice program",
      },
      {
        company_name: "Deloitte",
        role: "Champion",
        title: "Head of Digital Workplace",
        relevance: "Drives consultant device experience and refresh decisions",
        recommended_approach: "Offer a zero-touch deployment blueprint for consultant onboarding at scale",
      },
      {
        company_name: "Marriott International",
        role: "Champion",
        title: "VP, Frontline Technology",
        relevance: "Leads on-property associate technology rollouts",
        recommended_approach: "Pilot iPad-based associate workflows in a flagship property cluster",
      },
      {
        company_name: "Capital One",
        role: "Economic Buyer",
        title: "VP, End User Computing",
        relevance: "Owns endpoint security and device standards",
        recommended_approach: "Lead with built-in security, privacy, and managed-device controls",
      },
      {
        company_name: "Salesforce",
        role: "Influencer",
        title: "Director, IT Endpoint Management",
        relevance: "Standardizes engineering and creative hardware",
        recommended_approach: "Showcase Mac silicon performance for engineering and creative workloads",
      },
    ],
  },
  opportunities: {
    ranked_opportunities: [
      {
        company_name: "SAP",
        fit_score: 92,
        intent_score: 86,
        timing_score: 88,
        accessibility_score: 82,
        overall_score: 88,
        priority: "high",
        rationale: "Existing program plus refresh window make expansion the highest-value, fastest path",
      },
      {
        company_name: "Deloitte",
        fit_score: 90,
        intent_score: 84,
        timing_score: 85,
        accessibility_score: 80,
        overall_score: 85,
        priority: "high",
        rationale: "Large fleet with a regular refresh cadence and an engaged digital-workplace champion",
      },
      {
        company_name: "Marriott International",
        fit_score: 87,
        intent_score: 82,
        timing_score: 80,
        accessibility_score: 78,
        overall_score: 82,
        priority: "high",
        rationale: "Active frontline digitization with a clear pilot-to-rollout path",
      },
      {
        company_name: "Capital One",
        fit_score: 85,
        intent_score: 78,
        timing_score: 78,
        accessibility_score: 74,
        overall_score: 79,
        priority: "medium",
        rationale: "Strong fit; security review and procurement extend the cycle",
      },
      {
        company_name: "Salesforce",
        fit_score: 84,
        intent_score: 76,
        timing_score: 76,
        accessibility_score: 80,
        overall_score: 79,
        priority: "medium",
        rationale: "Mac-friendly culture; standardization decision drives timing",
      },
    ],
  },
  outreach: {
    outreach_strategies: [
      {
        company_name: "SAP",
        outreach_angle: "Expand the Mac employee-choice program with measurable TCO and retention gains",
        why_now: "A device refresh window plus talent competition makes program expansion timely",
        why_them: "SAP already runs employee choice and has the scale to realize strong TCO and retention impact",
        email_draft:
          "Hi [CIO], with the refresh cycle approaching, expanding SAP's Mac employee-choice program could lift retention while lowering TCO. We can share benchmarks from peers and a zero-touch deployment plan. Worth a 20-minute review?",
        linkedin_draft:
          "Impressed by SAP's employee-choice approach. We help large tech employers expand Mac programs with clear TCO and retention data. Happy to share relevant benchmarks.",
      },
      {
        company_name: "Deloitte",
        outreach_angle: "Zero-touch device experience for consultant onboarding at scale",
        why_now: "Refresh cadence and onboarding volume make provisioning efficiency a priority",
        why_them: "Deloitte's large, mobile workforce benefits most from zero-touch deployment and a great UX",
        email_draft:
          "Hi [Head of Digital Workplace], onboarding consultants at Deloitte's scale is a perfect fit for zero-touch Apple deployment. We'd love to share a blueprint that cuts provisioning time and tickets. Open to a short session?",
        linkedin_draft:
          "Following Deloitte's digital-workplace work. We help global firms streamline consultant device onboarding with zero-touch Apple deployment. Glad to compare notes.",
      },
      {
        company_name: "Marriott International",
        outreach_angle: "iPad-powered frontline associate workflows",
        why_now: "Frontline digitization initiatives are actively scaling across properties",
        why_them: "Marriott's on-property operations are ideal for iPad-based associate and guest experiences",
        email_draft:
          "Hi [VP Frontline Technology], iPad can modernize associate workflows and guest experiences across Marriott properties. We'd love to scope a flagship pilot with measurable service and efficiency gains. Could we connect?",
        linkedin_draft:
          "Tracking Marriott's frontline modernization. We partner with hospitality leaders on iPad-based associate experiences. Happy to share a pilot framework.",
      },
    ],
  },
  summary:
    "GTM intelligence report for Apple (Apple at Work). Identified 3 ICPs across employee-choice enterprises, creative-led organizations, and frontline operations, plus 5 high-fit prospects led by SAP, Deloitte, and Marriott. Outreach centers on TCO and retention, zero-touch onboarding, and iPad-powered frontline workflows.",
};

const SPACEX: DemoCompany = {
  id: "spacex",
  label: "SpaceX",
  tagline: "Starlink + Starshield ┬╖ global connectivity",
  matchKeywords: ["spacex", "space x", "starlink", "starshield"],
  input: {
    company: "SpaceX",
    product:
      "Starlink high-speed, low-latency satellite connectivity for enterprise, maritime, aviation, and government ΓÇö plus Starshield secure comms and Falcon 9 launch services",
    url: "https://www.starlink.com",
  },
  website_content: `Starlink for Enterprise
High-speed, low-latency internet anywhere on Earth ΓÇö at sea, in the air, and at the
most remote sites. Starlink replaces slow, costly legacy satellite (VSAT) with
enterprise-grade bandwidth, global coverage, and simple deployment. Solutions span
maritime, aviation, energy, mining, and government, with Starshield for secure
government communications.`,
  gtm_strategy: {
    icps: [
      {
        name: "Connectivity-Constrained Operations",
        description: "Maritime, energy, and mining operators needing reliable connectivity at remote sites and at sea",
        industries: ["Maritime", "Energy", "Mining"],
        company_size: "1,000+ employees",
        pain_points: [
          "No reliable connectivity at sea or remote sites",
          "Legacy VSAT is slow and expensive",
          "Crew welfare and IoT/telemetry need real bandwidth",
        ],
      },
      {
        name: "In-Transit Passenger Connectivity",
        description: "Aviation, cruise, and rail operators improving onboard passenger Wi-Fi",
        industries: ["Aviation", "Travel & Hospitality", "Rail"],
        company_size: "5,000+ employees",
        pain_points: [
          "Poor onboard Wi-Fi hurts customer experience",
          "High cost per Mbps with legacy providers",
          "Patchy coverage along routes",
        ],
      },
      {
        name: "Government & Defense Communications",
        description: "Agencies and defense organizations needing resilient, secure connectivity",
        industries: ["Public Sector", "Defense", "Emergency Services"],
        company_size: "Government agencies",
        pain_points: [
          "Need resilient, secure comms in contested or remote areas",
          "Disaster-zone connectivity gaps",
          "Anti-jam and sovereign communication requirements",
        ],
      },
    ],
    personas: [
      {
        title: "Chief Technology Officer",
        responsibilities: ["Connectivity strategy", "Network architecture", "Vendor selection"],
        goals: ["Reliable global connectivity", "Lower cost per Mbps", "Future-proof the network"],
        challenges: ["Coverage gaps", "Legacy contracts", "Integration complexity"],
      },
      {
        title: "VP of Network & Connectivity",
        responsibilities: ["Network operations", "Service reliability", "Capacity planning"],
        goals: ["Improve uptime and bandwidth", "Reduce connectivity cost", "Simplify deployment"],
        challenges: ["High-latency legacy links", "Remote-site logistics", "SLA management"],
      },
      {
        title: "Director of Fleet Operations",
        responsibilities: ["Fleet/asset operations", "Crew & passenger experience", "Telemetry & IoT"],
        goals: ["Connect every vessel/aircraft/site", "Improve crew welfare", "Enable real-time data"],
        challenges: ["Inconsistent coverage", "Costly bandwidth", "Hardware installation at scale"],
      },
    ],
    target_industries: [
      "Maritime",
      "Aviation",
      "Energy",
      "Government",
      "Telecommunications",
      "Travel & Hospitality",
    ],
    value_proposition:
      "Starlink delivers high-speed, low-latency connectivity anywhere on Earth ΓÇö at sea, in the air, and at the most remote sites ΓÇö replacing slow, costly legacy satellite with enterprise-grade bandwidth and global coverage.",
  },
  market_map: {
    primary_markets: [
      {
        name: "Maritime & Offshore Connectivity",
        description: "Connectivity for shipping, cruise, offshore energy, and fishing fleets",
        opportunity_size: "large",
        rationale: "Large fleets with acute connectivity pain and high willingness to replace legacy VSAT",
      },
      {
        name: "Aviation In-Flight Connectivity",
        description: "Next-generation onboard Wi-Fi for commercial and business aviation",
        opportunity_size: "large",
        rationale: "Airlines competing on passenger experience need higher bandwidth at lower cost",
      },
    ],
    secondary_markets: [
      {
        name: "Enterprise Remote-Site & IoT Backhaul",
        description: "Connectivity for mining, energy, and construction sites plus IoT telemetry",
        opportunity_size: "medium",
        rationale: "Remote operations need reliable backhaul for operations and safety",
      },
    ],
    adjacent_markets: [
      {
        name: "Government & Defense (Starshield)",
        description: "Secure, resilient communications for government and defense",
        opportunity_size: "large",
        rationale: "High-value, mission-critical demand for resilient sovereign comms",
      },
      {
        name: "Direct-to-Cell Telecom Partnerships",
        description: "Carrier partnerships extending mobile coverage via satellite",
        opportunity_size: "medium",
        rationale: "Expands reach through telco partners and eliminates dead zones",
      },
    ],
  },
  signals: {
    market_signals: [
      {
        signal_type: "Legacy VSAT Churn",
        description: "Maritime operators actively replacing expensive legacy VSAT contracts",
        urgency: "high",
        source: "Reuters",
        citations: [
          {
            url: "https://www.reuters.com/business/",
            title: "Shipping Lines Upgrade Connectivity at Sea",
            snippet: "Maritime operators are replacing legacy satellite links with high-bandwidth alternatives...",
          },
        ],
      },
      {
        signal_type: "Airline IFC RFP",
        description: "Airlines issuing RFPs for next-generation in-flight connectivity",
        urgency: "high",
        source: "Bloomberg",
        citations: [
          {
            url: "https://www.bloomberg.com/industries",
            title: "Airlines Race to Upgrade In-Flight Wi-Fi",
            snippet: "Carriers are evaluating low-earth-orbit connectivity to improve passenger experience...",
          },
        ],
      },
      {
        signal_type: "Government Comms Funding",
        description: "New government funding for resilient and disaster-response communications",
        urgency: "high",
        source: "Associated Press",
        citations: [
          {
            url: "https://apnews.com/hub/technology",
            title: "Governments Invest in Resilient Communications",
            snippet: "Agencies are funding resilient connectivity for defense and emergency response...",
          },
        ],
      },
      {
        signal_type: "Telecom Partnership",
        description: "Carriers announcing direct-to-cell satellite partnerships to eliminate dead zones",
        urgency: "medium",
        source: "The Wall Street Journal",
        citations: [
          {
            url: "https://www.wsj.com/tech/telecom",
            title: "Carriers Turn to Satellites for Coverage",
            snippet: "Mobile operators are partnering with satellite providers to extend coverage...",
          },
        ],
      },
      {
        signal_type: "Remote Operations Expansion",
        description: "Mining and energy firms expanding remote operations that require backhaul",
        urgency: "medium",
        source: "Financial Times",
        citations: [
          {
            url: "https://www.ft.com/companies",
            title: "Resource Firms Expand Remote Operations",
            snippet: "Mining and energy operators are scaling remote sites that depend on reliable connectivity...",
          },
        ],
      },
    ],
    intent_indicators: [
      "Public RFPs for maritime and in-flight connectivity",
      "Job posts for satellite/network connectivity engineers",
      "Announced remote-site or fleet expansion programs",
    ],
  },
  signal_evidence: {
    query: "Starlink enterprise maritime aviation government connectivity VSAT replacement buying signals 2026",
    results: [
      {
        title: "Shipping Lines Upgrade Connectivity at Sea",
        url: "https://www.reuters.com/business/",
        content: "Maritime operators are replacing legacy satellite links with high-bandwidth low-latency service...",
      },
      {
        title: "Airlines Race to Upgrade In-Flight Wi-Fi",
        url: "https://www.bloomberg.com/industries",
        content: "Carriers are evaluating low-earth-orbit connectivity to improve onboard passenger experience...",
      },
    ],
  },
  prospects: {
    prospects: [
      {
        company_name: "Royal Caribbean Group",
        website: "https://www.royalcaribbeangroup.com",
        industry: "Cruise / Maritime",
        fit_score: 94,
        match_rationale: "Cruise leader needing high-bandwidth connectivity for guests and operations fleet-wide",
        icp_match: "In-Transit Passenger Connectivity",
        citations: [
          {
            url: "https://www.royalcaribbeangroup.com/",
            title: "Royal Caribbean Guest Connectivity",
            snippet: "Cruise operators are investing in high-bandwidth connectivity for guest experience...",
          },
        ],
      },
      {
        company_name: "United Airlines",
        website: "https://www.united.com",
        industry: "Aviation",
        fit_score: 91,
        match_rationale: "Major airline upgrading in-flight connectivity to differentiate on passenger experience",
        icp_match: "In-Transit Passenger Connectivity",
        citations: [
          {
            url: "https://www.united.com/en/us/fly/company.html",
            title: "United Airlines In-Flight Experience",
            snippet: "United is investing in next-generation in-flight Wi-Fi for passengers...",
          },
        ],
      },
      {
        company_name: "Maersk",
        website: "https://www.maersk.com",
        industry: "Shipping / Logistics",
        fit_score: 88,
        match_rationale: "Global shipping fleet needing reliable connectivity for operations, crew, and IoT telemetry",
        icp_match: "Connectivity-Constrained Operations",
        citations: [
          {
            url: "https://www.maersk.com/about",
            title: "Maersk Fleet Digitalization",
            snippet: "Maersk is digitalizing fleet operations and improving crew connectivity...",
          },
        ],
      },
      {
        company_name: "T-Mobile US",
        website: "https://www.t-mobile.com",
        industry: "Telecommunications",
        fit_score: 89,
        match_rationale: "Carrier pursuing direct-to-cell satellite coverage to eliminate dead zones",
        icp_match: "Government & Defense Communications",
        citations: [
          {
            url: "https://www.t-mobile.com/news",
            title: "T-Mobile Coverage Expansion",
            snippet: "Carriers are partnering with satellite providers to extend mobile coverage...",
          },
        ],
      },
      {
        company_name: "Rio Tinto",
        website: "https://www.riotinto.com",
        industry: "Mining",
        fit_score: 86,
        match_rationale: "Mining major operating remote sites that require reliable backhaul and telemetry",
        icp_match: "Connectivity-Constrained Operations",
        citations: [
          {
            url: "https://www.riotinto.com/en/about",
            title: "Rio Tinto Remote Operations",
            snippet: "Mining operators are scaling automated, connected remote sites...",
          },
        ],
      },
    ],
  },
  prospect_evidence: {
    query: "Starlink enterprise prospects Royal Caribbean United Airlines Maersk T-Mobile Rio Tinto connectivity",
    results: [
      {
        title: "Maritime and Aviation Connectivity Upgrades",
        url: "https://www.reuters.com/business/",
        content: "Cruise lines, airlines, and shippers are upgrading to high-bandwidth satellite connectivity...",
      },
      {
        title: "Telecom and Mining Connectivity Demand",
        url: "https://www.ft.com/companies",
        content: "Carriers and resource firms are adopting satellite connectivity to close coverage gaps...",
      },
    ],
  },
  decision_makers: {
    decision_makers: [
      {
        company_name: "Royal Caribbean Group",
        role: "Economic Buyer",
        title: "Chief Technology Officer",
        relevance: "Owns guest connectivity strategy and fleet network budget",
        recommended_approach: "Lead with guest-experience uplift and fleet-wide bandwidth at lower cost",
      },
      {
        company_name: "United Airlines",
        role: "Champion",
        title: "VP, Digital & In-Flight Experience",
        relevance: "Drives in-flight connectivity upgrades and passenger experience",
        recommended_approach: "Propose a route-segment pilot demonstrating bandwidth and CX gains",
      },
      {
        company_name: "Maersk",
        role: "Economic Buyer",
        title: "Head of Fleet Technology",
        relevance: "Owns vessel connectivity, telemetry, and crew welfare programs",
        recommended_approach: "Quantify operations, telemetry, and crew-welfare value vs legacy VSAT",
      },
      {
        company_name: "T-Mobile US",
        role: "Champion",
        title: "VP, Network Strategy",
        relevance: "Leads coverage expansion and satellite partnerships",
        recommended_approach: "Position direct-to-cell partnership to eliminate coverage dead zones",
      },
      {
        company_name: "Rio Tinto",
        role: "Influencer",
        title: "Director, Remote Operations Technology",
        relevance: "Owns connectivity for automated remote mining sites",
        recommended_approach: "Show reliable backhaul enabling automation and safety telemetry",
      },
    ],
  },
  opportunities: {
    ranked_opportunities: [
      {
        company_name: "Royal Caribbean Group",
        fit_score: 94,
        intent_score: 88,
        timing_score: 90,
        accessibility_score: 80,
        overall_score: 89,
        priority: "high",
        rationale: "Acute guest-connectivity need plus fleet scale makes this the top opportunity",
      },
      {
        company_name: "United Airlines",
        fit_score: 91,
        intent_score: 86,
        timing_score: 85,
        accessibility_score: 78,
        overall_score: 85,
        priority: "high",
        rationale: "Active IFC upgrade cycle with a clear pilot-to-fleet path",
      },
      {
        company_name: "T-Mobile US",
        fit_score: 89,
        intent_score: 84,
        timing_score: 84,
        accessibility_score: 80,
        overall_score: 84,
        priority: "high",
        rationale: "Strategic direct-to-cell partnership with strong mutual upside",
      },
      {
        company_name: "Maersk",
        fit_score: 88,
        intent_score: 82,
        timing_score: 80,
        accessibility_score: 76,
        overall_score: 82,
        priority: "high",
        rationale: "Large fleet with clear VSAT-replacement economics",
      },
      {
        company_name: "Rio Tinto",
        fit_score: 86,
        intent_score: 78,
        timing_score: 78,
        accessibility_score: 78,
        overall_score: 80,
        priority: "medium",
        rationale: "Strong remote-site fit; procurement cycles extend timing",
      },
    ],
  },
  outreach: {
    outreach_strategies: [
      {
        company_name: "Royal Caribbean Group",
        outreach_angle: "Fleet-wide guest connectivity that elevates the onboard experience",
        why_now: "Guest expectations and competitive pressure make high-bandwidth connectivity urgent",
        why_them: "Royal Caribbean's fleet scale and guest-experience focus fit Starlink's maritime strengths",
        email_draft:
          "Hi [CTO], guests increasingly judge cruises by onboard connectivity. Starlink can deliver fleet-wide high-bandwidth, low-latency service at better economics than legacy VSAT. Could we scope a vessel pilot with clear CX and cost metrics?",
        linkedin_draft:
          "Following Royal Caribbean's guest-experience investments. We help cruise operators deliver fleet-wide Starlink connectivity. Happy to share a maritime pilot framework.",
      },
      {
        company_name: "United Airlines",
        outreach_angle: "Next-generation in-flight connectivity as a passenger-experience differentiator",
        why_now: "An active IFC upgrade cycle makes this the right moment to evaluate LEO connectivity",
        why_them: "United competes on experience and has the route network to benefit from higher bandwidth",
        email_draft:
          "Hi [VP In-Flight Experience], Starlink can transform United's in-flight Wi-Fi with higher bandwidth and lower latency. We'd love to run a route-segment pilot demonstrating measurable passenger-experience gains. Open to a short session?",
        linkedin_draft:
          "Tracking United's in-flight experience roadmap. We partner with airlines on next-gen connectivity pilots. Glad to share a relevant approach.",
      },
      {
        company_name: "Maersk",
        outreach_angle: "Reliable fleet connectivity for operations, telemetry, and crew welfare",
        why_now: "Fleet digitalization and crew-welfare goals require dependable, high-bandwidth links",
        why_them: "Maersk's global fleet has clear VSAT-replacement economics and IoT telemetry needs",
        email_draft:
          "Hi [Head of Fleet Technology], Starlink can upgrade Maersk's vessel connectivity for operations, telemetry, and crew welfare ΓÇö at compelling economics versus legacy VSAT. Could we quantify the value on a representative route?",
        linkedin_draft:
          "Impressed by Maersk's fleet digitalization. We help shipping leaders modernize vessel connectivity with Starlink. Happy to share an operations-focused business case.",
      },
    ],
  },
  summary:
    "GTM intelligence report for SpaceX (Starlink + Starshield). Identified 3 ICPs across connectivity-constrained operations, in-transit passenger connectivity, and government/defense, plus 5 high-fit prospects led by Royal Caribbean, United Airlines, and T-Mobile. Outreach focuses on guest connectivity, next-gen in-flight Wi-Fi, and fleet operations economics.",
};

export const DEMO_COMPANIES: DemoCompany[] = [MICROSOFT, APPLE, SPACEX];

/** Lightweight metadata for client UI (no heavy data payloads). */
export const DEMO_COMPANY_META = DEMO_COMPANIES.map((c) => ({
  id: c.id,
  label: c.label,
  tagline: c.tagline,
  input: c.input,
}));

/** Matches a free-form GTM input to a pre-baked demo company, if any. */
export function resolveDemoCompany(input: {
  company?: string;
  product?: string;
}): DemoCompany | null {
  const haystack = `${input.company ?? ""} ${input.product ?? ""}`.toLowerCase();
  for (const company of DEMO_COMPANIES) {
    if (company.matchKeywords.some((kw) => haystack.includes(kw))) {
      return company;
    }
  }
  return null;
}

/** Assembles the final report object from a demo company's slices. */
export function buildDemoReport(c: DemoCompany): GTMReport {
  return {
    summary: c.summary,
    icps: c.gtm_strategy.icps,
    personas: c.gtm_strategy.personas,
    target_industries: c.gtm_strategy.target_industries,
    value_proposition: c.gtm_strategy.value_proposition,
    primary_markets: c.market_map.primary_markets,
    secondary_markets: c.market_map.secondary_markets,
    adjacent_markets: c.market_map.adjacent_markets,
    market_signals: c.signals.market_signals,
    intent_indicators: c.signals.intent_indicators,
    prospects: c.prospects.prospects,
    decision_makers: c.decision_makers.decision_makers,
    ranked_opportunities: c.opportunities.ranked_opportunities,
    outreach_strategies: c.outreach.outreach_strategies,
    generated_at: new Date().toISOString(),
  };
}

/** Builds a fully-populated, completed run state for a demo company. */
export function buildDemoState(runId: string, c: DemoCompany): GTMReportState {
  const agent_statuses = createInitialAgentStatuses();
  for (const key of Object.keys(agent_statuses) as (keyof typeof agent_statuses)[]) {
    agent_statuses[key] = "done";
  }
  return {
    run_id: runId,
    input: c.input,
    website_content: c.website_content,
    gtm_strategy: c.gtm_strategy,
    market_map: c.market_map,
    signals: c.signals,
    prospects: c.prospects,
    decision_makers: c.decision_makers,
    opportunities: c.opportunities,
    outreach: c.outreach,
    report: buildDemoReport(c),
    research_evidence: {
      signal_hunter: c.signal_evidence,
      prospect_discovery: c.prospect_evidence,
    },
    agent_statuses,
    errors: {},
  };
}
