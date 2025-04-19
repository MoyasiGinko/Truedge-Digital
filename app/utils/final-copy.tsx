"use client";
import React, { useState, useEffect, useRef } from "react";

interface CustomCursorProps {
  color?: string;
  size?: number;
  hoverScale?: number;
  buttonFillColor?: string;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  color = "#3b82f6", // Default blue color
  size = 24,
  hoverScale = 1.5,
  buttonFillColor = "rgba(59, 130, 246, 0.5)", // Semi-transparent blue
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);

  useEffect(() => {
    // Add custom styles to all buttons
    const buttons = document.querySelectorAll('button, a, [role="button"]');
    buttons.forEach((button) => {
      if (button instanceof HTMLElement) {
        button.classList.add("cursor-btn");
        button.style.position = "relative";
        button.style.overflow = "hidden";
        button.style.isolation = "isolate";

        // Create the fill element for each button
        const fillElement = document.createElement("span");
        fillElement.classList.add("btn-fill");
        fillElement.style.position = "absolute";
        fillElement.style.inset = "0";
        fillElement.style.backgroundColor = buttonFillColor;
        fillElement.style.transform = "scale(0)";
        fillElement.style.transformOrigin = "center";
        fillElement.style.transition = "transform 0.3s ease-out";
        fillElement.style.zIndex = "-1";
        button.appendChild(fillElement);
      }
    });

    // Function to handle mouse movement
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    // Function to handle mouse leaving the window
    const onMouseLeave = () => {
      setIsVisible(false);
    };

    // Function to handle mouse entering the window
    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Function to handle button hover
    const onButtonHover = (e: Event) => {
      setIsHoveringButton(true);

      // Get the button and its fill element
      const button = e.currentTarget as HTMLElement;
      const fill = button.querySelector(".btn-fill") as HTMLElement;

      if (fill) {
        // Get cursor position relative to the button
        const rect = button.getBoundingClientRect();
        const x = position.x - rect.left;
        const y = position.y - rect.top;

        // Set the transform origin to the cursor position
        fill.style.transformOrigin = `${x}px ${y}px`;
        fill.style.transform = "scale(2.5)";
      }
    };

    // Function to handle button unhover
    const onButtonUnhover = (e: Event) => {
      setIsHoveringButton(false);

      const button = e.currentTarget as HTMLElement;
      const fill = button.querySelector(".btn-fill") as HTMLElement;

      if (fill) {
        fill.style.transform = "scale(0)";
      }
    };

    // Add event listeners for button hover
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", onButtonHover);
      button.addEventListener("mouseleave", onButtonUnhover);
    });

    // Add mouse event listeners
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);

      buttons.forEach((button) => {
        button.removeEventListener("mouseenter", onButtonHover);
        button.removeEventListener("mouseleave", onButtonUnhover);

        // Remove the custom fill element
        const fill = button.querySelector(".btn-fill");
        if (fill) {
          fill.remove();
        }

        if (button instanceof HTMLElement) {
          button.classList.remove("cursor-btn");
        }
      });
    };
  }, [buttonFillColor]);

  // Update cursor position
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  // Hide the default cursor
  useEffect(() => {
    document.body.style.cursor = "none";

    const elements = document.querySelectorAll(
      'button, a, [role="button"], input, textarea, select'
    );
    elements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.cursor = "none";
      }
    });

    return () => {
      document.body.style.cursor = "";

      elements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.cursor = "";
        }
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center"
      style={{
        width: isHoveringButton ? 0 : `${size}px`,
        height: isHoveringButton ? 0 : `${size}px`,
        opacity: isVisible ? 1 : 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        transformOrigin: "center",
        transition:
          "opacity 0.3s ease, transform 0.05s ease, width 0.3s ease, height 0.3s ease",
      }}
    >
      <div
        className="rounded-full"
        style={{
          backgroundColor: color,
          width: "100%",
          height: "100%",
          opacity: 0.5,
          transform: isHoveringButton ? `scale(0)` : `scale(1)`,
          transition: "transform 0.3s ease",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          backgroundColor: color,
          width: "8px",
          height: "8px",
          opacity: isHoveringButton ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
};

export default CustomCursor;
