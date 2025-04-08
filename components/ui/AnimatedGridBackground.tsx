"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGridBackgroundProps {
  opacity?: number;
  className?: string;
  gradientColors?: string[][];
  animationDuration?: number;
}

const AnimatedGridBackground: React.FC<AnimatedGridBackgroundProps> = ({
  opacity = 0.5,
  className = "",
  gradientColors = [
    ["#3b82f6", "#38bdf8"], // blue to cyan
    ["#8b5cf6", "#c084fc"], // violet to purple
    ["#06b6d4", "#22d3ee"], // cyan to lighter cyan
    ["#3b82f6", "#93c5fd"], // blue to light blue
    ["#8b5cf6", "#a78bfa"], // violet to lighter violet
  ],
  animationDuration = 20,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentGradientIndex, setCurrentGradientIndex] = useState(0);

  // Grid configuration
  const gridConfig = {
    rows: 12,
    columns: 16,
    cellSize: 60,
    strokeWidth: 0.5,
    strokeOpacity: opacity,
  };

  // Generate gradient definitions
  const gradientDefs = gradientColors.map((colors, i) => (
    <linearGradient
      key={`gradient-${i}`}
      id={`grid-gradient-${i}`}
      x1="0%"
      y1="0%"
      x2="100%"
      y2="100%"
    >
      <stop offset="0%" stopColor={colors[0]} stopOpacity={opacity} />
      <stop offset="100%" stopColor={colors[1]} stopOpacity={opacity} />
    </linearGradient>
  ));

  // Generate horizontal grid lines
  const horizontalLines = Array.from(
    { length: gridConfig.rows + 1 },
    (_, i) => ({
      id: `h-line-${i}`,
      x1: 0,
      y1: i * gridConfig.cellSize,
      x2: gridConfig.columns * gridConfig.cellSize,
      y2: i * gridConfig.cellSize,
      delay: i * 0.1,
    })
  );

  // Generate vertical grid lines
  const verticalLines = Array.from(
    { length: gridConfig.columns + 1 },
    (_, i) => ({
      id: `v-line-${i}`,
      x1: i * gridConfig.cellSize,
      y1: 0,
      x2: i * gridConfig.cellSize,
      y2: gridConfig.rows * gridConfig.cellSize,
      delay: i * 0.1 + horizontalLines.length * 0.1,
    })
  );

  // Combine all grid lines
  const allGridLines = [...horizontalLines, ...verticalLines];

  // Animation variants for drawing each path
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: (custom: number) => ({
      pathLength: 1,
      opacity: gridConfig.strokeOpacity,
      transition: {
        pathLength: {
          duration: 1.5,
          delay: custom,
          ease: "easeInOut",
        },
        opacity: {
          duration: 1,
          delay: custom,
          ease: "easeInOut",
        },
      },
    }),
  };

  // Effect to cycle through gradients
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentGradientIndex((prev) => (prev + 1) % gradientColors.length);
    }, animationDuration * 1000); // Cycle gradient every animationDuration seconds

    return () => clearInterval(intervalId);
  }, [gradientColors.length, animationDuration]);

  // Create animation sequence for redrawing the grid
  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path");
    let currentIndex = 0;

    const animatePath = () => {
      if (currentIndex >= paths.length) {
        currentIndex = 0;
      }

      // Reset the path to trigger redraw animation
      const path = paths[currentIndex];
      const currentLength = path.getTotalLength();

      path.style.strokeDasharray = `${currentLength}`;
      path.style.strokeDashoffset = `${currentLength}`;

      // Animate drawing the path
      const animation = path.animate(
        [{ strokeDashoffset: currentLength }, { strokeDashoffset: 0 }],
        {
          duration: 1500,
          easing: "ease-in-out",
          fill: "forwards",
        }
      );

      animation.onfinish = () => {
        currentIndex++;
        setTimeout(animatePath, 100);
      };
    };

    // Start the animation sequence
    animatePath();

    return () => {
      // Cleanup animations on unmount
      svgRef.current?.getAnimations().forEach((anim) => anim.cancel());
    };
  }, [svgRef.current, currentGradientIndex]);

  // Grid floating animation
  const floatingAnimation = {
    y: [0, 10, 0],
    x: [0, 5, 0],
    transition: {
      duration: animationDuration,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut",
    },
  };

  return (
    <div
      className={cn(
        "w-full h-full fixed top-0 left-0 z-[-1] pointer-events-none",
        className
      )}
    >
      <motion.svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox={`0 0 ${gridConfig.columns * gridConfig.cellSize} ${
          gridConfig.rows * gridConfig.cellSize
        }`}
        preserveAspectRatio="xMidYMid slice"
        animate={floatingAnimation}
      >
        <defs>
          {gradientDefs}
          <mask id="grid-mask">
            <rect width="100%" height="100%" fill="white" />
          </mask>
        </defs>

        {/* Grid drawn with SVG paths */}
        <g
          mask="url(#grid-mask)"
          stroke={`url(#grid-gradient-${currentGradientIndex})`}
          strokeWidth={gridConfig.strokeWidth}
        >
          {allGridLines.map((line, index) => (
            <motion.path
              key={line.id}
              d={`M${line.x1},${line.y1} L${line.x2},${line.y2}`}
              strokeLinecap="round"
              custom={line.delay}
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              strokeDasharray="0 1"
            />
          ))}

          {/* Add implementation of the footer-grid.svg paths */}
          <motion.path
            d="M0,0 V100%"
            strokeLinecap="round"
            custom={0}
            variants={pathVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.path
            d="M0,0 H100%"
            strokeLinecap="round"
            custom={0.2}
            variants={pathVariants}
            initial="hidden"
            animate="visible"
          />
        </g>

        {/* Add subtle glow effect for intersections */}
        <g filter="url(#glow)">
          {horizontalLines.map((hLine, i) =>
            verticalLines.map((vLine, j) => (
              <circle
                key={`intersection-${i}-${j}`}
                cx={vLine.x1}
                cy={hLine.y1}
                r="1"
                fill={`url(#grid-gradient-${currentGradientIndex})`}
                opacity={0.8}
              />
            ))
          )}
        </g>

        {/* Add filter for glow effect */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </motion.svg>
    </div>
  );
};

// Component for rendering the full-page grid from the footer-grid.svg
export default function PageGridBackground({
  opacity = 0.2,
}: {
  opacity?: number;
}) {
  return (
    <AnimatedGridBackground
      opacity={opacity}
      gradientColors={[
        ["#3b82f6", "#38bdf8"], // blue to cyan
        ["#8b5cf6", "#c084fc"], // violet to purple
        ["#06b6d4", "#22d3ee"], // cyan to lighter cyan
        ["#6366f1", "#818cf8"], // indigo to lighter indigo
        ["#8b5cf6", "#a78bfa"], // violet to lighter violet
      ]}
      animationDuration={30}
    />
  );
}
