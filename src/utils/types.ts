import { Dispatch, SetStateAction } from "react";

export type ResponseType = "simple" | "detailed" | "creative";

export type Responses = {
  simple: string;
  detailed: string;
  creative: string;
};

export type ChatContextType = {
  message: string;
  setMessage: (msg: string) => void;
  responses: Responses;
  setResponses: Dispatch<SetStateAction<Responses>>; 
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};