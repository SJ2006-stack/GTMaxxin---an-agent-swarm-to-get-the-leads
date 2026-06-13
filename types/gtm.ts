import { z } from "zod";

export const GTMInputSchema = z.object({
  company: z.string().min(1),
  product: z.string().min(1),
  url: z.string().url().optional().or(z.literal("")),
});

export type GTMInput = z.infer<typeof GTMInputSchema>;

export const ICPSchema = z.object({
  name: z.string(),
  description: z.string(),
  industries: z.array(z.string()),
  company_size: z.string(),
  pain_points: z.array(z.string()),
});

export const PersonaSchema = z.object({
  title: z.string(),
  responsibilities: z.array(z.string()),
  goals: z.array(z.string()),
  challenges: z.array(z.string()),
});

export const GTMStrategistOutputSchema = z.object({
  icps: z.array(ICPSchema),
  personas: z.array(PersonaSchema),
  target_industries: z.array(z.string()),
  value_proposition: z.string(),
});

export const MarketSegmentSchema = z.object({
  name: z.string(),
  description: z.string(),
  opportunity_size: z.enum(["large", "medium", "small"]),
  rationale: z.string(),
});

export const MarketMapperOutputSchema = z.object({
  primary_markets: z.array(MarketSegmentSchema),
  secondary_markets: z.array(MarketSegmentSchema),
  adjacent_markets: z.array(MarketSegmentSchema),
});

export const BuyingSignalSchema = z.object({
  signal_type: z.string(),
  description: z.string(),
  urgency: z.enum(["high", "medium", "low"]),
  source: z.string().optional(),
});

export const SignalHunterOutputSchema = z.object({
  market_signals: z.array(BuyingSignalSchema),
  intent_indicators: z.array(z.string()),
});

export const ProspectSchema = z.object({
  company_name: z.string(),
  website: z.string().optional(),
  industry: z.string(),
  fit_score: z.number().min(0).max(100),
  match_rationale: z.string(),
  icp_match: z.string(),
});

export const ProspectDiscoveryOutputSchema = z.object({
  prospects: z.array(ProspectSchema),
});

export const DecisionMakerSchema = z.object({
  company_name: z.string(),
  role: z.string(),
  title: z.string(),
  relevance: z.string(),
  recommended_approach: z.string(),
});

export const DecisionMakerOutputSchema = z.object({
  decision_makers: z.array(DecisionMakerSchema),
});

export const OpportunityScoreSchema = z.object({
  company_name: z.string(),
  fit_score: z.number().min(0).max(100),
  intent_score: z.number().min(0).max(100),
  timing_score: z.number().min(0).max(100),
  accessibility_score: z.number().min(0).max(100),
  overall_score: z.number().min(0).max(100),
  priority: z.enum(["high", "medium", "low"]),
  rationale: z.string(),
});

export const OpportunityScorerOutputSchema = z.object({
  ranked_opportunities: z.array(OpportunityScoreSchema),
});

export const OutreachStrategySchema = z.object({
  company_name: z.string(),
  outreach_angle: z.string(),
  why_now: z.string(),
  why_them: z.string(),
  email_draft: z.string(),
  linkedin_draft: z.string(),
});

export const OutreachPlannerOutputSchema = z.object({
  outreach_strategies: z.array(OutreachStrategySchema),
});

export const GTMReportSchema = z.object({
  summary: z.string(),
  icps: z.array(ICPSchema),
  personas: z.array(PersonaSchema),
  target_industries: z.array(z.string()),
  value_proposition: z.string(),
  primary_markets: z.array(MarketSegmentSchema),
  secondary_markets: z.array(MarketSegmentSchema),
  adjacent_markets: z.array(MarketSegmentSchema),
  market_signals: z.array(BuyingSignalSchema),
  intent_indicators: z.array(z.string()),
  prospects: z.array(ProspectSchema),
  decision_makers: z.array(DecisionMakerSchema),
  ranked_opportunities: z.array(OpportunityScoreSchema),
  outreach_strategies: z.array(OutreachStrategySchema),
  generated_at: z.string(),
});

export type GTMReport = z.infer<typeof GTMReportSchema>;
export type ICP = z.infer<typeof ICPSchema>;
export type Persona = z.infer<typeof PersonaSchema>;
export type MarketSegment = z.infer<typeof MarketSegmentSchema>;
export type BuyingSignal = z.infer<typeof BuyingSignalSchema>;
export type Prospect = z.infer<typeof ProspectSchema>;
export type DecisionMaker = z.infer<typeof DecisionMakerSchema>;
export type OpportunityScore = z.infer<typeof OpportunityScoreSchema>;
export type OutreachStrategy = z.infer<typeof OutreachStrategySchema>;

export const MAX_PROSPECTS = 5;
export const MAX_SIGNALS = 5;
