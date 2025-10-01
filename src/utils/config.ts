import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { PlatformType } from "./types";

export const platformConfig: PlatformType[] = [
  {
    id: "Twitter",
    icon: FaTwitter,
    color: "text-blue-400",
  },
  {
    id: "Facebook",
    icon: FaFacebook,
    color: "text-blue-800",
  },
  {
    id: "LinkedIn",
    icon: FaLinkedin,
    color: "text-blue-600",
  },
  {
    id: "Instagram",
    icon: FaInstagram,
    color: "text-pink-500",
  },
];