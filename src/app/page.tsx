"use client";

import { useState } from "react";

type ResponseType = "simple" | "detailed" | "creative";
type Responses = {
  simple: string;
  detailed: string;
  creative: string;
};

const responseConfig = {
  simple: {
    title: "Simple",
    color: "text-green-600",
  },
  detailed: {
    title: "Detailed",
    color: "text-blue-600",
  },
  creative: {
    title: "Creative",
    color: "text-red-600",
  },
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<Responses>({
    simple: "",
    detailed: "",
    creative: "",
  });

  //response boxes
  const createBox = (type: ResponseType) => {
    const config = responseConfig[type];
    const responseText = responses[type];

    return (
      <div
        key={type}
        className="flex-1 min-w-[300px] border-2 rounded-lg p-4 bg-gray-50 border-gray-200"
      >
        <h3 className={`${config.color} text-lg font-semibold mb-3`}>
          {config.title}
        </h3>
        <div className="min-h-[150px] whitespace-pre-wrap leading-relaxed text-gray-800">
          {responseText ||
            (isLoading ? (
              <span className="text-gray-500 italic">Typing...</span>
            ) : (
              <span className="text-gray-400 italic">
                Response will appear here...
              </span>
            ))}
        </div>
      </div>
    );
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    console.log("message to backend:", message);

    setIsLoading(true);
    setResponses({ simple: "", detailed: "", creative: "" });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      console.log("Response received");

      // allows reading data chunks from a stream one by one
      const reader = response.body?.getReader();
      // converts raw bytes into readable text strings
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {

          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          // converts the byte array chunk into a readable string
          const chunk = decoder.decode(value);
          console.log("chunk:", chunk);
          const lines = chunk.split("\n");

          for (const line of lines) {
            // server sent response lines start with "data: "
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                console.log("Parsed data:", data);

                // final server sent signal after all streams are done
                if (data.type === "all_done") {
                  console.log("completed");
                  setIsLoading(false);
                  break;
                }

                if (
                  data.content &&
                  data.type &&
                  (data.type === "simple" ||
                    data.type === "detailed" ||
                    data.type === "creative")
                ) {
                  const responseType = data.type as ResponseType;
                  console.log(
                    `adding content to ${responseType}:`,
                    data.content
                  );

                  setResponses((prev) => ({
                    ...prev,
                    // add new content to the end of existing text
                    [responseType]: prev[responseType] + data.content,
                  }));
                }

                if (data.error) {
                  console.error(`Error in ${data.type}:`, data.error);
                }
              } catch (e) {
                console.error("JSON parsing error:", e);
              }
            }
          }
        }
      }
      
    } catch (error) {
      console.error("Fetch error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Parallel AI Responses
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask something interesting..."
              className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className={`px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Streaming...
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {(["simple", "detailed", "creative"] as ResponseType[]).map(
            createBox
          )}
        </div>

        {isLoading && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 text-lg text-gray-600">
              <div className="animate-pulse h-3 w-3 bg-green-500 rounded-full"></div>
              <div className="animate-pulse h-3 w-3 bg-blue-500 rounded-full animation-delay-200"></div>
              <div className="animate-pulse h-3 w-3 bg-red-500 rounded-full animation-delay-400"></div>
              <span className="ml-2">AI models are thinking...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
