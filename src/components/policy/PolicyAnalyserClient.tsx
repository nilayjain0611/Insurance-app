"use client";

import { useState } from "react";
import PolicyUploader from "@/components/policy/PolicyUploader";
import PolicyAnalysisResults from "@/components/policy/PolicyAnalysisResults";
import { INSURANCE_CATEGORIES } from "@/lib/constants";

type AnalysisState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "analysing" }
  | { status: "completed"; data: Record<string, unknown> }
  | { status: "error"; message: string };

export default function PolicyAnalyserClient() {
  const [state, setState] = useState<AnalysisState>({ status: "idle" });
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const handleFileReady = async (file: File) => {
    setState({ status: "uploading" });

    try {
      // Brief pause to show uploading state
      setState({ status: "analysing" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);

      const response = await fetch("/api/policy/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setState({
          status: "error",
          message: result.error || "Analysis failed. Please try again.",
        });
        return;
      }

      setState({ status: "completed", data: result.data });
    } catch (error) {
      console.error("Analysis error:", error);
      setState({
        status: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  const handleReset = () => {
    setState({ status: "idle" });
  };

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-[var(--color-primary-light)]">
              Phase 1 — Policy Detailer
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            Analyse Your{" "}
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-teal)] bg-clip-text text-transparent">
              Insurance Policy
            </span>
          </h1>
          <p className="mt-4 text-[var(--color-muted-foreground)] max-w-xl mx-auto">
            Upload your policy document and our AI will explain it in simple language,
            highlight benefits and gaps, and compare it with market alternatives.
          </p>
        </div>

        {/* Main Content */}
        {state.status === "idle" && (
          <>
            {/* Language selector */}
            <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
              <span className="text-sm text-[var(--color-muted)]">Explain in:</span>
              <div className="flex rounded-lg border border-white/10 overflow-hidden">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    language === "en"
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-white/5 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("hi")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    language === "hi"
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-white/5 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            {/* Uploader */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
              <PolicyUploader onFileReady={handleFileReady} />
            </div>

            {/* Supported categories */}
            <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
              <p className="text-sm text-[var(--color-muted)] mb-4">
                Supports all major insurance types
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {INSURANCE_CATEGORIES.map((cat) => (
                  <span
                    key={cat.value}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-[var(--color-muted-foreground)]"
                  >
                    {cat.icon} {cat.label}
                  </span>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="mt-20 animate-fade-in-up" style={{ animationDelay: "0.6s", opacity: 0 }}>
              <h2 className="text-xl font-semibold text-center text-[var(--color-foreground)] mb-10">
                How it works
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { step: "01", title: "Upload", description: "Upload your policy document (PDF or image)", icon: "📄" },
                  { step: "02", title: "Analyse", description: "AI reads and understands your policy in seconds", icon: "🤖" },
                  { step: "03", title: "Understand", description: "Get a clear explanation with benefits, gaps, and comparison", icon: "✨" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="glass rounded-2xl p-6 text-center transition-all hover:bg-white/[0.06]"
                  >
                    <span className="text-3xl mb-3 block">{item.icon}</span>
                    <span className="text-xs font-bold tracking-widest text-[var(--color-primary)] uppercase">
                      Step {item.step}
                    </span>
                    <h3 className="mt-2 font-semibold text-[var(--color-foreground)]">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-[var(--color-muted)]">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Loading State */}
        {(state.status === "uploading" || state.status === "analysing") && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center animate-pulse-glow">
                <svg
                  className="h-10 w-10 text-[var(--color-primary)] animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            </div>
            <h2 className="mt-8 text-xl font-semibold text-[var(--color-foreground)]">
              {state.status === "uploading" ? "Uploading your policy..." : "AI is analysing your policy..."}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)] max-w-md text-center">
              {state.status === "uploading"
                ? "Securely uploading your document."
                : "Our AI is reading your policy, extracting details, and preparing a clear explanation. This usually takes 15-30 seconds."}
            </p>

            {/* Progress steps */}
            <div className="mt-10 space-y-3 w-full max-w-sm">
              {[
                { label: "Document uploaded", done: true },
                { label: "Reading policy content", done: state.status === "analysing" },
                { label: "Extracting key information", done: false },
                { label: "Generating explanation", done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${
                    step.done
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/5 text-[var(--color-muted)]"
                  }`}>
                    {step.done ? "✓" : "·"}
                  </div>
                  <span className={`text-sm ${step.done ? "text-[var(--color-foreground)]" : "text-[var(--color-muted)]"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {state.status === "error" && (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
            <div className="h-20 w-20 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-[var(--color-foreground)]">
              Analysis Failed
            </h2>
            <p className="mt-2 text-sm text-red-400 max-w-md text-center">
              {state.message}
            </p>
            <button
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-medium text-[var(--color-foreground)] hover:bg-white/10 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {state.status === "completed" && (
          <PolicyAnalysisResults data={state.data} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
