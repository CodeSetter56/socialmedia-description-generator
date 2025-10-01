import { getPrompt } from "@/lib/platformPrompts";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: NextRequest) {
  // from startStreaming in results/page.tsx
  const { message, platforms } = await request.json();

  // console.log("user message:", message);
  // console.log("selected platforms:", platforms);

  if (!message || !platforms || platforms.length === 0) {
    return new Response(
      JSON.stringify({ error: "Message and platforms are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ReadableStream: keep sending data to frontend
  const stream = new ReadableStream({
    start(controller) {

      // handle one LLM response for a specific platform
      async function streamResponse(platformId: string) {
        try {

          const prompt = getPrompt(platformId as any, message);

          const llmStream = await openrouter.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            stream: true, 
          });

          for await (const chunk of llmStream) {
            const text_content = chunk.choices[0]?.delta?.content || "";

            if (text_content) {
              const data = JSON.stringify({
                type: platformId,
                content: text_content,
              });

              // send structured data to frontend 
              controller.enqueue(`data: ${data}\n\n`);
            }
          }

          // send completion signal to frontend that this platform's response is done
          const doneData = JSON.stringify({
            type: platformId,
            done: true,
          });
          controller.enqueue(`data: ${doneData}\n\n`);
        } catch (error: any) {
          console.error(`${platformId} stream failed:`, error.message);

          const errorData = JSON.stringify({
            type: platformId,
            error: error.message,
          });
          controller.enqueue(`data: ${errorData}\n\n`);
        }
      }

      // stream for selected platforms
      const streamPromises = platforms.map((platformId: string) =>
        streamResponse(platformId)
      );

      // parallel LLM call
      Promise.allSettled(streamPromises).then((results) => {
        console.log("all streams completed:", results);

        // final completion signal to frontend
        controller.enqueue(`data: ${JSON.stringify({ type: "all_done" })}\n\n`);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream", 
      "Cache-Control": "no-cache", 
      Connection: "keep-alive",
    },
  });
}
