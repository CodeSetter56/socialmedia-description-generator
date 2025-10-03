// app/upload/ImageForm.tsx

"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

import { MyFile } from "@/utils/types";

import { useChat } from "@/context/ChatContext";

const getOrientation = (w: number, h: number): MyFile["orientation"] => {
  if (w > h) return "landscape";
  if (h > w) return "portrait";
  return "square";
};

export default function ImageForm() {
  const { file, setFile } = useChat();

  // useCallback to avoid re-creating the function on every render
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles?.length) return;

      const newFile = acceptedFiles[0];
      const preview = URL.createObjectURL(newFile);

      const img = new Image();
      img.src = preview;

      img.onload = () => {
        const { naturalWidth: width, naturalHeight: height } = img;

        setFile(
          // merge file with preview, width, height, orientation
          Object.assign(newFile, {
            preview,
            width,
            height,
            orientation: getOrientation(width, height),
          }) as MyFile
        );
      };
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // cleanup previews on unmount or file change
  useEffect(() => {
    return () => {
      if (file?.preview) URL.revokeObjectURL(file.preview);
    };
    // dependency on file change
  }, [file]);

  return (
    <div
      {...getRootProps({
        className:
          "p-6 w-full h-full flex items-center justify-center border-1 rounded-lg transition-colors border-amber-900",
      })}
    >
      <input {...getInputProps()} />

      <div
        className={`aspect-square w-full max-w-[500px] flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer border-amber-900
      ${
        isDragActive
          ? "border-amber-900 bg-amber-50"
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
      >
        {file ? (
          <div className="w-full h-full flex items-center justify-center bg-black rounded-md overflow-hidden ">
            <img
              src={file.preview}
              className="object-contain max-w-full max-h-full "
            />
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            {isDragActive
              ? "Drop the image here"
              : "Drag and drop an image or click to select"}
          </p>
        )}
      </div>
    </div>
  );
}
