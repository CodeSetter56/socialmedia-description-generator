// app/upload/InputForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { platformConfig } from "@/utils/config";
import { PlatformId, PlatformType } from "@/utils/types";
import Button from "@/components/Button";

import { useChat } from "@/context/ChatContext";

export default function InputForm() {
  const router = useRouter();
  const { file, setMessage, setPlatforms, setIsLoading } = useChat();
  const [inputMessage, setInputMessage] = useState<string>("");
  // array of selected platform ids
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
    // Check if we have either an image OR text
    if (!file && !inputMessage.trim()) {
      alert("Please upload an image or provide a description");
      return;
    }

    if (platformToggle.length === 0) {
      alert("Select at least one platform");
      return;
    }

    setIsLoading(true);
    setMessage(inputMessage); // Can be empty
    setPlatforms(platformToggle);
    
    router.push("/results");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col justify-center">
      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your post{" "}
            {file && <span className="text-gray-500">(optional)</span>}
          </label>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Hint: the ai can study the uploaded image, but you can add your own thoughts briefly. 
Talk about:
- what you feel about the image
- what you want to promote
- some engaging question
you can use line breaks for multiple points. The ai response will improve with more context.

eg: (You uploaded a selfie)
-my face
-feeling happy
-what are your ways to stay positive?`}
            className="w-full bg-amber-50 px-4 py-3 text-lg text-black border-1 border-amber-900 rounded-lg focus:outline-none focus:border-amber-950 focus:ring-1 focus:ring-grey-200 transition-all resize-none"
            rows={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selected platforms: {platformToggle.length}
          </label>
          <div className="flex items-center gap-6 justify-center">
            {platformConfig.map(({ id, icon: Icon, color }: PlatformType) => {
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
            })}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={(!file && !inputMessage.trim()) || platformToggle.length === 0}
          className="self-center"
        >
          Generate
        </Button>
      </div>
    </div>
  );
}
