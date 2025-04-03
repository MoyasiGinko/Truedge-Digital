"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

interface FluidCursorProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  glowColor?: string;
  highlightColor?: string;
  followSpeed?: number;
  fluidIntensity?: number;
  rippleSpeed?: number;
  waterOpacity?: number;
  enableInteractivity?: boolean;
  buttonMorphing?: boolean;
  adaptButtonColor?: boolean;
  maxMorphWidth?: number;
  maxMorphHeight?: number;
  cornerRadius?: number;
}

const FluidCursor: React.FC<FluidCursorProps> = ({
  size = 60,
  primaryColor = "rgba(56,189,248,0.5)",
  secondaryColor = "rgba(59,130,246,0.3)",
  glowColor = "rgba(56,189,248,0.4)",
  highlightColor = "rgba(255,255,255,0.6)",
  followSpeed = 6.0,
  fluidIntensity = 0.08,
  rippleSpeed = 1.5,
  waterOpacity = 0.75,
  enableInteractivity = true,
  buttonMorphing = true,
  adaptButtonColor = true,
  maxMorphWidth = 300, // Maximum width when morphing
  maxMorphHeight = 150, // Maximum height when morphing
  cornerRadius = 12,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [buttonColors, setButtonColors] = useState({
    primary: primaryColor,
    secondary: secondaryColor,
    highlight: highlightColor,
  });
  const [morphDimensions, setMorphDimensions] = useState({
    width: size,
    height: size,
    isMorphed: false,
    cornerRadius: cornerRadius,
  });
  const prevMorphState = useRef(false);

  // Mouse position with spring physics for smoother following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apply fluid physics with appropriate damping for watery movement
  const springConfig = {
    damping: 15, // Slightly higher damping for water-like oscillation
    stiffness: 200 * followSpeed, // Lower stiffness for fluid movement
    mass: 0.6, // Higher mass for liquid-like momentum
  };

  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Water animation values
  const wavePhase1 = useMotionValue(0);
  const wavePhase2 = useMotionValue(0);
  const wavePhase3 = useMotionValue(0);
  const rippleScale = useMotionValue(1);

  // Dynamic border radius for morphing
  const borderRadius = useSpring(size / 2, {
    damping: 20,
    stiffness: 300,
  });

  // Width and height for morphing
  const width = useSpring(size, {
    damping: 20,
    stiffness: 300,
  });

  const height = useSpring(size, {
    damping: 20,
    stiffness: 300,
  });

  // Fluid wave distortions
  const distortX = useTransform(
    wavePhase1,
    [0, Math.PI, 2 * Math.PI],
    [-fluidIntensity * size, fluidIntensity * size, -fluidIntensity * size]
  );

  const distortY = useTransform(
    wavePhase2,
    [0, Math.PI, 2 * Math.PI],
    [fluidIntensity * size, -fluidIntensity * size, fluidIntensity * size]
  );

  // Water ripple effect
  const ripple = useTransform(rippleScale, [1, 1.05, 1], [1, 1.05, 1]);

  // Init water animations
  useEffect(() => {
    // Generate continuous fluid motion
    const animations = [
      // Primary wave
      animate(wavePhase1, [0, 2 * Math.PI], {
        duration: 3 / rippleSpeed,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }),

      // Secondary wave (slightly out of phase)
      animate(wavePhase2, [Math.PI / 2, 2.5 * Math.PI], {
        duration: 2.7 / rippleSpeed,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }),

      // Tertiary wave (different phase)
      animate(wavePhase3, [Math.PI, 3 * Math.PI], {
        duration: 4.2 / rippleSpeed,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }),

      // Ripple pulsation
      animate(rippleScale, [1, 1.05, 1, 0.98, 1], {
        duration: 3.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      }),
    ];

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, [rippleSpeed]);

  // Extract color from element
  const getElementColors = (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element);
    let bgColor = computedStyle.backgroundColor;

    // Convert rgba(0,0,0,0) or transparent to undefined
    if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
      // Try to get background from parent elements (limited depth)
      let parent = element.parentElement;
      let searchDepth = 0;
      const maxDepth = 3;

      while (parent && searchDepth < maxDepth) {
        const parentStyle = window.getComputedStyle(parent);
        const parentBg = parentStyle.backgroundColor;

        if (parentBg !== "rgba(0, 0, 0, 0)" && parentBg !== "transparent") {
          bgColor = parentBg;
          break;
        }

        parent = parent.parentElement;
        searchDepth++;
      }
    }

    // If we still don't have a valid color, return default colors
    if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
      return {
        primary: primaryColor,
        secondary: secondaryColor,
        highlight: highlightColor,
      };
    }

    // Parse the background color
    let r,
      g,
      b,
      a = 1;

    if (bgColor.startsWith("rgba")) {
      const parts = bgColor.match(
        /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/
      );
      if (parts) {
        [, r, g, b, a] = parts.map(Number);
      }
    } else if (bgColor.startsWith("rgb")) {
      const parts = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (parts) {
        [, r, g, b] = parts.map(Number);
      }
    }

    if (r !== undefined && g !== undefined && b !== undefined) {
      // Create derived colors with proper opacity
      return {
        primary: `rgba(${r}, ${g}, ${b}, ${Math.min(0.5, a)})`,
        secondary: `rgba(${r}, ${g}, ${b}, ${Math.min(0.3, a)})`,
        highlight: `rgba(255, 255, 255, 0.6)`,
      };
    }

    return {
      primary: primaryColor,
      secondary: secondaryColor,
      highlight: highlightColor,
    };
  };

  // Handle morphing between circle and button shape
  useEffect(() => {
    if (targetElement && buttonMorphing) {
      const rect = targetElement.getBoundingClientRect();

      // Get button's border-radius if available
      const computedStyle = window.getComputedStyle(targetElement);
      const buttonBorderRadius =
        parseInt(computedStyle.borderRadius) || cornerRadius;

      // Get button dimensions with safety limits
      const buttonWidth = Math.min(rect.width + 8, maxMorphWidth);
      const buttonHeight = Math.min(rect.height + 8, maxMorphHeight);

      // Skip morphing for extremely large elements (likely special designs)
      const isTooLarge =
        rect.width > maxMorphWidth * 1.5 || rect.height > maxMorphHeight * 1.5;

      if (!isTooLarge) {
        // Update morph dimensions
        setMorphDimensions({
          width: buttonWidth,
          height: buttonHeight,
          isMorphed: true,
          cornerRadius: buttonBorderRadius,
        });

        // Extract button colors if enabled
        if (adaptButtonColor) {
          setButtonColors(getElementColors(targetElement));
        }
      } else {
        // For oversized elements, just adapt color but not shape
        if (adaptButtonColor) {
          setButtonColors(getElementColors(targetElement));
        }

        setMorphDimensions({
          width: size,
          height: size,
          isMorphed: false,
          cornerRadius: size / 2,
        });
      }
    } else {
      // Reset to default state
      setMorphDimensions({
        width: size,
        height: size,
        isMorphed: false,
        cornerRadius: size / 2, // Circle
      });

      // Reset colors to defaults
      setButtonColors({
        primary: primaryColor,
        secondary: secondaryColor,
        highlight: highlightColor,
      });
    }
  }, [
    targetElement,
    buttonMorphing,
    adaptButtonColor,
    size,
    cornerRadius,
    maxMorphWidth,
    maxMorphHeight,
  ]);

  // Apply morphing changes
  useEffect(() => {
    // Animate changes with fluid transitions
    animate(width, morphDimensions.width, {
      type: "spring",
      damping: 20,
      stiffness: 200,
    });

    animate(height, morphDimensions.height, {
      type: "spring",
      damping: 20,
      stiffness: 200,
    });

    animate(borderRadius, morphDimensions.cornerRadius, {
      type: "spring",
      damping: 20,
      stiffness: 200,
    });

    prevMorphState.current = morphDimensions.isMorphed;
  }, [morphDimensions, width, height, borderRadius]);

  useEffect(() => {
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });

      if (!isVisible) {
        setIsVisible(true);
      }

      // Check if hovering over interactive elements
      if (enableInteractivity) {
        const target = e.target as HTMLElement;
        const isButton = !!(
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("interactive")
        );

        // Handle elements with data-no-cursor attribute
        const hasNoMorph =
          target.hasAttribute("data-no-cursor") ||
          target.closest("[data-no-cursor]");

        if (isButton && !hasNoMorph) {
          setTargetElement(target);
        } else {
          setTargetElement(null);
        }
      }
    };

    // Window events
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Register events
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY, enableInteractivity]);

  // Calculate position offset for morphing
  const offsetX = useTransform(
    [width, distortX],
    ([w, dX]: number[]) => -w / 2 + dX
  );

  const offsetY = useTransform(
    [height, distortY],
    ([h, dY]: number[]) => -h / 2 + dY
  );

  return (
    <>
      {/* Main fluid cursor */}
      <motion.div
        style={{
          position: "fixed",
          pointerEvents: "none",
          zIndex: 999999,
          width,
          height,
          borderRadius,
          opacity: isVisible ? waterOpacity : 0,
          x,
          y,
          top: offsetY,
          left: offsetX,
          // Water-like appearance with gradient (using button colors when available)
          background: `
            radial-gradient(circle at 40% 40%,
              ${buttonColors.highlight} 0%,
              ${buttonColors.primary} 40%,
              ${buttonColors.secondary} 90%)
          `,
          boxShadow: `
            0 0 20px ${glowColor},
            inset 0 0 8px rgba(255,255,255,0.6)
          `,
          // Glass effect
          backdropFilter: "blur(3px)",
          transition: "opacity 0.3s ease",
          scale: ripple,
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isVisible ? waterOpacity : 0,
        }}
        transition={{
          opacity: { duration: 0.3, ease: "easeOut" },
        }}
      >
        {/* Water surface highlight */}
        <motion.div
          style={{
            position: "absolute",
            top: "15%",
            left: "15%",
            width: "50%",
            height: "25%",
            borderRadius: "50%",
            background: `radial-gradient(
              ellipse,
              rgba(255,255,255,0.7) 0%,
              rgba(255,255,255,0) 70%
            )`,
            opacity: 0.6,
            // Subtle movement to simulate water surface
            y: useTransform(wavePhase3, [0, Math.PI, 2 * Math.PI], [-2, 2, -2]),
            x: useTransform(wavePhase2, [0, Math.PI, 2 * Math.PI], [-1, 1, -1]),
          }}
        />

        {/* Secondary water reflection */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "25%",
            width: "30%",
            height: "15%",
            borderRadius: "50%",
            background: `radial-gradient(
              ellipse,
              rgba(255,255,255,0.5) 0%,
              rgba(255,255,255,0) 70%
            )`,
            opacity: 0.4,
            // Out of phase with primary highlight
            y: useTransform(wavePhase1, [0, Math.PI, 2 * Math.PI], [1, -1, 1]),
            x: useTransform(wavePhase3, [0, Math.PI, 2 * Math.PI], [1, -1, 1]),
          }}
        />

        {/* Water ripples */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "inherit",
            border: `1px solid rgba(255,255,255,0.2)`,
            boxSizing: "border-box",
            opacity: useTransform(
              wavePhase1,
              [0, Math.PI, 2 * Math.PI],
              [0.1, 0.3, 0.1]
            ),
          }}
        />
      </motion.div>
    </>
  );
};

// Default export with optimal water settings
export default function FluidAdaptiveCursor() {
  return (
    <FluidCursor
      size={70}
      followSpeed={3}
      primaryColor="rgba(56,189,248,0.5)"
      secondaryColor="rgba(59,130,246,0.4)"
      glowColor="rgba(56,189,248,0.4)"
      fluidIntensity={0.08}
      rippleSpeed={1.5}
      waterOpacity={0.75}
      buttonMorphing={true}
      adaptButtonColor={true}
      maxMorphWidth={300}
      maxMorphHeight={150}
      cornerRadius={12}
    />
  );
}
