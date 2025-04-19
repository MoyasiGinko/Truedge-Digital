"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { motion } from "framer-motion";

interface CursorContextType {
  cursorState: string;
  setCursorState: (state: string) => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorState: "default",
  setCursorState: () => {},
});

export const useCursor = () => useContext(CursorContext);

interface CursorProviderProps {
  children: React.ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  const [cursorState, setCursorState] = useState<string>("default");
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState }}>
      {children}
      {/* Circle that follows the cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-50"
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          transform: "translate(-50%, -50%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </CursorContext.Provider>
  );
};
