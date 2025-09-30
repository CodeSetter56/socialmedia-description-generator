"use client";

import { useChat } from "@/context/ChatContext";
import { responseConfig } from "@/utils/config";
import { ResponseType } from "@/utils/types";

const CreateBox = ({ type }: { type: ResponseType }) => {
  const { responses, isLoading } = useChat();

  const config = responseConfig[type];
  const responseText = responses[type];

  console.log(`CreateBox [${type}]:`, {
    isLoading,
    hasResponseText: !!responseText,
    responseLength: responseText.length,
  });

  return (
    <div className="flex-1 min-w-[300px] border-2 rounded-lg p-4 bg-white border-gray-200 shadow-sm">
      <h3 className={`${config.color} text-lg font-semibold mb-3`}>
        {config.title}
      </h3>
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
