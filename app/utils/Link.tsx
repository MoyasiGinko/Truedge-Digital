"use client";

import React, { ForwardedRef } from "react";
import NextLink from "next/link";
import { useCursorInteraction } from "./useCursorInteraction";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  underline?: boolean;
  external?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = "",
  underline = true,
  external = false,
  ...props
}) => {
  const cursorProps = useCursorInteraction({
    blendMode: "overlay",
    fillElement: true,
  });

  const linkClasses = `
    relative
    ${
      underline
        ? 'after:content-[""] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-current hover:after:w-full after:transition-all after:duration-300'
        : ""
    }
    ${className}
  `;

  // Destructure ref from cursorProps to avoid passing it to components
  const { ref, ...otherCursorProps } = cursorProps;

  if (external) {
    return (
      <a
        href={href}
        className={linkClasses}
        target="_blank"
        rel="noopener noreferrer"
        {...otherCursorProps}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      className={linkClasses}
      {...otherCursorProps}
      {...props}
    >
      {children}
    </NextLink>
  );
};
