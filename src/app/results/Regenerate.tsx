import { ChatContextType, PlatformId, MyFile } from "@/utils/types";
import { startStreaming } from "./startStreaming";

export const handleCopy = (
  text: string | undefined,
  platformId: PlatformId,
  setCopiedPlatform: (id: PlatformId | null) => void
) => {
  if (!text) return;
  navigator.clipboard.writeText(text);
  setCopiedPlatform(platformId);
  setTimeout(() => setCopiedPlatform(null), 2000);
};

export const handleRegenerateAll = (
  message: string | null,
  platforms: PlatformId[],
  file: MyFile | null,
  setResponses: ChatContextType["setResponses"],
  setLoadingForPlatforms: ChatContextType["setLoadingForPlatforms"], // Updated
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  startStreamingFn: typeof startStreaming
) => {
  setResponses((prev) => {
    const reset = { ...prev };
    platforms.forEach((platform) => {
      reset[platform] = "";
    });
    return reset;
  });

  abortControllerRef.current = new AbortController();
  startStreamingFn(
    message,
    platforms,
    file,
    setResponses,
    setLoadingForPlatforms, // Updated
    abortControllerRef.current.signal
  );
};

export const handleRegenerateSingle = (
  message: string | null,
  platformId: PlatformId,
  file: MyFile | null,
  setResponses: ChatContextType["setResponses"],
  setLoadingForPlatforms: ChatContextType["setLoadingForPlatforms"], // Updated
  singleAbortControllerRef: React.MutableRefObject<AbortController | null>, // Renamed for clarity
  startStreamingFn: typeof startStreaming
) => {
  setResponses((prev) => ({
    ...prev,
    [platformId]: "",
  }));

  singleAbortControllerRef.current = new AbortController();
  startStreamingFn(
    message,
    [platformId],
    file,
    setResponses,
    setLoadingForPlatforms, // Updated
    singleAbortControllerRef.current.signal
  );
};
