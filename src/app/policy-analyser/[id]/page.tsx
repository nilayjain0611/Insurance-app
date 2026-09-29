import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysis Results",
  description: "View the detailed AI-powered analysis of your insurance policy.",
};

export default function PolicyAnalysisResultPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            Policy Analysis Results
          </h1>
          <p className="mt-4 text-[var(--color-muted-foreground)]">
            Detailed analysis results will appear here once the AI integration is complete.
          </p>
        </div>

        {/* Placeholder for analysis results */}
        <div className="mt-12 glass rounded-2xl p-12 text-center">
          <span className="text-5xl block mb-4">📊</span>
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
            Analysis View Coming Soon
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md mx-auto">
            This page will show policyholder details, benefits, conditions, flaws, 
            market comparison, and AI-generated explanations in Hindi or English.
          </p>
        </div>
      </div>
    </div>
  );
}
