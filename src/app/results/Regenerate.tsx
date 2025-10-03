// app/results/Regenerate.ts

import { PlatformId, ChatContextType, MyFile, Responses } from "@/utils/types";
import type { MutableRefObject } from "react";
type StartStreamingFn = (
  message: string,
  platforms: PlatformId[],
  file: MyFile | null,
  setResponses: ChatContextType["setResponses"],
  setIsLoading: (loading: boolean) => void,
  signal: AbortSignal
) => Promise<void>;

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
  abortControllerRef: MutableRefObject<AbortController | null>,
  startStreaming: StartStreamingFn
) => {
  // Clear responses for selected platforms before regenerating
  setResponses((prev: Responses) => {
    const reset = { ...prev };
    platforms.forEach((platform) => {
      reset[platform] = "";
    });
    return reset;
  });

  abortControllerRef.current = new AbortController();
  startStreaming(
    message ?? "",
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
  abortControllerRef: MutableRefObject<AbortController | null>,
  startStreaming: StartStreamingFn
) => {
  // Clear response for this platform before regenerating
  setResponses((prev: Responses) => ({
    ...prev,
    [platformId]: "",
  }));

  abortControllerRef.current = new AbortController();
  startStreaming(
    message ?? "",
    [platformId],
    file,
    setResponses,
    setIsLoading,
    abortControllerRef.current.signal
  );
};
