import Link from "next/link";
import Card from "@/components/ui/Card";
import { APP_NAME, APP_TAGLINE, INSURANCE_CATEGORIES } from "@/lib/constants";

const features = [
  {
    title: "Policy Analyser",
    description: "Upload your policy and get an AI-powered explanation in simple language with benefits, gaps, and market comparison.",
    href: "/policy-analyser",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    badge: "Live",
  },
  {
    title: "Policy Fetcher",
    description: "Enter a registered mobile number to discover all insurance policies linked to a person — even after their passing.",
    href: "/policy-fetcher",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    badge: "Coming Soon",
  },
  {
    title: "Claim Settlement",
    description: "Get step-by-step guidance to settle claims yourself, or hire a claim settlement manager for assisted support.",
    href: "/claims",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    badge: "Coming Soon",
  },
  {
    title: "Policy Adviser",
    description: "Before you buy, let AI compare quotations from multiple insurers and recommend the most comprehensive coverage.",
    href: "/adviser",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    badge: "Coming Soon",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="absolute inset-0 bg-grid-pattern" />

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pt-32 sm:pb-28 lg:px-8 lg:pt-40 lg:pb-36">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-4 py-1.5 mb-8">
              <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="text-xs font-medium text-[var(--color-primary-light)]">
                AI-Powered Insurance Analysis
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-5xl lg:text-6xl">
              {APP_TAGLINE.split(" ").map((word, i) =>
                i === 1 ? (
                  <span key={i} className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-teal)] bg-clip-text text-transparent">
                    {word}{" "}
                  </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>

            <p className="mt-6 text-lg text-[var(--color-muted-foreground)] leading-relaxed max-w-2xl mx-auto">
              Upload your insurance policy and get a clear, AI-powered explanation in Hindi or English.
              Discover hidden benefits, identify gaps, compare with market alternatives, and settle claims — all in one place.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/policy-analyser"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-[var(--color-primary)]/25 transition-all duration-200 hover:shadow-2xl hover:shadow-[var(--color-primary)]/30 hover:-translate-y-0.5 active:translate-y-0 animate-pulse-glow"
              >
                Analyse Your Policy
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/policy-fetcher"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-[var(--color-foreground)] transition-all duration-200 hover:bg-white/10 hover:border-white/20"
              >
                Find Lost Policies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] sm:text-3xl">
              Everything you need, one platform
            </h2>
            <p className="mt-3 text-[var(--color-muted)] max-w-lg mx-auto">
              From understanding your policy to settling claims — we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href} className="group">
                <Card hover className="h-full">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)]/20">
                        {feature.icon}
                      </div>
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        feature.badge === "Live"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/5 text-[var(--color-muted)] border border-white/10"
                      }`}>
                        {feature.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Categories */}
      <section className="py-16 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-[var(--color-foreground)] sm:text-2xl">
              All insurance types supported
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {INSURANCE_CATEGORIES.map((cat) => (
              <div
                key={cat.value}
                className="glass glass-hover rounded-full px-5 py-2.5 text-sm font-medium text-[var(--color-muted-foreground)] transition-all cursor-default hover:text-[var(--color-foreground)]"
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--color-primary)]/10 via-transparent to-[var(--color-accent-teal)]/5 p-12 sm:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-50" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] sm:text-3xl">
                No matter where you bought your insurance
              </h2>
              <p className="mt-4 text-[var(--color-muted-foreground)] max-w-xl mx-auto">
                {APP_NAME} is your one-stop solution for understanding policies and settling all claims — regardless of broker or insurer.
              </p>
              <Link
                href="/policy-analyser"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-[var(--color-primary)]/25 transition-all duration-200 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Get Started Free
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
