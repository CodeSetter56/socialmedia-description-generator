// app/results/CreateBox.tsx

"use client";

import { IoMdRefresh, IoMdClipboard, IoMdCheckmark } from "react-icons/io";
import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { platformConfig } from "@/utils/config";
import { PlatformId } from "@/utils/types";
import { handleCopy, handleRegenerateSingle } from "./Regenerate";
import { startStreaming } from "@/app/results/startStreaming";

interface CreateBoxProps {
  type: PlatformId;
  globalAbortControllerRef: React.MutableRefObject<AbortController | null>;
}

const CreateBox = ({ type, globalAbortControllerRef }: CreateBoxProps) => {
  const { responses, isLoading, message, file, setResponses, setIsLoading } =
    useChat();

  const [copiedPlatform, setCopiedPlatform] = useState<PlatformId | null>(null);

  const config = platformConfig.find((p) => p.id === type);
  if (!config) return null;

  const responseText = responses[type];
  const isCopied = copiedPlatform === type;

  return (
    <div className="flex flex-col border-2 rounded-lg bg-white border-gray-200 shadow-sm h-[400px]">
      {/* Header */}
      <div className="flex justify-between items-center gap-2 p-3 border-b">
        <div className="flex gap-2">
          <config.icon className={`h-6 w-6 ${config.color}`} />
          <h3 className={`${config.color} text-lg font-semibold`}>{type}</h3>
        </div>

        <div className="flex gap-2">
          {/* Copy button */}
          <button
            onClick={() => handleCopy(responseText, type, setCopiedPlatform)}
            disabled={!responseText || isLoading}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
              isCopied
                ? "bg-gray-300 text-white"
                : "bg-amber-900 text-white hover:bg-amber-950"
            } disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400`}
          >
            {isCopied ? (
              <IoMdCheckmark size={20} />
            ) : (
              <IoMdClipboard size={20} />
            )}
          </button>

          {/* Regenerate button */}
          <button
            onClick={() =>
              handleRegenerateSingle(
                message,
                type,
                file,
                setResponses,
                setIsLoading,
                globalAbortControllerRef,
                startStreaming
              )
            }
            disabled={isLoading}
            className="w-10 h-10 flex items-center justify-center bg-amber-900 text-white rounded-lg hover:bg-amber-950 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
          >
            <IoMdRefresh size={20} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 whitespace-pre-wrap leading-relaxed text-black">
        {responseText ? (
          responseText
        ) : (
          <span className="text-gray-500 italic">Typing...</span>
        )}
      </div>
    </div>
  );
};

export default CreateBox;
