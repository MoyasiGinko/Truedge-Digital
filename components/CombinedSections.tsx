"use client";

import React, { useEffect, useRef } from "react";
import Experience from "@/components/Experience";
import Approach from "@/components/Approach";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin"; // Import MotionPathPlugin
import GraffitiBackground from "./ui/GraffitiBackground";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin); // Register MotionPathPlugin
}

// Rocket SVG Component - Increased size from 80px to 120px
const Rocket = () => (
  <div
    className="rocket absolute z-40"
    style={{ width: "120px", height: "120px" }}
  >
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rocket body */}
      <path
        d="M12 2L8 10L8 18C8 19.1046 8.89543 20 10 20L14 20C15.1046 20 16 19.1046 16 18L16 10L12 2Z"
        fill="#2563eb"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rocket top */}
      <path
        d="M12 2L11 5L13 5L12 2Z"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Windows */}
      <circle
        cx="12"
        cy="9"
        r="1.5"
        fill="#60a5fa"
        stroke="#ffffff"
        strokeWidth="0.5"
      />
      <circle
        cx="12"
        cy="13"
        r="1"
        fill="#60a5fa"
        stroke="#ffffff"
        strokeWidth="0.5"
      />
      {/* Fins */}
      <path
        d="M16 12L18 15V19L16 17V12Z"
        fill="#1e40af"
        stroke="#ffffff"
        strokeWidth="0.5"
      />
      <path
        d="M8 12L6 15V19L8 17V12Z"
        fill="#1e40af"
        stroke="#ffffff"
        strokeWidth="0.5"
      />
      {/* Thrust flames - animated */}
      <g className="thrust">
        <path
          className="animate-pulse"
          d="M10 20L9 23M14 20L15 23M12 20L12 24"
          stroke="#fde047"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animationDuration: "0.7s" }}
        />
        <path
          className="animate-pulse"
          d="M10.5 20L10 22M13.5 20L14 22"
          stroke="#fb923c"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animationDuration: "0.5s" }}
        />
      </g>
    </svg>

    {/* Enhanced particle trails */}
    <div className="absolute top-1/2 left-1/2 -z-10">
      <div
        className="absolute h-1 w-1 bg-blue-300 rounded-full opacity-80 animate-ping"
        style={{
          animationDuration: "1.5s",
          transform: "translate(-10px, 15px)",
        }}
      ></div>
      <div
        className="absolute h-2 w-2 bg-blue-200 rounded-full opacity-60 animate-ping"
        style={{ animationDuration: "2s", transform: "translate(10px, 10px)" }}
      ></div>
      <div
        className="absolute h-1 w-1 bg-yellow-200 rounded-full opacity-70 animate-ping"
        style={{ animationDuration: "1s", transform: "translate(0px, 20px)" }}
      ></div>
      <div
        className="absolute h-1 w-1 bg-orange-300 rounded-full opacity-75 animate-ping"
        style={{
          animationDuration: "0.8s",
          transform: "translate(-5px, 25px)",
        }}
      ></div>
      <div
        className="absolute h-1 w-1 bg-blue-400 rounded-full opacity-80 animate-ping"
        style={{ animationDuration: "1.2s", transform: "translate(15px, 5px)" }}
      ></div>
    </div>
  </div>
);

