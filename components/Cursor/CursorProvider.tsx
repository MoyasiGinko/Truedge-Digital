"use client";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

// Create context for cursor state
interface CursorContextType {
  cursorEnlarged: boolean;
  setCursorEnlarged: (enlarged: boolean) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

// Custom hook to use the cursor context
export const useCursor = () => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
};

interface CursorProviderProps {
  children: ReactNode;
}

const CursorProvider = ({ children }: CursorProviderProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorEnlarged, setCursorEnlarged] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <CursorContext.Provider value={{ cursorEnlarged, setCursorEnlarged }}>
      {children}
      <div
        className="fixed w-5 h-5 rounded-full bg-white pointer-events-none mix-blend-difference transition-transform duration-100"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: `translate(-50%, -50%) ${
            cursorEnlarged ? "scale(6)" : "scale(1)"
          }`,
          zIndex: 9999,
        }}
      />
    </CursorContext.Provider>
  );
};

export default CursorProvider;
