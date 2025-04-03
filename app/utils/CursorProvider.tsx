// components/CursorProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Use springs for smoother motion
  const springConfig = { damping: 25, stiffness: 300 };
  const bubbleConfig = { damping: 15, stiffness: 150 }; // Slower follow for bubble
  const yellowCircleConfig = { damping: 20, stiffness: 200 }; // For yellow circle
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const bubbleX = useSpring(0, bubbleConfig);
  const bubbleY = useSpring(0, bubbleConfig);
  const yellowX = useSpring(0, yellowCircleConfig);
  const yellowY = useSpring(0, yellowCircleConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Update spring values
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      bubbleX.set(e.clientX);
      bubbleY.set(e.clientY);
      yellowX.set(e.clientX);
      yellowY.set(e.clientY);

      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, cursorX, cursorY, bubbleX, bubbleY, yellowX, yellowY]);

  // Effect to handle target element dimensions and position
  useEffect(() => {
    if (!targetElement) return;

    const updateTargetRect = () => {
      // This will be used in the render for the hover state
    };

    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect);

    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect);
    };
  }, [targetElement]);

  // Click ripple animation state
  const [clickRipples, setClickRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  let rippleCounter = 0;

  // Add click handler to create ripple effect
  useEffect(() => {
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
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <CursorContext.Provider
      value={{ cursorState, setCursorState, targetElement, setTargetElement }}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Yellow Circle - follows cursor with slight delay */}
            <motion.div
              className="fixed pointer-events-none z-30"
              style={{
                x: yellowX,
                y: yellowY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 0.7,
                scale: cursorState === "hover" ? 3 : 2,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.4,
                scale: { duration: 0.6 },
              }}
            >
              <div
                className="w-20 h-20 rounded-full"
                style={{
                  backgroundColor: "#FFFF00",
                  filter: "blur(8px)",
                }}
              />
            </motion.div>

            {/* Gradient Bubble - follows cursor with delay */}
            <motion.div
              className="fixed pointer-events-none z-40"
              style={{
                x: bubbleX,
                y: bubbleY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 0.8,
                scale: cursorState === "hover" ? 2.5 : 1.8,
                width: "80px",
                height: "80px",
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.4,
                scale: { duration: 0.6 },
              }}
            >
              <div
                className="w-full h-full rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(56,189,248,0.6) 0%, rgba(59,130,246,0.3) 70%, rgba(99,102,241,0.1) 100%)",
                  boxShadow: "0 0 20px rgba(56,189,248,0.4)",
                  filter: "blur(2px)",
                }}
              />
            </motion.div>

            {/* Main cursor dot */}
            <motion.div
              ref={cursorRef}
              className="fixed pointer-events-none z-50"
              style={{
                x: cursorX,
                y: cursorY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                width: "12px",
                height: "12px",
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-full h-full rounded-full bg-white"
                style={{
                  boxShadow: "0 0 10px rgba(255,255,255,0.5)",
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
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                initial={{ width: 0, height: 0, opacity: 1 }}
                animate={{
                  width: 100,
                  height: 100,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
              >
                <div className="w-full h-full rounded-full bg-white/30 backdrop-blur-sm" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </CursorContext.Provider>
  );
};
