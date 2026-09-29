import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Claim Settlement",
  description:
    "Get step-by-step guidance to settle insurance claims yourself, or hire a claim settlement manager for assisted support.",
};

export default function ClaimsPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-amber-400">
              Coming Soon — Phase 2 & 3
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            Claim{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Settlement
            </span>
          </h1>
          <p className="mt-4 text-[var(--color-muted-foreground)] max-w-xl mx-auto">
            Our AI bot will guide you through the entire claim process — providing document checklists, cashless options, and legal compliance guidance. Or hire a manager to handle it for you.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="glass rounded-2xl p-8 text-center">
            <span className="text-4xl block mb-3">🤖</span>
            <h3 className="font-semibold text-[var(--color-foreground)]">Self-Service</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              AI-guided claim settlement with document checklists and step-by-step instructions.
            </p>
          </div>
          <div className="glass rounded-2xl p-8 text-center">
            <span className="text-4xl block mb-3">👨‍💼</span>
            <h3 className="font-semibold text-[var(--color-foreground)]">Assisted Service</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Hire a claim settlement manager to handle your claim on a commission basis.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/policy-analyser"
            className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium text-[var(--color-foreground)] hover:bg-white/10 transition-colors"
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
