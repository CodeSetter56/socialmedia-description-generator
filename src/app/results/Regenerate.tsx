import { ChatContextType, PlatformId, MyFile } from "@/utils/types";

// Import the actual startStreaming function
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
  setIsLoading: (loading: boolean) => void,
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
    setIsLoading,
    abortControllerRef.current.signal
  );
};

export const handleRegenerateSingle = (
  message: string | null,
  platformId: PlatformId,
  file: MyFile | null,
  setResponses: ChatContextType["setResponses"],
  setIsLoading: (loading: boolean) => void,
  globalAbortControllerRef: React.MutableRefObject<AbortController | null>,
  startStreamingFn: typeof startStreaming
) => {
  
  setResponses((prev) => ({
    ...prev,
    [platformId]: "",
  }));

  globalAbortControllerRef.current = new AbortController();
  startStreamingFn(
    message,
    [platformId],
    file,
    setResponses,
    setIsLoading,
    globalAbortControllerRef.current.signal
  );
};
