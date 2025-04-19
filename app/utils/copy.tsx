"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { motion, useSpring, useTransform } from "framer-motion";

type CursorState = "default" | "hover";
type MixBlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

interface CursorContextType {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
  targetElement: HTMLElement | null;
  setTargetElement: (element: HTMLElement | null) => void;
  cursorColor: string;
  setCursorColor: (color: string) => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorState: "default",
  setCursorState: () => {},
  targetElement: null,
  setTargetElement: () => {},
  cursorColor: "#4fd1c5",
  setCursorColor: () => {},
});

export const useCursor = () => useContext(CursorContext);

interface CursorProviderProps {
  children: React.ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [cursorColor, setCursorColor] = useState<string>("#4fd1c5");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [targetRect, setTargetRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Refs for cursor element
  const cursorRef = useRef<HTMLDivElement>(null);

  // Click ripple animation state
  const [clickRipples, setClickRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  let rippleCounter = 0;

  // Spring animations for smoother, squishier transitions
  const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  // For scaling and stretching effects
  const scale = useSpring(1, springConfig);
  const scaleX = useSpring(1, springConfig);
  const scaleY = useSpring(1, springConfig);
  const opacity = useSpring(1, { stiffness: 100, damping: 15 });

  // For morphing between circle and target shape
  const borderRadius = useSpring("40px", { stiffness: 100, damping: 20 });

  useEffect(() => {
    // Main cursor movement handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Update spring animations
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    // Click handler for ripple effect
    const handleClick = (e: MouseEvent) => {
      const newRipple = {
        id: rippleCounter++,
        x: e.clientX,
        y: e.clientY,
      };

      setClickRipples((prev) => [...prev, newRipple]);

      // Create a quick "squish" effect on click
      scale.set(0.8);
      setTimeout(() => scale.set(1), 100);

      // Remove the ripple after animation completes
      setTimeout(() => {
        setClickRipples((prev) =>
          prev.filter((ripple) => ripple.id !== newRipple.id)
        );
      }, 800);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [cursorX, cursorY, scale]);

  // Effect to handle target element dimensions and position
  useEffect(() => {
    if (!targetElement) {
      // Reset to default state
      scale.set(1);
      scaleX.set(1);
      scaleY.set(1);
      borderRadius.set("40px");
      opacity.set(1);
      return;
    }

    const updateTargetRect = () => {
      const rect = targetElement.getBoundingClientRect();
      setTargetRect({
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
        width: rect.width,
        height: rect.height,
      });

      // Calculate distance to animate
      const distX = rect.x + rect.width / 2 - mousePosition.x;
      const distY = rect.y + rect.height / 2 - mousePosition.y;

      // Get computed styles to match button
      const computedStyle = window.getComputedStyle(targetElement);
      const buttonBorderRadius = computedStyle.borderRadius;

      // If hovering, morph the cursor to match the target element
      if (cursorState === "hover") {
        // Scale to match target with a slight padding
        const scaleToWidth = (rect.width + 20) / 80;
        const scaleToHeight = (rect.height + 20) / 80;

        scale.set(1.2);
        scaleX.set(scaleToWidth);
        scaleY.set(scaleToHeight);

        // Morph border radius to match the button's
        borderRadius.set(buttonBorderRadius || "4px");

        // Make the cursor slightly see-through when hovering
        opacity.set(0.85);

        // We'll let the cursor stay with the mouse for a more natural feel
      }
    };

    updateTargetRect();

    // Update on scroll and resize
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect);

    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect);
    };
  }, [
    targetElement,
    cursorState,
    mousePosition,
    scale,
    scaleX,
    scaleY,
    borderRadius,
    opacity,
  ]);

  return (
    <CursorContext.Provider
      value={{
        cursorState,
        setCursorState,
        targetElement,
        setTargetElement,
        cursorColor,
        setCursorColor,
      }}
    >
      {children}

      {/* Custom Cursor with spring animations for squishy effect */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-50"
        style={{
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          scale,
          scaleX,
          scaleY,
          opacity,
          transformOrigin: "center center",
          transform: "translate(-50%, -50%)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Outermost teal scalloped edge */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: cursorColor,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius,
            zIndex: -3,
            mixBlendMode:
              "var(--cursor-blend-mode, normal)" as unknown as MixBlendMode,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />

        {/* White middle circle with pattern */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#e2e8f0",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius,
            zIndex: -2,
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 20,
            delay: 0.05,
          }}
        />

        {/* Inner detail circle */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "42px",
            height: "42px",
            border: "1px solid #718096",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius,
            zIndex: -1,
          }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 15,
            delay: 0.1,
          }}
        />

        {/* Teal inner circle  */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: cursorColor,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius,
            mixBlendMode:
              "var(--cursor-blend-mode, normal)" as unknown as MixBlendMode,
            zIndex: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 15,
            delay: 0.15,
          }}
        />
      </motion.div>

      {/* Render click ripples */}
      {clickRipples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none z-40"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{
            width: 100,
            height: 100,
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(79,209,197,0.6) 0%, rgba(79,209,197,0) 70%)`,
              border: `2px solid rgba(79,209,197,0.5)`,
            }}
          />
        </motion.div>
      ))}
    </CursorContext.Provider>
  );
};
