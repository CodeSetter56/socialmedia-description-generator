"use client";

import { useChat } from "@/context/ChatContext";
import { platformConfig } from "@/utils/config";
import { PlatformId } from "@/utils/types";

const CreateBox = ({ type }: { type: PlatformId }) => {
  const { responses, isLoading } = useChat();

  // Find the platform configuration
  const config = platformConfig.find((p) => p.id === type);
  if (!config) return null;

  const responseText = responses[type];

  return (
    <div className="flex-1 min-w-[300px] border-2 rounded-lg p-4 bg-white border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <config.icon className={`h-6 w-6 ${config.color}`} />
        <h3 className={`${config.color} text-lg font-semibold`}>{type}</h3>
      </div>
      <div className="min-h-[150px] whitespace-pre-wrap leading-relaxed text-black">
        {responseText ? (
          responseText
        ) : isLoading ? (
          <span className="text-gray-500 italic">Typing...</span>
        ) : (
          <span className="text-gray-400 italic">No response yet</span>
        )}
      </div>
    </div>
  );
};

export default CreateBox;
