// app/results/Regenerate.ts

import { PlatformId } from "@/utils/types";

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
  file: any,
  setResponses: (r: any) => void,
  setIsLoading: (loading: boolean) => void,
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  startStreaming: any
) => {
  // Clear responses for selected platforms before regenerating
  setResponses((prev: any) => {
    const reset = { ...prev };
    platforms.forEach((platform) => {
      reset[platform] = "";
    });
    return reset;
  });

  abortControllerRef.current = new AbortController();
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
  file: any,
  setResponses: (r: any) => void,
  setIsLoading: (loading: boolean) => void,
  globalAbortControllerRef: React.MutableRefObject<AbortController | null>,
  startStreaming: any
) => {
  // Clear response for this platform before regenerating
  setResponses((prev: any) => ({
    ...prev,
    [platformId]: "",
  }));

  // Use the global abort controller ref so the stop button can abort individual regenerations
  globalAbortControllerRef.current = new AbortController();
  startStreaming(
    message,
    [platformId],
    file,
    setResponses,
    setIsLoading,
    globalAbortControllerRef.current.signal
  );
};
