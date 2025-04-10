"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import services from "./services";
import { useScrollContext, ScrollProvider } from "./scrollContext";

import { useScrollAnimation, useStaggerAnimation } from "./useScrollAnimation";
import Heading from "../ui/Heading";
import MagicButton from "../ui/MagicButton";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Service info card component
const ServiceInfoCard: React.FC<{
  service: (typeof services)[0];
  index: number;
  visible: boolean;
}> = ({ service, index, visible }) => {
  const { registerSection } = useScrollContext();
  const cardRef = useRef<HTMLDivElement>(null);
  const listRef = useStaggerAnimation<HTMLUListElement>({
    childSelector: "li",
    staggerAmount: 0.1,
    fromVars: { opacity: 0, x: -20 },
    toVars: { opacity: 1, x: 0, ease: "back.out(1.2)" },
    duration: 0.4,
  });

  // Register this section with the context
  useEffect(() => {
    if (cardRef.current) {
      registerSection(index, cardRef.current);
    }
  }, [index, registerSection]);

  // Card animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.9,
      rotateX: 5,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -100,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  // Point item variants
  const pointVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Use GSAP for more complex animations
  useEffect(() => {
    if (!cardRef.current || !visible) return;

    const gifContainer = cardRef.current.querySelector(".gif-container");
    const title = cardRef.current.querySelector(".title");
    const description = cardRef.current.querySelector(".description");

    const tl = gsap.timeline();

    // Reset animations
    tl.set([gifContainer, title, description], { clearProps: "all" });

    // Animate gif container
    tl.fromTo(
      gifContainer,
      {
        scale: 0.8,
        opacity: 0,
        rotationY: -15,
        // boxShadow: "0 0 0 rgba(79, 70, 229, 0)",
      },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        // boxShadow: "0 0 30px rgba(79, 70, 229, 0.3)",
        duration: 0.8,
        ease: "power3.out",
      }
    );

    // Add floating animation for GIF container
    gsap.to(gifContainer, {
      y: "10px",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      // Cleanup animations
      gsap.killTweensOf(gifContainer);
    };
  }, [visible]);

  // Alternate layout for even/odd index
  const isEven = index % 2 === 0;

  // Parallax effect for background elements
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <div
      ref={cardRef}
      className="min-h-[80vh] flex items-center justify-center py-24 relative"
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={`service-${service.id}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`flex flex-col ${
              isEven ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-10 bg-gradient-to-br from-slate-950/80 to-slate-900/80 backdrop-blur-lg rounded-2xl p-8 md:p-12 w-full max-w-6xl mx-auto shadow-2xl border border-gray-700/30 relative overflow-hidden z-10`}
          >
            {/* Background decorative elements */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0"
              style={{ opacity: bgOpacity, y: bgY }}
            >
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
            </motion.div>

            {/* GIF Container */}
            <div className="gif-container relative z-10 w-full md:w-2/5 overflow-hidden rounded-xl p-1">
              <img
                src={service.gifUrl}
                alt={service.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Content section */}
            <div className="w-full md:w-3/5 relative z-10">
              <motion.h3
                className="title text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-400 mb-4"
                variants={pointVariants}
              >
                {service.title}
              </motion.h3>

              <motion.p
                className="description text-gray-300 mb-8 text-lg leading-relaxed"
                variants={pointVariants}
              >
                {service.description}
              </motion.p>

              <motion.ul ref={listRef} className="space-y-3">
                {service.points.map((point, i) => (
                  <motion.li
                    key={i}
                    variants={pointVariants}
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
              </motion.ul>

              <motion.div variants={pointVariants} className="mt-8">
                <MagicButton title="Learn More" icon={null} position="left" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main ServiceSection component
const ServiceSection: React.FC = () => {
  const { currentIndex } = useScrollContext();
  const sectionRef = useScrollAnimation<HTMLDivElement>({
    fromVars: { opacity: 0 },
    toVars: { opacity: 1 },
    duration: 1,
  });

  // Parallax background effect
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent overflow-hidden"
    >
      {/* Fixed background elements with parallax effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[url('/path/to/grid-pattern.svg')] opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-600/5 blur-3xl"></div>
      </motion.div>

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

      {/* Service cards */}
      <div>
        {services.map((service, index) => (
          <ServiceInfoCard
            key={service.id}
            service={service}
            index={index}
            visible={currentIndex === index}
          />
        ))}
      </div>

      {/* CSS for shimmer effect */}
      <style jsx global>{`
        .shimmer-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2.5s infinite;
          transform: rotate(30deg);
        }

        @keyframes shimmer {
          0% {
            transform: translateY(-100%) translateX(-100%) rotate(30deg);
          }
          100% {
            transform: translateY(100%) translateX(100%) rotate(30deg);
          }
        }
      `}</style>
    </section>
  );
};

// Wrapper component with ScrollContext
const ServiceSectionWithContext: React.FC = () => {
  return (
    <ScrollProvider totalSections={services.length}>
      <ServiceSection />
    </ScrollProvider>
  );
};

export default ServiceSectionWithContext;
