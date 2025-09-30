"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "../context/ChatContext";

export default function InputPage() {
  const router = useRouter();
  const { message, setMessage } = useChat();
  const [inputMessage, setInputMessage] = useState("");

  // send input message to context and navigate to results page
  const handleSubmit = () => {
    if (!inputMessage.trim()) return;
    setMessage(inputMessage);
    router.push("/results");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Parallel AI Responses
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask something interesting..."
              className="w-full px-4 py-3 text-lg text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            />

            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-8 py-3 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Generate
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">coming soon</p>
        </div>
      </div>
    </div>
  );
}
