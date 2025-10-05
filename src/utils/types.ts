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
  // setresponses using dispatch function to update specific platform response and setstateaction for resetting all responses
  setResponses: Dispatch<SetStateAction<Responses>>;
  
  // for handling loading states per platform
  loadingPlatforms: Set<PlatformId>;
  addLoadingPlatform: (platformId: PlatformId) => void;
  removeLoadingPlatform: (platformId: PlatformId) => void;
  setLoadingForPlatforms: (platformIds: PlatformId[], loading: boolean) => void;
  clearAllLoading: () => void;
  isPlatformLoading: (platformId: PlatformId) => boolean;
  isAnyLoading: boolean;
};

export interface CreateBoxProps {
  type: PlatformId;
}

type BaseButtonProps = {
  children: React.ReactNode;
  color?: string;
  padding?: string;
  icon?: IconType;
  iconPosition?: "left" | "right";
  className?: string;
  ignoreLoading?: boolean;
  disabled?: boolean;
};

type ButtonActionProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export type ButtonPropsType = BaseButtonProps &
  (ButtonActionProps | ButtonLinkProps);

