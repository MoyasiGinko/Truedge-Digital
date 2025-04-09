"use client";
import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

// Define hover effect types
type HoverEffectType =
  | "color1"
  | "color2"
  | "color3"
  | "color4"
  | "color5"
  | "color6"
  | "color7"
  | "color8"
  | "color9";

export const TextGenerateEffect = ({
  words,
  className,
  hoverEffects = true,
}: {
  words: string;
  className?: string;
  hoverEffects?: boolean;
}) => {
  const [scope, animate] = useAnimate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Split words into array
  let wordsArray = words.split(" ");

  // Pre-defined effect styles for each word based on index
  const wordEffects: HoverEffectType[] = [
    "color1", // Transforming
    "color2", // Concepts
    "color3", // into
    "color4", // Seamless
    "color5", // User
    "color6", // Experiences
  ];

  // Initialize animation when component mounts
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(0.2),
      }
    );
  }, [scope.current, animate]);

  // Apply hover effect styles based on effect type
  const getHoverStyles = (effect: HoverEffectType, isHovered: boolean) => {
    if (!isHovered) return "";

    switch (effect) {
      case "color1":
        return "hover:text-blue-500 transition-all duration-300";
      case "color2":
        return "hover:text-red-500 transition-all duration-300";
      case "color3":
        return "hover:text-green-500 transition-all duration-300";
      case "color4":
        return "hover:text-yellow-500 transition-all duration-300";
      case "color5":
        return "hover:text-purple-500 transition-all duration-300";
      case "color6":
        return "hover:text-pink-500 transition-all duration-300";
      case "color7":
        return "hover:text-orange-500 transition-all duration-300";
      case "color8":
        return "hover:text-teal-500 transition-all duration-300";
      case "color9":
        return "hover:text-indigo-500 transition-all duration-300";
      default:
        return "";
    }
  };

  // Render words with effects
  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          // Determine text color - purple for words after index 3
          const baseClass = idx > 3 ? "text-purple" : "text-gray-100 ";

          // Get the appropriate effect for this word (cycling through the effects array)
          const effectType = wordEffects[idx % wordEffects.length];

          // Check if this word is currently being hovered
          const isHovered = hoveredIndex === idx;

          // Combine classes based on hover state
          const hoverClass = hoverEffects
            ? getHoverStyles(effectType, isHovered)
            : "";

          return (
            <motion.span
              key={word + idx}
              className={`${baseClass} opacity-0 inline-block mx-[0.3rem] transition-all duration-300 ${hoverClass}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={hoverEffects ? { y: 0 } : {}}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-4">
        <div className="text-white   leading-snug tracking-wide relative">
          {renderWords()}

          {/* Subtle background animation */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute h-20 w-40 -top-6 -left-2 bg-purple-500/30 rounded-full filter blur-3xl"></div>
            <div className="absolute h-20 w-40 -bottom-6 -right-2 bg-blue-500/30 rounded-full filter blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
