"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { socialMedia } from "@/data";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Custom text splitting component with Framer Motion
const SplitText = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  // Using useState with useEffect to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={className}>
      {children.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: index * 0.02,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

// Animated lines background component
const AnimatedLinesBackground = () => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    if (containerRef.current && typeof window !== "undefined") {
      const lines = 7; // Number of lines

      for (let i = 0; i < lines; i++) {
        const line = document.createElement("div");
        line.className =
          "absolute h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent";
        line.style.width = "100%";
        line.style.top = `${(i + 1) * (100 / (lines + 1))}%`;
        line.style.left = "0";
        line.style.opacity = "0";
        line.style.transform = "scaleX(0)";

        containerRef.current.appendChild(line);

        gsap.to(line, {
          opacity: 0.3,
          scaleX: 1,
          duration: 1.5,
          delay: 0.2 * i,
          ease: "power2.inOut",
        });
      }
    }
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    />
  );
};

// Animated circle background
const CircleBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const circles = 3; // Number of circles

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {Array.from({ length: circles }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full border border-purple-500/10"
          style={{
            width: "80vw",
            height: "80vw",
            left: "50%",
            top: "50%",
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{
            scale: 0.5,
            opacity: 0,
            borderWidth: 1,
          }}
          animate={{
            scale: [0.5 + index * 0.2, 0.8 + index * 0.2],
            opacity: [0, 0.1, 0],
            borderWidth: [1, 2, 1],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            delay: index * 3,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Reveal text component
const RevealText = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.2, 0.65, 0.3, 0.9],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const FooterHeading = ({ children }: { children: React.ReactNode }) => {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Check if children is a string to apply text splitting
  if (typeof children === "string") {
    return (
      <motion.h1
        ref={headingRef}
        className="heading lg:max-w-[50vw] text-center relative z-10 text-white"
        initial="hidden"
        animate={controls}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
      >
        <SplitText>{children}</SplitText>
      </motion.h1>
    );
  }

  // Handle JSX children (like the span with className="text-purple")
  return (
    <motion.h1
      ref={headingRef}
      className="heading lg:max-w-[50vw] text-center relative z-10 text-white"
      initial="hidden"
      animate={controls}
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {},
      }}
    >
      {children}
    </motion.h1>
  );
};

// A client-side-only gradient border component
const AnimatedBorder = () => {
  const [mounted, setMounted] = useState(false);
  const borderRef = useRef(null);
  const isInView = useInView(borderRef, { once: true, amount: 0.3 });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-px bg-white/10 my-8" />;
  }

  return (
    <motion.div
      ref={borderRef}
      className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-8"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
      transition={{ duration: 1.5, delay: 0.2 }}
    />
  );
};

// Geometric shape backdrop component
const GeometricBackdrop = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-10">
      {/* Diamond Shape */}
      <motion.div
        className="absolute bg-gradient-to-r from-purple-500/20 to-purple-700/20"
        style={{
          width: "40vw",
          height: "40vw",
          left: "10%",
          top: "20%",
          borderRadius: "5%",
        }}
        initial={{ opacity: 0, rotate: 0 }}
        animate={{
          opacity: [0, 0.3, 0.1],
          rotate: 45,
          scale: [0.8, 1, 0.9],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Circle */}
      <motion.div
        className="absolute rounded-full border-2 border-purple-500/10"
        style={{
          width: "30vw",
          height: "30vw",
          right: "10%",
          top: "60%",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.2, 0], scale: [0.8, 1.1, 0.9] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      {/* Triangle */}
      <svg
        className="absolute"
        style={{ width: "20vw", height: "20vw", right: "20%", top: "10%" }}
        viewBox="0 0 100 100"
      >
        <motion.path
          d="M50 10 L90 90 L10 90 Z"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0.5],
            opacity: [0, 0.3, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Create scroll-triggered animation for the entire footer
    if (footerRef.current && typeof window !== "undefined") {
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top bottom",
        onEnter: () => {
          gsap.fromTo(
            footerRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
          );
        },
      });
    }
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full pt-20 pb-10 relative overflow-hidden backdrop-blur-sm bg-black/30"
      id="contact"
    >
      {/* Background effects - client-side only */}
      {mounted && (
        <>
          <AnimatedLinesBackground />
          <CircleBackground />
          <GeometricBackdrop />
          {/* Added blur overlay */}
          <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-b from-transparent to-black/40 z-0 pointer-events-none" />
        </>
      )}

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center">
          <FooterHeading>
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              Ready to take{" "}
              <motion.span
                className="text-purple-500 inline-block font-extrabold relative"
                animate={{
                  scale: [1, 1.1, 1],
                  color: ["#805ad5", "#9f7aea", "#805ad5"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.2 }}
              >
                your
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </motion.span>{" "}
              digital presence to the{" "}
              <span className="relative inline-block">next level</span>?
            </span>
          </FooterHeading>

          <RevealText
            delay={0.3}
            className="text-white-200 md:mt-10 my-6 text-center max-w-2xl text-lg md:text-xl font-medium"
          >
            <motion.div className="p-2">
              Reach out to us today and let&apos;s discuss how we can help you
              <span className="font-bold text-purple-400">
                {" "}
                achieve your goals
              </span>
            </motion.div>
          </RevealText>
        </div>

        <AnimatedBorder />

        <div className="flex mt-12 md:flex-row flex-col justify-between items-center">
          <RevealText delay={0.4} className="md:text-left text-center">
            <div className="flex items-center justify-center md:justify-start">
              <img src="/logo.svg" alt="Logo" className="w-44 h-22" />
            </div>
            <p className="md:text-base text-sm md:font-normal font-light text-white-200">
              Copyright © 2025 Truedge Digital
            </p>
          </RevealText>

          <div className="flex items-center md:gap-4 gap-6 mt-8 md:mt-0 flex-wrap justify-center md:justify-end">
            {socialMedia.map((info, index) => (
              <RevealText key={info.id} delay={0.4 + index * 0.1}>
                <motion.div
                  className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-20 bg-black-200 rounded-lg border border-black-300 relative group"
                  whileHover={{
                    scale: 1.2,
                    borderColor: "#805ad5",
                    boxShadow: "0 0 12px rgba(128, 90, 213, 0.6)",
                  }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.3 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: "linear-gradient(45deg, #805ad5, #6b46c1)",
                    }}
                  />

                  <a
                    href={info.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full h-full"
                  >
                    <motion.img
                      src={info.img}
                      alt={`${info.id} icon`}
                      width={20}
                      height={20}
                      whileHover={{
                        rotate: [0, -10, 10, -5, 0],
                        transition: {
                          duration: 0.5,
                          ease: "easeInOut",
                        },
                      }}
                    />
                  </a>

                  <motion.span
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black-200 bg-opacity-80 text-white-200 text-xs px-2 py-1 rounded opacity-0 whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {info.id}
                  </motion.span>
                </motion.div>
              </RevealText>
            ))}
          </div>
        </div>

        <RevealText
          delay={0.7}
          className="text-center mt-12 text-sm text-white-200/50"
        >
          <p>Designed with passion by Truedge Digital</p>
        </RevealText>
      </div>
    </footer>
  );
};

export default Footer;
