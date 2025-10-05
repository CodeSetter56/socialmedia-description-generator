"use client";

import { ChatContextType, Responses, PlatformId, MyFile } from "@/utils/types";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from "react";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<MyFile | null>(null);
  const [platforms, setPlatforms] = useState<PlatformId[]>([]);
  // using Set for per-platform loading
  const [loadingPlatforms, setLoadingPlatforms] = useState<Set<PlatformId>>(
    new Set()
  );

  const [responses, setResponses] = useState<Responses>({
    Twitter: "",
    Facebook: "",
    LinkedIn: "",
    Instagram: "",
  });

  // adds a platform to the loading set
  const addLoadingPlatform = useCallback((platformId: PlatformId) => {
    setLoadingPlatforms((prev) => {
      const next = new Set(prev);
      next.add(platformId);
      return next;
    });
  }, []);

  // removes a platform from the loading set
  const removeLoadingPlatform = useCallback((platformId: PlatformId) => {
    setLoadingPlatforms((prev) => {
      const next = new Set(prev);
      next.delete(platformId);
      return next;
    });
  }, []);

  // sets loading state for multiple platforms
  const setLoadingForPlatforms = useCallback(
    (platformIds: PlatformId[], loading: boolean) => {
      setLoadingPlatforms((prev) => {
        const next = new Set(prev);
        if (loading) {
          platformIds.forEach((id) => next.add(id));
        } else {
          platformIds.forEach((id) => next.delete(id));
        }
        return next;
      });
    },
    []
  );

  // clears all loading states
  const clearAllLoading = useCallback(() => {
    setLoadingPlatforms(new Set());
  }, []);

  const isPlatformLoading = useCallback(
    (platformId: PlatformId) => {
      return loadingPlatforms.has(platformId);
    },
    [loadingPlatforms]
  );

  const isAnyLoading = loadingPlatforms.size > 0;

  return (
    <ChatContext.Provider
      value={{
        file,
        setFile,
        message,
        setMessage,
        platforms,
        setPlatforms,
        responses,
        setResponses,
        loadingPlatforms,
        addLoadingPlatform,
        removeLoadingPlatform,
        setLoadingForPlatforms,
        clearAllLoading,
        isPlatformLoading,
        isAnyLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
