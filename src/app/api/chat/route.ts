import { NextRequest } from "next/server";
import OpenAI from "openai";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  // ReadableStream: keep sending data to frontend
  const stream = new ReadableStream({
    start(controller) {
      // handle one LLM  response
      async function streamResponse(prompt: string, responseType: string) {
        try {
          const llmStream = await openrouter.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            stream: true,
          });

          // loop through each streamed chunk from LLM and send to frontend
          for await (const chunk of llmStream) {
            const text_content = chunk.choices[0]?.delta?.content || "";

            if (text_content) {
              console.log(
                `${responseType} chunk:`,
                JSON.stringify(text_content)
              );

              // converting raw content in JSON format
              const data = JSON.stringify({
                type: responseType,
                content: text_content,
              });

              // sending structured data to frontend
              controller.enqueue(`data: ${data}\n\n`);
            }
          }

          // send completion signal to frontend that the whole response is done
          const doneData = JSON.stringify({
            type: responseType,
            done: true, 
          });
          controller.enqueue(`data: ${doneData}\n\n`);
        
        } catch (error: any) {
          console.error(`❌ ${responseType} stream failed:`, error.message);

          const errorData = JSON.stringify({
            type: responseType,
            error: error.message,
          });
          controller.enqueue(`data: ${errorData}\n\n`);
        }
      }

      // parallel LLM calls 
      Promise.allSettled([
        streamResponse(`Give a simple, short answer: ${message}`, "simple"),
        streamResponse(
          `Give a detailed, comprehensive answer: ${message}`,
          "detailed"
        ),
        streamResponse(`Give a creative, fun answer: ${message}`, "creative"),
      ]).then((results) => {
        console.log(" all streams completed:", results);

        // Send final completion signal to frontend
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
