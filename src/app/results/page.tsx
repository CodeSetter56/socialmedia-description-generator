"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { PlatformId } from "@/utils/types";
import { startStreaming } from "./startStreaming";
import CreateBox from "./CreateBox";

export default function ResultsPage() {
  const router = useRouter();
  const { message, platforms, setResponses, setIsLoading, isLoading } =
    useChat();

  useEffect(() => {
    if (!message || platforms.length === 0) {
      router.push("/");
      return;
    }

    // abort controller to cancel fetch on unmount or re-run
    const controller = new AbortController();
    const signal = controller.signal;

    startStreaming(message, platforms, setResponses, setIsLoading, signal);

    // abort the first request in strict mode
    // abort the active request on refresh or navigation
    return () => {
      controller.abort();
    };
    // message and platforms in dependency array to allow new fetches on changes
  }, [message, platforms, router, setResponses, setIsLoading]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex-grow">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Generated Posts
            </h1>
            <p className="text-gray-600 break-words">
              Context:{" "}
              <span className="font-semibold text-black">{message}</span>
            </p>
          </div>

          <button
            onClick={() => router.push("/inputs")}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all w-full sm:w-auto flex-shrink-0"
          >
            New Post
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}
