"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

interface BubbleCursorProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  glowColor?: string;
  highlightColor?: string;
  followSpeed?: number;
  enablePulse?: boolean;
  pulseIntensity?: number;
  enableRotation?: boolean;
  enableFloat?: boolean;
  opacity?: number;
  innerGlowOpacity?: number;
  enableInteractivity?: boolean;
}

const EnhancedBubbleCursor: React.FC<BubbleCursorProps> = ({
  size = 60,
  primaryColor = "rgba(56,189,248,0.7)",
  secondaryColor = "rgba(99,102,241,0.3)",
  glowColor = "rgba(56,189,248,0.4)",
  highlightColor = "rgba(255,255,255,0.9)",
  followSpeed = 6.0,
  enablePulse = true,
  pulseIntensity = 0.05,
  enableRotation = true,
  enableFloat = true,
  opacity = 0.85,
  innerGlowOpacity = 0.7,
  enableInteractivity = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position with spring physics for smoother following
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Apply ultra-fast spring physics with minimal damping for instant following
  const springConfig = {
    damping: 12,
    stiffness: 750 * followSpeed,
    mass: 0.2,
  };

  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Advanced animation values
  const pulseSize = useMotionValue(1);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const floatY = useMotionValue(0);

  // Derived transforms
  const scale = useTransform(
    pulseSize,
    [1 - pulseIntensity, 1 + pulseIntensity],
    [1 - pulseIntensity, 1 + pulseIntensity]
  );

  // Init animations
  useEffect(() => {
    const animations: ReturnType<typeof animate>[] = [];

    // Pulse animation
    if (enablePulse) {
      const pulseAnimation = animate(
        pulseSize,
        [1, 1 + pulseIntensity, 1, 1 - pulseIntensity, 1],
        {
          duration: 3.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }
      );
      animations.push(pulseAnimation);
    }

    // Gentle floating animation
    if (enableFloat) {
      const floatAnimation = animate(floatY, [0, -3, 0, 3, 0], {
        duration: 5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      });
      animations.push(floatAnimation);
    }

    // Cleanup animations on unmount
    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, [enablePulse, enableFloat, pulseIntensity]);

  useEffect(() => {
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      // For smoother updates
      requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);

        // 3D rotation effect based on mouse velocity
        if (enableRotation) {
          const dx = e.movementX;
          const dy = e.movementY;

          // Apply subtle rotation based on mouse movement
          rotateX.set(-dy * 0.7);
          rotateY.set(dx * 0.7);

          // Reset rotation gradually when mouse stops
          setTimeout(() => {
            animate(rotateX, 0, { duration: 0.8, ease: "easeOut" });
            animate(rotateY, 0, { duration: 0.8, ease: "easeOut" });
          }, 100);
        }
      });

      if (!isVisible) {
        setIsVisible(true);
      }

      // Check if hovering over interactive elements
      if (enableInteractivity) {
        const target = e.target as HTMLElement;
        const isInteractive = !!(
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.closest("button") ||
          target.closest("a") ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("interactive")
        );

        setIsHovering(isInteractive);
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
  }, [isVisible, mouseX, mouseY, enableRotation, enableInteractivity]);

  // Main bubble style with enhanced 3D effects
  const bubbleStyle = {
    position: "fixed" as const,
    pointerEvents: "none" as const,
    zIndex: 999,
    borderRadius: "50%",
    width: `${size}px`,
    height: `${size}px`,
    opacity: isVisible ? opacity : 0,
    // Position so cursor is at center
    top: -size / 2,
    left: -size / 2,
    // Enhanced 3D look with multiple layers
    background: `
      radial-gradient(circle at 30% 30%,
        ${highlightColor} 0%,
        ${primaryColor} 35%,
        ${secondaryColor} 80%)
    `,
    boxShadow: `
      0 0 15px ${glowColor},
      0 0 25px ${glowColor},
      inset 0 0 15px rgba(255,255,255,${innerGlowOpacity})
    `,
    // Subtle glass effect
    backdropFilter: "blur(2px)",
    transition: "opacity 0.2s ease, box-shadow 0.3s ease",
  };

  return (
    <motion.div
      style={{
        ...bubbleStyle,
        x,
        // Removed duplicate y property
        y: useTransform(
          [y, floatY],
          (values: number[]) => values[0] + values[1]
        ),
        scale: enablePulse ? scale : undefined,
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: isHovering
          ? enablePulse
            ? scale.get() * 1.3
            : 1.3
          : enablePulse
          ? scale.get()
          : 1,
        opacity: isVisible ? opacity : 0,
      }}
      transition={{
        scale: { duration: 0.25, ease: "easeOut" },
        opacity: { duration: 0.2 },
      }}
    >
      {/* Inner highlight for 3D effect */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "35%",
          height: "35%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%)`,
          opacity: 0.7,
        }}
      />
    </motion.div>
  );
};

// Default export with optimal 3D settings
export default EnhancedBubbleCursor;

function EnhancedBubbleCursorWrapper() {
  return (
    <EnhancedBubbleCursor
      size={65}
      followSpeed={6}
      primaryColor="rgba(56,189,248,0.7)"
      secondaryColor="rgba(99,102,241,0.3)"
      glowColor="rgba(56,189,248,0.5)"
      enablePulse={true}
      pulseIntensity={0.05}
      enableRotation={true}
      enableFloat={true}
      opacity={0.85}
      innerGlowOpacity={0.7}
    />
  );
}
