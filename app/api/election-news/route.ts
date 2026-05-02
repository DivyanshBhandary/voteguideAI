import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ElectionNews {
  title: string;
  description: string;
  percentage?: string;
  sourceUrl: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    ongoing: ElectionNews[];
    results: ElectionNews[];
    turnout: ElectionNews[];
    trending: ElectionNews[];
  };
  error?: string;
}

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error("Missing GOOGLE_GENERATIVE_AI_API_KEY. Make sure it is set in your server environment.");
      return NextResponse.json(
        { success: false, error: "API key not configured" },
        { status: 500 }
      );
    }

    const client = new GoogleGenerativeAI(apiKey);
    const modelNames = ["gemini-1.5-flash", "gemini-2.5-flash", "gemini-2.5-pro"];

    const prompt = `Search for the latest 2026 election news and results in India. Return a JSON object with the following structure (no markdown, pure JSON only):
{
  "ongoing": [
    {
      "title": "String with election name",
      "description": "Brief description of current voting/events",
      "percentage": "Turnout or progress percentage if available",
      "sourceUrl": "URL to the news article"
    }
  ],
  "results": [
    {
      "title": "Results headline",
      "description": "Party performance or seat distribution",
      "percentage": "Vote share percentage",
      "sourceUrl": "URL to results source"
    }
  ],
  "turnout": [
    {
      "title": "Turnout info",
      "description": "Current voter turnout statistics",
      "percentage": "Turnout percentage",
      "sourceUrl": "URL to official turnout data"
    }
  ],
  "trending": [
    {
      "title": "Trending political news",
      "description": "Key developments or statements",
      "sourceUrl": "URL to news article"
    }
  ]
}

If real-time 2026 data is not available, provide the most recent election data with news URLs. Ensure all URLs are valid and accessible.`;

    let response;
    let lastError: unknown;

    for (const modelName of modelNames) {
      try {
        let model;
        try {
          model = client.getGenerativeModel({ model: modelName });
        } catch (modelError) {
          lastError = modelError;
          console.warn(`Failed to instantiate Gemini model ${modelName}:`, modelError);
          continue;
        }

        response = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        });
        break;
      } catch (err) {
        lastError = err;
        console.warn(`Gemini generateContent failed for ${modelName}:`, err);
      }
    }

    if (!response) {
      console.error("Election news generation failed for all candidate models.", lastError);
      return NextResponse.json(
        { success: false, error: "Model unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const textContent = response.response?.text?.();
    if (!textContent) {
      return NextResponse.json(
        { success: false, error: "No response from model" },
        { status: 500 }
      );
    }

    // Clean up potential markdown code blocks
    let jsonText = textContent
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let electionData;
    try {
      electionData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Election news JSON parse failed:", parseError, "textContent:", textContent);
      return NextResponse.json(
        { success: false, error: "Invalid API response format" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: electionData,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Election news API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch election news" },
      { status: 500 }
    );
  }
}
