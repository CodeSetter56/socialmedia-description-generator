// app/results/Regenerate.ts

import { PlatformId, MyFile, ChatContextType } from "@/utils/types";

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
  startStreaming: (
    message: string,
    platforms: PlatformId[],
    file: MyFile | null,
    setResponses: ChatContextType["setResponses"],
    setIsLoading: (loading: boolean) => void,
    signal: AbortSignal
  ) => void
) => {
  // Abort any existing request first
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  // Clear responses for selected platforms before regenerating
  setResponses((prev) => {
    const reset = { ...prev };
    platforms.forEach((platform) => {
      reset[platform] = "";
    });
    return reset;
  });

  // Create new abort controller for this request
  abortControllerRef.current = new AbortController();
  setIsLoading(true);
  
  startStreaming(
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
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  startStreaming: (
    message: string,
    platforms: PlatformId[],
    file: MyFile | null,
    setResponses: ChatContextType["setResponses"],
    setIsLoading: (loading: boolean) => void,
    signal: AbortSignal
  ) => void
) => {
  // Abort any existing request first
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  // Clear response for this platform before regenerating
  setResponses((prev) => ({
    ...prev,
    [platformId]: "",
  }));

  // Create new abort controller for this request
  abortControllerRef.current = new AbortController();
  setIsLoading(true);
  
  startStreaming(
    message,
    [platformId],
    file,
    setResponses,
    setIsLoading,
    abortControllerRef.current.signal
  );
};
