"use client";

import { ChatContextType, Responses, PlatformId, MyFile } from "@/utils/types";
import { createContext, ReactNode, useContext, useState } from "react";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<MyFile|null>(null);
  const [platforms, setPlatforms] = useState<PlatformId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<Responses>({
    Twitter: "",
    Facebook: "",
    LinkedIn: "",
    Instagram: "",
  });

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
        isLoading,
        setIsLoading,
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
