import { fileToBase64 } from "@/utils/fileToBase64";
import { ChatContextType, PlatformId, MyFile } from "@/utils/types";

export const startStreaming = async (
  message: string | null,
  platforms: PlatformId[],
  file: MyFile | null,
  setResponses: ChatContextType["setResponses"],
  setLoadingForPlatforms: ChatContextType["setLoadingForPlatforms"],
  signal: AbortSignal
) => {
  if ((!message && !file) || platforms.length === 0) {
    setLoadingForPlatforms(platforms, false);
    return;
  }

  if (signal.aborted) {
    setLoadingForPlatforms(platforms, false);
    return;
  }

  setLoadingForPlatforms(platforms, true);

  setResponses((prev) => {
    const reset = { ...prev };
    platforms.forEach((platform) => {
      reset[platform] = "";
    });
    return reset;
  });

  try {
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
        message: message || "",
        platforms,
        image: imageBase64,
        imageType: imageType,
      }),
      signal,
    });

    if (!response.body) {
      throw new Error("Response body is empty.");
    }

    // Read the streaming response 
    const reader = response.body.getReader();
    // decider to convert response to string
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setLoadingForPlatforms(platforms, false);
        break;
      }

      // decode the received chunk and process it
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        // Each line in the stream is prefixed with "data: "
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            const { type, content, error } = data;

            // server sent signal that all platforms are done
            if (type === "all_done") {
              setLoadingForPlatforms(platforms, false);
              return;
            }

            // append content to the respective platform response
            if (content && type) {
              setResponses((prev) => ({
                ...prev,
                [type]: prev[type as PlatformId] + content,
              }));
            }

            if (error) {
              console.error(`Error in stream for type ${type}:`, error);

              if (
                error.includes("429") ||
                error.includes("Rate limit exceeded") ||
                error.includes("quota")
              ) {
                alert(
                  "⚠️ Model quota exhausted or daily free limit reached.\nPlease wait or upgrade your API plan."
                );
              }
            }
          } catch (e) {
            console.error("Failed to parse stream data:", e);
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log("Fetch aborted by user");
    } else {
      console.error("Fetch error:", error);

      if (
        error instanceof Error &&
        (error.message.includes("429") ||
          error.message.includes("Rate limit exceeded") ||
          error.message.includes("quota"))
      ) {
        alert(
          "⚠️ Model quota exhausted or daily free limit reached.\nPlease wait or upgrade your API plan."
        );
      } else {
        alert("❌ Unable to connect to the server. Please try again later.");
      }
    }

    setLoadingForPlatforms(platforms, false);
  }
};
