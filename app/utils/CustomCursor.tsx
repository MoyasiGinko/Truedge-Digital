"use client";
import React, { useState, useEffect, useRef } from "react";

interface CustomCursorProps {
  color?: string;
  size?: number;
  hoverScale?: number;
  buttonFillColor?: string;
  enableRipple?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  color = "#3b82f6", // Default blue color
  size = 40, // Default size
  hoverScale = 1.5,
  buttonFillColor = "rgba(59, 130, 246, 0.5)", // Semi-transparent blue
  enableRipple = true,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [ripples, setRipples] = useState<
    { id: string; x: number; y: number; size: number }[]
  >([]);

  // Use useRef for tracking state that shouldn't trigger re-renders
  const rippleCounterRef = useRef(0);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);
  const lastClickTimeRef = useRef(0);
  const isMouseDownRef = useRef(false);

  // Track active button elements
  const activeButtonsRef = useRef<Set<HTMLElement>>(new Set());

  // Initialize and clean up button styles
  useEffect(() => {
    // Function to set up buttons
    const setupButtons = () => {
      const buttons = document.querySelectorAll("button,a");
      buttons.forEach((button) => {
        if (button instanceof HTMLElement) {
          // Only set up if not already initialized
          if (!button.classList.contains("cursor-btn")) {
            button.classList.add("cursor-btn");

            // Create the fill element for each button
            const fillElement = document.createElement("span");
            fillElement.classList.add("btn-fill");
            fillElement.style.position = "absolute";
            fillElement.style.inset = "0";
            fillElement.style.backgroundColor = buttonFillColor;
            fillElement.style.transform = "scale(0)";
            fillElement.style.transformOrigin = "center";
            fillElement.style.transition =
              "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";
            fillElement.style.zIndex = "-1";
            button.appendChild(fillElement);
          }
        }
      });
    };

    // Initial setup
    setupButtons();

    // Set up a MutationObserver to handle dynamically added buttons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          setupButtons();
        }
      });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup function
    return () => {
      observer.disconnect();

      // Clean up all button styles
      const buttons = document.querySelectorAll(".cursor-btn");
      buttons.forEach((button) => {
        if (button instanceof HTMLElement) {
          button.classList.remove("cursor-btn");
          button.style.boxShadow = "";
          button.style.transform = "";
          button.style.transition = "";

          // Remove fill elements
          const fill = button.querySelector(".btn-fill");
          if (fill) fill.remove();
        }
      });
    };
  }, [buttonFillColor]);

  // Handle mouse movement with optimized animation frame
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updateCursorPosition);
      }

      // Only update visibility if needed
      if (!isVisible && !isHoveringButton) {
        setIsVisible(true);
      }
    };

    const updateCursorPosition = () => {
      setPosition(lastMousePosRef.current);
      rafIdRef.current = null;
    };

    const handleMouseDown = () => {
      isMouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(!isHoveringButton);
    };

    // Handle click for ripple effect
    const handleClick = (e: MouseEvent) => {
      if (!enableRipple) return;

      const now = Date.now();
      // Prevent creating too many ripples in quick succession
      if (now - lastClickTimeRef.current < 150) return;
      lastClickTimeRef.current = now;

      const rippleId = `ripple-${Date.now()}-${rippleCounterRef.current++}`;
      const rippleSize = Math.random() * 20 + 40; // Random size between 40-60px

      // Add a new ripple
      setRipples((prevRipples) => [
        ...prevRipples,
        { id: rippleId, x: e.clientX, y: e.clientY, size: rippleSize },
      ]);

      // Remove the ripple after animation completes
      setTimeout(() => {
        setRipples((prevRipples) =>
          prevRipples.filter((r) => r.id !== rippleId)
        );
      }, 1000);
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("click", handleClick);

    // Add button hover events
    const onButtonHover = (e: Event) => {
      const button = e.currentTarget as HTMLElement;

      // Track this button as active
      activeButtonsRef.current.add(button);
      setIsHoveringButton(true);

      // Apply morph animation
      morphCursorToButton(button);
    };

    const onButtonUnhover = (e: Event) => {
      const button = e.currentTarget as HTMLElement;

      // Remove from active buttons
      activeButtonsRef.current.delete(button);

      // Only set isHoveringButton to false if no other buttons are being hovered
      if (activeButtonsRef.current.size === 0) {
        setIsHoveringButton(false);
      }

      // Reset button styles
      resetButtonStyles(button);

      // Restore cursor if no more buttons are being hovered
      if (activeButtonsRef.current.size === 0) {
        restoreCursor();
      }
    };

    // Apply hover effects to all buttons
    const buttons = document.querySelectorAll(".cursor-btn");
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", onButtonHover);
      button.addEventListener("mouseleave", onButtonUnhover);
    });

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("click", handleClick);

      buttons.forEach((button) => {
        button.removeEventListener("mouseenter", onButtonHover);
        button.removeEventListener("mouseleave", onButtonUnhover);
      });

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isHoveringButton, isVisible, enableRipple]);

  // Function to morph cursor to button
  const morphCursorToButton = (button: HTMLElement) => {
    // Get the button's fill element
    const fill = button.querySelector(".btn-fill") as HTMLElement;
    if (fill) {
      // Get button dimensions and position
      const rect = button.getBoundingClientRect();

      // Set the transform origin to cursor position
      const x = position.x - rect.left;
      const y = position.y - rect.top;

      fill.style.transformOrigin = `${x}px ${y}px`;
      fill.style.transform = "scale(3)";
      fill.style.transition =
        "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";

      // Add subtle glow effect
      button.style.boxShadow = `0 0 15px ${color}80`;
      button.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
    }

    // Animate cursor to morph and disappear
    if (cursorRef.current) {
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      // Smooth morph animation
      cursorRef.current.style.transform = `translate(${
        buttonCenterX - size / 2
      }px, ${buttonCenterY - size / 2}px) scale(0)`;
      cursorRef.current.style.opacity = "0";
      cursorRef.current.style.transition =
        "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease";
    }
  };

  // Function to reset button styles
  const resetButtonStyles = (button: HTMLElement) => {
    const fill = button.querySelector(".btn-fill") as HTMLElement;
    if (fill) {
      fill.style.transition =
        "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      fill.style.transform = "scale(0)";
    }

    // Remove the glow
    button.style.boxShadow = "none";
  };

  // Function to restore cursor after button unhover
  const restoreCursor = () => {
    if (cursorRef.current) {
      const halfSize = size / 2;
      cursorRef.current.style.transform = `translate(${
        position.x - halfSize
      }px, ${position.y - halfSize}px) scale(1)`;
      cursorRef.current.style.opacity = "1";
      cursorRef.current.style.transition =
        "transform 0.3s ease-out, opacity 0.2s ease";
    }
  };

  // Update cursor position when position changes
  useEffect(() => {
    if (cursorRef.current && !isHoveringButton) {
      const halfSize = size / 2;
      cursorRef.current.style.transform = `translate(${
        position.x - halfSize
      }px, ${position.y - halfSize}px) scale(1)`;
    }
  }, [position, size, isHoveringButton]);

  return (
    <>
      {/* Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center"
        style={{
          opacity: isVisible ? 1 : 0,
          width: `${size}px`,
          height: `${size}px`,
          transition: "opacity 0.3s ease, transform 0.2s ease",
        }}
      >
        {/* Outer glow */}
        <div
          className="absolute rounded-full blur-md"
          style={{
            backgroundColor: color,
            width: "140%",
            height: "140%",
            opacity: 0.3,
            animation: "cursorPulse 2s ease-in-out infinite",
          }}
        />

        {/* Main circle */}
        <div
          className="rounded-full"
          style={{
            backgroundColor: `${color}cc`,
            width: "100%",
            height: "100%",
            opacity: 0.7,
            boxShadow: `0 0 20px ${color}80`,
            animation: "cursorPulse 2s ease-in-out infinite",
            animationDelay: "0.1s",
          }}
        />

        {/* Inner circle */}
        {/* <div
          className="absolute rounded-full"
          style={{
            backgroundColor: "#ffffff",
            width: "30%",
            height: "30%",
            opacity: 0.9,
            boxShadow: `0 0 10px ${color}`,
          }}
        /> */}
      </div>

      {/* Ripple container */}
      <div
        ref={rippleContainerRef}
        className="fixed inset-0 pointer-events-none z-40"
      >
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none ripple-effect"
            style={{
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: `${ripple.size}px`,
              height: `${ripple.size}px`,
              border: `2px solid ${color}`,
              boxShadow: `0 0 15px ${color}80`,
              animation:
                "ripple-effect 1s cubic-bezier(0.2, 0.6, 0.4, 1) forwards",
            }}
          />
        ))}
      </div>
    </>
  );
};

export default CustomCursor;
