import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/policy/analyse
 * Triggers AI analysis on an uploaded policy.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { policyId, language = "en" } = body;

    if (!policyId) {
      return NextResponse.json(
        { success: false, error: "Policy ID is required" },
        { status: 400 }
      );
    }

    // TODO: Trigger actual AI analysis pipeline
    // 1. Retrieve the uploaded document
    // 2. Parse/OCR the document
    // 3. Send to AI for analysis
    // 4. Store results

    return NextResponse.json({
      success: true,
      data: {
        policyId,
        status: "analysing",
        message: `Analysis started for policy ${policyId} in ${language === "hi" ? "Hindi" : "English"}.`,
      },
    });
  } catch (error) {
    console.error("[API] Analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
