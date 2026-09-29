import { NextRequest, NextResponse } from "next/server";
import { analysePolicyWithAI } from "@/services/ai-analyser";

/**
 * POST /api/policy/upload
 * Handles policy document upload and triggers AI analysis.
 * Accepts multipart form data with a "file" field and optional "language" field.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const language = (formData.get("language") as "en" | "hi") || "en";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const supportedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    if (!supportedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: ${file.type}. Please upload a PDF or image.`,
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer for Gemini
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(
      `[API] Processing "${file.name}" (${(file.size / 1024).toFixed(1)}KB, ${file.type})`
    );

    // Call Gemini once to extract JSON data AND explanation
    const result = await analysePolicyWithAI(buffer, file.type, file.name, language);

    // Handle extraction failure
    if (!result.extractedData) {
      return NextResponse.json(
        {
          success: false,
          error:
            result.error ||
            "Failed to extract policy data. Please try again or upload a clearer document.",
        },
        { status: 422 }
      );
    }

    // Unpack metadata, policyType and the generated report
    const rawData = result.extractedData || {};
    const policyType = rawData.policyType || "other";
    const extractedData = rawData.metadata || {};
    const explanation = rawData.report || "No report generated.";

    // Return the combined result
    return NextResponse.json({
      success: true,
      data: {
        policyId: crypto.randomUUID(),
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        policyType,
        extractedData,
        explanation, // contains the rich markdown report
        explanationLanguage: language,
        analysedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[API] Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
