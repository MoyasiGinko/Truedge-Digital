"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

type CursorVariant = "cursorEnter" | "cursorLeave" | "buttonHover";

interface CursorContextType {
  initialCursorVariant: CursorVariant;
  setInitialCursorVariant: React.Dispatch<React.SetStateAction<CursorVariant>>;
  animateCursorVariant: CursorVariant;
  setAnimateCursorVariant: React.Dispatch<React.SetStateAction<CursorVariant>>;
  animateCursor: (variant: CursorVariant) => void;
}

// Create context with proper default values
const CursorContext = createContext<CursorContextType>({
  initialCursorVariant: "cursorLeave",
  setInitialCursorVariant: () => {},
  animateCursorVariant: "cursorLeave",
  setAnimateCursorVariant: () => {},
  animateCursor: () => {},
});

export const useCursorContext = () => useContext(CursorContext);

interface CursorProviderProps {
  children: ReactNode;
}

export const CursorProvider: React.FC<CursorProviderProps> = ({ children }) => {
  // Initialize with proper default values
  const [initialCursorVariant, setInitialCursorVariant] =
    useState<CursorVariant>("cursorLeave");
  const [animateCursorVariant, setAnimateCursorVariant] =
    useState<CursorVariant>("cursorLeave");

  const animateCursor = (variant: CursorVariant): void => {
    setInitialCursorVariant(animateCursorVariant);
    setAnimateCursorVariant(variant);
  };

  return (
    <CursorContext.Provider
      value={{
        initialCursorVariant,
        setInitialCursorVariant,
        animateCursorVariant,
        setAnimateCursorVariant,
        animateCursor,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};

export default CursorProvider;
