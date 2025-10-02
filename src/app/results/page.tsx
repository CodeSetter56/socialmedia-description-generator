"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { startStreaming } from "./startStreaming";
import CreateBox from "./CreateBox";

export default function ResultsPage() {
  const router = useRouter();
  const { message, platforms, setResponses, setIsLoading, isLoading, setFile } =
    useChat();

  useEffect(() => {
    if (!message || platforms.length === 0) {
      router.push("/");
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;

    startStreaming(message, platforms, setResponses, setIsLoading, signal);

    return () => {
      controller.abort();
    };
  }, [message, platforms, router, setResponses, setIsLoading]);

  return (
    <div className="w-full mx-auto px-8 pb-20 pt-8 bg-gray-50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex-grow">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Generated Posts
          </h1>
          <p className="text-gray-600 break-words">
            Message: <span className="font-semibold text-black">{message}</span>
          </p>
        </div>

        <button
          disabled={isLoading}
          onClick={() => {
            setFile(null);
            router.push("/inputs");
          }}
          className="px-6 py-2 bg-gray-300 disabled:bg-gray-200 rounded-lg hover:bg-gray-400 transition-all w-full sm:w-auto flex-shrink-0"
        >
          New Post
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {platforms.map((platformId) => (
          <CreateBox key={platformId} type={platformId} />
        ))}
      </div>
      {isLoading && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-lg text-gray-600">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="ml-2">Generating posts...</span>
          </div>
        </div>
      )}
    </div>
  );
}
