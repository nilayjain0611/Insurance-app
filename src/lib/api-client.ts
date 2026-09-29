import { ApiResponse } from "@/types";

const API_BASE = "/api";

/**
 * Generic fetch wrapper with error handling.
 */
async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `Request failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

/**
 * Upload a policy file for analysis.
 */
export async function uploadPolicy(file: File, language: string = "en") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", language);

  const response = await fetch(`${API_BASE}/policy/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return {
      success: false,
      error: errorData.error || "Upload failed",
    };
  }

  const data = await response.json();
  return { success: true, data };
}

/**
 * Trigger AI analysis on an uploaded policy.
 */
export async function analysePolicy(policyId: string, language: string = "en") {
  return request(`/policy/analyse`, {
    method: "POST",
    body: JSON.stringify({ policyId, language }),
  });
}

/**
 * Fetch analysis results for a policy.
 */
export async function getAnalysisResult(policyId: string) {
  return request(`/policy/${policyId}`);
}
