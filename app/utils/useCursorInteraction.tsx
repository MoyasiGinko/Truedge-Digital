// hooks/useCursorInteraction.ts
"use client";

import { useState, useRef, useEffect } from "react";
import { useCursor } from "./CursorProvider";

interface UseCursorInteractionProps {
  blendMode?: "normal" | "difference" | "overlay";
  fillElement?: boolean;
}

export const useCursorInteraction = <T extends HTMLElement>({
  blendMode = "normal",
  fillElement = false,
}: UseCursorInteractionProps = {}) => {
  const { setCursorState, setTargetElement } = useCursor();
  // Make the ref generic
  const elementRef = useRef<T | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (isHovering) {
        setCursorState("default");
        setTargetElement(null);

        // Remove any custom styles
        if (elementRef.current) {
          elementRef.current.style.removeProperty("background");
          elementRef.current.style.removeProperty("color");
        }
      }
    };
  }, [isHovering, setCursorState, setTargetElement]);

  const handleMouseEnter = (e: React.MouseEvent<T>) => {
    setCursorState("hover");
    setTargetElement(e.currentTarget);
    setIsHovering(true);

    // Apply fill effect if requested
    if (fillElement) {
      e.currentTarget.style.background = "rgba(56,189,248,0.2)";
      e.currentTarget.style.color = "#fff";
    }

    // Apply blend mode to cursor
    if (blendMode === "difference") {
      document.documentElement.style.setProperty(
        "--cursor-blend-mode",
        "difference"
      );
    } else if (blendMode === "overlay") {
      document.documentElement.style.setProperty(
        "--cursor-blend-mode",
        "overlay"
      );
    } else {
      document.documentElement.style.setProperty(
        "--cursor-blend-mode",
        "normal"
      );
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<T>) => {
    setCursorState("default");
    setTargetElement(null);
    setIsHovering(false);

    // Remove fill effect
    if (fillElement) {
      e.currentTarget.style.removeProperty("background");
      e.currentTarget.style.removeProperty("color");
    }

    document.documentElement.style.setProperty("--cursor-blend-mode", "normal");
  };

  return {
    ref: elementRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };
};
