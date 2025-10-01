"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { platformConfig } from "@/utils/config";
import { PlatformId, PlatformType } from "@/utils/types";
import { useChat } from "@/context/ChatContext";

export default function InputPage() {
  const router = useRouter();
  const { setMessage, setPlatforms } = useChat();
  const [inputMessage, setInputMessage] = useState<string>("");
  const [platformToggle, setPlatformToggle] = useState<PlatformId[]>([]);

  const handlePlatformSelect = (isActive: boolean, id: PlatformId) => {
    if (isActive) {
      // remove from array
      setPlatformToggle(platformToggle.filter((pId) => pId !== id));
    } else {
      // add to array
      setPlatformToggle([...platformToggle, id]);
    }
  };

  const handleSubmit = () => {
    if (!inputMessage.trim()) return;
    if (platformToggle.length === 0) {
      alert("select at least one platform");
      return;
    }

    setMessage(inputMessage);
    setPlatforms(platformToggle);
    
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Social Media Post Generator
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your post
              </label>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Describe your post and select platforms"
                className="w-full px-4 py-3 text-lg text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Selected platforms: {platformToggle.length}
              </label>
              <div className="flex items-center gap-6 justify-center">
                {platformConfig.map(
                  ({ id, icon: Icon, color }: PlatformType) => {
                    const isActive = platformToggle.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => handlePlatformSelect(isActive, id)}
                        className="flex flex-col items-center gap-2 p-3 transition-all hover:scale-110"
                      >
                        <Icon
                          className={`h-10 w-10 ${
                            isActive ? color : "text-gray-400"
                          }`}
                        />
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!inputMessage.trim() || platformToggle.length === 0}
              className="self-center px-8 py-3 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:shadow-lg transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed "
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}