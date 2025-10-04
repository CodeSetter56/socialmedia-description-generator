import { getPrompt } from "@/lib/platformPrompts";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { PlatformId } from "@/utils/types"; 

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: NextRequest) {
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
      let isClosed = false; // Track controller state

      // Safe enqueue wrapper to prevent writing to closed controller
      const safeEnqueue = (data: string) => {
        if (!isClosed) {
          try {
            controller.enqueue(data);
          } catch (error) {
            isClosed = true;
            console.error("Failed to enqueue data:", error);
          }
        }
      };

      // handle one LLM response for a specific platform
      async function streamResponse(platformId: string) {
        try {
          const prompt = getPrompt(
            platformId as PlatformId,
            message || "",
            !!image
          );

          // Build messages array based on whether we have an image
          const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

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
            model: "mistralai/mistral-small-3.2-24b-instruct:free",
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
              safeEnqueue(`data: ${data}\n\n`);
            }
          }

          // send completion signal to frontend that this platform's response is done
          const doneData = JSON.stringify({
            type: platformId,
            done: true,
          });
          safeEnqueue(`data: ${doneData}\n\n`);
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error(`${platformId} stream failed:`, errorMessage);

          const errorData = JSON.stringify({
            type: platformId,
            error: errorMessage,
          });
          safeEnqueue(`data: ${errorData}\n\n`);
        }
      }

      // stream for selected platforms
      const streamPromises = platforms.map((platformId: string) =>
        streamResponse(platformId)
      );

      // parallel LLM call
      Promise.allSettled(streamPromises).then(() => {

        // final completion signal to frontend
        safeEnqueue(`data: ${JSON.stringify({ type: "all_done" })}\n\n`);

        if (!isClosed) {
          isClosed = true;
          controller.close();
        }
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
