"use client";

import React, { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface BubbleCursorProps {
  size?: number;
  color?: string;
  delay?: number;
  blur?: number;
  opacity?: number;
  followSpeed?: number;
}

export const BubbleCursor: React.FC<BubbleCursorProps> = ({
  size = 80,
  color = "rgba(56,189,248,0.6)",
  delay = 0.02, // Reduced delay from 0.08 to 0.02
  blur = 5,
  opacity = 0.7,
  followSpeed = 0.8, // Increased from 0.1 to 0.8 for faster following
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Mouse position with spring physics for smoother following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apply faster spring physics with less damping for quicker follow
  // Higher stiffness and lower damping = faster following
  const springConfig = {
    damping: 12, // Reduced from 25 for less resistance
    stiffness: 400 * followSpeed, // Increased from 300 for more responsiveness
  };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      // Using requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });

      if (!isVisible) {
        setIsVisible(true);
      }
    };

    // Handle mouse leaving the window
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Handle mouse entering the window
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove, { passive: true }); // Added passive for performance
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Clean up event listeners
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  // Calculate bubble styles
  const bubbleStyle = {
    position: "fixed" as const,
    pointerEvents: "none" as const,
    zIndex: 9999,
    borderRadius: "50%",
    mixBlendMode: "normal" as const,
    filter: `blur(${blur}px)`,
    background: `radial-gradient(circle,
        ${color} 0%,
        rgba(59,130,246,${opacity * 0.5}) 70%,
        rgba(99,102,241,${opacity * 0.2}) 100%)`,
    boxShadow: `0 0 20px rgba(56,189,248,${opacity * 0.6})`,
    top: 0,
    left: 0,
    width: `${size}px`,
    height: `${size}px`,
    transform: "translate(-50%, -50%)",
    opacity: isVisible ? 1 : 0,
    transition: `opacity 0.3s ease`,
  };

  return (
    <motion.div
      style={{
        ...bubbleStyle,
        x,
        y,
      }}
      initial={{ scale: 0.8 }}
      animate={{
        scale: isVisible ? 1 : 0.8,
      }}
      transition={{
        scale: { duration: 0.2 }, // Faster scale transition (from 0.3 to 0.2)
      }}
    />
  );
};

// Create a version with click effects
export const BubbleCursorWithClick: React.FC<BubbleCursorProps> = (props) => {
  // Use default props with faster following
  const defaultProps = {
    followSpeed: 0.8, // Faster following
    delay: 0.02, // Reduced delay
    ...props,
  };

  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  let clickCounter = 0;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newClick = {
        id: clickCounter++,
        x: e.clientX,
        y: e.clientY,
      };

      setClicks((prev) => [...prev, newClick]);

      // Remove the click effect after animation
      setTimeout(() => {
        setClicks((prev) => prev.filter((click) => click.id !== newClick.id));
      }, 1000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <BubbleCursor {...defaultProps} />

      {/* Render click effects */}
      {clicks.map((click) => (
        <motion.div
          key={click.id}
          style={{
            position: "fixed" as const,
            left: click.x,
            top: click.y,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            zIndex: 9998,
            pointerEvents: "none" as const,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ width: 0, height: 0, opacity: 0.7 }}
          animate={{
            width: defaultProps.size ? defaultProps.size * 2 : 160,
            height: defaultProps.size ? defaultProps.size * 2 : 160,
            opacity: 0,
          }}
          transition={{
            duration: 0.4, // Faster animation (from 0.6 to 0.4)
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
};
