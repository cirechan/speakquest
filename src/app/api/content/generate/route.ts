import { NextRequest, NextResponse } from "next/server";
import { generateContent, type GenerationRequest } from "@/lib/content/generator";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerationRequest;

    if (!body.theme || !body.contentType || !body.difficultyLevel || !body.count) {
      return NextResponse.json(
        { error: "Missing required fields: theme, contentType, difficultyLevel, count" },
        { status: 400 }
      );
    }

    if (body.count > 20) {
      return NextResponse.json(
        { error: "Maximum 20 items per generation" },
        { status: 400 }
      );
    }

    const result = await generateContent(body);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content", details: String(error) },
      { status: 500 }
    );
  }
}
