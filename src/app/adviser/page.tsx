import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Policy Adviser",
  description:
    "Get AI-powered insurance recommendations. Compare quotations from multiple insurers and find the most comprehensive coverage for your needs.",
};

export default function AdviserPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-amber-400">
              Coming Soon — Phase 4
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            Policy{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
              Adviser
            </span>
          </h1>
          <p className="mt-4 text-[var(--color-muted-foreground)] max-w-xl mx-auto">
            Before you buy insurance, let our AI understand your needs, fetch quotations from multiple insurers, compare premiums and coverage, and recommend the most comprehensive policy.
          </p>
        </div>

        <div className="mt-12 glass rounded-2xl p-12 text-center">
          <span className="text-5xl block mb-4">💡</span>
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
            Under Development
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md mx-auto">
            This feature will compare quotations, identify cashless vs. reimbursement benefits, and link you directly to the insurer to complete your purchase.
          </p>
          <Link
            href="/policy-analyser"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium text-[var(--color-foreground)] hover:bg-white/10 transition-colors"
          >
            Try Policy Analyser Instead
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