const CombinedSections = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const approachRef = useRef<HTMLElement | null>(null);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const rocketRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    // Store a reference to all main sections
    sectionsRef.current = [experienceRef.current, approachRef.current].filter(
      (section): section is HTMLElement => section !== null
    );

    // Create timeline for initial load animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial animation when page loads
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );

    // Animate in the first section
    tl.fromTo(
      experienceRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.5"
    );

    // Create scroll-triggered animations for each section
    sectionsRef.current.forEach((section, index) => {
      // Skip the first section as it's already animated in
      if (index === 0) return;

      // Create scroll animation for each subsequent section
      gsap.fromTo(
        section,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top bottom-=100",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Add parallax effect to section backgrounds
      const sectionBg = section.querySelector(".section-bg");
      if (sectionBg) {
        gsap.fromTo(
          sectionBg,
          { y: 0 },
          {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    });

    // Create header pinning effect if header exists
    const header = document.querySelector("header");
    if (header) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        endTrigger: "html",
        end: "bottom top",
        toggleClass: { targets: header, className: "sticky-header" },
      });
    }

    // Initialize the rocket animation
    if (rocketRef.current && containerRef.current) {
      // Get container dimensions for path creation
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Create an SVG path for the rocket to follow
      const svgPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svgPath.setAttribute("width", "100%");
      svgPath.setAttribute("height", containerHeight.toString());
      svgPath.style.position = "absolute";
      svgPath.style.top = "0";
      svgPath.style.left = "0";
      svgPath.style.pointerEvents = "none";
      svgPath.style.zIndex = "30";
      svgPath.style.opacity = "0";

      // Add a curved path for the rocket to follow
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      // Create a smoother path with more control points and fix the 3rd curve turn gap
      path.setAttribute(
        "d",
        `M20,20
         C70,40 140,30 ${containerWidth - 100},40
         C${containerWidth - 50},80 ${containerWidth - 80},120 ${
          containerWidth - 120
        },180
         C${containerWidth - 180},240 100,${containerHeight / 3} 50,${
          containerHeight / 2.5
        }
         C30,${containerHeight / 2} 60,${containerHeight / 1.8} ${
          containerWidth / 2
        },${containerHeight / 1.7}
         C${containerWidth - 200},${containerHeight / 1.6} ${
          containerWidth - 100
        },${containerHeight / 1.5} ${containerWidth - 120},${
          containerHeight / 1.3
        }
         C${containerWidth - 140},${containerHeight / 1.25} 150,${
          containerHeight / 1.2
        } 100,${containerHeight - 150}
         C60,${containerHeight - 120} 80,${containerHeight - 80} ${
          containerWidth / 2
        },${containerHeight - 60}
         C${containerWidth - 200},${containerHeight - 50} ${
          containerWidth - 100
        },${containerHeight - 40} ${containerWidth - 50},${
          containerHeight - 30
        }`
      );

      path.setAttribute("stroke", "#FF0000");
      path.setAttribute("fill", "none");
      path.id = "rocketPath";
      svgPath.appendChild(path);
      containerRef.current.appendChild(svgPath);

      pathRef.current = path; // Save reference to the path

      // Updated smoother animation with slower scrubbing and higher resolution
      gsap.to(rocketRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5, // Increased from 0.1 to 1.5 for smoother animation
          onUpdate: (self) => {
            if (self.progress === 0 || self.progress === 1) {
              gsap.to(rocketRef.current, { opacity: 1, duration: 0.5 });
            }
          },
        },
        motionPath: {
          path: pathRef.current,
          align: pathRef.current,
          alignOrigin: [0.5, 0.5],
          autoRotate: 90,
          resolution: 500, // Increased from 300 to 500 for higher resolution path following
          type: "cubic",
        },
        ease: "none", // Changed from power1.inOut to none for consistent speed
        immediateRender: true,
      });

      gsap.set(rocketRef.current, {
        x: 20,
        y: 20,
      });

      // Add subtle hover animation with smoother timing
      const floatingAnimation = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: "sine.inOut" },
      });

      floatingAnimation.to(rocketRef.current, {
        y: "+=4",
        x: "+=3",
        rotation: "+=1",
        duration: 2, // Increased from 1.2 to 2
      });

      floatingAnimation.to(rocketRef.current, {
        y: "-=4",
        x: "-=3",
        rotation: "-=1",
        duration: 2.5, // Increased from 1.5 to 2.5
      });

      floatingAnimation.pause(); // Pause floating animation when motionPath is active
    }

    // Clean up all ScrollTriggers when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf(rocketRef.current);
    };
  }, []);

  // Function to handle smooth scrolling between sections
  interface ScrollableElement extends HTMLElement {}

  const scrollToSection = (section: ScrollableElement | null): void => {
    if (section) {
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: section,
          offsetY: 80,
        },
        ease: "power3.inOut",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center items-center flex-col overflow-hidden bg-gradient-to-b from-[#141217] to-[#0c0a0f] min-h-screen"
    >
      <GraffitiBackground />

      {/* Rocket */}
      <div ref={rocketRef}>
        <Rocket />
      </div>

      {/* Light effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-400/20 blur-[100px] animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/15 blur-[120px] animate-pulse"
          style={{ animationDuration: "7s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/2 w-64 h-64 rounded-full bg-cyan-300/10 blur-[80px] animate-pulse"
          style={{ animationDuration: "10s" }}
        ></div>
      </div>

      <div className="max-w-7xl w-full">
        {/* Experience Section */}
        <section ref={experienceRef} className="relative py-20 overflow-hidden">
          <div className="section-bg absolute inset-0 z-0 opacity-30 bg-[url('/bg-pattern.svg')]"></div>
          <Experience />
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => scrollToSection(approachRef.current)}
              className="animate-bounce p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
              aria-label="Scroll to Approach section"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* Approach Section */}
        <section ref={approachRef} className="relative py-20 overflow-hidden">
          <Approach />
        </section>
      </div>

      {/* Navigation dots */}
      <div className="fixed right-10 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {["Experience", "Approach"].map((section, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(sectionsRef.current[i])}
            className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
            aria-label={`Navigate to ${section} section`}
          />
        ))}
      </div>
    </div>
  );
};

export default CombinedSections;
