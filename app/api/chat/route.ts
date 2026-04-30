import { NextRequest } from "next/server";
import { getGeminiModel } from "@/lib/gemini";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), { status: 400 });
    }

    const latestMessageContent = messages[messages.length - 1].content;

    // Save user message to database
    await supabase.from("chat_history").insert([
      { user_id: user.id, role: "user", content: latestMessageContent }
    ]);

    const model = getGeminiModel();

    type ChatMessage = { role: string; content: string };
    const history = messages.slice(0, -1).map((msg: ChatMessage) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(latestMessageContent);

    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              fullResponse += chunkText;
              controller.enqueue(new TextEncoder().encode(chunkText));
            }
          }
          
          // Save model response to database upon completion
          await supabase.from("chat_history").insert([
            { user_id: user.id, role: "model", content: fullResponse }
          ]);
          
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
