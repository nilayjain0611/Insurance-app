"use client";

import { useEffect, useState, useMemo } from "react";
import { marked } from "marked";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { parseReportMarkdown, categorizeSections, ReportSection } from "@/lib/report-parser";

interface PolicyAnalysisResultsProps {
  data: Record<string, any>;
  onReset: () => void;
}

type TabType = "summary" | "coverage" | "financials" | "claims" | "scenarios" | "askAi";

export default function PolicyAnalysisResults({ data, onReset }: PolicyAnalysisResultsProps) {
  const metadata = data.extractedData || {};
  const reportMarkdown = data.explanation || "No report generated.";
  const fileName = data.fileName as string;
  const analysedAt = data.analysedAt as string;
  const policyType = data.policyType as string;

  const [activeTab, setActiveTab] = useState<TabType>("summary");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [expandedScenarios, setExpandedScenarios] = useState<Record<number, boolean>>({});
  
  // Chat simulator state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");

  // Parse raw report into structured sections
  const parsedSections = useMemo(() => parseReportMarkdown(reportMarkdown), [reportMarkdown]);
  
  // Group sections by tabs
  const categorized = useMemo(() => categorizeSections(parsedSections), [parsedSections]);

  // Extract Health / Motor score from the markdown report text
  const healthScore = useMemo(() => {
    const match = reportMarkdown.match(/Score:\s*(\d+)\/100/i);
    return match ? parseInt(match[1]) : 80; // default to 80 if not found
  }, [reportMarkdown]);

  // Extract claim readiness score
  const claimScore = useMemo(() => {
    const match = reportMarkdown.match(/Readiness\s+Score:?\s*(\d+)\/100/i);
    return match ? parseInt(match[1]) : 75; // default to 75
  }, [reportMarkdown]);

  // Parse Action Plan items into checklist state
  const actionPlanItems = useMemo(() => {
    const planSection = parsedSections.find(s => 
      s.title.toLowerCase().includes("action plan") || 
      s.title.toLowerCase().includes("do now") || 
      s.title.toLowerCase().includes("should do now")
    );
    if (!planSection) return [];
    
    // Extract lines starting with *, -, or numbers
    return planSection.content
      .split("\n")
      .map(line => line.replace(/^[\s*\-\d\.]+\s*/, "").trim())
      .filter(line => line.length > 5 && !line.toLowerCase().includes("do now") && !line.toLowerCase().includes("should do now"));
  }, [parsedSections]);

  // Parse Real-Life Scenarios into structured list
  const scenariosList = useMemo(() => {
    const scenarioSec = parsedSections.find(s => 
      s.title.toLowerCase().includes("scenario")
    );
    if (!scenarioSec) return [];

    // Split scenarios by Scenario headings
    const items = scenarioSec.content.split(/###?\s+Scenario/gi);
    return items
      .filter(item => item.trim().length > 0)
      .map((item, idx) => {
        const lines = item.split("\n").map(l => l.trim());
        const question = lines[0]?.replace(/^:\s*/, "") || `Scenario ${idx + 1}`;
        
        // Find coverage status
        let position = "Conditional";
        if (item.toLowerCase().includes("covered")) position = "Covered";
        if (item.toLowerCase().includes("not covered") || item.toLowerCase().includes("excluded")) position = "Not Covered";
        
        return {
          question,
          details: item.trim(),
          position
        };
      });
  }, [parsedSections]);

  // Parse AI Chat suggested questions
  const suggestedQuestions = useMemo(() => {
    const askSec = parsedSections.find(s => 
      s.title.toLowerCase().includes("ask your") || 
      s.title.toLowerCase().includes("suggested questions")
    );
    if (!askSec) return [
      "What are the biggest exclusions in my policy?",
      "How much could I have to pay myself?",
      "What documents will I need for a claim?",
      "What happens if my policy expires?"
    ];

    return askSec.content
      .split("\n")
      .map(line => line.replace(/^[\s*\-\d\.\"\']+\s*/, "").replace(/[\"\']+$/, "").trim())
      .filter(line => line.length > 10 && line.endsWith("?"));
  }, [parsedSections]);

  // Handle Action Plan checklist toggles
  const toggleCheck = (item: string) => {
    setChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  // Chat simulator response generator
  const triggerChatResponse = (question: string) => {
    setChatMessages(prev => [...prev, { sender: "user", text: question }]);
    setIsTyping(true);

    setTimeout(() => {
      // Find relevant paragraphs in the markdown report for answer matching
      const query = question.toLowerCase();
      let answer = "";

      if (query.includes("exclusion") || query.includes("not covered")) {
        const sec = parsedSections.find(s => s.title.toLowerCase().includes("not cover") || s.title.toLowerCase().includes("exclusion"));
        answer = sec ? `Here are the major exclusions noted in your policy:\n\n${sec.content.slice(0, 500)}...` : "";
      } else if (query.includes("pay") || query.includes("out-of-pocket") || query.includes("deductible")) {
        const sec = parsedSections.find(s => s.title.toLowerCase().includes("risk") || s.title.toLowerCase().includes("pocket") || s.title.toLowerCase().includes("deduct"));
        answer = sec ? `Based on the financial risk analysis, here is what you might have to pay out-of-pocket:\n\n${sec.content.slice(0, 500)}...` : "";
      } else if (query.includes("document") || query.includes("claim")) {
        const sec = parsedSections.find(s => s.title.toLowerCase().includes("claim") || s.title.toLowerCase().includes("document"));
        answer = sec ? `To file a claim, follow these steps and prepare these documents:\n\n${sec.content.slice(0, 600)}...` : "";
      }

      if (!answer) {
        // Fallback search
        const match = parsedSections.find(s => s.content.toLowerCase().includes(query.slice(0, 10)));
        if (match) {
          answer = `Here is what I found regarding "${question}" under section **${match.title}**:\n\n${match.content.slice(0, 400)}...`;
        } else {
          answer = `Based on my analysis of your policy: The document details indicate this coverage is subject to standard conditions. Please review section **What This Policy Covers** or **How to Claim** in the tabs above for exact details.`;
        }
      }

      setChatMessages(prev => [...prev, { sender: "bot", text: answer }]);
      setIsTyping(false);
    }, 1200);
  };

  // Convert markdown section to HTML
  const renderSectionHtml = (section: ReportSection) => {
    return { __html: marked.parse(section.content) as string };
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return "stroke-red-500 text-red-400";
    if (score < 75) return "stroke-amber-500 text-amber-400";
    return "stroke-emerald-500 text-emerald-400";
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
              {policyType === "health" ? "🩺 Health Policy" : "🚗 Motor Policy"}
            </span>
            <span className="text-xs text-[var(--color-muted)]">
              Ref: {metadata.policyNumber || "N/A"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            {metadata.insurerName || "Policy"} — {metadata.productName || "Insurance Analysis"}
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Document: {fileName} • {new Date(analysedAt).toLocaleDateString("en-IN")}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={onReset}>
            Analyse Another
          </Button>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div className="flex overflow-x-auto gap-2 border-b border-white/5 pb-2 scrollbar-none">
        {[
          { id: "summary", label: "📊 Summary", count: null },
          { id: "coverage", label: "🛡️ Coverage", count: categorized.coverage.length },
          { id: "financials", label: "💰 Financials", count: categorized.financials.length },
          { id: "claims", label: "📋 Claims Center", count: null },
          { id: "scenarios", label: "🎮 Simulator", count: scenariosList.length || null },
          { id: "askAi", label: "💬 Ask AI Sandbox", count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`
              flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200
              ${activeTab === tab.id
                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 shadow-lg shadow-[var(--color-primary)]/5"
                : "text-[var(--color-muted)] border border-transparent hover:text-[var(--color-foreground)] hover:bg-white/5"
              }
            `}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded-full border border-white/5">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">

        {/* 1. EXECUTIVE SUMMARY TAB */}
        {activeTab === "summary" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Health Score Gauge */}
            <Card glow className="flex flex-col items-center justify-center p-6 text-center md:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-muted)] mb-4">
                Health Score
              </h3>
              <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="40" className="stroke-white/5 fill-transparent" strokeWidth="8" />
                  {/* Score Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={`fill-transparent transition-all duration-1000 ${getScoreColor(healthScore)}`}
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * healthScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold text-[var(--color-foreground)]">{healthScore}</span>
                  <span className="text-xs text-[var(--color-muted)] block">/100</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                AI evaluation of coverage strength, financial limits, and exclusions.
              </p>
            </Card>

            {/* Checkable Action Plan Checklist */}
            <Card className="md:col-span-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                📋 DO NOW Checklist
              </h3>
              {actionPlanItems.length > 0 ? (
                <div className="space-y-3">
                  {actionPlanItems.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(item)}
                      className={`
                        flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none
                        ${checklist[item]
                          ? "bg-emerald-500/5 border-emerald-500/20 text-[var(--color-muted)] line-through"
                          : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04] text-[var(--color-muted-foreground)]"
                        }
                      `}
                    >
                      <div className={`
                        h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all
                        ${checklist[item]
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-white/20"
                        }
                      `}>
                        {checklist[item] && "✓"}
                      </div>
                      <span className="text-sm leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-muted)]">No action plan items generated.</p>
              )}
            </Card>

            {/* Top Things to Know & Remaining Summary Sections */}
            <div className="md:col-span-3 space-y-6">
              {categorized.summary.map((sec, idx) => (
                <Card key={idx} className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                    {sec.title}
                  </h3>
                  <div
                    className="
                      prose prose-invert max-w-none text-sm text-[var(--color-muted-foreground)] leading-relaxed space-y-4
                      [&>ul]:list-none [&>ul]:pl-0 [&>ul]:space-y-4
                      [&>ul>li]:border [&>ul>li]:border-white/5 [&>ul>li]:rounded-2xl [&>ul>li]:p-5 [&>ul>li]:bg-white/[0.01]
                      [&>ul>li_strong]:text-[var(--color-foreground)] [&>ul>li_strong]:block [&>ul>li_strong]:text-base [&>ul>li_strong]:mb-1
                    "
                    dangerouslySetInnerHTML={renderSectionHtml(sec)}
                  />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 2. COVERAGE & EXCLUSIONS TAB */}
        {activeTab === "coverage" && (
          <div className="space-y-6">
            {categorized.coverage.length > 0 ? (
              categorized.coverage.map((sec, idx) => (
                <Card key={idx} className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4 pb-2 border-b border-white/5">
                    {sec.title}
                  </h3>
                  <div
                    className="
                      prose prose-invert max-w-none text-sm text-[var(--color-muted-foreground)] leading-relaxed
                      [&>table]:w-full [&>table]:border-collapse [&>table]:my-4 [&>table]:border [&>table]:border-white/5 [&>table]:rounded-xl [&>table]:overflow-hidden
                      [&>table_th]:bg-white/5 [&>table_th]:px-4 [&>table_th]:py-3 [&>table_th]:text-xs [&>table_th]:font-bold [&>table_th]:uppercase [&>table_th]:border-b [&>table_th]:border-white/10 [&>table_th]:text-left
                      [&>table_td]:px-4 [&>table_td]:py-3 [&>table_td]:border-b [&>table_td]:border-white/5 [&>table_td]:text-xs
                      [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2
                    "
                    dangerouslySetInnerHTML={renderSectionHtml(sec)}
                  />
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center text-[var(--color-muted)]">
                No coverage sections detected.
              </Card>
            )}
          </div>
        )}

        {/* 3. FINANCIAL RISKS TAB */}
        {activeTab === "financials" && (
          <div className="space-y-6">
            {categorized.financials.length > 0 ? (
              categorized.financials.map((sec, idx) => (
                <Card key={idx} className="p-6 sm:p-8 border-amber-500/10 bg-gradient-to-br from-amber-500/[0.02] to-transparent">
                  <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                    {sec.title}
                  </h3>
                  <div
                    className="
                      prose prose-invert max-w-none text-sm text-[var(--color-muted-foreground)] leading-relaxed space-y-4
                      [&>table]:w-full [&>table]:border-collapse [&>table]:my-4 [&>table]:border [&>table]:border-white/5
                      [&>table_th]:bg-white/5 [&>table_th]:px-4 [&>table_th]:py-2.5 [&>table_th]:text-left [&>table_th]:text-xs [&>table_th]:font-bold
                      [&>table_td]:px-4 [&>table_td]:py-2.5 [&>table_td]:border-b [&>table_td]:border-white/5 [&>table_td]:text-xs
                      [&>p_strong]:text-amber-400
                    "
                    dangerouslySetInnerHTML={renderSectionHtml(sec)}
                  />
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center text-[var(--color-muted)]">
                No financial exposure details found.
              </Card>
            )}
          </div>
        )}

        {/* 4. CLAIM CENTER TAB */}
        {activeTab === "claims" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Claims Readiness Score */}
            <Card glow className="flex flex-col items-center justify-center p-6 text-center md:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-muted)] mb-4">
                Claim Readiness
              </h3>
              <div className="relative h-32 w-32 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-white/5 fill-transparent" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={`fill-transparent transition-all duration-1000 ${getScoreColor(claimScore)}`}
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * claimScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold text-[var(--color-foreground)]">{claimScore}</span>
                  <span className="text-xs text-[var(--color-muted)] block">/100</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-[var(--color-muted-foreground)] leading-relaxed">
                Represents documentation preparedness and contact availability.
              </p>
            </Card>

            {/* Claims Guidance Content */}
            <div className="md:col-span-2 space-y-6">
              {categorized.claims.map((sec, idx) => (
                <Card key={idx} className="p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-4">
                    {sec.title}
                  </h3>
                  <div
                    className="
                      prose prose-invert max-w-none text-sm text-[var(--color-muted-foreground)] leading-relaxed space-y-4
                      [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-3
                      [&>ol>li]:font-semibold [&>ol>li]:text-[var(--color-foreground)]
                      [&>ol>li>p]:font-normal [&>ol>li>p]:text-[var(--color-muted-foreground)] [&>ol>li>p]:mt-1
                      [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2
                    "
                    dangerouslySetInnerHTML={renderSectionHtml(sec)}
                  />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 5. SCENARIO SIMULATOR TAB */}
        {activeTab === "scenarios" && (
          <div className="space-y-4">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[var(--color-foreground)]">Real-Life Scenario Simulator</h3>
              <p className="text-sm text-[var(--color-muted)] mt-1">
                Select a scenario below to simulate how the policy will respond in real life.
              </p>
            </div>

            {scenariosList.length > 0 ? (
              scenariosList.map((sc, idx) => {
                const isOpen = expandedScenarios[idx];
                const badgeColor = 
                  sc.position === "Covered" 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : sc.position === "Not Covered"
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20";

                return (
                  <Card key={idx} className="overflow-hidden border-white/5 bg-white/[0.01] hover:border-white/10 transition-all p-0">
                    {/* Scenario header clickable */}
                    <div 
                      onClick={() => setExpandedScenarios(prev => ({ ...prev, [idx]: !prev[idx] }))}
                      className="flex items-center justify-between gap-4 p-5 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xs font-bold text-[var(--color-primary)]">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-semibold text-[var(--color-foreground)] leading-tight">
                          {sc.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${badgeColor}`}>
                          {sc.position}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className={`text-[var(--color-muted)] transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>

                    {/* Expandable details */}
                    {isOpen && (
                      <div className="border-t border-white/5 p-5 bg-black/20 animate-fade-in">
                        <div 
                          className="
                            prose prose-invert text-xs text-[var(--color-muted-foreground)] leading-relaxed space-y-3
                            [&>h3]:text-sm [&>h3]:font-bold [&>h3]:text-[var(--color-foreground)] [&>h3]:mt-4 [&>h3]:mb-1 [&>h3]:border-b [&>h3]:border-white/5 [&>h3]:pb-1
                            [&>p]:mb-2
                          "
                          dangerouslySetInnerHTML={{ __html: marked.parse(sc.details) as string }}
                        />
                      </div>
                    )}
                  </Card>
                );
              })
            ) : (
              <Card className="p-12 text-center text-[var(--color-muted)]">
                No real-life scenarios simulated in the report.
              </Card>
            )}
          </div>
        )}

        {/* 6. ASK AI SANDBOX TAB */}
        {activeTab === "askAi" && (
          <Card className="p-6 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-transparent min-h-[400px] flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-foreground)] flex items-center gap-2 mb-1">
                💬 Interactive AI Chat Sandbox
              </h3>
              <p className="text-sm text-[var(--color-muted)] mb-6">
                Click a suggested question below to query the policy details.
              </p>

              {/* Chat Dialogue box */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 p-4 rounded-xl border border-white/5 bg-black/30 scrollbar-none min-h-[180px]">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-[var(--color-muted)] text-center text-xs">
                    <span>💭 Ask me anything about this policy.</span>
                  </div>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div className={`
                        max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap
                        ${msg.sender === "user"
                          ? "bg-[var(--color-primary)] text-white rounded-br-none"
                          : "bg-white/5 text-[var(--color-muted-foreground)] rounded-bl-none border border-white/5"
                        }
                      `}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 text-[var(--color-muted)] rounded-2xl rounded-bl-none px-4 py-2.5 text-xs border border-white/5 flex gap-1">
                      <span className="h-1.5 w-1.5 bg-[var(--color-muted)] rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                      <span className="h-1.5 w-1.5 bg-[var(--color-muted)] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <span className="h-1.5 w-1.5 bg-[var(--color-muted)] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Suggested Questions Bubble Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => triggerChatResponse(q)}
                    disabled={isTyping}
                    className="
                      text-[11px] text-[var(--color-primary-light)] bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/10 px-3.5 py-2 rounded-full transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input box */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask custom question (e.g. Is theft covered?)"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customQuestion.trim()) {
                    triggerChatResponse(customQuestion);
                    setCustomQuestion("");
                  }
                }}
                disabled={isTyping}
                className="
                  flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-xs text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all
                "
              />
              <Button
                variant="primary"
                onClick={() => {
                  if (customQuestion.trim()) {
                    triggerChatResponse(customQuestion);
                    setCustomQuestion("");
                  }
                }}
                disabled={isTyping || !customQuestion.trim()}
              >
                Send
              </Button>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
