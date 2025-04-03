"use client";

import React from "react";
import { useCursorInteraction } from "./useCursorInteraction";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  interactive = false,
  ...props
}) => {
  const cursorProps = interactive ? useCursorInteraction() : {};

  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg shadow-sm
        overflow-hidden
        transition-all duration-200
        ${interactive ? "hover:shadow-md transform hover:-translate-y-1" : ""}
        ${className}
      `}
      {...(interactive ? cursorProps : {})}
      {...props}
    >
      {children}
    </div>
  );
};
