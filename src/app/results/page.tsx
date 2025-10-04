"use client";

import { IoMdRefresh, IoMdArrowBack, IoMdClose } from "react-icons/io";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useChat } from "@/context/ChatContext";
import { PlatformId } from "@/utils/types";
import { handleRegenerateAll } from "./Regenerate";
import { startStreaming } from "./startStreaming";
import CreateBox from "./CreateBox";
import Button from "@/components/Button";

export default function ResultsPage() {
  const router = useRouter();
  const {
    message,
    file,
    setFile,
    platforms,
    setResponses,
    isLoading,
    setIsLoading,
  } = useChat();

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    startStreaming(
      message,
      platforms,
      file,
      setResponses,
      setIsLoading,
      abortControllerRef.current.signal
    );

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [message, file, platforms, setResponses, setIsLoading, router]);

  const handleBack = () => {
    setFile(null);
    router.push("/upload");
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 bg-white rounded-xl shadow-md p-4 md:p-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
              Generated Posts for:
            </h1>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6">
            {/* Only show preview and user input on md+ screens */}
            <div className="hidden md:block w-[25%] flex-shrink-0 relative h-64">
              {file && (
                <Image
                  src={file.preview}
                  alt="Uploaded content"
                  fill
                  className="rounded-lg shadow-sm object-cover"
                  unoptimized
                />
              )}
            </div>
            <div className="hidden md:block w-[55%] flex-shrink-0">
              <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  User Input:
                </h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {message || "No user input"}
                </p>
              </div>
            </div>
            {/* Buttons always visible */}
            <div className="w-full md:flex-1 flex flex-col justify-center gap-6 md:gap-10 min-h-[8rem] md:min-h-[16rem]">
              <Button
                onClick={handleBack}
                icon={IoMdArrowBack}
                iconPosition="left"
                padding="px-6 py-2.5"
              >
                Back
              </Button>
              {isLoading ? (
                <Button
                  onClick={handleAbort}
                  icon={IoMdClose}
                  iconPosition="left"
                  padding="px-6 py-2.5"
                  ignoreLoading={true}
                >
                  Stop
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    handleRegenerateAll(
                      message,
                      platforms,
                      file,
                      setResponses,
                      setIsLoading,
                      abortControllerRef,
                      startStreaming
                    )
                  }
                  icon={IoMdRefresh}
                  iconPosition="left"
                  padding="px-6 py-2.5"
                >
                  Regenerate All
                </Button>
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="mb-6 text-center">
            <p className="text-gray-600 animate-pulse">
              Generating content for {platforms.length} platform
              {platforms.length > 1 ? "s" : ""}...
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platformId: PlatformId) => (
            <CreateBox
              key={platformId}
              type={platformId}
              globalAbortControllerRef={abortControllerRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
