"use client";
// components/CustomButton.tsx
import React from "react";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  className = "",
  variant = "primary",
}) => {
  const baseStyles =
    "relative px-4 py-2 rounded-md transition-colors duration-300 overflow-hidden font-medium";

  const variantStyles = {
    primary: "bg-red-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border-2 border-blue-600 text-blue-600 hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
