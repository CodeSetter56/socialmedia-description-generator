import { ChatContextType, ResponseType } from "@/utils/types";

export const startStreaming = async (
  message: string,
  setResponses: ChatContextType["setResponses"],
  setIsLoading: (loading: boolean) => void,
  signal: AbortSignal
) => {
  if (!message) return;
  setIsLoading(true);
  setResponses({ simple: "", detailed: "", creative: "" });

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal, // attach the AbortSignal to the fetch request
    });

    if (!response.body) {
      throw new Error("Response body is empty.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setIsLoading(false);
        break;
      }

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
              break;
            }

            if (content && type) {
              setResponses((prev) => ({
                ...prev,
                [type as ResponseType]: prev[type as ResponseType] + content,
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
