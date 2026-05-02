export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    console.log("Key exists:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Key Missing" },
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error("Supabase auth error:", authError);
    }

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => null);
    const messages = body?.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const latestMessageContent = messages[messages.length - 1].content;

    try {
      await supabase.from("chat_history").insert([
        { user_id: user.id, role: "user", content: latestMessageContent }
      ]);
    } catch (dbError) {
      console.warn("Failed to save user message:", dbError);
    }

    const googleResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: {
            text: latestMessageContent,
          },
        }),
      }
    );

    const googleData = await googleResponse.json().catch(() => null);
    const message =
      googleData?.candidates?.[0]?.output ||
      googleData?.output ||
      googleData?.text ||
      googleData?.response?.[0]?.content ||
      "I am currently experiencing service issues. Please try again later.";

    try {
      await supabase.from("chat_history").insert([
        { user_id: user.id, role: "model", content: message }
      ]);
    } catch (dbError) {
      console.warn("Failed to save model response:", dbError);
    }

    return NextResponse.json(
      { message },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
