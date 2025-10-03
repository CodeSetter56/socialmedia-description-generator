// app/results/startStreaming.ts

import { ChatContextType, PlatformId, MyFile } from "@/utils/types";

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data:image/xxx;base64, prefix
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const startStreaming = async (
  message: string,
  platforms: PlatformId[],
  file: MyFile | null,
  setResponses: ChatContextType["setResponses"],
  setIsLoading: (loading: boolean) => void,
  signal: AbortSignal
) => {
  if ((!message && !file) || platforms.length === 0) return;

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
    // Convert image to base64 if exists
    let imageBase64 = null;
    let imageType = null;

    if (file) {
      imageBase64 = await fileToBase64(file);
      imageType = file.type;
    }

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        platforms,
        image: imageBase64,
        imageType: imageType,
      }),
      signal, // attach the AbortSignal to the fetch request
    });

    if (!response.body) {
      throw new Error("Response body is empty.");
    }

    // ReadableStreamDefaultReader - allows reading data chunks from a stream one by one
    const reader = response.body.getReader();
    // Ensure we cancel the reader if the request is aborted after response
    const onAbort = () => {
      try {
        reader.cancel();
      } catch (e) {
        // ignore
      }
    };

    if (signal.aborted) {
      onAbort();
      setIsLoading(false);
      return;
    }

    signal.addEventListener("abort", onAbort, { once: true });
    // TextDecoder - converts raw bytes into readable text strings
    const decoder = new TextDecoder();

    while (true) {
      if (signal.aborted) {
        try {
          reader.cancel();
        } catch (e) {
          // ignore
        }
        setIsLoading(false);
        break;
      }
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
    setIsLoading(false);
  }
};
