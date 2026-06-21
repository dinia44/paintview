import { NextResponse } from "next/server";
import type { RoomAnalysisResponse } from "@/lib/types";

export async function POST() {
  const response: RoomAnalysisResponse = {
    suggestedWalls: [],
    detectedFeatures: [],
    warnings: [
      "AI room analysis is not enabled in V1.",
      "Use guided wall marking and manual measurement confirmation instead.",
      "Configure OPENAI_API_KEY to enable future vision analysis.",
    ],
  };

  return NextResponse.json(response, { status: 501 });
}
