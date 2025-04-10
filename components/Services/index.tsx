"use client";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import services from "./services";
import Heading from "../ui/Heading";
import MagicButton from "../ui/MagicButton";

// Define interface for service object
interface Service {
  id: number;
  title: string;
  description: string;
  gifUrl: string;
  points: string[];
}

// Pre-load all images to prevent layout shifts
const preloadImages = () => {
  services.forEach((service) => {
    const img = new Image();
    img.src = service.gifUrl;
  });
};

// Optimized Service info card component that always renders but only animates when active
const ServiceInfoCard = ({
  service,
  index,
  activeIndex,
  registerIntersection,
}: {
  service: Service;
  index: number;
  activeIndex: number;
  registerIntersection: (element: HTMLDivElement, index: number) => void;
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isActive = activeIndex === index;

  // Register this element with the intersection handler
  useEffect(() => {
    if (cardRef.current) {
      registerIntersection(cardRef.current, index);
    }
  }, [index, registerIntersection]);

  // Alternate layout for even/odd index
  const isEven = index % 2 === 0;

  // Memoize expensive calculations
  const isVisible = useMemo(() => {
    // Pre-render the current active card and cards immediately adjacent to it
    return Math.abs(activeIndex - index) <= 1;
  }, [activeIndex, index]);

  // We don't need AnimatePresence since we're handling visibility differently
  return (
    <div
      ref={cardRef}
      className="min-h-[80vh] flex items-center justify-center py-24 relative"
      id={`service-${service.id}`}
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        willChange: isVisible ? "transform, opacity" : "auto",
      }}
    >
      <motion.div
        key={`service-${service.id}`}
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0.3,
          y: isActive ? 0 : 50,
          scale: isActive ? 1 : 0.95,
        }}
        transition={{
          type: "tween", // Using tween instead of spring for better performance
          duration: 0.3,
          ease: "easeOut",
        }}
        className={`flex flex-col ${
          isEven ? "md:flex-row" : "md:flex-row-reverse"
        } items-center gap-10 bg-gradient-to-br from-black/80 to-slate-950/80 backdrop-blur-lg rounded-2xl p-8 md:p-12 w-full max-w-6xl mx-auto shadow-xl border border-gray-700/30 relative overflow-hidden z-10`}
        style={{ willChange: "transform, opacity" }}
      >
        {/* Simplified background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div
            className={`absolute ${
              isEven ? "top-0 left-0" : "bottom-0 right-0"
            } w-64 h-64 rounded-full bg-indigo-600/10 blur-3xl`}
          ></div>
          <div
            className={`absolute ${
              isEven ? "bottom-0 right-0" : "top-0 left-0"
            } w-48 h-48 rounded-full bg-purple-600/10 blur-3xl`}
          ></div>
        </div>

        {/* GIF Container with CSS animations instead of GSAP */}
        <div className="w-full md:w-2/5 overflow-hidden rounded-xl p-1 gif-container">
          <img
            src={service.gifUrl}
            alt={service.title}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Content section */}
        <div className="w-full md:w-3/5 relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-400 mb-4 title">
            {service.title}
          </h3>

          <p className="text-gray-300 mb-8 text-lg leading-relaxed description">
            {service.description}
          </p>

          <ul className="space-y-3">
            {service.points.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  x: isActive ? 0 : -20,
                }}
                transition={{
                  duration: 0.3,
                  delay: isActive ? i * 0.05 : 0, // Reduced delay for better performance
                  ease: "easeOut",
                }}
                className="flex items-start gap-3"
              >
                <span className="text-indigo-400 mt-1 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-gray-200">{point}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-8">
            <MagicButton title="Learn More" icon={null} position="left" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Main ServiceSection component
const ServiceSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // Preload all images when component mounts
  useEffect(() => {
    preloadImages();
  }, []);

  // Setup optimized intersection observer with lower threshold and fewer calculations
  const registerIntersection = useCallback(
    (element: HTMLDivElement, index: number) => {
      if (!intersectionObserverRef.current) {
        intersectionObserverRef.current = new IntersectionObserver(
          (entries) => {
            // Only process if we're not in the middle of a programmatic scroll
            if (!isScrolling) {
              entries.forEach((entry) => {
                // Use a lower threshold to trigger earlier before the section is fully visible
                if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
                  const index = parseInt(entry.target.id.split("-")[1]) - 1;
                  // Debounce the update to prevent rapid changes
                  requestAnimationFrame(() => {
                    setActiveIndex(index);
                  });
                }
              });
            }
          },
          {
            threshold: [0.4], // Lower threshold to detect earlier
            rootMargin: "-5% 0px", // Smaller margin for better accuracy
          }
        );
      }

      // Observe this element
      intersectionObserverRef.current.observe(element);

      // No return cleanup function here as it's not used in this callback
    },
    [isScrolling]
  );

  // Optimized scroll handler with debouncing
  const scrollToSection = useCallback(
    (index: number): void => {
      const element = document.getElementById(`service-${services[index].id}`);
      if (element && !isScrolling) {
        // Set scrolling flag to prevent intersection observer from firing
        setIsScrolling(true);
        // Update active index immediately for visual feedback
        setActiveIndex(index);

        const targetPosition = element.offsetTop;

        // Use native scrollIntoView with behavior smooth for better performance
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Reset scrolling flag after animation completes
        setTimeout(() => {
          setIsScrolling(false);
        }, 800);
      }
    },
    [isScrolling]
  );

  // Create optimized navigation dot buttons with minimal re-renders
  const NavigationDots = useMemo(() => {
    return (
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-3">
        {services.map((service, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === i
                ? "bg-indigo-500 scale-125"
                : "bg-gray-600 hover:bg-gray-400"
            }`}
            onClick={() => scrollToSection(i)}
            aria-label={`Go to ${service.title}`}
          />
        ))}
      </div>
    );
  }, [activeIndex, scrollToSection]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent overflow-hidden"
    >
      {/* Simplified background element */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/path/to/grid-pattern.svg')] opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-600/5 blur-3xl"></div>
      </div>

      {/* Section header */}
      <div className="relative z-10 container mx-auto pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <Heading text="Our" highlightedText="Services" className="" />
        </motion.div>
      </div>

      {/* Fixed navigation dots */}
      {/* {NavigationDots} */}

      {/* Service cards */}
      <div>
        {services.map((service, index) => (
          <ServiceInfoCard
            key={service.id}
            service={service}
            index={index}
            activeIndex={activeIndex}
            registerIntersection={registerIntersection}
          />
        ))}
      </div>

      {/* CSS for optimizations */}
      <style jsx global>{`
        .gif-container {
          animation: float 3s ease-in-out infinite;
          will-change: transform;
          contain: layout;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        /* Optimize scrolling */
        * {
          -webkit-overflow-scrolling: touch;
        }

        /* Add contain property to improve performance */
        section > div {
          contain: content;
        }

        /* Force hardware acceleration */
        .force-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
};

// Add scroll optimization hook
const useScrollOptimizer = () => {
  useEffect(() => {
    // Passive scroll listener to improve scroll performance
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    // Apply scroll optimizations
    document.addEventListener("touchstart", preventDefault, { passive: true });
    document.addEventListener("touchmove", preventDefault, { passive: true });

    return () => {
      document.removeEventListener("touchstart", preventDefault);
      document.removeEventListener("touchmove", preventDefault);
    };
  }, []);
};

// Enhanced service section with scroll optimization
const EnhancedServiceSection = () => {
  useScrollOptimizer();
  return <ServiceSection />;
};

export default EnhancedServiceSection;
