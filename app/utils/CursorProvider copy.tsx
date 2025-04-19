"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { motion } from "framer-motion";

type CursorState = "default" | "hover";

interface CursorContextType {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
  targetElement: HTMLElement | null;
  setTargetElement: (element: HTMLElement | null) => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorState: "default",
  setCursorState: () => {},
  targetElement: null,
  setTargetElement: () => {},
});

export const useCursor = () => useContext(CursorContext);

interface CursorProviderProps {
  children: React.ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  // Refs for cursor element
  const cursorRef = useRef<HTMLDivElement>(null);

  // Click ripple animation state
  const [clickRipples, setClickRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  let rippleCounter = 0;

  useEffect(() => {
    // Main cursor movement handler
    const handleMouseMove = (e: MouseEvent) => {
      // Direct DOM manipulation for cursor - ensuring it's exactly centered
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Click handler for ripple effect
    const handleClick = (e: MouseEvent) => {
      const newRipple = {
        id: rippleCounter++,
        x: e.clientX,
        y: e.clientY,
      };

      setClickRipples((prev) => [...prev, newRipple]);

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
  }, []);

  // Effect to handle target element dimensions and position
  useEffect(() => {
    if (!targetElement) return;

    const updateTargetRect = () => {
      // This will be used in the render for the hover state if needed
    };

    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect);

    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect);
    };
  }, [targetElement]);

  return (
    <CursorContext.Provider
      value={{ cursorState, setCursorState, targetElement, setTargetElement }}
    >
      {children}

      {/* Custom Cursor styled like the image */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-50"
        style={{
          transform: "translate(-50%, -50%)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: cursorState === "hover" ? 1.1 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Outermost teal scalloped edge */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#4fd1c5", // Teal color like in the image
            borderRadius: "50%",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            clipPath: "circle(40px at center)",
            zIndex: -3,
          }}
        />

        {/* White middle circle with pattern */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#e2e8f0", // Light gray/silver
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: -2,
          }}
        />

        {/* Inner detail circle */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "42px",
            height: "42px",
            border: "1px solid #718096", // Mid gray border
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: -1,
          }}
        />

        {/* Teal inner circle with cursor */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: "#4fd1c5", // Matches outer teal
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        ></motion.div>
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
              background:
                "radial-gradient(circle, rgba(79,209,197,0.6) 0%, rgba(79,209,197,0) 70%)",
              border: "2px solid rgba(79,209,197,0.5)",
            }}
          />
        </motion.div>
      ))}
    </CursorContext.Provider>
  );
};
