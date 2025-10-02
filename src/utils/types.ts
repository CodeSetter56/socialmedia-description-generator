import { Dispatch, SetStateAction } from "react";

export type PlatformId = "Twitter" | "Facebook" | "LinkedIn" | "Instagram";

export type PlatformType = {
  id: PlatformId,
  icon: React.ElementType,
  color: string,
};

export type Responses = {
  Twitter: string,
  Facebook: string,
  LinkedIn: string,
  Instagram: string,
};

export interface MyFile extends File {
  preview: string;
  width: number;
  height: number;
  orientation: "portrait" | "landscape" | "square";
}

export type ChatContextType = {
  file: MyFile | null,
  setFile: (file: MyFile | null) => void,
  message: string,
  setMessage: (msg: string) => void,
  platforms: PlatformId[],
  setPlatforms: (platforms: PlatformId[]) => void,
  responses: Responses,
  setResponses: Dispatch<SetStateAction<Responses>>,
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void,
};
