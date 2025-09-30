"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { ResponseType } from "@/utils/types";
import { startStreaming } from "./startStreaming";
import CreateBox from "./CreateBox";

export default function ResultsPage() {

  const router = useRouter();
  const { message, setResponses, setIsLoading, isLoading } = useChat();

  useEffect(() => {
    if (!message) {
      router.push("/");
      return;
    }

    // abort controller to cancel fetch on unmount or re-run
    const controller = new AbortController();
    const signal = controller.signal;

    startStreaming(message, setResponses, setIsLoading, signal);

    // abort the first request in strict mode
    // abort the active request on refresh or navigation 
    return () => {
      controller.abort();
    };
    //message in dependency array to allow new fetches on new messages
  }, [message, router, setResponses, setIsLoading]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex-grow">

            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              AI Responses
            </h1>
            <p className="text-gray-600 break-words">
              Question:{" "}
              <span className="font-semibold text-black">{message}</span>
            </p>
          </div>
          
          <button
            onClick={() => {
              router.push("/");
            }}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all w-full sm:w-auto flex-shrink-0"
          >
            New Question
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {(["simple", "detailed", "creative"] as ResponseType[]).map(
            (type) => (
              <CreateBox key={type} type={type} />
            )
          )}
        </div>

        {isLoading && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 text-lg text-gray-600">
              <div className="animate-pulse h-3 w-3 bg-green-500 rounded-full"></div>
              <div
                className="animate-pulse h-3 w-3 bg-blue-500 rounded-full"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="animate-pulse h-3 w-3 bg-red-500 rounded-full"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <span className="ml-2">thinking...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
