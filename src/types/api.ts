/**
 * Standard API response wrapper.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Policy upload request payload.
 */
export interface PolicyUploadRequest {
  file: File;
  language?: "en" | "hi";
}

/**
 * Policy upload response.
 */
export interface PolicyUploadResponse {
  policyId: string;
  status: "uploading" | "processing";
  message: string;
}

/**
 * Policy analysis request payload.
 */
export interface PolicyAnalyseRequest {
  policyId: string;
  language: "en" | "hi";
  includeComparison?: boolean;
}

/**
 * Paginated list response.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
