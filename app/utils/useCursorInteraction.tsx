"use client";

import { useEffect, useRef, useState } from "react";
import { useCursor } from "./CursorProvider";

interface FluidCursorInteractionOptions {
  blendMode?:
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "difference"
    | "exclusion"
    | "soft-light"
    | "hard-light";
  color?: string;
  fillElement?: boolean;
  scale?: number;
  expandOnHover?: boolean;
  animationDuration?: number;
  waterIntensity?: number;
  splashEffect?: boolean;
}

export const useFluidCursorInteraction = ({
  blendMode = "difference",
  color,
  fillElement = false,
  scale = 1.05,
  expandOnHover = true,
  animationDuration = 0.4,
  waterIntensity = 1,
  splashEffect = true,
}: FluidCursorInteractionOptions = {}) => {
  const {
    setCursorState,
    setTargetElement,
    setCursorColor,
    morphCursor,
    resetMorph,
  } = useCursor();

  const elementRef = useRef<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rippleElements = useRef<HTMLDivElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Handle the water-like submerge animation
  useEffect(() => {
    if (!elementRef.current || !fillElement) return;

    if (isHovered) {
      // Apply water-like animation effect when hovering
      const element = elementRef.current;
      element.style.transition = `transform ${animationDuration}s cubic-bezier(0.34, 1.56, 0.64, 1), background-color ${animationDuration}s ease`;

      // Set cursor blend mode on document root for global access
      document.documentElement.style.setProperty(
        "--cursor-blend-mode",
        blendMode
      );

      // Start submerge animation
      setIsAnimating(true);

      // Apply water ripple effect with the cursor color
      if (color && fillElement) {
        element.style.position = "relative";
        element.style.overflow = "hidden";

        // Create water ripple container if it doesn't exist
        let rippleContainer = element.querySelector(
          ".water-ripple-container"
        ) as HTMLDivElement;
        if (!rippleContainer) {
          rippleContainer = document.createElement("div");
          rippleContainer.className = "water-ripple-container";
          rippleContainer.style.position = "absolute";
          rippleContainer.style.inset = "0";
          rippleContainer.style.overflow = "hidden";
          rippleContainer.style.pointerEvents = "none";
          element.appendChild(rippleContainer);
        }

        // Create continuous water ripple effect
        const createWaterRipple = () => {
          if (!isHovered || !element.contains(rippleContainer)) return;

          // Create ripple at random position
          const ripple = document.createElement("div");
          ripple.className = "water-ripple";

          // Random position within the element
          const width = element.offsetWidth;
          const height = element.offsetHeight;
          const x = Math.random() * width;
          const y = Math.random() * height;

          // Style the ripple
          ripple.style.position = "absolute";
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;
          ripple.style.width = "0";
          ripple.style.height = "0";
          ripple.style.borderRadius = "50%";
          ripple.style.backgroundColor = `${color}30`; // Color with transparency
          ripple.style.transform = "translate(-50%, -50%)";
          ripple.style.transition = `all ${
            animationDuration * 1.5
          }s cubic-bezier(0.25, 0.8, 0.25, 1)`;

          rippleContainer.appendChild(ripple);
          rippleElements.current.push(ripple);

          // Animate the ripple
          setTimeout(() => {
            const size = Math.max(width, height) * 0.8;
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.opacity = "0";
          }, 10);

          // Remove ripple after animation completes
          setTimeout(() => {
            if (rippleContainer.contains(ripple)) {
              rippleContainer.removeChild(ripple);
              rippleElements.current = rippleElements.current.filter(
                (el) => el !== ripple
              );
            }
          }, animationDuration * 1500);

          // Schedule next ripple
          if (isHovered) {
            animationFrameRef.current = requestAnimationFrame(() => {
              setTimeout(createWaterRipple, Math.random() * 1000 + 500);
            });
          }
        };

        // Start water ripple animation
        createWaterRipple();
      }
    } else if (isAnimating) {
      // Reset animation when not hovering
      const element = elementRef.current;
      if (element) {
        element.style.transition = `transform ${animationDuration}s cubic-bezier(0.34, 1.56, 0.64, 1), background-color ${animationDuration}s ease`;

        // Clean up animation frames
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        // Reset any specific styles
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Delay to complete exit animation
        timeoutRef.current = setTimeout(() => {
          setIsAnimating(false);

          // Remove any remaining ripples
          rippleElements.current.forEach((ripple) => {
            if (ripple.parentElement) {
              ripple.parentElement.removeChild(ripple);
            }
          });
          rippleElements.current = [];
        }, animationDuration * 1000);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isHovered,
    fillElement,
    blendMode,
    color,
    animationDuration,
    isAnimating,
    morphCursor,
  ]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setIsHovered(true);
    setCursorState("water");
    elementRef.current = e.currentTarget;
    setTargetElement(e.currentTarget);

    if (color) {
      setCursorColor(color);
    }

    // Apply water morphing effect
    morphCursor(waterIntensity);

    // Apply any custom styles for hover state
    if (expandOnHover && elementRef.current) {
      elementRef.current.style.transform = `scale(${scale})`;
    }

    // Apply water-like background effect
    if (fillElement && elementRef.current) {
      const element = elementRef.current;

      // Create a water overlay if it doesn't exist
      let waterOverlay = element.querySelector(
        ".water-overlay"
      ) as HTMLDivElement;
      if (!waterOverlay && color) {
        waterOverlay = document.createElement("div");
        waterOverlay.className = "water-overlay";
        waterOverlay.style.position = "absolute";
        waterOverlay.style.inset = "0";
        waterOverlay.style.backgroundColor = `${color}20`; // Very light tint
        waterOverlay.style.opacity = "0";
        waterOverlay.style.transition = `opacity ${animationDuration}s ease`;
        waterOverlay.style.pointerEvents = "none";
        waterOverlay.style.zIndex = "0";
        element.appendChild(waterOverlay);

        // Ensure content is above the overlay
        const children = Array.from(element.children);
        children.forEach((child) => {
          if (
            child !== waterOverlay &&
            child.className !== "water-ripple-container"
          ) {
            (child as HTMLElement).style.position = "relative";
            (child as HTMLElement).style.zIndex = "1";
          }
        });
      }

      // Fade in the water overlay
      if (waterOverlay) {
        waterOverlay.style.opacity = "1";
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCursorState("default");
    setTargetElement(null);

    // Reset morph effect
    resetMorph();

    // Reset cursor color
    if (color) {
      setCursorColor("#4fd1c5"); // Reset to default or pass in a resetColor param
    }

    // Reset element transform
    if (expandOnHover && elementRef.current) {
      elementRef.current.style.transform = "scale(1)";
    }

    // Fade out water overlay
    if (fillElement && elementRef.current) {
      const waterOverlay = elementRef.current.querySelector(
        ".water-overlay"
      ) as HTMLDivElement;
      if (waterOverlay) {
        waterOverlay.style.opacity = "0";
      }
    }
  };

  // Handle clicks to create splash effect
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!splashEffect) return;

    // Trigger extra morphing on click
    morphCursor(waterIntensity * 1.5);

    // Create splash effect in the element
    if (fillElement && elementRef.current) {
      const element = elementRef.current;
      const rect = element.getBoundingClientRect();

      // Calculate click position relative to element
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Find or create ripple container
      let splashContainer = element.querySelector(
        ".water-splash-container"
      ) as HTMLDivElement;
      if (!splashContainer) {
        splashContainer = document.createElement("div");
        splashContainer.className = "water-splash-container";
        splashContainer.style.position = "absolute";
        splashContainer.style.inset = "0";
        splashContainer.style.overflow = "hidden";
        splashContainer.style.pointerEvents = "none";
        splashContainer.style.zIndex = "0";
        element.appendChild(splashContainer);
      }

      // Create multiple splash droplets
      for (let i = 0; i < 8; i++) {
        const splash = document.createElement("div");

        // Random angle and distance
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 40;
        const size = 5 + Math.random() * 10;
        const duration = 0.5 + Math.random() * 0.5;

        // Position and style the splash
        splash.style.position = "absolute";
        splash.style.left = `${x}px`;
        splash.style.top = `${y}px`;
        splash.style.width = `${size}px`;
        splash.style.height = `${size}px`;
        splash.style.borderRadius = "50%";
        splash.style.backgroundColor = color || "#4fd1c5";
        splash.style.transform = "translate(-50%, -50%)";
        splash.style.opacity = "0.8";
        splash.style.zIndex = "1";
        splash.style.pointerEvents = "none";

        // Add to container
        splashContainer.appendChild(splash);

        // Animate the splash
        setTimeout(() => {
          splash.style.transition = `all ${duration}s ease-out`;
          splash.style.transform = `translate(
            ${Math.cos(angle) * distance - 50}%,
            ${Math.sin(angle) * distance - 50}%
          )`;
          splash.style.opacity = "0";
        }, 10);

        // Remove after animation
        setTimeout(() => {
          if (splashContainer.contains(splash)) {
            splashContainer.removeChild(splash);
          }
        }, duration * 1000 + 10);
      }
    }
  };

  return {
    isHovered,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    ref: elementRef,
  };
};
