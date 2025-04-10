// context/ScrollContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

interface ScrollContextType {
  currentIndex: number;
  scrollToSection: (index: number) => void;
  registerSection: (index: number, ref: HTMLElement) => void;
  isScrolling: boolean;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error("useScrollContext must be used within a ScrollProvider");
  }
  return context;
};

interface ScrollProviderProps {
  children: ReactNode;
  totalSections: number;
}

export const ScrollProvider: React.FC<ScrollProviderProps> = ({
  children,
  totalSections,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>(
    Array(totalSections).fill(null)
  );

  const registerSection = (index: number, ref: HTMLElement) => {
    sectionRefs.current[index] = ref;
  };

  const scrollToSection = (index: number) => {
    if (index < 0 || index >= totalSections || isScrolling) return;

    const targetSection = sectionRefs.current[index];
    if (!targetSection) return;

    setIsScrolling(true);

    gsap.to(window, {
      duration: 1.2,
      scrollTo: {
        y: targetSection,
        offsetY: 80,
      },
      ease: "power3.inOut",
      onComplete: () => {
        setCurrentIndex(index);
        setTimeout(() => setIsScrolling(false), 100); // Small buffer to prevent immediate scrolling again
      },
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sectionRefs.current.forEach((section, index) => {
        if (!section) return;

        const { top, bottom } = section.getBoundingClientRect();
        const sectionTop = window.scrollY + top;
        const sectionBottom = window.scrollY + bottom;

        // Check if the section is currently in view
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
          setCurrentIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolling, totalSections]);

  const value = {
    currentIndex,
    scrollToSection,
    registerSection,
    isScrolling,
  };

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
};

export default ScrollContext;
