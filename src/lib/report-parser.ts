export interface ReportSection {
  title: string;
  level: number;
  content: string;
}

/**
 * Parses raw report markdown and groups it by headings (#, ##, ###).
 */
export function parseReportMarkdown(md: string): ReportSection[] {
  const lines = md.split("\n");
  const sections: ReportSection[] = [];
  let currentSection: ReportSection | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        level: headingMatch[1].length,
        title: headingMatch[2].trim(),
        content: "",
      };
    } else {
      if (currentSection) {
        currentSection.content += line + "\n";
      } else {
        // Capture initial header or content before any heading
        if (line.trim()) {
          currentSection = {
            level: 1,
            title: "Header",
            content: line + "\n",
          };
        }
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // Clean trailing spaces and returns
  return sections.map(s => ({
    ...s,
    content: s.content.trim()
  }));
}

/**
 * Groups sections into high-level dashboard tabs.
 * 
 * Tab mapping:
 *   summary    → Overview, Score, Top Things, Action Plan, Dates, Important Limits
 *   coverage   → Coverage, Exclusions, Waiting Periods, Hidden Terms, Third-Party, IDV, Depreciation, Driver/Usage
 *   financials → Financial Risk, Deductibles, Out-of-Pocket, Add-ons, NCB
 *   claims     → Claim Readiness, How To Claim, Documents, Claim Risk Alerts, Cashless/Reimbursement, Network Partners
 *   scenarios  → Scenario Simulator + Scenario Output
 *   comparison → Market Comparison, Improvement Suggestions
 *   askAi      → Ask Your Policy / Suggested Questions
 */
export function categorizeSections(sections: ReportSection[]): Record<string, ReportSection[]> {
  const grouped: Record<string, ReportSection[]> = {
    summary: [],
    coverage: [],
    financials: [],
    claims: [],
    scenarios: [],
    comparison: [],
    askAi: [],
    other: []
  };

  sections.forEach(sec => {
    const title = sec.title.toLowerCase();

    // Skip main title section headers
    if (
      title === "insurance health report" || 
      title === "motor insurance health report" || 
      title === "header"
    ) {
      return;
    }

    // ── Summary tab ──
    if (
      title.includes("overview") || 
      title.includes("health score") ||
      title.includes("things you should know") || 
      title.includes("things") ||
      title.includes("action plan") || 
      title.includes("what you should do") ||
      title.includes("dates") ||
      title.includes("vehicle document check") ||
      title.includes("policy type")
    ) {
      // Split Claim Readiness Score out to the Claims tab
      if (title.includes("claim readiness score")) {
        grouped.claims.push(sec);
      } else {
        grouped.summary.push(sec);
      }
    }
    // ── Coverage tab ──
    else if (
      title.includes("what is covered") ||
      title.includes("cover") && !title.includes("claim") && !title.includes("cashless") ||
      title.includes("does not cover") ||
      title.includes("exclu") || 
      title.includes("waiting") || 
      title.includes("hidden terms") ||
      title.includes("red flag") ||
      title.includes("third-party") || 
      title.includes("idv") || 
      title.includes("deprec") || 
      title.includes("driver") || 
      title.includes("usage") ||
      title.includes("important limits") ||
      title.includes("policy limits")
    ) {
      grouped.coverage.push(sec);
    }
    // ── Financials tab ──
    else if (
      title.includes("risk") && !title.includes("claim risk") && !title.includes("hidden") || 
      title.includes("deduct") || 
      title.includes("excess") ||
      title.includes("pocket") ||
      title.includes("add-on") ||
      title.includes("ncb") ||
      title.includes("no claim bonus")
    ) {
      grouped.financials.push(sec);
    }
    // ── Claims tab ──
    else if (
      title.includes("claim") || 
      title.includes("document") ||
      title.includes("cashless") ||
      title.includes("reimbursement") ||
      title.includes("network hospital") ||
      title.includes("network dealer") ||
      title.includes("tie-up") ||
      title.includes("garage")
    ) {
      grouped.claims.push(sec);
    }
    // ── Scenarios tab ──
    else if (
      title.includes("scenario") || 
      title.includes("simulator")
    ) {
      grouped.scenarios.push(sec);
    }
    // ── Comparison tab (NEW) ──
    else if (
      title.includes("market comparison") ||
      title.includes("comparison summary") ||
      title.includes("improvement suggestion") ||
      title.includes("policy improvement")
    ) {
      grouped.comparison.push(sec);
    }
    // ── Ask AI tab ──
    else if (
      title.includes("ask") || 
      title.includes("question")
    ) {
      grouped.askAi.push(sec);
    }
    // ── Fallback ──
    else {
      grouped.other.push(sec);
    }
  });

  return grouped;
}
