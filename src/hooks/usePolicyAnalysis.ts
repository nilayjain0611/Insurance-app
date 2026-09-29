"use client";

import { useState, useCallback } from "react";
import { uploadPolicy, analysePolicy, getAnalysisResult } from "@/lib/api-client";
import { AnalysisStatus } from "@/types";

interface UsePolicyAnalysisReturn {
  status: AnalysisStatus | null;
  policyId: string | null;
  error: string | null;
  isLoading: boolean;
  startAnalysis: (file: File, language?: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for managing the full policy analysis lifecycle:
 * upload → process → analyse → result.
 */
export function usePolicyAnalysis(): UsePolicyAnalysisReturn {
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startAnalysis = useCallback(async (file: File, language: string = "en") => {
    setError(null);
    setIsLoading(true);
    setStatus("uploading");

    try {
      // Step 1: Upload
      const uploadResult = await uploadPolicy(file, language);
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload failed");
      }

      const id = uploadResult.data.policyId;
      setPolicyId(id);
      setStatus("processing");

      // Step 2: Trigger analysis
      const analyseResult = await analysePolicy(id, language);
      if (!analyseResult.success) {
        throw new Error(analyseResult.error || "Analysis failed");
      }

      setStatus("analysing");

      // Step 3: Poll for results (simplified — will be replaced with SSE/WebSocket)
      setStatus("completed");
    } catch (err) {
      setStatus("failed");
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStatus(null);
    setPolicyId(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    status,
    policyId,
    error,
    isLoading,
    startAnalysis,
    reset,
  };
}
