import { Dispatch, SetStateAction } from "react";
import { IconType } from "react-icons";

export type PlatformId = "Twitter" | "Facebook" | "LinkedIn" | "Instagram";

export type PlatformType = {
  id: PlatformId;
  icon: IconType;
  color: string;
};

export type Responses = {
  Twitter: string;
  Facebook: string;
  LinkedIn: string;
  Instagram: string;
};

export interface MyFile extends File {
  preview: string;
  width: number;
  height: number;
  orientation: "portrait" | "landscape" | "square";
}

export type ChatContextType = {
  file: MyFile | null;
  setFile: (file: MyFile | null) => void;
  message: string;
  setMessage: (msg: string) => void;
  platforms: PlatformId[];
  setPlatforms: (platforms: PlatformId[]) => void;
  responses: Responses;
  setResponses: Dispatch<SetStateAction<Responses>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

type BaseButtonProps = {
  children: React.ReactNode;
  color?: string;
  padding?: string;
  icon?: IconType;
  iconPosition?: "left" | "right";
  className?: string;
  ignoreLoading?: boolean; // flag to ignore global loading
  disabled?: boolean; // explicit disabled prop
};

type ButtonActionProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  // doesnot have link
  href?: never;
};
type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  // has link
  href: string;
};

export type ButtonPropsType = BaseButtonProps &
  (ButtonActionProps | ButtonLinkProps);


export interface CreateBoxProps {
  type: PlatformId;
  globalAbortControllerRef: React.MutableRefObject<AbortController | null>;
}