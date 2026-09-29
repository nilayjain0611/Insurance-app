/**
 * Insurance Product Categories supported by the platform.
 * Source: PRD — Insurance Product Categories section.
 */
export enum InsuranceCategory {
  Motor = "Motor",
  Medicare = "Medicare",
  PACover = "PA Cover",
  Commercial = "Commercial",
  NonCommercial = "Non-Commercial",
  Marine = "Marine",
  Travel = "Travel",
  Cyber = "Cyber",
}

/**
 * Types of claim benefits a policy can offer.
 */
export enum BenefitType {
  Cashless = "Cashless",
  Reimbursement = "Reimbursement",
  Both = "Both",
}

/**
 * Supported languages for policy explanation.
 */
export type ExplanationLanguage = "en" | "hi";

/**
 * Policyholder details extracted from the uploaded policy.
 */
export interface Policyholder {
  name: string;
  dateOfBirth?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  relationship?: string;
}

/**
 * Nominee details extracted from the uploaded policy.
 */
export interface Nominee {
  name: string;
  relationship: string;
  dateOfBirth?: string;
  contactNumber?: string;
  sharePercentage?: number;
}

/**
 * A specific benefit or coverage item within a policy.
 */
export interface PolicyBenefit {
  title: string;
  description: string;
  coverageAmount?: number;
  isAddOn?: boolean;
}

/**
 * A condition, exclusion, or term within a policy.
 */
export interface PolicyCondition {
  title: string;
  description: string;
  type: "condition" | "exclusion" | "term" | "waiting_period";
}

/**
 * A flaw or area of improvement identified in the policy.
 */
export interface PolicyFlaw {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  suggestion?: string;
}

/**
 * Tie-up partner information (hospitals for mediclaim, dealers for motor).
 */
export interface TieUpPartner {
  name: string;
  type: "hospital" | "dealer" | "showroom" | "garage";
  address?: string;
  city?: string;
  contactNumber?: string;
}

/**
 * Documents required for claim settlement.
 */
export interface ClaimDocument {
  name: string;
  description: string;
  isMandatory: boolean;
}

/**
 * The core Policy object — represents a fully parsed insurance policy.
 */
export interface Policy {
  id: string;
  policyNumber: string;
  insurerName: string;
  productName: string;
  category: InsuranceCategory;

  // People
  policyholder: Policyholder;
  nominees: Nominee[];

  // Tenure & dates
  startDate: string;
  endDate: string;
  tenureYears: number;
  premiumAmount: number;
  sumInsured: number;

  // Coverage details
  benefitType: BenefitType;
  benefits: PolicyBenefit[];
  conditions: PolicyCondition[];
  flaws: PolicyFlaw[];

  // Tie-ups
  tieUpPartners?: TieUpPartner[];

  // Claim guidance
  claimDocuments: ClaimDocument[];
  claimProcess?: string[];

  // Metadata
  uploadedAt: string;
  analysedAt?: string;
  rawFileUrl?: string;
}

/**
 * Status of a policy analysis job.
 */
export type AnalysisStatus =
  | "uploading"
  | "processing"
  | "analysing"
  | "completed"
  | "failed";
