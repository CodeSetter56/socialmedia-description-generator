import { ChatContextType, PlatformId } from "@/utils/types";

export const startStreaming = async (
  message: string,
  platforms: PlatformId[],
  setResponses: ChatContextType["setResponses"],
  setIsLoading: (loading: boolean) => void,
  signal: AbortSignal
) => {
  if (!message || platforms.length === 0) return;

  //already set loading true in InputForm
  setIsLoading(true);

  // reset only selected platforms to empty strings
  setResponses((prev) => {
    const reset = { ...prev };
    platforms.forEach((platform) => {
      reset[platform] = "";
    });
    return reset;
  });

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, platforms }), 
      signal, // attach the AbortSignal to the fetch request
    });

    if (!response.body) {
      throw new Error("Response body is empty.");
    }

    // ReadableStreamDefaultReader - allows reading data chunks from a stream one by one
    const reader = response.body.getReader();
    // TextDecoder - converts raw bytes into readable text strings
    const decoder = new TextDecoder();

    while (true) {

      const { done, value } = await reader.read();
      if (done) {
        setIsLoading(false);
        break;
      }

      // convert byte array chunk into a readable string
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        // server sent response starts with "data: "
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            const { type, content, error } = data;
            // server sent signal that all responses are done
            if (type === "all_done") {
              setIsLoading(false); // mark as done here
              return;  
            }

            if (content && type) {
              setResponses((prev) => ({
                ...prev,
                [type]: prev[type as PlatformId] + content,
              }));
            }

            if (error) {
              console.error(`Error in stream for type ${type}:`, error);
            }
          } catch (e) {
            console.error("Failed to parse stream data:", e);
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Fetch aborted");
    } else {
      console.error("Fetch error:", error);
    }
  }
};
