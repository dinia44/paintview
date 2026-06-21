import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      matches: [],
      warnings: [
        "Colour matching API is not enabled in V1.",
        "Use built-in swatches or enter brand and paint code manually.",
        "Configure COLOUR_MATCH_API_KEY for future integrations.",
      ],
    },
    { status: 501 }
  );
}
