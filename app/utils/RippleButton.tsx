"use client";
import React, { useState, useEffect, useRef } from "react";

interface RippleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  rippleColor?: string;
  rippleDuration?: number;
}

interface Ripple {
  id: string;
  x: number;
  y: number;
  size: number;
}

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  rippleColor = "rgba(255, 255, 255, 0.7)",
  rippleDuration = 800,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleCounterRef = useRef(0);

  const baseStyles =
    "relative px-4 py-2 rounded-md transition-colors duration-300 overflow-hidden font-medium";

  const variantStyles = {
    primary: "bg-purple-600 text-white hover:bg-purple-700",
    secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600",
    outline:
      "border-2 border-purple-500 text-purple-400 hover:border-purple-400",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    // Get click position relative to button
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate ripple size based on button dimensions
    const size = Math.max(rect.width, rect.height) * 2;

    // Create unique ripple ID
    const rippleId = `btn-ripple-${Date.now()}-${rippleCounterRef.current++}`;

    // Create new ripple
    const newRipple: Ripple = {
      id: rippleId,
      x,
      y,
      size,
    };

    // Add ripple
    setRipples((prevRipples) => [...prevRipples, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prevRipples) => prevRipples.filter((r) => r.id !== rippleId));
    }, rippleDuration);

    // Call original onClick if provided
    if (onClick) onClick();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className} cursor-btn`}
    >
      {children}

      {/* Ripple container */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute block rounded-full pointer-events-none"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
            transform: "scale(0)",
            animation: `button-ripple ${rippleDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />
      ))}
    </button>
  );
};

export default RippleButton;
