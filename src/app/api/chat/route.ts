import { getPrompt } from "@/lib/platformPrompts";
import type { PlatformId } from "@/utils/types";
import { NextRequest } from "next/server";
import OpenAI from "openai";

// Minimal message types to satisfy TypeScript without relying on SDK internals
type ImageContent = {
  type: "image_url";
  image_url: { url: string };
};
type TextContent = {
  type: "text";
  text: string;
};
type VisionMessage = {
  role: "user";
  content: Array<ImageContent | TextContent>;
};
type TextMessage = {
  role: "user";
  content: string;
};
type Message = VisionMessage | TextMessage;

export async function POST(request: NextRequest) {
  const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  // from startStreaming
  const { message, platforms, image, imageType } = await request.json();

  // console.log("user message:", message);
  // console.log("selected platforms:", platforms);
  // console.log("has image:", !!image);

  if ((!message && !image) || !platforms || platforms.length === 0) {
    return new Response(
      JSON.stringify({ error: "Message or image, and platforms are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ReadableStream: keep sending data to frontend
  const stream = new ReadableStream({
    start(controller) {
      // handle one LLM response for a specific platform
      async function streamResponse(platformId: string) {
        try {
          const prompt = getPrompt(platformId as PlatformId, message || "", !!image);

          // Build messages array based on whether we have an image
          const messages: Message[] = [];

          if (image) {
            // Vision-enabled message format
            messages.push({
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${imageType || "image/jpeg"};base64,${image}`,
                  },
                },
                {
                  type: "text",
                  text: prompt,
                },
              ],
            });
          } else {
            // Text-only fallback
            messages.push({
              role: "user",
              content: prompt,
            });
          }

          const llmStream = await openrouter.chat.completions.create({
            model: "x-ai/grok-4-fast:free", 
            messages: messages,
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
          } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error(`${platformId} stream failed:`, errorMessage);

          const errorData = JSON.stringify({
            type: platformId,
            error: errorMessage,
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
