"use client";

import { IoMdRefresh, IoMdClipboard, IoMdCheckmark } from "react-icons/io";
import { useState, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { platformConfig } from "@/utils/config";
import { CreateBoxProps, PlatformId } from "@/utils/types";
import { handleCopy, handleRegenerateSingle } from "./Regenerate";
import { startStreaming } from "@/app/results/startStreaming";

const CreateBox = ({ type }: CreateBoxProps) => {
  const {
    responses,
    isPlatformLoading, 
    message,
    file,
    setResponses,
    setLoadingForPlatforms, 
  } = useChat();

  const [copiedPlatform, setCopiedPlatform] = useState<PlatformId | null>(null);

  // each box has its own abort controller for single regeneration
  const singleAbortControllerRef = useRef<AbortController | null>(null);

  const config = platformConfig.find((p) => p.id === type);
  if (!config) return null;

  const responseText = responses[type];
  const isCopied = copiedPlatform === type;
  const isThisPlatformLoading = isPlatformLoading(type); 

  return (
    <div className="flex flex-col border-2 rounded-lg bg-white border-gray-200 shadow-sm h-[400px]">
      <div className="flex justify-between items-center gap-2 p-3 border-b">
        <div className="flex gap-2">
          <config.icon className={`h-6 w-6 ${config.color}`} />
          <h3 className={`${config.color} text-lg font-semibold`}>{type}</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleCopy(responseText, type, setCopiedPlatform)}
            disabled={!responseText || isThisPlatformLoading} 
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

          <button
            onClick={() =>
              handleRegenerateSingle(
                message,
                type,
                file,
                setResponses,
                setLoadingForPlatforms, 
                singleAbortControllerRef, 
                startStreaming
              )
            }
            disabled={isThisPlatformLoading} // only disabled if this platform is loading
            className="w-10 h-10 flex items-center justify-center bg-amber-900 text-white rounded-lg hover:bg-amber-950 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
          >
            <IoMdRefresh size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 whitespace-pre-wrap leading-relaxed text-black">
        {responseText ? (
          responseText
        ) : (
          <span className="text-gray-500 italic">
            {isThisPlatformLoading ? "Typing..." : "Waiting..."}
          </span>
        )}
      </div>
    </div>
  );
};

export default CreateBox;
