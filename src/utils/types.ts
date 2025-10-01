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

export type ChatContextType = {
  message: string,
  setMessage: (msg: string) => void,
  platforms: PlatformId[],
  setPlatforms: (platforms: PlatformId[]) => void,
  responses: Responses,
  setResponses: Dispatch<SetStateAction<Responses>>,
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void,
};
