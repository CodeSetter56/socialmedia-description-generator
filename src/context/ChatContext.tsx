"use client";

import { ChatContextType, Responses } from "@/utils/types";
import { createContext, ReactNode, useContext, useState } from "react";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<Responses>({
    simple: "",
    detailed: "",
    creative: "",
  });

  return (
    <ChatContext.Provider
      value={{
        message,
        setMessage,
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
