import Link from "next/link";
import { APP_NAME, APP_TAGLINE, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-[var(--color-foreground)]">{APP_NAME}</span>
            </div>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed max-w-xs">
              {APP_TAGLINE}. Helping you understand, manage, and settle your insurance policies with AI-powered insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-foreground)] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Insurance Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-foreground)] mb-4">
              Insurance Types
            </h3>
            <ul className="space-y-2.5">
              {["Motor Insurance", "Medicare / Mediclaim", "Travel Insurance", "Cyber Insurance", "Marine Insurance"].map((type) => (
                <li key={type}>
                  <span className="text-sm text-[var(--color-muted)]">{type}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-muted)]">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
