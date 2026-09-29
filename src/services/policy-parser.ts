/**
 * Policy document parser.
 * Responsible for extracting structured data from uploaded policy documents.
 *
 * TODO: Integrate with a document parsing service (e.g., PDF.js, AWS Textract, or a custom LLM pipeline).
 */

/**
 * Parse a policy document file and extract raw text content.
 */
export async function parseDocument(file: File): Promise<string> {
  // Placeholder — will be replaced with actual parsing logic
  console.log(`[PolicyParser] Parsing file: ${file.name} (${file.type})`);
  return `Parsed content of ${file.name}`;
}

/**
 * Validate that the uploaded file is a supported format and within size limits.
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const supportedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!supportedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Please upload a PDF or image file.`,
    };
  }

  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 10MB.`,
    };
  }

  return { valid: true };
}
