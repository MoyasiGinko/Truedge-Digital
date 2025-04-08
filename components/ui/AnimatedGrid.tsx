"use client";
import React, { useEffect, useState, useRef, Fragment } from "react";
import { motion } from "framer-motion";

// Fixed cell size in pixels - ensures consistent grid size across all screens
const CELL_SIZE = 80; // Each grid cell will be 80x80px

// Gradient color combinations for animation
const COLOR_GRADIENTS = [
  ["#3b82f6", "#8b5cf6"], // blue to purple
  ["#10b981", "#3b82f6"], // green to blue
  ["#f59e0b", "#ef4444"], // amber to red
  ["#ec4899", "#8b5cf6"], // pink to purple
  ["#06b6d4", "#3b82f6"], // cyan to blue
  ["#f97316", "#f59e0b"], // orange to amber
  ["#8b5cf6", "#ec4899"], // purple to pink
];

const AnimatedGrid: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  interface AnimatingLine {
    id: string;
    isHorizontal: boolean;
    position: number;
    gradient: string[];
    duration: number;
    delay: number;
    createdAt: number;
  }

  const [animatingLines, setAnimatingLines] = useState<AnimatingLine[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // This ensures the component renders only on the client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);

    // Get initial window dimensions
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Update dimensions on resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate grid lines
  useEffect(() => {
    if (!isClient) return;

    // Calculate how many cells can fit in the current viewport
    const numCols = Math.ceil(dimensions.width / CELL_SIZE) + 1;
    const numRows = Math.ceil(dimensions.height / CELL_SIZE) + 1;

    // Generate grid lines based on fixed cell size
    const horizontalLines = Array.from({ length: numRows }, (_, i) => ({
      id: `h${i}`,
      y: i * CELL_SIZE,
      index: i,
    }));

    const verticalLines = Array.from({ length: numCols }, (_, i) => ({
      id: `v${i}`,
      x: i * CELL_SIZE,
      index: i,
    }));

    // Function to add new random animated lines
    const addRandomAnimatedLine = () => {
      // Decide if horizontal or vertical line (50/50 chance)
      const isHorizontal = Math.random() > 0.5;

      // Random position
      const position = isHorizontal
        ? horizontalLines[Math.floor(Math.random() * horizontalLines.length)].y
        : verticalLines[Math.floor(Math.random() * verticalLines.length)].x;

      // Random color gradient
      const gradient =
        COLOR_GRADIENTS[Math.floor(Math.random() * COLOR_GRADIENTS.length)];

      // Random duration between 1.5 and 3 seconds
      const duration = 1.5 + Math.random() * 1.5;

      // Random delay before animation starts
      const delay = Math.random() * 0.5;

      // Create unique ID
      const id = `line-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const newLine = {
        id,
        isHorizontal,
        position,
        gradient,
        duration,
        delay,
        createdAt: Date.now(),
      };

      // Add the new line to the state
      setAnimatingLines((prevLines) => [...prevLines, newLine]);

      // Schedule removal of the line after animation completes (duration + 0.5s buffer)
      setTimeout(() => {
        setAnimatingLines((prevLines) =>
          prevLines.filter((line) => line.id !== id)
        );
      }, (duration + delay + 0.5) * 1000);
    };

    // Start adding random lines
    const startRandomAnimation = () => {
      // Add initial batch of lines
      for (let i = 0; i < 5; i++) {
        addRandomAnimatedLine();
      }

      // Continue adding lines at random intervals
      const scheduleNextLine = () => {
        // Random interval between 200ms and 800ms
        const nextInterval = 200 + Math.random() * 600;

        animationRef.current = setTimeout(() => {
          addRandomAnimatedLine();
          scheduleNextLine();
        }, nextInterval);
      };

      scheduleNextLine();
    };

    startRandomAnimation();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isClient, dimensions]);

  if (!isClient) return null;

  // Calculate how many cells can fit in the current viewport
  const numCols = Math.ceil(dimensions.width / CELL_SIZE) + 1;
  const numRows = Math.ceil(dimensions.height / CELL_SIZE) + 1;

  // Generate grid lines for the static base grid
  const horizontalLines = Array.from({ length: numRows }, (_, i) => ({
    id: `h${i}`,
    y: i * CELL_SIZE,
    index: i,
  }));

  const verticalLines = Array.from({ length: numCols }, (_, i) => ({
    id: `v${i}`,
    x: i * CELL_SIZE,
    index: i,
  }));

  // Animation variants for random lines
  interface LineVariantCustom {
    gradient: string[];
    duration: number;
    delay: number;
  }

  // Define variants object directly instead of using an interface
  const lineVariants = {
    initial: {
      pathLength: 0,
      opacity: 0.3,
    },
    animate: (custom: LineVariantCustom) => ({
      pathLength: [0, 1, 1],
      opacity: 1,
      stroke: [custom.gradient[0], custom.gradient[1], "#333333"],
      transition: {
        pathLength: {
          duration: custom.duration,
          times: [0, 0.6, 1],
          ease: "easeInOut",
          delay: custom.delay,
        },
        stroke: {
          duration: custom.duration,
          times: [0, 0.6, 1],
          ease: "easeInOut",
          delay: custom.delay,
        },
      },
    }),
  };
  // Previously defined above

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      {/* Base static grid - always visible gray grid */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        preserveAspectRatio="none"
      >
        {/* Horizontal base lines */}
        {horizontalLines.map((line) => (
          <path
            key={`base-${line.id}`}
            d={`M 0 ${line.y} H ${dimensions.width}`}
            stroke="#333333"
            strokeWidth="0.5"
            strokeOpacity="0.3"
            fill="none"
          />
        ))}

        {/* Vertical base lines */}
        {verticalLines.map((line) => (
          <path
            key={`base-${line.id}`}
            d={`M ${line.x} 0 V ${dimensions.height}`}
            stroke="#333333"
            strokeWidth="0.5"
            strokeOpacity="0.3"
            fill="none"
          />
        ))}
      </svg>

      {/* Animated random lines */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        preserveAspectRatio="none"
      >
        {animatingLines.map((line) => (
          <motion.path
            key={line.id}
            d={
              line.isHorizontal
                ? `M 0 ${line.position} H ${dimensions.width}`
                : `M ${line.position} 0 V ${dimensions.height}`
            }
            strokeWidth="0.5"
            strokeOpacity="0.3"
            fill="none"
            variants={lineVariants}
            initial="initial"
            animate="animate"
            custom={{
              gradient: line.gradient,
              duration: line.duration,
              delay: line.delay,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default AnimatedGrid;
