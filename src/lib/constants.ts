/**
 * Application-wide constants.
 */

export const APP_NAME = "PolicySure";
export const APP_TAGLINE = "Your Insurance Companion";
export const APP_DESCRIPTION =
  "Upload, understand, and manage your insurance policies with AI-powered analysis. Get clear explanations, market comparisons, and claim guidance — all in one place.";

/**
 * Supported file types for policy upload.
 */
export const SUPPORTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const SUPPORTED_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"] as const;

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Insurance categories with display metadata.
 */
export const INSURANCE_CATEGORIES = [
  { value: "Motor", label: "Motor Insurance", icon: "🚗" },
  { value: "Medicare", label: "Medicare / Mediclaim", icon: "🏥" },
  { value: "PA Cover", label: "Personal Accident Cover", icon: "🛡️" },
  { value: "Commercial", label: "Commercial Insurance", icon: "🏢" },
  { value: "Non-Commercial", label: "Non-Commercial Insurance", icon: "📋" },
  { value: "Marine", label: "Marine Insurance", icon: "🚢" },
  { value: "Travel", label: "Travel Insurance", icon: "✈️" },
  { value: "Cyber", label: "Cyber Insurance", icon: "🔒" },
] as const;

/**
 * Navigation links for the main menu.
 */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/policy-analyser", label: "Policy Analyser" },
  { href: "/policy-fetcher", label: "Policy Fetcher" },
  { href: "/claims", label: "Claim Settlement" },
  { href: "/adviser", label: "Policy Adviser" },
] as const;
