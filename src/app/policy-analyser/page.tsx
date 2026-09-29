import type { Metadata } from "next";
import PolicyAnalyserClient from "@/components/policy/PolicyAnalyserClient";

export const metadata: Metadata = {
  title: "Policy Analyser",
  description:
    "Upload your insurance policy and get an AI-powered analysis with clear explanations, benefit highlights, gap identification, and market comparison.",
};

export default function PolicyAnalyserPage() {
  return <PolicyAnalyserClient />;
}
