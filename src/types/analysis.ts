import { Policy, BenefitType } from "./policy";

/**
 * A market comparison entry — another product compared against the uploaded policy.
 */
export interface ComparisonProduct {
  insurerName: string;
  productName: string;
  premiumAmount: number;
  sumInsured: number;
  benefitType: BenefitType;
  highlights: string[];
  rating?: number;
  url?: string;
}

/**
 * The result of a policy comparison against market alternatives.
 */
export interface PolicyComparison {
  uploadedPolicy: Pick<Policy, "insurerName" | "productName" | "premiumAmount" | "sumInsured">;
  alternatives: ComparisonProduct[];
  summary: string;
}

/**
 * Improvement suggestion from the AI analysis.
 */
export interface ImprovementSuggestion {
  area: string;
  currentState: string;
  recommendation: string;
  impact: "low" | "medium" | "high";
}

/**
 * The full AI-generated analysis result for an uploaded policy.
 */
export interface AnalysisResult {
  id: string;
  policyId: string;
  status: "completed" | "failed";

  // Parsed policy
  policy: Policy;

  // AI explanation in selected language
  explanation: string;
  explanationLanguage: "en" | "hi";

  // Market comparison
  comparison?: PolicyComparison;

  // Suggestions
  improvements: ImprovementSuggestion[];

  // Reimbursement guidance (if applicable)
  reimbursementGuide?: string;

  // Timestamps
  createdAt: string;
  completedAt: string;
}
