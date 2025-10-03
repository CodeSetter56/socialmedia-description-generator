// components/Button.tsx

"use client";

import Link from "next/link";
import { ButtonPropsType } from "@/utils/types";
import { useChat } from "@/context/ChatContext";

export default function Button(props: ButtonPropsType) {
  const {
    children,
    color = "bg-amber-900",
    padding = "px-6 py-3",
    icon: Icon,
    iconPosition = "right",
    className = "",
    ignoreLoading = false,
    disabled,
    ...rest
  } = props;

  const { isLoading } = useChat();

  // Determine if button should be disabled
  const shouldDisable = !!disabled || (!ignoreLoading && isLoading);

  // Centralized base styles for all buttons and links
  const baseStyles = `font-semibold text-white rounded-lg hover:bg-amber-950 transition-all inline-flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed`;

  // icon orientation and content
  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-5 h-5" />}
    </>
  );

  // if link
  if ("href" in props && props.href) {
    const linkClasses = `${baseStyles} ${padding} ${color} ${className} ${
      shouldDisable ? "pointer-events-none opacity-50" : ""
    }`;

    return (
      <Link
        href={shouldDisable ? "#" : props.href}
        className={linkClasses}
        onClick={(e) => {
          if (shouldDisable) {
            e.preventDefault();
          }
        }}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  // if not link
  return (
    <button
      className={`${baseStyles} ${padding} ${color} ${className}`}
      disabled={shouldDisable}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
